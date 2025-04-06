import { motion } from "framer-motion"
import {
  Brain,
  Heart,
  MessageSquareText,
  Mic,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Clock,
  Zap,
  Shield,
  Smile,
  BarChart3,
  Lock,
  Key,
} from "lucide-react"
import { useState } from "react"
import { Button } from "../components/ui/button"
import { Card, CardContent } from "../components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../components/ui/accordion"

const features = [
  {
    icon: <MessageSquareText className="h-8 w-8 text-purple-600" />,
    title: "AI Thought Dump",
    description: "Speak or type your worries, tasks, and ideas to instantly clear your mind",
  },
  {
    icon: <Heart className="h-8 w-8 text-purple-600" />,
    title: "Smart Mood Tracker",
    description: "AI detects emotions and stress levels to provide personalized support",
  },
  {
    icon: <Brain className="h-8 w-8 text-purple-600" />,
    title: "AI Emotional Twin",
    description: "Learns your patterns and organizes your thoughts for better mental clarity",
  },
  {
    icon: <Mic className="h-8 w-8 text-purple-600" />,
    title: "Voice Engine",
    description: "Talk to AI for instant relief and guidance whenever you need it",
  },
  {
    icon: <CheckCircle2 className="h-8 w-8 text-purple-600" />,
    title: "Task & Reminder Automation",
    description: "Converts your scattered thoughts into actionable steps and timely reminders",
  },
  {
    icon: <Shield className="h-8 w-8 text-purple-600" />,
    title: "Data Security & Privacy",
    description: "Your data is encrypted end-to-end, ensuring complete privacy and control over your information",
  },
]

const howItWorks = [
  {
    number: "01",
    title: "Offload Your Thoughts",
    description: "Speak or type your thoughts, worries, tasks, and ideas into MindEase",
  },
  {
    number: "02",
    title: "AI Organization",
    description: "Our AI organizes and simplifies your information into meaningful insights",
  },
  {
    number: "03",
    title: "Emotional Twin Evolution",
    description: "Your AI Emotional Twin evolves to predict your needs and patterns",
  },
  {
    number: "04",
    title: "Structured Guidance",
    description: "Receive structured insights, reminders, and stress-relief suggestions",
  },
]

const benefits = [
  {
    icon: <Zap className="h-8 w-8 text-purple-600" />,
    title: "Reduced Mental Load",
    description: "Free up mental space by offloading thoughts, tasks, and worries to your AI companion",
  },
  {
    icon: <BarChart3 className="h-8 w-8 text-purple-600" />,
    title: "Improved Focus",
    description: "Stay present and focused on what matters most without mental distractions",
  },
  {
    icon: <Shield className="h-8 w-8 text-purple-600" />,
    title: "Decreased Stress",
    description: "Lower anxiety levels by knowing your thoughts are safely captured and organized",
  },
  {
    icon: <Smile className="h-8 w-8 text-purple-600" />,
    title: "Better Emotional Wellbeing",
    description: "Gain insights into your emotional patterns for improved self-awareness",
  },
]

const faqs = [
  {
    question: "How does MindEase protect my privacy?",
    answer:
      "MindEase takes privacy seriously. All your data is encrypted end-to-end, and we never share your personal information with third parties. You have complete control over your data, with options to delete it at any time.",
  },
  {
    question: "Can MindEase replace therapy?",
    answer:
      "MindEase is designed to complement, not replace, professional mental health care. While it provides valuable tools for mental organization and stress management, it's not a substitute for working with qualified mental health professionals.",
  },
  {
    question: "How accurate is the emotion detection?",
    answer:
      "Our emotion detection technology uses advanced natural language processing and voice analysis to identify emotional patterns with high accuracy. The system improves over time as it learns your unique emotional expressions and patterns.",
  },
  {
    question: "Can I use MindEase offline?",
    answer:
      "While MindEase primarily functions with an internet connection to leverage its AI capabilities, we offer a limited offline mode that allows you to record thoughts for later processing when you're back online.",
  },
  {
    question: "Is there a limit to how much I can offload to MindEase?",
    answer:
      "MindEase is designed to handle extensive use. Our standard plan includes generous limits that accommodate most users' needs, while our premium plans offer expanded capacity for power users.",
  },
]

