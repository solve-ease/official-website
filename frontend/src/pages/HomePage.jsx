import React from 'react'

const HomePage = () => {
  return (
    <div className="font-sans bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 min-h-screen">
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

    </div>
  )
}

export default HomePage


