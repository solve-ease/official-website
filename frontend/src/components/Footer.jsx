import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Heart, Github, Linkedin, Instagram, Twitter } from 'lucide-react';
import Logo from '../assets/logo.png'

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: "Company",
      links: [
        { name: "About Us", href: "/about" },
        { name: "Our Services", href: "#services" },
        { name: "Our Team", href: "#team" },
        { name: "Careers", href: "/careers" },
        { name: "Contact Us", href: "#contact" }
      ]
    },
    {
      title: "Services",
      links: [
        { name: "Web Development", href: "/services/web-development" },
        { name: "Mobile Apps", href: "/services/mobile-apps" },
        { name: "AI Solutions", href: "/services/ai-solutions" },
        { name: "Custom Software", href: "/services/custom-software" },
        { name: "Technical Consultation", href: "/services/consultation" }
      ]
    },
    {
      title: "Resources",
      links: [
        { name: "Blog", href: "/blog" },
        { name: "Case Studies", href: "/case-studies" },
        { name: "Documentation", href: "/docs" },
        { name: "FAQ", href: "/faq" },
        { name: "Privacy Policy", href: "/privacy-policy" }
      ]
    }
  ];

  const socialLinks = [
    { icon: <Github size={20} />, href: "https://github.com/solve-ease", ariaLabel: "GitHub" },
    { icon: <Instagram size={20} />, href: "https://www.instagram.com/solve__ease/", ariaLabel: "Instagram" },
    { icon: <Linkedin size={20} />, href: "https://www.linkedin.com/company/solve-ease/", ariaLabel: "LinkedIn" },
    { icon: <Twitter size={20} />, href: "https://x.com/solve__ease/", ariaLabel: "Twitter/X" }
  ];

  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          <div className="lg:col-span-2">
            <div className="flex items-center mb-6">
              <img src={Logo} alt="Solve-Ease Logo" className="h-10 w-auto" />
              <span className="ml-2 text-2xl font-bold text-indigo-400">Solve-Ease</span>
            </div>
            <p className="text-gray-400 mb-6 max-w-md">
              Start with Purpose, Solve with Innovation, Succeed with Impact. We help businesses transform their ideas into impactful digital solutions.
            </p>
            <div className="flex space-x-4 mb-8">
              {socialLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-indigo-600 hover:text-white transition-colors"
                  aria-label={link.ariaLabel}
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </div>

          {footerLinks.map((column, index) => (
            <div key={index} className="mt-8 lg:mt-0">
              <h3 className="text-lg font-semibold mb-6 text-white">{column.title}</h3>
              <ul className="space-y-4">
                {column.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a 
                      href={link.href} 
                      className="text-gray-400 hover:text-indigo-400 transition-colors flex items-center"
                    >
                      <ChevronRight size={16} className="mr-2" />
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="border-t border-gray-800 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              &copy; {currentYear} Solve-Ease. All rights reserved.
            </p>
            <div className="flex items-center">
              <span className="text-gray-400 text-sm flex items-center">
                Made with <Heart size={16} className="text-red-500 mx-1" /> by the Solve-Ease Team
              </span>
            </div>
          </div>
        </div>
        
        {/* Schema.org structured data for better SEO */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Solve-Ease",
            "url": "https://solve-ease.com",
            "logo": "https://solve-ease.com/logo.svg",
            "sameAs": [
              "https://github.com/solve-ease",
              "https://www.instagram.com/solve__ease/",
              "https://www.linkedin.com/company/solve-ease/",
              "https://x.com/solve__ease/"
            ],
            "contactPoint": {
              "@type": "ContactPoint",
              "telephone": "+1-555-123-4567",
              "contactType": "customer service",
              "email": "info@solve-ease.com"
            }
          })
        }} />
      </div>
    </footer>
  );
};

export default Footer;