import { useEffect, useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import './App.css'
import HomePage from './pages/HomePage'
import ScrollToTop from './components/ScrollToTop'

function App() {
  return (
    <main className='flex-grow'>
    
    <Router>
      <Routes>
        <Route path='/' element={<HomePage />} />
      </Routes>
    </Router>
    <ScrollToTop />
    </main>
  )
}

export default App