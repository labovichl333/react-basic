import {useContext} from 'react';
import {AppContext} from "../App.jsx";
import "./styles/ThemeToggle.css"
import clsx from "clsx";

const ThemeToggle = () => {
    const {theme, setTheme} = useContext(AppContext);
    const isDark = theme === 'dark';

    function handleThemeChange() {
        setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
    }

    return (
        <section className="theme-switcher">
            <button
                type="button"
                className={clsx('theme', {
                    light: isDark,
                    dark: !isDark,
                })}
                onClick={handleThemeChange}
            >
                <span>{isDark ? 'Light' : 'Dark'}</span>
                <span className="material-symbols-outlined theme-icon">
                    {isDark ? 'light_mode' : 'dark_mode'}
                </span>
            </button>
        </section>
    );
};

export default ThemeToggle;
