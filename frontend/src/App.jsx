import { useEffect, useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import './App.css'
import HomePage from './pages/HomePage'
import ScrollToTop from './components/ScrollToTop'
import BlogsPage from './pages/BlogsPage'

function App() {
  return (
    <main className='flex-grow'>
    
    <Router>
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/blogs' element={<BlogsPage />} />
      </Routes>
    </Router>
    <ScrollToTop />
    </main>
  )
}

export default App