export default function LandingPage() {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter subscription
    console.log('Subscribed with:', email);
    setEmail('');
    // Show success message or toast notification
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-purple-50">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="inline-block mb-6">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                <Sparkles className="h-4 w-4 mr-1" />
                Your AI Brain Offloader
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Give your mind the <span className="text-purple-600">freedom</span> it deserves
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              MindEase absorbs your mental clutter, giving you a stress-free, organized mind. 
              Your personal AI assistant manages thoughts, emotions, tasks, and stress while helping you stay focused.
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white px-8" onClick={() => window.location.href = '/register'}>
                Get Started
              </Button>
              <Button size="lg" variant="outline" className="border-2 border-purple-600 text-purple-600 hover:bg-purple-50 px-8" onClick={() => window.location.href = '/login'}>
                Login
              </Button>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-16 relative"
          >
            <div className="aspect-video rounded-xl overflow-hidden shadow-2xl border border-purple-100">
              <img 
                src="/icons/Home.png?height=720&width=1280" 
                alt="MindEase in action" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent flex items-end justify-center pb-8">
                <Button variant="secondary" size="sm" className="rounded-full px-4 flex items-center gap-2">
                  See MindEase in action <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center"></div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Key Features</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              MindEase combines powerful AI technology with intuitive design to help you manage your mental load
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow border-purple-100">
                  <CardContent className="p-6">
                    <div className="mb-4 p-2 bg-purple-50 inline-block rounded-lg">{feature.icon}</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="lg:w-1/2"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Benefits of Mental Offloading</h2>
              <p className="text-gray-600 mb-8">
                MindEase helps you achieve mental clarity and emotional balance by taking the weight off your mind. 
                Our AI-powered system is designed to understand your unique thought patterns and provide personalized support.
              </p>
              
              <div className="space-y-6">
                {benefits.map((benefit, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                    className="flex items-start gap-4"
                  >
                    <div className="p-2 bg-purple-50 rounded-lg shrink-0">
                      {benefit.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900">{benefit.title}</h3>
                      <p className="text-gray-600">{benefit.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="lg:w-1/2"
            >
              <div className="relative">
                <div className="absolute -inset-4 bg-purple-100 rounded-3xl transform -rotate-3"></div>
                <div className="absolute -inset-4 bg-purple-200 rounded-3xl transform rotate-3 opacity-70"></div>
                <img 
                  src="/icons/Brain2.png?height=600&width=600" 
                  alt="Mental clarity illustration" 
                  className="relative z-10 rounded-3xl shadow-lg"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
        <h2 className="text-3xl font-bold text-white mb-4">How It Works</h2>
        <p className="text-purple-100 max-w-2xl mx-auto">
          MindEase simplifies the process of managing your mental load in four easy steps
        </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {howItWorks.map((step, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="relative"
          >
            <div className="text-5xl font-bold text-purple-200 mb-4">{step.number}</div>
            <h3 className="text-xl font-semibold text-white mb-2">{step.title}</h3>
            <p className="text-purple-100">{step.description}</p>
            
            {index < howItWorks.length - 1 && (
          <div className="hidden lg:block absolute top-8 right-0 transform translate-x-1/2">
            <ArrowRight className="h-6 w-6 text-purple-300" />
          </div>
            )}
          </motion.div>
        ))}
          </div>
          
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How MindEase Can Benefit You</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore the ways MindEase can help you achieve mental clarity, reduce stress, and improve your overall wellbeing.
            </p>
            </div>
          
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
              icon: <Shield className="h-8 w-8 text-purple-600" />,
              title: "End-to-End Encryption",
              description:
                "All your data is encrypted from the moment it leaves your device until it reaches our servers, ensuring complete privacy.",
              },
              {
              icon: <Lock className="h-8 w-8 text-purple-600" />,
              title: "Secure Storage",
              description:
                "Your data is stored in highly secure servers with multiple layers of protection to prevent unauthorized access.",
              },
              {
              icon: <Key className="h-8 w-8 text-purple-600" />,
              title: "User-Controlled Access",
              description:
                "You have full control over your data, with options to delete or export it at any time, ensuring transparency and trust.",
              },
            ].map((securityFeature, index) => (
              <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              >
              <Card className="h-full border-purple-100">
                <CardContent className="p-6">
                <div className="mb-4 p-2 bg-purple-50 inline-block rounded-lg">
                  {securityFeature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {securityFeature.title}
                </h3>
                <p className="text-gray-600">{securityFeature.description}</p>
                </CardContent>
              </Card>
              </motion.div>
            ))}
            </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-gray-600">
              Find answers to common questions about MindEase
            </p>
          </div>
          
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border border-gray-200 rounded-lg overflow-hidden">
                <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-purple-50">
                  <span className="text-left font-medium">{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 pt-2 text-gray-600">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Future Vision Section */}
      <section className="py-20 bg-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="lg:w-1/2"
            >
              <h2 className="text-3xl font-bold mb-6">Future Vision</h2>
              <p className="text-purple-100 text-lg mb-6">
                We're working to integrate MindEase with wearables and smart assistants for real-time stress monitoring and relief. 
                Imagine your AI companion detecting stress patterns before you do and providing timely interventions.
              </p>
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-purple-500 rounded-full">
                  <Clock className="h-6 w-6" />
                </div>
                <p className="font-medium">Coming soon in 2025</p>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="lg:w-1/2"
            >
              <div className="aspect-square max-w-md mx-auto relative">
                <div className="absolute inset-0 bg-purple-500 rounded-full opacity-20 animate-pulse"></div>
                <img 
                  src="/icons/Future2.png?height=400&width=400" 
                  alt="Future MindEase" 
                  className="relative z-10 rounded-3xl"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        {/* Company Info */}
        <div>
          <div className="flex items-center mb-4">
            <Brain className="h-8 w-8 text-purple-400 mr-2" />
            <span className="text-2xl font-bold">MindEase</span>
          </div>
          <p className="text-gray-400 mb-4">
            Your AI-powered brain offloader for mental clarity and emotional wellbeing.
          </p>
          <div className="flex space-x-4">
            <a href="https://github.com/KshKnsl/MindEase" className="text-gray-400 hover:text-white transition-colors">
          <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
          </svg>
            </a>
          </div>
        </div>
        
        </div>
          
          <div className="border-t border-gray-800 pt-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} MindEase. All rights reserved.
          </p>
        </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

