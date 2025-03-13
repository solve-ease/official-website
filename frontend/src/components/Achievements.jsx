import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, ExternalLink } from 'lucide-react';

const Achievements = () => {
  const achievements = [
    {
      id: 1,
      title: "AWS Hackathon Winner",
      description: "First place in the AWS Innovation Challenge with our serverless architecture solution.",
      image: "/images/achievements/aws-hackathon.jpg",
      date: "November 2023",
      linkedinPost: "https://www.linkedin.com/company/solve-ease/posts/?feedView=all"
    },
    {
      id: 2,
      title: "Google Solution Challenge Finalist",
      description: "Selected as one of the top 10 global finalists for our sustainability-focused mobile application.",
      image: "/images/achievements/google-challenge.jpg",
      date: "March 2024",
      linkedinPost: "https://www.linkedin.com/company/solve-ease/posts/?feedView=all"
    },
    {
      id: 3,
      title: "AI Innovation Award",
      description: "Recognized for our groundbreaking AI chatbot solution at the International Tech Summit.",
      image: "/images/achievements/ai-award.jpg",
      date: "May 2024",
      linkedinPost: "https://www.linkedin.com/company/solve-ease/posts/?feedView=all"
    },
    {
      id: 4,
      title: "Best Health Tech Solution",
      description: "Won the HealthTech Innovators competition with our patient monitoring platform.",
      image: "/images/achievements/health-tech.jpg",
      date: "August 2024",
      linkedinPost: "https://www.linkedin.com/company/solve-ease/posts/?feedView=all"
    }
  ];

  return (
    <section id="achievements" className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block py-1 px-3 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 text-sm font-medium mb-4">
            Our Achievements
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Celebrating Our Success Stories
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            We take pride in our hackathon victories and industry recognition that validate our expertise and innovative approach.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {achievements.map((achievement, index) => (
            <motion.div 
              key={achievement.id}
              className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="flex flex-col md:flex-row">
                <div className="md:w-2/5 relative pb-[60%] md:pb-0 bg-gray-200 dark:bg-gray-700">
                  <img 
                    src={achievement.image || `/api/placeholder/400/300?text=${encodeURIComponent(achievement.title)}`} 
                    alt={`${achievement.title} achievement`}
                    className="absolute h-full w-full object-cover"
                  />
                </div>
                <div className="md:w-3/5 p-6">
                  <div className="flex items-start mb-2">
                    <Trophy className="text-yellow-500 mr-2 flex-shrink-0" size={20} />
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{achievement.title}</h3>
                  </div>
                  <p className="text-sm text-indigo-600 dark:text-indigo-400 mb-2">{achievement.date}</p>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">{achievement.description}</p>
                  <a
                    href={achievement.linkedinPost}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium"
                  >
                    <ExternalLink size={16} className="mr-1" />
                    View on LinkedIn
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

export default Achievements;