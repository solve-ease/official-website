import { useEffect, useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import './App.css'
import HomePage from './pages/HomePage'
import ScrollToTop from './components/ScrollToTop'
import BlogsPage from './pages/BlogsPage'
import BlogDetailPage from './pages/BlogDetailPage'
import NotFoundPage from './pages/NotFoundPage'

function App() {
  return (
    <main className='flex-grow'>
    
    <Router>
      <Routes>
        <Route path='/' element={<HomePage />} />
        {/* <Route path='/blogs' element={<BlogsPage />} /> */}
        <Route path="blog">
            <Route index element={<BlogsPage />} />
            <Route path=":slug" element={<BlogDetailPage />} />
            <Route path="not-found" element={<NotFoundPage />} />
          </Route>
      </Routes>
    </Router>
    <ScrollToTop />
    </main>
  )
}

export default App