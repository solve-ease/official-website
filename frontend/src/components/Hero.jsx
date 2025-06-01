import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Code, Lightbulb, Award } from 'lucide-react';
// import HeroImage from '../assets/hero-image.svg';
import HeroImage from '../assets/hero.png';

const Hero = () => {
  return (
    <section id="home" className="pt-24 pb-16 md:pt-32 md:pb-24">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center">
          <motion.div 
            className="md:w-1/2 mb-10 md:mb-0 md:ml-10"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            // style={{marginLeft :"2rem"}}
          >
            <span className="inline-block py-1 px-3 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 text-sm font-medium mb-4">
              Innovation Hub
            </span>
            <h1 className="text-4xl md:text-4xl lg:text-6xl font-bold leading-tight text-gray-900 dark:text-white mb-6">
              Where Innovation 
              <span className="text-indigo-600 dark:text-indigo-400"> Meets Impact</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-lg">
              Start with Purpose, Solve with Innovation, Succeed with Impact. We build digital solutions that transform ideas into reality.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <motion.a
                href="#contact"
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg inline-flex items-center justify-center transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Get Started
                <ArrowRight className="ml-2" size={18} />
              </motion.a>
              <motion.a
                href="#services"
                className="px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-medium rounded-lg inline-flex items-center justify-center transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Our Services
              </motion.a>
            </div>
          </motion.div>
          <motion.div 
            className="md:w-1/2"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <img 
              src={HeroImage} 
              alt="Innovative solutions visualization showing digital transformation" 
              className="w-auto h-auto rounded-lg md:mx-5 "
              style={{ maxHeight: '400px' }}
            />
          </motion.div>
        </div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {[
            {
              icon: <Code size={32} className="text-indigo-600 dark:text-indigo-400" />,
              title: "Innovative Development",
              description: "We leverage cutting-edge technologies to build robust web and mobile applications."
            },
            {
              icon: <Lightbulb size={32} className="text-indigo-600 dark:text-indigo-400" />,
              title: "AI Solutions",
              description: "Custom AI chatbots and generative AI solutions to solve complex business challenges."
            },
            {
              icon: <Award size={32} className="text-indigo-600 dark:text-indigo-400" />,
              title: "Award-Winning Projects",
              description: "Multiple hackathon victories that showcase our team's expertise and creativity."
            }
          ].map((feature, index) => (
            <div 
              key={index} 
              className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;