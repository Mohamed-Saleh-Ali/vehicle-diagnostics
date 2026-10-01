import { Link, NavLink, useNavigate } from 'react-router';
import { History, LogOut, Menu, Settings2, Stethoscope, Wrench } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const linkClass = ({ isActive }: { isActive: boolean }) => (isActive ? 'menu-active font-semibold' : '');

export default function Navbar() {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const links = (
    <>
      <li>
        <NavLink to="/" end className={linkClass}>
          <Wrench size={16} /> Parts
        </NavLink>
      </li>
      <li>
        <NavLink to="/diagnose" className={linkClass}>
          <Stethoscope size={16} /> Diagnose
        </NavLink>
      </li>
      {user && (
        <li>
          <NavLink to="/diagnoses" end className={linkClass}>
            <History size={16} /> My diagnoses
          </NavLink>
        </li>
      )}
      {isAdmin && (
        <li>
          <NavLink to="/admin/parts" className={linkClass}>
            <Settings2 size={16} /> Manage parts
          </NavLink>
        </li>
      )}
    </>
  );

  return (
    <header className="navbar sticky top-0 z-30 border-b-2 border-neutral bg-base-100 px-4">
      <div className="navbar-start gap-1">
        {/* Mobile menu */}
        <div className="dropdown lg:hidden">
          <button tabIndex={0} className="btn btn-ghost btn-square" aria-label="Open menu">
            <Menu size={20} />
          </button>
          <ul tabIndex={0} className="menu dropdown-content z-40 mt-3 w-56 rounded-box bg-base-100 p-2 shadow-lg">
            {links}
          </ul>
        </div>
        <Link to="/" className="flex items-center gap-2 font-display text-2xl font-extrabold uppercase tracking-tight">
          <span className="grid size-9 place-items-center bg-neutral text-primary">
            <Wrench size={18} />
          </span>
          <span>
            Diag<span className="text-primary">Bay</span>
          </span>
        </Link>
      </div>

      <nav className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal gap-1">{links}</ul>
      </nav>

      <div className="navbar-end gap-2">
        {user ? (
          <>
            <div className="hidden text-right leading-tight sm:block">
              <div className="text-sm font-medium">{user.name}</div>
              <div className="text-xs capitalize text-base-content/60">{user.role}</div>
            </div>
            <button onClick={handleLogout} className="btn btn-ghost btn-sm" aria-label="Log out">
              <LogOut size={16} />
              <span className="hidden sm:inline">Log out</span>
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn btn-ghost btn-sm">
              Log in
            </Link>
            <Link to="/register" className="btn btn-primary btn-sm">
              Sign up
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
