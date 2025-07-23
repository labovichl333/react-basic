import fetchTools from '../utils/fetchTools.js';

const USERS_URL = 'http://localhost:3000/users';

const userService = {
    async getAllUsers() {
        return await fetchTools.getResource(USERS_URL);
    },

    async getUsersByFields(fields) {
        return await fetchTools.getResource(USERS_URL, fields);
    },

    async createUser(email, password) {
        const newUser = {email, password, favorites: []}
        return await fetchTools.createResource(USERS_URL, newUser)

    },

    async updateUser(user) {
        return await fetchTools.updateResource(USERS_URL, user.id, user)
    },
};

export default userService;
