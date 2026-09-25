import { useState, lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import Header from './components/Header.jsx'
import NavBar from './components/NavBar.jsx'
import Footer from './components/Footer.jsx'
import Spinner from './components/Spinner.jsx'
import './App.css'

// Practical 8: Route-based Code Splitting using React.lazy()
const Home = lazy(() => import('./pages/Home.jsx'))
const Projects = lazy(() => import('./pages/Projects.jsx'))
const Contact = lazy(() => import('./pages/Contact.jsx'))
const NotFound = lazy(() => import('./pages/NotFound.jsx'))

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

      <Suspense fallback={<Spinner message="Loading page..." />}>
        <Routes>
          <Route path="/" element={<Home summary={summary} skillList={skillList} />} />
          <Route path="/tasks" element={<Projects initialTab="tasks" />} />
          <Route path="/projects" element={<Projects initialTab="tasks" />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>

      <Footer email={email} linkedIn={linkedIn} />
    </div>
  )
}


export default App
