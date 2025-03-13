import React from 'react';
import { motion } from 'framer-motion';
import { 
  Globe, 
  Smartphone, 
  MessageSquare, 
  Cpu, 
  Code, 
  SearchCode 
} from 'lucide-react';

const Services = () => {
  const services = [
    {
      icon: <Globe size={24} />,
      title: "Web Development",
      description: "Custom websites and web applications built with modern frameworks like React, ensuring responsive design and optimal performance."
    },
    {
      icon: <Smartphone size={24} />,
      title: "Mobile App Development",
      description: "Native and cross-platform mobile applications that deliver seamless user experiences across iOS and Android devices."
    },
    {
      icon: <MessageSquare size={24} />,
      title: "AI Chatbots",
      description: "Intelligent conversational agents that enhance customer support, streamline processes, and provide 24/7 assistance."
    },
    {
      icon: <Cpu size={24} />,
      title: "Generative AI Solutions",
      description: "Custom AI models that generate content, analyze data, and automate complex tasks to drive business efficiency."
    },
    {
      icon: <Code size={24} />,
      title: "Custom Software Solutions",
      description: "Tailored software applications designed to address specific business challenges and operational requirements."
    },
    {
      icon: <SearchCode size={24} />,
      title: "Technical Consultation",
      description: "Expert guidance on technology selection, architecture design, and implementation strategies for digital projects."
    }
  ];

  return (
    <section id="services" className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block py-1 px-3 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 text-sm font-medium mb-4">
            Our Services
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Solutions That Drive Impact
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            We offer a comprehensive range of digital services to help businesses innovate and thrive in the digital landscape.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div 
              key={index}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center mb-4 text-indigo-600 dark:text-indigo-400">
                {service.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">{service.title}</h3>
              <p className="text-gray-600 dark:text-gray-300">{service.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;