import { NavLink } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="navbar">
      <span className="navbar-title">Student Academic Performance System</span>
      <div className="nav-links">
        <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>Home</NavLink>
        <NavLink to="/students" className={({ isActive }) => isActive ? 'active' : ''}>Student Entry</NavLink>
        <NavLink to="/analytics" className={({ isActive }) => isActive ? 'active' : ''}>Analytics</NavLink>
        <NavLink to="/prediction" className={({ isActive }) => isActive ? 'active' : ''}>Prediction</NavLink>
        <NavLink to="/reports" className={({ isActive }) => isActive ? 'active' : ''}>Reports</NavLink>
      </div>
    </nav>
  );
}

export default Navbar;
