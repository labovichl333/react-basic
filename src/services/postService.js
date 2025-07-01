import fetchTools from '../utils/fetchTools.js';
import userService from "./userService.js";

const POSTS_URL = 'http://localhost:3000/posts';

const postService = {

    async getPosts(searchParams, page, limit, setResponse, isPageNumberReset) {
        if (isPageNumberReset) {
            page = 1
            setResponse((prev) => ({
                ...prev,
                page: page,
                data: [],
            }))
        }

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

        Object.entries(params)
            .forEach(([key, value]) => value && urlObj.searchParams.append(key, value));

        setResponse((prev) => ({
            ...prev,
            isInProgress: true,
        }));

        try {
            const response = await fetch(urlObj);
            const data = await response.json();
            setResponse((prev) => ({
                ...prev,
                data: [
                    ...(prev.data || []),
                    ...data.data.filter(item => !prev.data.some(existingItem => existingItem.id === item.id))
                ],
                page: prev.page + 1,
                lastPage: data.last,
                isInProgress: false,
            }));
        } catch (err) {
            setResponse((prev) => ({
                ...prev,
                error: 'Ошибка при загрузке данных',
                isInProgress: false,
            }));
        }


    },


    async getFavoritePosts(ids, setResponse) {
        setResponse((prev) => ({
            ...prev,
            isInProgress: true,
        }));

        try {
            const posts = [];

            for (const id of ids) {

                const url = `${POSTS_URL}/${id}`;

                const response = await fetch(url);

                if (!response.ok) {
                    throw new Error(`Ошибка при загрузке поста с ID: ${id}`);
                }

                const data = await response.json();

                posts.push(data);
            }

            setResponse((prev) => ({
                ...prev,
                data: posts,
                isInProgress: false,
            }));

        } catch (err) {
            setResponse((prev) => ({
                ...prev,
                error: 'Ошибка при загрузке избранных постов',
                isInProgress: false,
            }));
        }
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
