import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Github, Link } from 'lucide-react';

import EdugamixImg  from '../assets/edugamix-project.webp';
import OrchardEyesImg from '../assets/orchardeyes-project.webp';
import SeedSocietyImg from '../assets/seed-society-project.webp';
import AutoDocImg from '../assets/autodoc-project.webp';


const Projects = () => {
  const [activeFilter, setActiveFilter] = useState('all');

  const filters = [
    { id: 'all', label: 'All Projects' },
    { id: 'web', label: 'Web Development' },
    { id: 'mobile', label: 'Mobile Apps' },
    { id: 'ai', label: 'AI Solutions' }
  ];

  const projects = [
    {
      id: 1,
      title: "EduGamix: AI-Powered Learning Platform",
      description: "An intelligent platform that personalizes learning paths based on student performance and learning style with 3D AI Avatar Interviews.",
      image: EdugamixImg,
      category: ["web", "ai"],
      demoLink: "https://edu-gamix.vercel.app/",
      githubLink: "https://github.com/solve-ease/EduGamix",
      technologies: ["React", "Express.js", "TensorFlow", "Supabase", "Threejs"]
    },
    {
      id: 2,
      title: "OrchardEyes: Apple Orchard Management",
      description: "An end to end Automated Apple Orchard Management system using Ai, blockchain and UAV autonomus drones. ",
      image: OrchardEyesImg,
      category: ["web"],
      demoLink: "https://orchard-eyes-new.vercel.app/",
      githubLink: "https://github.com/solve-ease/supply-chain",
      technologies: ["React", "Express.js", "Solidity", "PostgreSQL", "Ethereum", "OpenCV", "Raspberry Pi", "ROS", "YOLOv8"]
    },
    {
      id: 3,
      title: "SeedSociety: Android App + Web",
      description: "A community platform providing smart tracking of tree plantation and their health using AI and blockchain technology.",
      image: SeedSocietyImg,
      category: ["mobile", "web", "ai"],
      demoLink: "https://seed-society.vercel.app/",
      githubLink: "https://github.com/solve-ease/SeedSociety",
      technologies: ["React Native", "Supabase", "OpenCV", "Solidity", "Ethereum"]
    },
    {
      id: 4,
      title: "AutoDoc: Document Verification System",
      description: "An Automated Official Doc Managemnt system using AI and Blockchain with secure storage via IPFS. User profiles include Issuing Authorities, Verifiying authorities and Individuals. ",
      image: AutoDocImg,
      category: [ "web"],
      demoLink: "https://auto-doc-seven.vercel.app/",
      githubLink: "https://github.com/solve-ease/Auto-Doc-Manager",
      technologies: ["React", "Expressjs", "Solidity", "Pinata + Infura", "Ethereum", "PostgreSQL"]
    },
    {
      id: 5,
      title: "Medicure RAG Chatbot",
      description: "A Medical assitant Chatbot using Retrieval Augmented Generation powered by Meta Llama2-7b LLM quantized Model. The Web App is built using streamlit and deployed on huggingface hub spaces",
      image: "https://adarsh-maurya-dev.vercel.app/img/medicure-cert.webp",
      category: ["ai", "web"],
      demoLink: "https://huggingface.co/spaces/4darsh-Dev/medicure",
      githubLink: "https://github.com/4darsh-Dev/medicure-rag-chatbot/",
      technologies: ["Python", "LLM", "Langchain", "Pinecone", "Streamlit"]
    },
    
    {
      id: 6,
      title: "CogniGuard: Dark Pattern Detector",
      description: "A web extension for detecing and combatting dark patterns on various websites, particularly focusing on E-commerce platforms.",
      image: "https://adarsh-maurya-dev.vercel.app/img/cogniguard-cert.webp",
      category: ["web", "ai"],
      demoLink: "https://demo.solve-ease.com/ar-shopping",
      githubLink: "https://github.com/4darsh-Dev/CogniGaurd",
      technologies: ["JavaScript", "HTML","CSS","BERT-LLM", "Redis","Celery", "AWS", "Django", "Gunicorn+Nginx", "PostgreSQL"]
    }
  ];

  const filteredProjects = activeFilter === 'all' 
    ? projects 
    : projects.filter(project => project.category.includes(activeFilter));

  return (
    <section id="projects" className="py-16">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block py-1 px-3 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 text-sm font-medium mb-4">
            Our Projects
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Innovations That Solve Real Problems
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Explore our portfolio of projects that demonstrate our expertise and commitment to delivering impactful solutions.
          </p>
          
          <div className="flex flex-wrap justify-center mt-8 mb-12 gap-2">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeFilter === filter.id
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project, index) => (
            <motion.div 
              key={project.id}
              className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="relative pb-[60%] bg-gray-200 dark:bg-gray-700">
                <img 
                  src={project.image || `/api/placeholder/400/240?text=${encodeURIComponent(project.title)}`} 
                  alt={`${project.title} project thumbnail`}
                  className="absolute h-full w-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{project.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">{project.description}</p>
                
                <div className="mb-4 flex flex-wrap gap-2">
                  {project.technologies.map((tech, i) => (
                    <span 
                      key={i} 
                      className="px-2 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 rounded"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                
                <div className="flex space-x-4">
                  <a
                    href={project.demoLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium"
                  >
                    <ExternalLink size={16} className="mr-1" />
                    Demo
                  </a>
                  <a
                    href={project.githubLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium"
                  >
                    <Github size={16} className="mr-1" />
                    Code
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;