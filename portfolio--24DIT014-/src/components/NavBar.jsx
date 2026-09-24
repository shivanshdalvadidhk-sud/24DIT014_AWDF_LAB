import { NavLink } from 'react-router-dom'

function NavBar() {
  return (
    <nav className="nav-bar">
      <ul>
        <li>
          <NavLink to="/" className={({ isActive }) => (isActive ? 'nav-button active' : 'nav-button')}>
            Home
          </NavLink>
        </li>
        <li>
          <NavLink to="/tasks" className={({ isActive }) => (isActive ? 'nav-button active' : 'nav-button')}>
            Tasks
          </NavLink>
        </li>
        <li>
          <NavLink to="/projects" className={({ isActive }) => (isActive ? 'nav-button active' : 'nav-button')}>
            Projects
          </NavLink>
        </li>
        <li>
          <NavLink to="/contact" className={({ isActive }) => (isActive ? 'nav-button active' : 'nav-button')}>
            Contact
          </NavLink>
        </li>
      </ul>
    </nav>
  )
}

export default NavBar
