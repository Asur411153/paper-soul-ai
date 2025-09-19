import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Brain, Zap, Shield, BarChart3, Users, Clock, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import heroImage from '@/assets/hero-ai-checking.jpg';

const Index = () => {
  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Checking',
      description: 'Advanced machine learning models analyze exam papers with 99.5% accuracy, providing instant and reliable results.',
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Process hundreds of papers in minutes. Our optimized algorithms deliver results 50x faster than manual checking.',
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Bank-level encryption ensures all exam data remains confidential with GDPR compliance and robust security.',
    },
    {
      icon: BarChart3,
      title: 'Deep Analytics',
      description: 'Comprehensive performance insights help identify learning gaps and track student progress over time.',
    },
  ];

  const stats = [
    { value: '99.5%', label: 'Accuracy Rate' },
    { value: '50x', label: 'Faster Processing' },
    { value: '10K+', label: 'Papers Daily' },
    { value: '500+', label: 'Schools Trust Us' },
  ];

  const benefits = [
    'Eliminate manual grading errors',
    'Save 90% of checking time',
    'Consistent, bias-free evaluation',
    'Instant detailed feedback',
    'Comprehensive progress tracking',
    'Multi-format paper support',
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight mb-6">
                Transform Exam Checking with{' '}
                <span className="bg-gradient-hero bg-clip-text text-transparent">
                  AI Intelligence
                </span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-lg">
                PaperSoull revolutionizes education with AI-powered exam evaluation. 
                Get instant, accurate results while freeing teachers to focus on what matters most - teaching.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button size="lg" className="bg-gradient-hero text-lg px-8" asChild>
                  <Link to="/signup">
                    Start Free Trial
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-8" asChild>
                  <Link to="/about">Learn More</Link>
                </Button>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-2xl font-bold text-primary mb-1">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <img 
                src={heroImage} 
                alt="AI-powered exam checking technology" 
                className="w-full h-auto rounded-2xl shadow-large"
              />
              <div className="absolute inset-0 bg-gradient-hero opacity-10 rounded-2xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-6">
                Why Choose PaperSoull?
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Join thousands of educators who have transformed their workflow with our intelligent evaluation system.
              </p>
              
              <div className="grid gap-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-success flex-shrink-0" />
                    <span className="text-foreground">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <Card className="border-0 shadow-medium bg-gradient-card">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <Clock className="w-16 h-16 text-primary mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-foreground mb-2">
                    From Hours to Minutes
                  </h3>
                  <p className="text-muted-foreground">
                    What used to take days of manual work now happens in minutes with our AI technology.
                  </p>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Manual Checking</span>
                    <span className="text-destructive font-semibold">8+ hours</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">PaperSoull AI</span>
                    <span className="text-success font-semibold">10 minutes</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t">
                    <span className="text-foreground font-semibold">Time Saved</span>
                    <span className="text-primary font-bold text-lg">95%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Powerful Features for Modern Education
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our comprehensive platform provides everything you need to streamline 
              exam evaluation and enhance educational outcomes.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-soft bg-gradient-card hover:shadow-medium transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="w-8 h-8 text-primary" />
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

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-hero">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-6">
            Ready to Transform Your Exam Process?
          </h2>
          <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
            Join thousands of educators worldwide who trust PaperSoull to streamline 
            their exam evaluation process. Start your free trial today.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="text-lg px-8" asChild>
              <Link to="/signup">
                Start Free Trial
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary" asChild>
              <Link to="/contact">Schedule Demo</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
