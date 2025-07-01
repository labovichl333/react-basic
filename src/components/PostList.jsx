import {useEffect, useRef, useState} from 'react';
import postService from '../services/postService.js';

import './styles/PostList.css';
import Spinner from "./Spinner.jsx";
import Post from "./post/Post.jsx";
import {useSearchParams} from "react-router-dom";
import toast from "react-hot-toast";

const PostList = () => {
    const [searchParams] = useSearchParams();
    const isFirstRender = useRef(true);

    const query = searchParams.get('query');
    const sort = searchParams.get('sort');
    const order = searchParams.get('order');

    const [response, setResponse] = useState({
        data: [],
        error: null,
        isInProgress: false,
        page: 1,
        lastPage: null,
    });

    const limit = 5;
    const childRef = useRef();

    function hasMorePosts() {
        return response.lastPage === null || response.lastPage >= response.page;
    }

    const observer = useRef();
    useEffect(() => {
        const callback = () => postService.getPosts(Object.fromEntries(searchParams.entries()), response.page, limit, setResponse, false);
        const element = childRef.current;
        if (hasMorePosts()) {
            const options = {
                rootMargin: '0px',
                threshold: 0
            }
            observer.current = new IntersectionObserver(([target]) => {
                if (target.isIntersecting) {
                    callback()
                }
            }, options)

            observer.current.observe(element)
        }

        return function () {
            observer.current.unobserve(element)
        };
    }, [response.page])


    useEffect(() => {
        if (response.error) {
            toast.error('error loading posts!');
        }
    }, [response.error]);

    useEffect(() => {
        if (!isFirstRender.current) {
            postService.getPosts(Object.fromEntries(searchParams.entries()), response.page, limit, setResponse, true)
        }
        isFirstRender.current = false;
    }, [sort, order, query]);

    return (
        <>
            {response.data.length > 0 && (
                <ul>
                    {response.data.map((post) => (
                        <li key={post.id}>
                            <Post post={post}/>
                        </li>
                    ))}
                </ul>
            )}

            {response.isInProgress && (
                <Spinner/>
            )}
            {response.data.length === 0 && (
                <div className="posts-not-found-msg">Posts were not found.</div>
            )}
            <div style={{height: 10}} ref={childRef}/>
        </>
    );
}

export default PostList;
