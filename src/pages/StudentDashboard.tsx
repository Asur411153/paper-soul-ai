import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { FileText, TrendingUp, MessageCircle, Upload, Download } from 'lucide-react';
import Navigation from '@/components/Navigation';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface ExamResult {
  id: number;
  exam_id: number;
  result_pdf_url: string;
  uploaded_at: string;
  exams: {
    exam_name: string;
    exam_date: string;
    subjects: {
      subject_name: string;
    };
  };
}

interface Query {
  id: number;
  query_text: string;
  response_text: string | null;
  status: string;
  created_at: string;
  exam_id: number | null;
  exams?: {
    exam_name: string;
  };
}

const StudentDashboard = () => {
  const { user, signOut } = useAuth();
  const [results, setResults] = useState<ExamResult[]>([]);
  const [queries, setQueries] = useState<Query[]>([]);
  const [loading, setLoading] = useState(true);
  const [studentId, setStudentId] = useState<number | null>(null);
  const [newQuery, setNewQuery] = useState('');
  const [selectedExamId, setSelectedExamId] = useState<number | null>(null);
  const [isQueryDialogOpen, setIsQueryDialogOpen] = useState(false);

  useEffect(() => {
    if (user) {
      fetchStudentData();
    }
  }, [user]);

  const fetchStudentData = async () => {
    try {
      // Get student record
      const { data: student, error: studentError } = await supabase
        .from('students')
        .select('id, user_id')
        .eq('user_id', user?.id)
        .single();

      if (studentError) {
        console.error('Error fetching student:', studentError);
        return;
      }

      setStudentId(student.id);

      // Fetch exam results
      const { data: resultsData, error: resultsError } = await supabase
        .from('exam_results')
        .select(`
          id,
          exam_id,
          result_pdf_url,
          uploaded_at,
          exams (
            exam_name,
            exam_date,
            subjects (
              subject_name
            )
          )
        `)
        .eq('student_id', student.id)
        .order('uploaded_at', { ascending: false });

      if (!resultsError) {
        setResults(resultsData || []);
      }

      // Fetch queries
      const { data: queriesData, error: queriesError } = await supabase
        .from('queries')
        .select(`
          id,
          query_text,
          response_text,
          status,
          created_at,
          exam_id,
          exams (
            exam_name
          )
        `)
        .eq('student_id', student.id)
        .order('created_at', { ascending: false });

      if (!queriesError) {
        setQueries(queriesData || []);
      }
    } catch (error) {
      console.error('Error fetching student data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load dashboard data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitQuery = async () => {
    if (!newQuery.trim() || !studentId) return;

    try {
      const { error } = await supabase
        .from('queries')
        .insert({
          student_id: studentId,
          query_text: newQuery,
          exam_id: selectedExamId,
          status: 'pending'
        });

      if (error) throw error;

      toast({
        title: 'Query Submitted',
        description: 'Your query has been submitted successfully.',
      });

      setNewQuery('');
      setSelectedExamId(null);
      setIsQueryDialogOpen(false);
      fetchStudentData();
    } catch (error) {
      console.error('Error submitting query:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit query',
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
            <h1 className="text-3xl font-bold text-foreground">Student Dashboard</h1>
            <p className="text-muted-foreground">Welcome back! View your exam results and performance.</p>
          </div>
          <Button onClick={signOut} variant="outline">
            Sign Out
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Results</CardTitle>
              <FileText className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{results.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Queries</CardTitle>
              <MessageCircle className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {queries.filter(q => q.status === 'pending').length}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Performance</CardTitle>
              <TrendingUp className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Good</div>
              <p className="text-xs text-muted-foreground">Based on recent results</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Results */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Recent Exam Results</CardTitle>
            <CardDescription>
              Your latest exam results and performance reports
            </CardDescription>
          </CardHeader>
          <CardContent>
            {results.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
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
                        {result.exams.exam_name}
                      </TableCell>
                      <TableCell>{result.exams.subjects.subject_name}</TableCell>
                      <TableCell>
                        {new Date(result.exams.exam_date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(result.result_pdf_url, '_blank')}
                        >
                          <Download className="w-4 h-4 mr-2" />
                          View Result
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
                <p className="text-muted-foreground">Your exam results will appear here once available.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Queries Section */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>My Queries</CardTitle>
                <CardDescription>
                  Ask questions about your exam results or raise concerns
                </CardDescription>
              </div>
              <Dialog open={isQueryDialogOpen} onOpenChange={setIsQueryDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Submit Query
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Submit a Query</DialogTitle>
                    <DialogDescription>
                      Ask a question about your exam results or raise a concern
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="exam-select">Related Exam (Optional)</Label>
                      <select 
                        id="exam-select"
                        className="w-full mt-1 p-2 border border-border rounded-md bg-background"
                        value={selectedExamId || ''}
                        onChange={(e) => setSelectedExamId(e.target.value ? parseInt(e.target.value) : null)}
                      >
                        <option value="">Select an exam (optional)</option>
                        {results.map((result) => (
                          <option key={result.exam_id} value={result.exam_id}>
                            {result.exams.exam_name} - {result.exams.subjects.subject_name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="query-text">Your Query</Label>
                      <Textarea
                        id="query-text"
                        placeholder="Describe your question or concern..."
                        value={newQuery}
                        onChange={(e) => setNewQuery(e.target.value)}
                        rows={4}
                      />
                    </div>
                    <Button onClick={handleSubmitQuery} disabled={!newQuery.trim()}>
                      Submit Query
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            {queries.length > 0 ? (
              <div className="space-y-4">
                {queries.map((query) => (
                  <div key={query.id} className="border border-border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{query.query_text}</p>
                        {query.exams && (
                          <p className="text-sm text-muted-foreground">
                            Related to: {query.exams.exam_name}
                          </p>
                        )}
                      </div>
                      <Badge 
                        variant={query.status === 'pending' ? 'default' : 'secondary'}
                      >
                        {query.status}
                      </Badge>
                    </div>
                    {query.response_text && (
                      <div className="mt-3 p-3 bg-muted rounded-md">
                        <p className="text-sm font-medium text-foreground mb-1">Response:</p>
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
                <p className="text-muted-foreground">Submit a query to get help with your exam results.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default StudentDashboard;