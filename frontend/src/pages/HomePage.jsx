import React from 'react'

import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import Services from '../components/Services'
import Projects from '../components/Projects'
import Achievements from '../components/Achievements'
import Team from '../components/Team'
import Contact from '../components/Contact'
import Footer from '../components/Footer'
import ChatBot from '../components/Chatbot'


const HomePage = () => {
  return (
    <div className="font-sans bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 min-h-screen p-0">
        <Navbar />
        <main>
          <Hero />
          <Services />
          <Projects />
          <Achievements />
          <Team />
          <Contact />
        </main>
        <Footer />
        <ChatBot />

    </div>
  )
}

export default HomePage


