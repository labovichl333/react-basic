import React, {useContext, useEffect, useState} from 'react';
import localStorageService from "../../services/localStorageService.js";
import {AppContext} from "../../App.jsx";
import './styles/PostStatistics.css'


const PostStatistics = ({post}) => {

    const {user} = useContext(AppContext);

    const [isLiked, setIsLiked] = useState(
        localStorageService.getUserDataParam(user, 'likedPosts')?.includes(post.id),
    );
    const [isDisliked, setIsDisliked] = useState(
        localStorageService.getUserDataParam(user, 'dislikedPosts')?.includes(post.id),
    );

    const [likes, setLikes] = useState(countLikes());
    const [dislikes, setDislikes] = useState(countDislikes());


    useEffect(() => {
        if (user) {
            localStorageService.syncPostStatisticsToStorage(user, 'likedPosts', isLiked, post.id);
        }
    }, [isLiked]);

    useEffect(() => {
        if (user) {

            localStorageService.syncPostStatisticsToStorage(user, 'dislikedPosts', isDisliked, post.id);
        }
    }, [isDisliked]);

    function countLikes() {
        let count = post.statistics.likes
        if (localStorageService.getUserDataParam(user, 'likedPosts')?.includes(post.id)) {
            count++
        }
        return count
    }

    function countDislikes() {
        let count = post.statistics.dislikes
        if (localStorageService.getUserDataParam(user, 'dislikedPosts')?.includes(post.id)) {
            count++
        }
        return count
    }

    function handleLikesChange() {
        if (!user) return;

        if (isLiked) {
            setLikes(prev => prev - 1);
        } else {
            setLikes(prev => prev + 1);
            if (isDisliked) {
                setIsDisliked(false);
                setDislikes(prev => prev - 1);
            }
        }

        setIsLiked(prev => !prev);
    }

    function handleDislikesChange() {
        if (!user) return;

        if (isDisliked) {
            setDislikes(prev => prev - 1);
        } else {
            setDislikes(prev => prev + 1);
            if (isLiked) {
                setIsLiked(false);
                setLikes(prev => prev - 1);
            }
        }

        setIsDisliked(prev => !prev);
    }

    return (
        <div className="post-statistics">
            <div className="post-statistic views">
                <span className="material-symbols-outlined statistic-icon">visibility</span>
                <span className="statistic-value">{post.statistics.views}</span>
            </div>

            <div
                className={
                    'post-statistic rating likes' +
                    (!user ? ' disabled' : !isLiked ? ' opaque' : '')
                }
            >
                <button
                    type="button"
                    className={!user ? 'no-pointer-events' : ''}
                    onClick={handleLikesChange}
                >
                    <span className="material-symbols-outlined statistic-icon">thumb_up</span>
                </button>
                <span className="statistic-value">{likes}</span>
            </div>

            <div
                className={
                    'post-statistic rating dislikes' +
                    (!user ? ' disabled' : !isDisliked ? ' opaque' : '')
                }
            >
                <button
                    type="button"
                    className={!user ? 'no-pointer-events' : ''}
                    onClick={handleDislikesChange}
                >
                    <span className="material-symbols-outlined statistic-icon">thumb_down</span>
                </button>
                <span className="statistic-value">{dislikes}</span>
            </div>
        </div>
    );
};

export default PostStatistics;
