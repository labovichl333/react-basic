import {useEffect, useReducer, useRef, useState} from 'react';
import postService from '../services/postService.js';

import './styles/PostList.css';
import Spinner from './Spinner.jsx';
import Post from './post/Post.jsx';
import {useSearchParams} from 'react-router-dom';
import toast from 'react-hot-toast';

const limit = 5;

const initialState = {
    data: [],
    error: null,
    isLoading: false,
    lastPage: null,
};

function postReducer(state, action) {
    switch (action.type) {
        case 'START_LOADING':
            return {...state, isLoading: true};
        case 'LOAD_SUCCESS':
            return {
                ...state,
                isLoading: false,
                data: [...state.data, ...action.payload.filter(
                    (item) => !state.data.some((existingItem) => existingItem.id === item.id)
                )],
                lastPage: action.lastPage,
            };
        case 'LOAD_ERROR':
            return {...state, isLoading: false, error: action.error};
        case 'RESET':
            return {...initialState};
        default:
            throw new Error(`Unknown action type: ${action.type}`);
    }
}

const PostList = () => {
    const [searchParams] = useSearchParams();
    const isFirstRender = useRef(true);
    const observer = useRef(null);
    const sentinelRef = useRef(null);

    const [page, setPage] = useState(1);
    const [listState, dispatch] = useReducer(postReducer, initialState);

    const query = searchParams.get('query');
    const sort = searchParams.get('sort');
    const order = searchParams.get('order');

    const fetchPosts = async (pageToFetch) => {
        dispatch({type: 'START_LOADING'});

        const response = await postService.getPosts(
            Object.fromEntries(searchParams.entries()),
            pageToFetch,
            limit
        );

        if (response.error) {
            dispatch({type: 'LOAD_ERROR', error: 'Error loading data'});
        } else {
            dispatch({
                type: 'LOAD_SUCCESS',
                payload: response.data,
                lastPage: response.lastPage,
            });
        }
    };

    useEffect(() => {
        const loadInitialData = async () => {
            if (!isFirstRender.current) {
                dispatch({type: 'RESET'});
                setPage(2);
                await fetchPosts(1);
            }
            isFirstRender.current = false;
        };

        loadInitialData();
    }, [sort, order, query]);

    useEffect(() => {
        if (!hasMorePosts()) return;

        const handleIntersect = (entries) => {
            const target = entries[0];
            if (target.isIntersecting) {
                console.log("intersept  " + page)
                fetchPosts(page);
                setPage(prev => prev + 1);
            }
        };

        const options = {rootMargin: '0px', threshold: 0};

        const element = sentinelRef.current;

        observer.current = new IntersectionObserver(handleIntersect, options);
        observer.current.observe(element);

        return () => {
            if (element) {
                observer.current.unobserve(element);
            }
        };
    }, [page]);

    const hasMorePosts = () => {
        return listState.lastPage === null || page <= listState.lastPage;
    };

    useEffect(() => {
        if (listState.error) {
            toast.error('Error loading posts!');
        }
    }, [listState.error]);

    return (
        <>
            {listState.data.length > 0 ? (
                <ul>
                    {listState.data.map((post) => (
                        <li key={post.id}>
                            <Post post={post}/>
                        </li>
                    ))}
                </ul>
            ) : !listState.isLoading && (
                <div className="posts-not-found-msg">Posts were not found.</div>
            )}

            {listState.isLoading && <Spinner/>}

            <div style={{height: 10}} ref={sentinelRef}/>
        </>
    );
};

export default PostList;
