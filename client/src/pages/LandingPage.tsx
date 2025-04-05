import { motion } from "framer-motion"
import {
  Brain,
  Heart,
  MessageSquareText,
  Mic,
  CheckCircle2,
  Map,
  Sparkles,
  ArrowRight,
  Clock,
  Star,
  Zap,
  Shield,
  Smile,
  BarChart3,
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
    icon: <Map className="h-8 w-8 text-purple-600" />,
    title: "Brain Mapping & Idea Sorting",
    description: "Helps structure priorities and organize your mental landscape",
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

const testimonials = [
  {
    quote:
      "MindEase has completely transformed how I manage my mental load. It's like having a second brain that understands me.",
    author: "Sarah J.",
    role: "Marketing Executive",
    rating: 5,
  },
  {
    quote:
      "As someone with ADHD, keeping track of my thoughts was always challenging. MindEase helps me organize my mind in ways I never thought possible.",
    author: "Michael T.",
    role: "Software Developer",
    rating: 5,
  },
  {
    quote:
      "The voice feature is a game-changer. I can offload my thoughts while driving or walking, and MindEase organizes everything perfectly.",
    author: "Priya K.",
    role: "Healthcare Professional",
    rating: 5,
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


const stats = [
  { value: "87%", label: "Users report reduced stress levels" },
  { value: "92%", label: "Improvement in task completion" },
  { value: "3.5h", label: "Average weekly time saved" },
  { value: "250k+", label: "Active users worldwide" },
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
              <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white px-8">
                Start Offloading
              </Button>
              <Button size="lg" variant="outline" className="border-2 border-purple-600 text-purple-600 hover:bg-purple-50 px-8">
                Watch Demo
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
                src="/placeholder.svg?height=720&width=1280" 
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="text-4xl font-bold text-purple-600 mb-2">{stat.value}</div>
                <p className="text-gray-600">{stat.label}</p>
              </motion.div>
            ))}
          </div>
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
                  src="/placeholder.svg?height=600&width=600" 
                  alt="Mental clarity illustration" 
                  className="relative z-10 rounded-3xl shadow-lg"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
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
                <div className="text-5xl font-bold text-purple-100 mb-4">{step.number}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
                
                {index < howItWorks.length - 1 && (
                  <div className="hidden lg:block absolute top-8 right-0 transform translate-x-1/2">
                    <ArrowRight className="h-6 w-6 text-purple-200" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
          
          <div className="mt-16 text-center">
            <Button className="bg-purple-600 hover:bg-purple-700 text-white">
              Get Started Now
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What Our Users Say</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover how MindEase has transformed the mental wellbeing of our users
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full border-purple-100">
                  <CardContent className="p-6">
                    <div className="flex mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                      ))}
                    </div>
                    <p className="text-gray-600 italic mb-6">"{testimonial.quote}"</p>
                    <div>
                      <p className="font-semibold text-gray-900">{testimonial.author}</p>
                      <p className="text-gray-500 text-sm">{testimonial.role}</p>
                    </div>
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
                  src="/placeholder.svg?height=400&width=400" 
                  alt="Future MindEase" 
                  className="relative z-10 rounded-3xl"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Ready to offload your mental clutter?
            </h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Join thousands who have found mental clarity and reduced stress with MindEase
            </p>
            <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white px-8">
              Get Started Now
            </Button>
          </motion.div>
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
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
          <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
          </svg>
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
          <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
          </svg>
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
          <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
          </svg>
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
          <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
          </svg>
            </a>
          </div>
        </div>
        
        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2">
            <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Features</a></li>
            <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Pricing</a></li>
            <li><a href="#" className="text-gray-400 hover:text-white transition-colors">About Us</a></li>
            <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Testimonials</a></li>
            <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
          </ul>
        </div>
        
        {/* Legal */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Legal</h3>
          <ul className="space-y-2">
            <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
            <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a></li>
            <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Cookie Policy</a></li>
            <li><a href="#" className="text-gray-400 hover:text-white transition-colors">GDPR Compliance</a></li>
          </ul>
        </div>
        
        {/* Newsletter */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Subscribe to our newsletter</h3>
          <p className="text-gray-400 mb-4">
            Stay updated with the latest features and releases.
          </p>
          <form onSubmit={handleSubscribe} className="flex">
            <input 
          type="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          placeholder="Enter your email" 
          required
          className="px-4 py-2 w-full bg-gray-800 border border-gray-700 rounded-l-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
            />
            <Button 
          type="submit" 
          className="bg-purple-600 hover:bg-purple-700 rounded-l-none"
            >
          Subscribe
            </Button>
          </form>
        </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} MindEase. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
          Privacy
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
          Terms
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
          Cookies
            </a>
          </div>
        </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

