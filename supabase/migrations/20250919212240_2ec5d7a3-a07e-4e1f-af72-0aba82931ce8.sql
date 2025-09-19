-- Create queries table for student-teacher communication
CREATE TABLE public.queries (
  id SERIAL PRIMARY KEY,
  student_id INTEGER NOT NULL,
  teacher_id INTEGER,
  exam_id INTEGER,
  query_text TEXT NOT NULL,
  response_text TEXT,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(20) DEFAULT 'pending'
);

-- Create storage bucket for exam papers
INSERT INTO storage.buckets (id, name, public) VALUES ('exam-papers', 'exam-papers', false);

-- Add auth_user_id column to users table to link with Supabase Auth
ALTER TABLE public.users ADD COLUMN auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
CREATE UNIQUE INDEX users_auth_user_id_idx ON public.users(auth_user_id);

-- Enable Row Level Security on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_papers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.queries ENABLE ROW LEVEL SECURITY;

-- Create function to get current user's internal ID
CREATE OR REPLACE FUNCTION public.get_current_user_id()
RETURNS INTEGER AS $$
  SELECT id FROM public.users WHERE auth_user_id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE SET search_path = public;

-- Create function to get current user role
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT AS $$
  SELECT role FROM public.users WHERE auth_user_id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE SET search_path = public;

-- Create function to get current user school
CREATE OR REPLACE FUNCTION public.get_current_user_school()
RETURNS INTEGER AS $$
  SELECT school_id FROM public.users WHERE auth_user_id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE SET search_path = public;

-- RLS Policies for users table
CREATE POLICY "Users can view their own profile" ON public.users
  FOR SELECT USING (auth_user_id = auth.uid());

CREATE POLICY "Admins can view all users" ON public.users
  FOR SELECT USING (public.get_current_user_role() = 'admin');

-- RLS Policies for schools table
CREATE POLICY "Users can view their school" ON public.schools
  FOR SELECT USING (id = public.get_current_user_school());

CREATE POLICY "Admins can view all schools" ON public.schools
  FOR SELECT USING (public.get_current_user_role() = 'admin');

-- RLS Policies for students table
CREATE POLICY "Students can view their own record" ON public.students
  FOR SELECT USING (user_id = public.get_current_user_id());

CREATE POLICY "Teachers can view students in their school" ON public.students
  FOR SELECT USING (
    public.get_current_user_role() = 'teacher' AND
    EXISTS (SELECT 1 FROM public.classes c WHERE c.id = class_id AND c.school_id = public.get_current_user_school())
  );

CREATE POLICY "Admins can view all students" ON public.students
  FOR SELECT USING (public.get_current_user_role() = 'admin');

-- RLS Policies for classes table
CREATE POLICY "Teachers can view classes in their school" ON public.classes
  FOR SELECT USING (
    (public.get_current_user_role() = 'teacher' AND school_id = public.get_current_user_school()) OR
    public.get_current_user_role() = 'admin'
  );

CREATE POLICY "Students can view their class" ON public.classes
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.students s WHERE s.class_id = id AND s.user_id = public.get_current_user_id())
  );

-- RLS Policies for exams table
CREATE POLICY "Users can view exams in their school" ON public.exams
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.subjects s 
      WHERE s.id = subject_id AND s.school_id = public.get_current_user_school()
    ) OR public.get_current_user_role() = 'admin'
  );

-- RLS Policies for exam_papers table
CREATE POLICY "Students can view their own papers" ON public.exam_papers
  FOR SELECT USING (student_id IN (
    SELECT id FROM public.students WHERE user_id = public.get_current_user_id()
  ));

CREATE POLICY "Students can upload their own papers" ON public.exam_papers
  FOR INSERT WITH CHECK (student_id IN (
    SELECT id FROM public.students WHERE user_id = public.get_current_user_id()
  ));

CREATE POLICY "Teachers can view papers in their school" ON public.exam_papers
  FOR SELECT USING (
    public.get_current_user_role() IN ('teacher', 'admin') AND
    EXISTS (
      SELECT 1 FROM public.students s, public.classes c 
      WHERE s.id = student_id AND s.class_id = c.id AND c.school_id = public.get_current_user_school()
    )
  );

-- RLS Policies for exam_results table
CREATE POLICY "Students can view their own results" ON public.exam_results
  FOR SELECT USING (student_id IN (
    SELECT id FROM public.students WHERE user_id = public.get_current_user_id()
  ));

CREATE POLICY "Teachers can view results in their school" ON public.exam_results
  FOR SELECT USING (
    public.get_current_user_role() IN ('teacher', 'admin') AND
    EXISTS (
      SELECT 1 FROM public.students s, public.classes c 
      WHERE s.id = student_id AND s.class_id = c.id AND c.school_id = public.get_current_user_school()
    )
  );

-- RLS Policies for queries table
CREATE POLICY "Students can view their own queries" ON public.queries
  FOR SELECT USING (student_id IN (
    SELECT id FROM public.students WHERE user_id = public.get_current_user_id()
  ));

CREATE POLICY "Students can create queries" ON public.queries
  FOR INSERT WITH CHECK (student_id IN (
    SELECT id FROM public.students WHERE user_id = public.get_current_user_id()
  ));

CREATE POLICY "Teachers can view and respond to queries in their school" ON public.queries
  FOR ALL USING (
    public.get_current_user_role() IN ('teacher', 'admin') AND
    EXISTS (
      SELECT 1 FROM public.students s, public.classes c 
      WHERE s.id = student_id AND s.class_id = c.id AND c.school_id = public.get_current_user_school()
    )
  );

-- Storage policies for exam papers
CREATE POLICY "Students can upload their own exam papers" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'exam-papers' AND
    (storage.foldername(name))[1] = public.get_current_user_id()::text
  );

CREATE POLICY "Users can view exam papers in their school context" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'exam-papers' AND (
      (storage.foldername(name))[1] = public.get_current_user_id()::text OR
      public.get_current_user_role() IN ('teacher', 'admin')
    )
  );

-- Update function for queries
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for queries updated_at
CREATE TRIGGER update_queries_updated_at
  BEFORE UPDATE ON public.queries
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();