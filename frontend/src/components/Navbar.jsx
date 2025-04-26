import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Menu, X, Moon, Sun, Github, Linkedin, Instagram, Twitter } from 'lucide-react';
import Logo from '../assets/logo.png'
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleMenu = () => {
    setIsOpen(!isOpen)
    
    // if (isOpen) {
    //   document.getElementsByClassName('my-head')[0].classList.remove('bg-white/90 dark:bg-gray-900/90 shadow-md backdrop-blur-sm');
    //   document.getElementsByClassName('my-head')[0].classList.add('bg-transparent');
    // }
  };
  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  const navLinks = [
    { name: 'Home', href: '/' },
    {name : 'Blogs', href : '/blog'},
    { name: 'Services', href: '#services' },
    { name: 'Projects', href: '#projects' },
    { name: 'Achievements', href: '#achievements' },
    { name: 'Team', href: '#team' },
    { name: 'Contact', href: '#contact' },
  ];

  const socialLinks = [
    { icon: <Github size={20} />, href: 'https://github.com/solve-ease', ariaLabel: 'GitHub' },
    { icon: <Instagram size={20} />, href: 'https://www.instagram.com/solve__ease/', ariaLabel: 'Instagram' },
    { icon: <Linkedin size={20} />, href: 'https://www.linkedin.com/company/solve-ease/', ariaLabel: 'LinkedIn' },
    { icon: <Twitter size={20} />, href: 'https://x.com/solve__ease/', ariaLabel: 'Twitter/X' },
  ];

  return (
    <motion.header 
      
    className={`fixed my-head w-full z-50 transition-all duration-300 ${
      scrolled || isOpen ? 'bg-white/90 dark:bg-gray-900/90 shadow-md backdrop-blur-sm' : 'bg-transparent'
    }`}
      
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <nav className="container mx-auto px-4 py-4 md:flex md:justify-between md:items-center">
        <div className="flex items-center justify-between">
          <a href="#home" className="flex items-center">
            <img src={Logo} alt="Solve-Ease Logo" className="h-10 w-auto" />
            <span className="ml-2 text-xl font-bold text-indigo-600 dark:text-indigo-400">Solve-Ease</span>
          </a>
          <div className="flex md:hidden"
            style={{marginRight: '16px'}}
          >
            <button
              type="button"
              className="ml-2 text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 focus:outline-none"
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              {isDarkMode ? <Sun /> : <Moon />}
            </button>
            <button
              type="button"
              className="ml-2 text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 focus:outline-none"
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={32} /> : <Menu size={32} />}
            </button>
          </div>
        </div>

        <div
          className={`${
            isOpen ? 'flex flex-col mt-4 ' : 'hidden'
          } md:flex md:mt-0 md:flex-row md:items-center`}
        >
          <ul className="md:flex md:space-x-8">
            {navLinks.map((link) => (
              <li key={link.name}>
                <a
                  href={link.href}
                  className="block py-2 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
          <div className="hidden md:flex md:items-center md:ml-8 space-x-4">
            {socialLinks.map((link, index) => (
              <a
                key={index}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                aria-label={link.ariaLabel}
              >
                {link.icon}
              </a>
            ))}
            <button
              type="button"
              className="ml-2 text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 focus:outline-none"
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              {isDarkMode ? <Sun size={32} /> : <Moon size={32} />}
            </button>
          </div>
        </div>
      </nav>
    </motion.header>
  );
};

export default Navbar;