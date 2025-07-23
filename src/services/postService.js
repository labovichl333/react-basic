import fetchTools from '../utils/fetchTools.js';
import userService from "./userService.js";

const POSTS_URL = 'http://localhost:3000/posts';

const postService = {

    async getPosts(searchParams, page, limit) {
        const result = {};

        const params = {};

        if (searchParams?.query) {
            params.title = searchParams.query;
        }

        if (searchParams?.sort) {
            params._sort = `statistics.${searchParams.sort}`;
            if (searchParams.order === 'desc') {
                params._sort = `-${params._sort}`;
            }
        }

        params._page = page;
        params._per_page = limit;

        const urlObj = new URL(POSTS_URL);

        Object.entries(params).forEach(([key, value]) => {
            if (value) urlObj.searchParams.append(key, value);
        });

        try {
            const response = await fetch(urlObj);
            const data = await response.json();

            result.data = data.data;
            result.lastPage = data.last;
        } catch (err) {
            result.error = 'Error loading data';
        }
        return result;
    },

    async getFavoritePosts(ids) {

        const response = {}

        try {
            const posts = [];

            for (const id of ids) {

                const url = `${POSTS_URL}/${id}`;

                const response = await fetch(url);

                if (!response.ok) {
                    throw new Error(`Error loading post with ID: ${id}`);
                }

                const data = await response.json();

                posts.push(data);
            }

            response.data = posts

        } catch (err) {
            response.error = 'Error loading featured posts';
        }
        return response;
    },


    async getPostsByFields(fields) {
        return await fetchTools.getResource(POSTS_URL, fields);
    },

    async deletePost(postId) {
        const users = await userService.getAllUsers()

        users.forEach(user => {
            if (user.favorites.includes(postId)) {
                const updatedFavorites = user.favorites.filter(id => id !== postId);

                userService.updateUser({id: user.id, favorites: updatedFavorites})
            }
        });
        return await fetchTools.deleteResource(POSTS_URL, postId)
    },

    async createPost(post) {
        return await fetchTools.createResource(POSTS_URL, post)
    },

    async updatePost(post) {
        return await fetchTools.updateResource(POSTS_URL, post.id, post)
    },
};

export default postService;
