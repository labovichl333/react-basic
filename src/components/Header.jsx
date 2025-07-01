import {useContext, useRef} from 'react';
import {Link, NavLink, useNavigate} from 'react-router-dom';

import './styles/Header.css';
import {AppContext} from "../App.jsx";

const Header = () => {
    const {user, setUser, theme, setTheme} = useContext(AppContext);
    const navigate = useNavigate();

    const navRef = useRef();

    function handleLogout() {
        localStorage.removeItem('loggedInUser');
        setUser();
        navigate('/login');
    }

    function handleThemeChange() {
        setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
    }

    return (
        <header className="page-header">

            {user && (
                <Link to="/about" className="username">
                    {user.email}
                </Link>
            )}

            <nav className="navigation">
                <ul ref={navRef}>
                    <li>
                        <NavLink className="nav-btn" to="/blog">
                            Blog
                        </NavLink>
                    </li>
                    {user && (
                        <>
                            <li>
                                <NavLink className="nav-btn" to="/about">
                                    About
                                </NavLink>
                            </li>
                            <li>
                                <NavLink className="nav-btn" to="/favorites">
                                    Favorites
                                </NavLink>
                            </li>
                        </>
                    )}
                </ul>
            </nav>

            <div className="right-content-wrapper">
                <section className="theme-switcher">
                    {theme === 'dark' && (
                        <button
                            type="button"
                            className="theme light"
                            onClick={handleThemeChange}
                        >
                            <span>Light</span>
                            <span className="material-symbols-outlined theme-icon">
                light_mode
              </span>
                        </button>
                    )}

                    {theme === 'light' && (
                        <button
                            type="button"
                            className="theme dark"
                            onClick={handleThemeChange}
                        >
                            <span>Dark</span>
                            <span className="material-symbols-outlined theme-icon">
                dark_mode
              </span>
                        </button>
                    )}
                </section>

                {user ? (
                    <section className="user-wrapper">
                        <button
                            onClick={handleLogout}
                            type="button"
                            className="logout nav-btn"
                        >
                            <span className="logout-label">Log Out</span>
                            <span className="material-symbols-outlined logout-icon">
                logout
              </span>
                        </button>
                    </section>
                ) : (
                    <section className="login-wrapper">
                        <Link to="/login" className="login nav-btn">
                            <span className="login-label">Log In</span>
                            <span className="material-symbols-outlined login-icon">
                login
              </span>
                        </Link>
                        <Link to="/signup" className="signup nav-btn">
                            <span className="signup-label">Sign Up</span>
                            <span className="material-symbols-outlined signup-icon">
                person_add
              </span>
                        </Link>
                    </section>
                )}
            </div>
        </header>
    );
}

export default Header;
