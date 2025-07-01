import userService from "./userService.js";

const localStorageService = {

    setUserDataParam(user, key, value) {
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');

        userData[user.email] = {
            ...userData[user.email],
            [key]: value,
        };

        localStorage.setItem('userData', JSON.stringify(userData));
    },

    getUserDataParam(user, key) {
        if (user) {
            return localStorage.getItem('userData')?.[user.email]?.[key];
        }
        return null;
    },

    async getLoggedInUser() {
        const userStr = localStorage.getItem('loggedInUser');

        if (userStr === null || userStr === '' || userStr === 'null' || userStr === 'undefined' ) {
            return null;
        }

        const {email, password} = JSON.parse(localStorage.getItem('loggedInUser'));

        const users = await userService.getUsersByFields({
            email: email,
            password: password,
        });

        return users[0];
    },

    setLoggedInUser(user) {
        if (user) {
            localStorage.setItem('loggedInUser', JSON.stringify(user));
        }
    },

    syncPostStatisticsToStorage(user, key, isActive, postId) {
        const posts = this.getUserDataParam(user, key) ?? [];

        const index = posts.indexOf(postId);
        if (isActive && index === -1) {
            posts.push(postId);
        } else if (!isActive && index !== -1) {
            posts.splice(index, 1);
        }

        this.setUserDataParam(user, key, posts);
    },

    setTheme(theme) {
        localStorage.setItem('theme', JSON.stringify(theme));
    },

    getTheme() {
        return JSON.parse(localStorage.getItem('theme') || null)
    },


};

export default localStorageService;
