import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { FileText, Users, MessageCircle, Upload, Download } from 'lucide-react';
import Navigation from '@/components/Navigation';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Student {
  id: number;
  user_id: number;
  users: {
    username: string;
    email: string;
  };
}

interface ExamResult {
  id: number;
  student_id: number;
  exam_id: number;
  result_pdf_url: string;
  uploaded_at: string;
  students: {
    users: {
      username: string;
    };
  };
  exams: {
    exam_name: string;
    subjects: {
      subject_name: string;
    };
  };
}

interface Query {
  id: number;
  student_id: number;
  query_text: string;
  response_text: string | null;
  status: string;
  created_at: string;
  exam_id: number | null;
  students: {
    users: {
      username: string;
    };
  };
  exams?: {
    exam_name: string;
  };
}

const TeacherDashboard = () => {
  const { user, signOut } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [results, setResults] = useState<ExamResult[]>([]);
  const [queries, setQueries] = useState<Query[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuery, setSelectedQuery] = useState<Query | null>(null);
  const [response, setResponse] = useState('');
  const [isResponseDialogOpen, setIsResponseDialogOpen] = useState(false);

  useEffect(() => {
    if (user) {
      fetchTeacherData();
    }
  }, [user]);

  const fetchTeacherData = async () => {
    try {
      // Fetch students in teacher's classes
      const { data: studentsData, error: studentsError } = await supabase
        .from('students')
        .select(`
          id,
          user_id,
          users (
            username,
            email
          )
        `);

      if (!studentsError) {
        setStudents(studentsData || []);
      }

      // Fetch exam results for students in teacher's school
      const { data: resultsData, error: resultsError } = await supabase
        .from('exam_results')
        .select(`
          id,
          student_id,
          exam_id,
          result_pdf_url,
          uploaded_at,
          students (
            users (
              username
            )
          ),
          exams (
            exam_name,
            subjects (
              subject_name
            )
          )
        `)
        .order('uploaded_at', { ascending: false });

      if (!resultsError) {
        setResults(resultsData || []);
      }

      // Fetch queries from students
      const { data: queriesData, error: queriesError } = await supabase
        .from('queries')
        .select(`
          id,
          student_id,
          query_text,
          response_text,
          status,
          created_at,
          exam_id,
          students (
            users (
              username
            )
          ),
          exams (
            exam_name
          )
        `)
        .order('created_at', { ascending: false });

      if (!queriesError) {
        setQueries(queriesData || []);
      }
    } catch (error) {
      console.error('Error fetching teacher data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load dashboard data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResponseSubmit = async () => {
    if (!response.trim() || !selectedQuery) return;

    try {
      const { error } = await supabase
        .from('queries')
        .update({
          response_text: response,
          status: 'answered'
        })
        .eq('id', selectedQuery.id);

      if (error) throw error;

      toast({
        title: 'Response Submitted',
        description: 'Your response has been sent to the student.',
      });

      setResponse('');
      setSelectedQuery(null);
      setIsResponseDialogOpen(false);
      fetchTeacherData();
    } catch (error) {
      console.error('Error submitting response:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit response',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Teacher Dashboard</h1>
            <p className="text-muted-foreground">Manage students, view results, and respond to queries.</p>
          </div>
          <Button onClick={signOut} variant="outline">
            Sign Out
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <Users className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{students.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Exam Results</CardTitle>
              <FileText className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{results.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Queries</CardTitle>
              <MessageCircle className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {queries.filter(q => q.status === 'pending').length}
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="results" className="w-full">
          <TabsList>
            <TabsTrigger value="results">Exam Results</TabsTrigger>
            <TabsTrigger value="queries">Student Queries</TabsTrigger>
            <TabsTrigger value="students">Students</TabsTrigger>
          </TabsList>

          <TabsContent value="results">
            <Card>
              <CardHeader>
                <CardTitle>Recent Exam Results</CardTitle>
                <CardDescription>
                  View and download exam results for your students
                </CardDescription>
              </CardHeader>
              <CardContent>
                {results.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Student</TableHead>
                        <TableHead>Exam</TableHead>
                        <TableHead>Subject</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {results.map((result) => (
                        <TableRow key={result.id}>
                          <TableCell className="font-medium">
                            {result.students.users.username}
                          </TableCell>
                          <TableCell>{result.exams.exam_name}</TableCell>
                          <TableCell>{result.exams.subjects.subject_name}</TableCell>
                          <TableCell>
                            {new Date(result.uploaded_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => window.open(result.result_pdf_url, '_blank')}
                            >
                              <Download className="w-4 h-4 mr-2" />
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8">
                    <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-2">No results yet</h3>
                    <p className="text-muted-foreground">Exam results will appear here once available.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="queries">
            <Card>
              <CardHeader>
                <CardTitle>Student Queries</CardTitle>
                <CardDescription>
                  Respond to student questions and concerns
                </CardDescription>
              </CardHeader>
              <CardContent>
                {queries.length > 0 ? (
                  <div className="space-y-4">
                    {queries.map((query) => (
                      <div key={query.id} className="border border-border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1">
                            <p className="font-medium text-foreground">{query.query_text}</p>
                            <p className="text-sm text-muted-foreground">
                              From: {query.students.users.username}
                              {query.exams && ` • Related to: ${query.exams.exam_name}`}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge 
                              variant={query.status === 'pending' ? 'default' : 'secondary'}
                            >
                              {query.status}
                            </Badge>
                            {query.status === 'pending' && (
                              <Button
                                size="sm"
                                onClick={() => {
                                  setSelectedQuery(query);
                                  setIsResponseDialogOpen(true);
                                }}
                              >
                                Respond
                              </Button>
                            )}
                          </div>
                        </div>
                        {query.response_text && (
                          <div className="mt-3 p-3 bg-muted rounded-md">
                            <p className="text-sm font-medium text-foreground mb-1">Your Response:</p>
                            <p className="text-sm text-muted-foreground">{query.response_text}</p>
                          </div>
                        )}
                        <p className="text-xs text-muted-foreground mt-2">
                          Submitted on {new Date(query.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <MessageCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-2">No queries yet</h3>
                    <p className="text-muted-foreground">Student queries will appear here.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="students">
            <Card>
              <CardHeader>
                <CardTitle>Students</CardTitle>
                <CardDescription>
                  View and manage your students
                </CardDescription>
              </CardHeader>
              <CardContent>
                {students.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {students.map((student) => (
                        <TableRow key={student.id}>
                          <TableCell className="font-medium">
                            {student.users.username}
                          </TableCell>
                          <TableCell>{student.users.email}</TableCell>
                          <TableCell>
                            <Badge variant="secondary">Active</Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8">
                    <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-2">No students yet</h3>
                    <p className="text-muted-foreground">Students will appear here once enrolled.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Response Dialog */}
        <Dialog open={isResponseDialogOpen} onOpenChange={setIsResponseDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Respond to Query</DialogTitle>
              <DialogDescription>
                Provide a response to the student's query
              </DialogDescription>
            </DialogHeader>
            {selectedQuery && (
              <div className="space-y-4">
                <div className="p-3 bg-muted rounded-md">
                  <p className="text-sm font-medium text-foreground mb-1">Student Query:</p>
                  <p className="text-sm text-muted-foreground">{selectedQuery.query_text}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    From: {selectedQuery.students.users.username}
                  </p>
                </div>
                <div>
                  <Textarea
                    placeholder="Type your response..."
                    value={response}
                    onChange={(e) => setResponse(e.target.value)}
                    rows={4}
                  />
                </div>
                <Button onClick={handleResponseSubmit} disabled={!response.trim()}>
                  Send Response
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default TeacherDashboard;