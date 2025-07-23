import {useEffect, useState} from 'react';
import Post from '../components/post/Post.jsx';
import './styles/PostSlider.css'
import clsx from "clsx";

const INTERVAL = 2500;

const PostSlider = ({posts}) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [prevIndex, setPrevIndex] = useState(null);
    const [direction, setDirection] = useState('right');

    useEffect(() => {
        if (posts.length <= 1) return;

        const id = setInterval(() => {
            handleNext();
        }, INTERVAL);

        return () => clearInterval(id);
    }, [posts, currentIndex]);

    const handleNext = () => {
        setDirection('right');
        setPrevIndex(currentIndex);
        setCurrentIndex((currentIndex + 1) % posts.length);
    };

    const handlePrev = () => {
        setDirection('left');
        setPrevIndex(currentIndex);
        setCurrentIndex((currentIndex - 1 + posts.length) % posts.length);
    };

    return (
        <div className={clsx('content', {
            'slider': posts.length > 1,
            'single-post': posts.length <= 1,
        })}>
            <button type="button" className="material-symbols-outlined btn prev" onClick={handlePrev}>
                arrow_back_2
            </button>

            <div className="post-slider">
                {posts.map((post, index) => {
                    const className = clsx('slide', {
                        active: index === currentIndex,
                        [`slide-in-${direction}`]: index === currentIndex,
                        [`slide-out-${direction}`]: index === prevIndex,
                    });
                    return (
                        <div key={post.id} className={className}>
                            <Post post={post}/>
                        </div>
                    );
                })}
            </div>

            <button type="button" className="material-symbols-outlined btn next" onClick={handleNext}>
                play_arrow
            </button>
        </div>
    );
};

export default PostSlider;
