import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Star, Zap, Building, GraduationCap } from 'lucide-react';

const Pricing = () => {
  const plans = [
    {
      name: 'Starter',
      icon: GraduationCap,
      price: '$49',
      period: 'per month',
      description: 'Perfect for small schools and individual teachers',
      features: [
        'Up to 500 papers per month',
        'Basic AI checking for MCQ & Short answers',
        'Student & Teacher dashboards',
        'Email support',
        'Basic analytics',
        'Secure cloud storage',
      ],
      buttonText: 'Start Free Trial',
      popular: false,
    },
    {
      name: 'Professional',
      icon: Star,
      price: '$149',
      period: 'per month',
      description: 'Ideal for medium-sized educational institutions',
      features: [
        'Up to 2,000 papers per month',
        'Advanced AI for all question types',
        'Multi-role dashboards',
        'Priority email & chat support',
        'Advanced analytics & insights',
        'Custom reporting',
        'Integration support',
        'Teacher training sessions',
      ],
      buttonText: 'Get Started',
      popular: true,
    },
    {
      name: 'Enterprise',
      icon: Building,
      price: 'Custom',
      period: 'tailored pricing',
      description: 'Comprehensive solution for large institutions',
      features: [
        'Unlimited paper checking',
        'Full AI suite with custom models',
        'White-label solution',
        'Dedicated account manager',
        'Phone & on-site support',
        'Custom integrations',
        'Advanced security features',
        'Comprehensive training program',
        'SLA guarantees',
      ],
      buttonText: 'Contact Sales',
      popular: false,
    },
  ];

  const addOns = [
    {
      name: 'Advanced Analytics',
      price: '$29/month',
      description: 'Deep learning insights, predictive analysis, and custom reports',
    },
    {
      name: 'API Access',
      price: '$49/month', 
      description: 'Full REST API access for custom integrations and third-party tools',
    },
    {
      name: 'Premium Support',
      price: '$99/month',
      description: '24/7 phone support, dedicated success manager, and priority response',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Simple, Transparent{' '}
            <span className="bg-gradient-hero bg-clip-text text-transparent">Pricing</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Choose the perfect plan for your institution. All plans include our core AI checking 
            technology with no hidden fees. Start with a 14-day free trial.
          </p>
          
          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center items-center gap-8 mt-12 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-success" />
              <span>14-day free trial</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-success" />
              <span>Cancel anytime</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-success" />
              <span>No setup fees</span>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Plans */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <Card 
                key={index} 
                className={`border-0 shadow-soft bg-gradient-card hover:shadow-medium transition-all duration-300 relative ${
                  plan.popular ? 'lg:scale-105 shadow-large' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-hero text-primary-foreground px-4 py-2 rounded-full text-sm font-medium">
                      Most Popular
                    </div>
                  </div>
                )}
                
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <plan.icon className="w-8 h-8 text-primary" />
                  </div>
                  <CardTitle className="text-2xl text-foreground">{plan.name}</CardTitle>
                  <p className="text-muted-foreground">{plan.description}</p>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                    <span className="text-muted-foreground ml-2">/{plan.period}</span>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    className={`w-full ${
                      plan.popular 
                        ? 'bg-gradient-hero' 
                        : 'bg-primary hover:bg-primary-hover'
                    }`}
                  >
                    {plan.buttonText}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Add-ons */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Optional Add-ons
            </h2>
            <p className="text-xl text-muted-foreground">
              Enhance your plan with additional features and support options.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {addOns.map((addon, index) => (
              <Card key={index} className="border-0 shadow-soft bg-gradient-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-foreground">{addon.name}</h3>
                    <span className="text-primary font-bold">{addon.price}</span>
                  </div>
                  <p className="text-muted-foreground text-sm">{addon.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Frequently Asked Questions
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Can I change my plan anytime?
                </h3>
                <p className="text-muted-foreground">
                  Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, 
                  and we'll prorate the billing accordingly.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  What payment methods do you accept?
                </h3>
                <p className="text-muted-foreground">
                  We accept all major credit cards, PayPal, and bank transfers for Enterprise plans. 
                  All payments are processed securely through Stripe.
                </p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Is there a long-term contract?
                </h3>
                <p className="text-muted-foreground">
                  No, all plans are month-to-month with no long-term commitments. 
                  Enterprise customers can opt for annual billing for additional discounts.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Do you offer educational discounts?
                </h3>
                <p className="text-muted-foreground">
                  Yes, we offer special pricing for public schools, non-profits, 
                  and developing countries. Contact our sales team for details.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Pricing;