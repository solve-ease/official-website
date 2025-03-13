import React from 'react';
import { motion } from 'framer-motion';
import { Linkedin, Github, Twitter, Mail } from 'lucide-react';

const Team = () => {
  const team = [
    {
      id: 1,
      name: "Aman SIngh",
      role: "Full stack and blockchain developer",
      bio: "I love becoming better",
      image:'https://auto-doc-seven.vercel.app/as-pic.jpg' ,
      expertise: ["ReactJs","ExpressJs","Solidity"],
      social: {
        linkedin: "www.linkedin.com/in/aman-singh-397a32229",
        github: "https://github.com/amansingh494"
      }
    },

    {
      id: 2,
      name: "Adarsh Maurya",
      role: "Entrepreneur and Tech Expert",
      bio: "An Entrepreneur, buildling solutions for world's pressing problems using latest tools and technology like Gen AI, Blockchain, etc",
      image: "https://auto-doc-seven.vercel.app/am-pic.png",
      expertise: ["Web & App Dev", "Gen AI & LLMs", "Blockchain"],
      social: {
        linkedin: "https://www.linkedin.com/in/adarsh-maurya-dev",
        github: "https://github.com/4darsh-Dev"
      }
    },
    {
      id: 3,
      name: "Anmol Goel",
      role: "Robotics and ML Expert",
      bio: "Love Building smart machines",
      image: "/images/team/anmol.jpg",
      expertise: ["Deep Learning", "Machine Learning", "ROS", "IOT"],
      social: {
        linkedin: "https://www.linkedin.com/in/anmolgoel29/",
        github: "https://github.com/mrgoel2975"
      }
    },
    // {
    //   id: 4,
    //   name: "Priya Patel",
    //   role: "AI Specialist",
    //   bio: "AI researcher with expertise in natural language processing and machine learning algorithms.",
    //   image: "/images/team/priya.jpg",
    //   expertise: ["NLP", "Machine Learning", "TensorFlow", "Python"],
    //   social: {
    //     linkedin: "https://www.linkedin.com/in/priyapatel",
    //     github: "https://github.com/priyapatel"
    //   }
    // },
    // {
    //   id: 5,
    //   name: "David Kim",
    //   role: "UX Designer",
    //   bio: "Creative designer focused on crafting intuitive and engaging user experiences.",
    //   image: "/images/team/david.jpg",
    //   expertise: ["UI/UX Design", "Figma", "User Research", "Design Systems"],
    //   social: {
    //     linkedin: "https://www.linkedin.com/in/davidkim",
    //     twitter: "https://x.com/davidkim"
    //   }
    // },
    // {
    //   id: 6,
    //   name: "Emily Wilson",
    //   role: "Project Manager",
    //   bio: "Experienced project manager with a track record of delivering complex technical projects on time and within budget.",
    //   image: "/images/team/emily.jpg",
    //   expertise: ["Agile Methodologies", "Risk Management", "Team Leadership"],
    //   social: {
    //     linkedin: "https://www.linkedin.com/in/emilywilson"
    //   }
    // }
  ];

  return (
    <section id="team" className="py-16">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block py-1 px-3 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 text-sm font-medium mb-4">
            Our Team
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Meet the Innovators Behind Solve-Ease
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Our diverse team of experts brings together a wealth of experience and passion for technology to deliver outstanding solutions.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {team.map((member, index) => (
            <motion.div 
              key={member.id}
              className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="relative pb-[100%] bg-gray-200 dark:bg-gray-700">
                <img 
                  src={member.image || `/api/placeholder/300/300?text=${encodeURIComponent(member.name)}`} 
                  alt={`${member.name}, ${member.role} at Solve-Ease`}
                  className="absolute h-full w-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{member.name}</h3>
                <p className="text-indigo-600 dark:text-indigo-400 font-medium mb-2">{member.role}</p>
                <p className="text-gray-600 dark:text-gray-300 mb-4">{member.bio}</p>
                
                <div className="mb-4 flex flex-wrap gap-2">
                  {member.expertise.map((skill, i) => (
                    <span 
                      key={i} 
                      className="px-2 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 rounded"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
                
                <div className="flex space-x-4">
                  {member.social.linkedin && (
                    <a
                      href={member.social.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                      aria-label={`${member.name}'s LinkedIn profile`}
                    >
                      <Linkedin size={18} />
                    </a>
                  )}
                  {member.social.github && (
                    <a
                      href={member.social.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                      aria-label={`${member.name}'s GitHub profile`}
                    >
                      <Github size={18} />
                    </a>
                  )}
                  {member.social.twitter && (
                    <a
                      href={member.social.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                      aria-label={`${member.name}'s Twitter profile`}
                    >
                      <Twitter size={18} />
                    </a>
                  )}
                  <a
                    href={`mailto:${member.name.toLowerCase().replace(' ', '.')}@solve-ease.com`}
                    className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                    aria-label={`Email ${member.name}`}
                  >
                    <Mail size={18} />
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

export default Team;