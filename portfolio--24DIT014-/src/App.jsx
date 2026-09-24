import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Header from './components/Header.jsx'
import NavBar from './components/NavBar.jsx'
import Home from './pages/Home.jsx'
import Projects from './pages/Projects.jsx'
import Contact from './pages/Contact.jsx'
import NotFound from './pages/NotFound.jsx'
import Footer from './components/Footer.jsx'
import './App.css'

function App() {
  const [theme, setTheme] = useState('dark')

  const name = 'Shivansh Dalvadi'
  const tagline = 'My student portfolio page'
  const summary =
    'I create simple React pages with separate components. This portfolio shows my skills and contact info.'
  const skillList = ['HTML', 'CSS', 'JavaScript', 'React']
  const email = 'shivanshdalvadi.dhk@gmail.com'
  const linkedIn = 'www.linkedin.com/in/dalvadi-shivanshkumar-272886343'

  return (
    <div className={`app-shell ${theme === 'light' ? 'theme-light' : 'theme-dark'}`}>
      <Header name={name} tagline={tagline} themeColor={theme === 'light' ? '#f8d9a0' : '#d0e7ff'} />
      <button
        type="button"
        className="theme-toggle"
        onClick={() => setTheme((currentTheme) => (currentTheme === 'dark' ? 'light' : 'dark'))}
      >
        {theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      </button>
      <NavBar />

      <Routes>
        <Route path="/" element={<Home summary={summary} skillList={skillList} />} />
        <Route path="/tasks" element={<Projects initialTab="tasks" />} />
        <Route path="/projects" element={<Projects initialTab="tasks" />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<NotFound />} />
      </Routes>

      <Footer email={email} linkedIn={linkedIn} />
    </div>
  )
}

export default App
