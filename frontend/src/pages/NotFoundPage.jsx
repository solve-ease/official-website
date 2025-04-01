import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'


const NotFoundPage = () => {
  return (
    <>
    <Navbar />
    <div>404 Page Not Found </div>
    <p className='text-center'>The page you are looking for does not exist.</p>
    <p className='text-center'>Please check the URL or return to the homepage.</p>
    <p className='text-center'>If you think this is a mistake, please contact support.</p>
    <p className='text-center'>Thank you for your understanding.</p>
    
    <Footer />
    </>
  )
}

export default NotFoundPage