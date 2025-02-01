import React from 'react';
import { Brain, Heart, Sparkles, BarChart3, Users } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
  {
    icon: <Brain className="h-8 w-8 text-purple-600" />,
    title: "AI Emotional Twin",
    description: "Your personalized AI companion for emotional support and guidance"
  },
  {
    icon: <BarChart3 className="h-8 w-8 text-purple-600" />,
    title: "Mood Tracking",
    description: "Track and analyze your emotional journey with intelligent insights"
  },
  {
    icon: <Heart className="h-8 w-8 text-purple-600" />,
    title: "Therapy Tools",
    description: "Access therapeutic resources and exercises for mental well-being"
  },
  {
    icon: <Users className="h-8 w-8 text-purple-600" />,
    title: "Community Support",
    description: "Connect with others on similar journeys in a safe, supportive space"
  }
];

const LandingPage = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Empowering mental well-being through
              <span className="text-purple-600"> AI-driven emotional intelligence</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Experience personalized emotional support, mood tracking, and therapeutic tools powered by advanced AI technology.
            </p>
            <div className="flex justify-center space-x-4">
              <button className="bg-purple-600 text-white px-8 py-3 rounded-lg hover:bg-purple-700 transition-colors">
                Get Started
              </button>
              <button className="border-2 border-purple-600 text-purple-600 px-8 py-3 rounded-lg hover:bg-purple-50 transition-colors">
                Learn More
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Features that empower your journey</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover the tools and support systems designed to enhance your mental well-being
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-purple-50 p-6 rounded-xl hover:shadow-lg transition-shadow"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Start your journey to better mental health today
          </h2>
          <p className="text-purple-100 mb-8 max-w-2xl mx-auto">
            Join thousands of others who have found peace and support through MindEase
          </p>
          <button className="bg-white text-purple-600 px-8 py-3 rounded-lg hover:bg-purple-50 transition-colors">
            Begin Your Journey
          </button>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;