import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { Building, Users, FileText, BookOpen, MessageCircle, BarChart3 } from 'lucide-react';
import Navigation from '@/components/Navigation';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface School {
  id: number;
  school_name: string;
  address: string | null;
  created_at: string;
}

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  created_at: string;
  schools: {
    school_name: string;
  };
}

interface ExamResult {
  id: number;
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

const AdminDashboard = () => {
  const { user, signOut } = useAuth();
  const [schools, setSchools] = useState<School[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [results, setResults] = useState<ExamResult[]>([]);
  const [stats, setStats] = useState({
    totalSchools: 0,
    totalUsers: 0,
    totalStudents: 0,
    totalTeachers: 0,
    totalResults: 0,
    pendingQueries: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchAdminData();
    }
  }, [user]);

  const fetchAdminData = async () => {
    try {
      // Fetch schools
      const { data: schoolsData, error: schoolsError } = await supabase
        .from('schools')
        .select('*')
        .order('created_at', { ascending: false });

      if (!schoolsError) {
        setSchools(schoolsData || []);
      }

      // Fetch users
      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select(`
          id,
          username,
          email,
          role,
          created_at,
          schools (
            school_name
          )
        `)
        .order('created_at', { ascending: false });

      if (!usersError) {
        setUsers(usersData || []);
      }

      // Fetch exam results
      const { data: resultsData, error: resultsError } = await supabase
        .from('exam_results')
        .select(`
          id,
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
        .order('uploaded_at', { ascending: false })
        .limit(50);

      if (!resultsError) {
        setResults(resultsData || []);
      }

      // Calculate statistics
      const totalSchools = schoolsData?.length || 0;
      const totalUsers = usersData?.length || 0;
      const totalStudents = usersData?.filter(u => u.role === 'student').length || 0;
      const totalTeachers = usersData?.filter(u => u.role === 'teacher').length || 0;
      const totalResults = resultsData?.length || 0;

      // Get pending queries count
      const { count: pendingQueriesCount } = await supabase
        .from('queries')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

      setStats({
        totalSchools,
        totalUsers,
        totalStudents,
        totalTeachers,
        totalResults,
        pendingQueries: pendingQueriesCount || 0,
      });

    } catch (error) {
      console.error('Error fetching admin data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load dashboard data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
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
            <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-muted-foreground">System overview and management controls.</p>
          </div>
          <Button onClick={signOut} variant="outline">
            Sign Out
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Schools</CardTitle>
              <Building className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalSchools}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
              <p className="text-xs text-muted-foreground">
                {stats.totalStudents} students, {stats.totalTeachers} teachers
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Exam Results</CardTitle>
              <FileText className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalResults}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Queries</CardTitle>
              <MessageCircle className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingQueries}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">System Health</CardTitle>
              <BarChart3 className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">Good</div>
              <p className="text-xs text-muted-foreground">All systems operational</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="schools" className="w-full">
          <TabsList>
            <TabsTrigger value="schools">Schools</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="results">Exam Results</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="schools">
            <Card>
              <CardHeader>
                <CardTitle>Schools Management</CardTitle>
                <CardDescription>
                  View and manage registered schools in the platform
                </CardDescription>
              </CardHeader>
              <CardContent>
                {schools.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>School Name</TableHead>
                        <TableHead>Address</TableHead>
                        <TableHead>Registration Date</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {schools.map((school) => (
                        <TableRow key={school.id}>
                          <TableCell className="font-medium">{school.school_name}</TableCell>
                          <TableCell>{school.address || 'Not provided'}</TableCell>
                          <TableCell>
                            {new Date(school.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary">Active</Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8">
                    <Building className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-2">No schools registered</h3>
                    <p className="text-muted-foreground">Schools will appear here once registered.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>
                  View and manage all platform users
                </CardDescription>
              </CardHeader>
              <CardContent>
                {users.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>School</TableHead>
                        <TableHead>Registration Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">{user.username}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            <Badge 
                              variant={
                                user.role === 'admin' ? 'default' : 
                                user.role === 'teacher' ? 'secondary' : 'outline'
                              }
                            >
                              {user.role}
                            </Badge>
                          </TableCell>
                          <TableCell>{user.schools.school_name}</TableCell>
                          <TableCell>
                            {new Date(user.created_at).toLocaleDateString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8">
                    <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-2">No users found</h3>
                    <p className="text-muted-foreground">Users will appear here once registered.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="results">
            <Card>
              <CardHeader>
                <CardTitle>Recent Exam Results</CardTitle>
                <CardDescription>
                  View all exam results across the platform
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
                        <TableHead>Upload Date</TableHead>
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

          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Platform Analytics</CardTitle>
                <CardDescription>
                  System-wide performance and usage statistics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">User Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Students</span>
                          <span className="font-semibold">{stats.totalStudents}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Teachers</span>
                          <span className="font-semibold">{stats.totalTeachers}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Admins</span>
                          <span className="font-semibold">
                            {users.filter(u => u.role === 'admin').length}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">System Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Database</span>
                          <Badge variant="secondary">Online</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>Authentication</span>
                          <Badge variant="secondary">Online</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>File Storage</span>
                          <Badge variant="secondary">Online</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;