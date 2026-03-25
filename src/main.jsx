import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import JournalArticle from './pages/JournalArticle'
import CoursePage from './pages/CoursePage'
import LibraryBook from './pages/LibraryBook'
import NewsArticle from './pages/NewsArticle'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/journals/:slug" element={<JournalArticle />} />
        <Route path="/courses/:slug" element={<CoursePage />} />
        <Route path="/library/:slug" element={<LibraryBook />} />
        <Route path="/news/:slug" element={<NewsArticle />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
