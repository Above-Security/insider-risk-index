import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Shield, 
  Users, 
  Target, 
  TrendingUp, 
  BookOpen,
  Award,
  Globe,
  Lock
} from "lucide-react";
import { pageMetadata } from "@/lib/seo";
import Link from "next/link";

export const metadata = pageMetadata.about();

export default function AboutPage() {
  const teamMembers = [
    {
      name: "Dr. Sarah Chen",
      role: "Chief Security Officer",
      bio: "Former CISO at Fortune 500 companies with 15+ years in cybersecurity",
      image: "/team/sarah-chen.jpg"
    },
    {
      name: "Michael Rodriguez",
      role: "Lead Security Researcher", 
      bio: "PhD in Computer Science, specializing in behavioral analytics",
      image: "/team/michael-rodriguez.jpg"
    },
    {
      name: "Emily Thompson",
      role: "Risk Assessment Expert",
      bio: "Certified risk management professional with insider threat expertise",
      image: "/team/emily-thompson.jpg"
    },
  ];

  const methodology = [
    {
      icon: BookOpen,
      title: "Research-Based",
      description: "Our framework is built on peer-reviewed research and industry best practices from leading security organizations."
    },
    {
      icon: Users,
      title: "Expert Validation", 
      description: "Developed and validated by security professionals with decades of real-world insider threat experience."
    },
    {
      icon: TrendingUp,
      title: "Data-Driven",
      description: "Continuously refined using feedback from thousands of assessments across diverse industries."
    },
    {
      icon: Globe,
      title: "Industry Benchmarks",
      description: "Comprehensive benchmarking data helps you understand where you stand relative to peers."
    },
  ];

  const principles = [
    {
      icon: Lock,
      title: "Privacy First",
      description: "Your data is encrypted and never shared. We collect only what's necessary for benchmarking."
    },
    {
      icon: Award,
      title: "Actionable Results",
      description: "Every assessment provides specific, prioritized recommendations you can implement."
    },
    {
      icon: Target,
      title: "Practical Focus",
      description: "We focus on realistic, cost-effective solutions that work in real organizational environments."
    },
    {
      icon: Shield,
      title: "Continuous Improvement",
      description: "Our methodology evolves based on new threats, technologies, and industry feedback."
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-blue-50 to-white py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge variant="secondary" className="mb-4">
              Trusted by 1,400+ Organizations
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              About Insider Risk Index
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600 max-w-3xl mx-auto">
              We help organizations understand and improve their insider risk posture through 
              comprehensive assessments, expert insights, and actionable recommendations.
            </p>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Our Mission
            </h2>
            <p className="mt-6 text-xl text-gray-600">
              To democratize access to world-class insider threat assessment capabilities, 
              helping organizations of all sizes build more secure and resilient environments.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                <Shield className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">Security First</h3>
              <p className="mt-2 text-gray-600">
                Built by security professionals for security professionals
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">Accessible</h3>
              <p className="mt-2 text-gray-600">
                Free assessments available to organizations of all sizes
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
                <Target className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">Practical</h3>
              <p className="mt-2 text-gray-600">
                Actionable recommendations that drive real improvements
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-amber-100">
                <TrendingUp className="h-6 w-6 text-amber-600" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">Evidence-Based</h3>
              <p className="mt-2 text-gray-600">
                Grounded in research and validated by industry data
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Methodology Section */}
      <div className="bg-gray-50 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Assessment Methodology
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
              Our 5-pillar framework is validated by real-world data from the Ponemon Institute, 
              Verizon DBIR, and enhanced with threat intelligence from the ForScie Insider Threat Matrix.
            </p>
          </div>

          {/* Pillar Framework */}
          <div className="mb-16">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">5-Pillar Framework</h3>
              <p className="text-gray-600">Industry-validated weightings based on cost impact analysis</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              <Card className="text-center border-t-4 border-blue-500">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-3 flex items-center justify-center">
                    <Shield className="h-6 w-6 text-blue-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Visibility</h4>
                  <div className="text-2xl font-bold text-blue-600 mb-1">25%</div>
                  <p className="text-sm text-gray-600">Monitoring & Detection Capabilities</p>
                </CardContent>
              </Card>
              
              <Card className="text-center border-t-4 border-green-500">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 bg-green-100 rounded-lg mx-auto mb-3 flex items-center justify-center">
                    <Users className="h-6 w-6 text-green-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Coaching</h4>
                  <div className="text-2xl font-bold text-green-600 mb-1">25%</div>
                  <p className="text-sm text-gray-600">Prevention & Training Programs</p>
                </CardContent>
              </Card>
              
              <Card className="text-center border-t-4 border-purple-500">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg mx-auto mb-3 flex items-center justify-center">
                    <BookOpen className="h-6 w-6 text-purple-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Evidence</h4>
                  <div className="text-2xl font-bold text-purple-600 mb-1">20%</div>
                  <p className="text-sm text-gray-600">Investigation & Response</p>
                </CardContent>
              </Card>
              
              <Card className="text-center border-t-4 border-amber-500">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 bg-amber-100 rounded-lg mx-auto mb-3 flex items-center justify-center">
                    <Lock className="h-6 w-6 text-amber-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Identity</h4>
                  <div className="text-2xl font-bold text-amber-600 mb-1">15%</div>
                  <p className="text-sm text-gray-600">Access Controls & SaaS</p>
                </CardContent>
              </Card>
              
              <Card className="text-center border-t-4 border-red-500">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 bg-red-100 rounded-lg mx-auto mb-3 flex items-center justify-center">
                    <Target className="h-6 w-6 text-red-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Phishing</h4>
                  <div className="text-2xl font-bold text-red-600 mb-1">15%</div>
                  <p className="text-sm text-gray-600">Social Engineering Defense</p>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2">
            {methodology.map((item) => (
              <Card key={item.title} className="border-t-4 border-blue-500">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <item.icon className="h-6 w-6 text-blue-600" />
                    </div>
                    <CardTitle>{item.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Principles Section */}
      <div className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Our Principles
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              The values that guide everything we do
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
            {principles.map((principle) => (
              <div key={principle.title} className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <principle.icon className="h-6 w-6 text-gray-700" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {principle.title}
                  </h3>
                  <p className="text-gray-600">{principle.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Data Sources Section */}
      <div className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Research Foundation
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Our assessments are grounded in the latest industry research and threat intelligence
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-blue-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <BookOpen className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle>Ponemon Institute 2025</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Global Cost of Insider Threats study provides the economic foundation for our pillar weightings
                </p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">$17.4M</div>
                  <div className="text-sm text-gray-600">Average annual cost per organization</div>
                </div>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-green-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <Shield className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle>Verizon DBIR 2024</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Data Breach Investigations Report informs our understanding of insider threat patterns
                </p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">68%</div>
                  <div className="text-sm text-gray-600">Breaches involve human element</div>
                </div>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-purple-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <Users className="h-8 w-8 text-purple-600" />
                </div>
                <CardTitle>ForScie Matrix</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Community-driven threat intelligence enhances our recommendations with real-world techniques
                </p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">50+</div>
                  <div className="text-sm text-gray-600">Insider threat techniques cataloged</div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-12 text-center">
            <p className="text-gray-600 mb-6">
              All research is properly attributed and cited in our methodology documentation
            </p>
            <Link href="/matrix" className="text-blue-600 hover:text-blue-800 font-medium">
              Explore the Insider Threat Matrix →
            </Link>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="bg-gray-50 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Meet Our Team
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Security experts dedicated to helping you manage insider risk
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {teamMembers.map((member) => (
              <Card key={member.name} className="text-center">
                <CardContent className="p-6">
                  <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Users className="h-10 w-10 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {member.name}
                  </h3>
                  <p className="text-blue-600 font-medium mb-3">{member.role}</p>
                  <p className="text-gray-600 text-sm">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Ready to Get Started?
            </h2>
            <p className="mt-4 text-lg text-blue-100">
              Take your first step toward better insider risk management
            </p>
            <div className="mt-8">
              <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
                <Link href="/assessment">
                  Start Your Assessment
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}