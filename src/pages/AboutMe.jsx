import React, {useEffect, useRef, useState} from 'react';
import postService from "../services/postService.js";
import Spinner from "../components/Spinner.jsx";
import Post from "../components/post/Post.jsx";

import './styles/AboutMe.css'
import toast from "react-hot-toast";

const INTERVAL = 2500;

const AboutMe = () => {
    const [response, setResponse] = useState({
        data: null,
        error: null,
        isInProgress: false,
    });

    const [postList, setPostList] = useState([]);

    const nextBtnRef = useRef();
    const interval = useRef();

    useEffect(() => {
        postService.getPosts({sort: 'views', order: 'desc'}, 1, 3, setResponse, true);

        return () => {
            clearInterval(interval.current);
        };
    }, []);

    useEffect(() => {
        if (response.error) {
            toast.error('error loading posts');
        } else if (response.data) {
            setPostList(response.data);
        }
        if (response.isInProgress) {
            <Spinner/>;
        }

    }, [response]);

    useEffect(() => {
        if (postList.length > 1) {
            interval.current = setInterval(intervalFunc, INTERVAL);
        }
    }, [postList]);

    function intervalFunc() {
        nextBtnRef.current.click();
    }

    function handleButtonClick(e) {
        if (e.clientX && e.clientY) {
            if (interval.current) {
                clearInterval(interval.current);
            }

            interval.current = setInterval(intervalFunc, INTERVAL);
        }

        const btn = e.currentTarget;
        const isNextBtn = btn.classList.contains('next');

        const postList = btn.parentElement.querySelector('.post-list');
        const posts = [...postList.children];

        const activePost = postList.firstElementChild;
        const targetPost = isNextBtn
            ? activePost.nextElementSibling
            : postList.lastElementChild;

        if (isNextBtn) {
            posts.forEach((post) => post.classList.add('move-left'));
        } else {
            postList.prepend(targetPost);
            posts.forEach((post) => post.classList.add('move-right'));
        }

        targetPost.onanimationend = handleAnimationEnd;

        function handleAnimationEnd() {
            posts.forEach((post) => {
                post.classList.remove('move-right');
                post.classList.remove('move-left');
            });

            if (isNextBtn) {
                postList.append(activePost);
                postList.prepend(targetPost);
            }

            targetPost.onanimationend = null;
        }
    }

    return (
        <div className="about-page">
            {response.isInProgress && (
                <Spinner/>
            )}

            <div className="about-wrapper">
                <div className="title">About Me</div>
                <div className="text">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Error sint obcaecati quia dolore
                    exercitationem ex saepe! Ipsa a earum iusto. Quidem veritatis dignissimos tempora itaque error hic
                    perferendis, qui nobis quisquam provident doloribus deleniti obcaecati totam maxime enim ex soluta
                    consequatur fugiat laborum eos tenetur nesciunt architecto? Sunt, possimus. Illo nisi labore,
                    officiis quas ipsa porro ea pariatur. Asperiores sapiente nisi ab impedit, voluptatum deserunt quo
                    earum dignissimos molestiae id, minima enim accusantium eveniet accusamus nostrum totam. Numquam
                    corrupti ipsa nisi officia eum incidunt distinctio ab officiis laborum ipsam. Quaerat nostrum totam
                    provident sint quidem dolore a eum in numquam.
                </div>
            </div>

            {postList.length > 0 && (
                <div className="about-top-posts">
                    <div className="title">
                        {`Top ${postList.length} popular posts`}
                    </div>
                    <div className={`content${postList.length > 1 ? ' slider' : ''}`}>
                        <button
                            type="button"
                            className="material-symbols-outlined btn prev"
                            onClick={handleButtonClick}
                        >
                            arrow_back_2
                        </button>
                        <ul className="post-list">
                            {postList.map((post) => (
                                <li key={post.id}>
                                    <Post post={post}/>
                                </li>
                            ))}
                        </ul>
                        <button
                            ref={nextBtnRef}
                            type="button"
                            className="material-symbols-outlined btn next"
                            onClick={handleButtonClick}
                        >
                            play_arrow
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AboutMe;