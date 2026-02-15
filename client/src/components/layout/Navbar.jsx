import { Shield, Menu, X, LogOut } from "lucide-react";
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const linkClass =
  "block py-2 px-3 hover:text-blue-600 transition-colors";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout, status } = useAuth();

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate("/login");
  };

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-white pt-3 shadow">
      <div className="container mx-auto flex items-center pb-3 pt-2 px-4">

        <div className="flex items-center flex-1">
          <NavLink to={user?.role === "researcher" ? "/" : "/dashboard"} className="flex items-center">
            <div className="bg-blue-600 p-2 rounded-lg mr-3">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                EthixPortal
              </h1>
              <p className="text-xs text-gray-500">
                IEC Management
              </p>
            </div>
          </NavLink>
        </div>

        {status === "authenticated" && (
          <nav className="hidden md:flex flex-1 justify-center">
            <ul className="flex items-center space-x-6 text-gray-700">
              {user?.role === "researcher" && (
                <li>
                  <NavLink to="/" className={linkClass}>Home</NavLink>
                </li>
              )}
              <li>
                <NavLink to="/dashboard" className={linkClass}>Dashboard</NavLink>
              </li>
              <li>
                <NavLink to="/documents" className={linkClass}>Documents</NavLink>
              </li>
            </ul>
          </nav>
        )}

        <div className="flex items-center justify-end flex-1 space-x-3">
          {status === "authenticated" && (
            <>
              <div className="flex flex-col items-end mr-3 hidden sm:flex">
                <span className="text-sm font-semibold text-gray-700">{user?.name}</span>
                <span className="text-xs text-gray-500 capitalize">{user?.role}</span>
              </div>
              <span className="text-xl text-gray-600 w-12 h-12 bg-amber-300 flex items-center justify-center rounded-full shadow-md">
                {user?.name?.[0]?.toUpperCase()}
              </span>

              <button
                onClick={handleLogout}
                className="flex items-center justify-center p-1 hover:bg-black/10 rounded-md transition-colors"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </>
          )}

          {status === "authenticated" && (
            <button
              className="md:hidden text-gray-800 ml-2"
              onClick={() => setOpen(!open)}
            >
              {open ? <X /> : <Menu />}
            </button>
          )}
        </div>
      </div>

      {open && status === "authenticated" && (
        <div className="md:hidden bg-white border-t">
          <ul className="flex flex-col px-4 pb-4 text-gray-700">

            {user?.role === "researcher" && (
              <li>
                <NavLink onClick={() => setOpen(false)} to="/" className={linkClass}>
                  Home
                </NavLink>
              </li>
            )}

            <li>
              <NavLink onClick={() => setOpen(false)} to="/dashboard" className={linkClass}>
                Dashboard
              </NavLink>
            </li>

            <li>
              <NavLink onClick={() => setOpen(false)} to="/documents" className={linkClass}>
                Documents
              </NavLink>
            </li>

            <li className="border-t mt-2 pt-2">
              <button
                onClick={handleLogout}
                className="flex items-center text-red-600 w-full py-2"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </button>
            </li>

          </ul>
        </div>
      )}
    </header>
  );
}