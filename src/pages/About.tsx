import Navigation from '@/components/Navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Brain, Zap, Shield, Target, Users, Award } from 'lucide-react';

const About = () => {
  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Analysis',
      description: 'Advanced machine learning algorithms analyze exam papers with 99.5% accuracy, identifying patterns and providing instant feedback.',
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Process hundreds of exam papers in minutes, not hours. Our optimized AI model delivers results 50x faster than manual checking.',
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Bank-level encryption ensures all exam data remains confidential. GDPR compliant with robust data protection measures.',
    },
    {
      icon: Target,
      title: 'Precise Scoring',
      description: 'Consistent, bias-free evaluation with detailed breakdown of answers, identifying areas for improvement.',
    },
    {
      icon: Users,
      title: 'Multi-Role Access',
      description: 'Tailored dashboards for students, teachers, and administrators with role-based permissions and analytics.',
    },
    {
      icon: Award,
      title: 'Performance Insights',
      description: 'Comprehensive analytics help identify learning gaps and track student progress over time.',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Revolutionizing Education Through{' '}
            <span className="bg-gradient-hero bg-clip-text text-transparent">AI Innovation</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            PaperSoull harnesses the power of artificial intelligence to transform how educational institutions 
            handle exam evaluation, making it faster, more accurate, and deeply insightful.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-6">Our Mission</h2>
              <p className="text-lg text-muted-foreground mb-6">
                We believe that teachers should focus on teaching, not on repetitive grading tasks. 
                PaperSoull empowers educators with AI-driven tools that provide instant, accurate, 
                and insightful exam evaluation.
              </p>
              <p className="text-lg text-muted-foreground">
                By automating the checking process, we free up valuable time for personalized 
                student interaction while ensuring consistent, bias-free assessment across all examinations.
              </p>
            </div>
            <div className="bg-gradient-card rounded-2xl p-8 shadow-medium">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">99.5%</div>
                <div className="text-muted-foreground mb-4">Accuracy Rate</div>
                <div className="text-2xl font-bold text-success mb-2">50x</div>
                <div className="text-muted-foreground mb-4">Faster Processing</div>
                <div className="text-2xl font-bold text-accent mb-2">10,000+</div>
                <div className="text-muted-foreground">Papers Processed Daily</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Advanced Technology Stack
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Built with cutting-edge AI and modern web technologies to deliver 
              unparalleled performance and reliability.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-soft bg-gradient-card hover:shadow-medium transition-all duration-300">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-foreground mb-6">
            Built for the Future of Education
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Our platform combines state-of-the-art machine learning models with intuitive 
            design to create a seamless experience for educators and students alike.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Machine Learning</h3>
              <p className="text-muted-foreground">Deep learning models trained on millions of exam papers</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-success" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Cloud Infrastructure</h3>
              <p className="text-muted-foreground">Scalable, secure backend powered by Supabase</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Real-time Analytics</h3>
              <p className="text-muted-foreground">Instant insights and performance tracking</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;