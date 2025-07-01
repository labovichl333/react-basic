import localStorageService from './localStorageService.js';

const themeService = {
    applyTheme(theme) {
        localStorageService.setTheme(theme)
        document.documentElement.classList.toggle('dark', theme === 'dark');
    },

    getTheme() {
        const storedTheme = localStorageService.getTheme();
        return storedTheme || (matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
    },
};

export default themeService;
