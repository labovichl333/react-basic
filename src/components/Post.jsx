import {useContext, useEffect, useRef, useState} from 'react';

import validationService from '../services/validationService.js';
import localStorageService from '../services/localStorageService.js';
import postService from '../services/postService.js';
import userService from '../services/userService.js';
import './styles/Post.css';
import Spinner from "./Spinner.jsx";
import {AppContext} from "../App.jsx";
import toast from "react-hot-toast";

const Post = ({post}) => {

    const {user, favorites, setFavorites} = useContext(AppContext);

    const [values, setValues] = useState({
        title: post.title,
        text: post.text,
    });

    const [formValues, setFormValues] = useState({
        title: values.title,
        text: values.text,
    });

    const [isFavorite, setIsFavorite] = useState(favorites.includes(post.id));
    const [isDeleted, setIsDeleted] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const postRef = useRef();
    const postEditFormRef = useRef();
    const postTextRef = useRef();
    const applyBtnRef = useRef();

    const [isLiked, setIsLiked] = useState(
        localStorageService.getUserDataParam(user, 'likedPosts')?.includes(post.id),
    );
    const [isDisliked, setIsDisliked] = useState(
        localStorageService.getUserDataParam(user, 'dislikedPosts')?.includes(post.id),
    );

    const [likes, setLikes] = useState(countLikes());
    const [dislikes, setDislikes] = useState(countDislikes());

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


    useEffect(() => {
        if (isEdit) {
            setTextareaHeight();
        }
    }, [isEdit]);

    useEffect(() => {
        setBtnDisabled();
    }, [formValues, isEdit]);

    function setBtnDisabled() {
        if (applyBtnRef.current) {
            applyBtnRef.current.disabled =
                formValues.title === values.title && formValues.text === values.text;
        }
    }

    function setTextareaHeight() {
        if (postTextRef.current) {
            const borderWidth = parseFloat(
                getComputedStyle(postTextRef.current).getPropertyValue('border-width'),
            );

            postTextRef.current.style.height = '';
            postTextRef.current.style.height =
                postTextRef.current.scrollHeight + borderWidth * 2 + 'px';
        }
    }

    function handleValueChange(e) {
        setTextareaHeight();

        const input = e.target;
        setFormValues((prev) => ({...prev, [input.name]: input.value}));
    }

    async function handleFormSubmit(e) {
        e.preventDefault();

        if (applyBtnRef.current.disabled) return;

        setIsLoading(true);

        try {
            await validationService.validatePostEditForm(
                postEditFormRef.current,
                setErrors,
            );
        } catch {
            toast.error(`Error validating post ${post.title}!`);
            return;
        } finally {
            setIsLoading(false);
        }

        if (postEditFormRef.current.checkValidity()) {
            setIsLoading(true);

            try {
                await postService.updatePost({
                    id: post.id,
                    title: formValues.title,
                    text: formValues.text,
                });

                toast.success(`Post ${post.title} updated successfully!`);
                setValues((prev) => ({...prev, ...formValues}));
                setIsEdit(false);
            } catch {
                toast.error(`Error updatinng post ${post.title}!`);
            } finally {
                setIsLoading(false);
            }
        }
    }

    function handleEditBtn() {
        setBtnDisabled();
        setErrors({});
        setIsEdit(true);
    }

    function handleCancelBtn() {
        setFormValues({title: values.title, text: values.text});
        setErrors({});
        setIsEdit(false);
    }

    async function handleDeleteBtn() {
        setIsLoading(true);

        try {
            await postService.deletePost(post.id);
            removeFromFavorite(post.id);
            setIsDeleted(true);
            toast.success(`Post ${post.title} deleted successfully!`);
        } catch {
            toast.error(`Error deleting post ${post.title}!.`);
        } finally {
            setIsLoading(false);
        }
    }

    const removeFromFavorite = (postId) => {
        if (favorites.includes(postId)) {
            const updatedFavorites = favorites.filter(id => id !== postId);
            setFavorites(updatedFavorites);
        }
    };


    function handleFavoriteClick() {
        if (!user) return;

        const updatedFavorites = isFavorite
            ? favorites.filter(id => id !== post.id)
            : [...favorites, post.id];

        setIsFavorite(!isFavorite);
        setFavorites(updatedFavorites);

        userService.updateUser({id: user.id, favorites: updatedFavorites})
            .catch(() => toast.error(`Error updating favorites for user ${user?.email}!`));
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
        <>
            {!isDeleted && (
                <article ref={postRef} className="post">
                    {isLoading && (<Spinner/>)}

                    <div className="post-content">
                        {user && isEdit && (
                            <form
                                ref={postEditFormRef}
                                id={`post-form-${post.id}`}
                                className="post-content-wrapper"
                                onSubmit={handleFormSubmit}
                                noValidate
                            >
                                <header className="post-title-wrapper">
                                    <input
                                        className="post-title"
                                        type="text"
                                        name="title"
                                        value={formValues.title}
                                        onChange={handleValueChange}
                                        required
                                        minLength="5"
                                        maxLength="100"
                                    />
                                </header>
                                {errors.title && <div className="err">{errors.title}</div>}

                                <textarea
                                    ref={postTextRef}
                                    className="post-text"
                                    name="text"
                                    value={formValues.text}
                                    onChange={handleValueChange}
                                    required
                                    minLength="10"
                                    maxLength="700"
                                />
                                {errors.text && <div className="err">{errors.text}</div>}
                            </form>
                        )}

                        {!isEdit && (
                            <div className="post-content-wrapper">
                                <header className="post-title-wrapper">
                                    <h3 className="post-title">{values.title}</h3>
                                </header>
                                <div className="post-text">{values.text}</div>
                            </div>
                        )}

                        {user && (
                            <div className="post-favorite">
                                <button
                                    disabled={!user}
                                    type="button"
                                    onClick={handleFavoriteClick}
                                >
                  <span
                      className={
                          'material-symbols-outlined fav-icon' +
                          (isFavorite ? ' active' : '')
                      }
                  >
                    favorite
                  </span>
                                </button>
                            </div>
                        )}
                    </div>

                    {user && (
                        <div className="post-controls">
                            <div className="post-control edit">
                                {user && !isEdit && (
                                    <button type="button" onClick={handleEditBtn}>
                    <span className="material-symbols-outlined control-icon">
                      edit_square
                    </span>
                                    </button>
                                )}

                                {user && isEdit && (
                                    <>
                                        <button
                                            ref={applyBtnRef}
                                            type="submit"
                                            form={`post-form-${post.id}`}
                                        >
                      <span className="material-symbols-outlined control-icon">
                        check_circle
                      </span>
                                        </button>

                                        <button type="button" onClick={handleCancelBtn}>
                      <span className="material-symbols-outlined control-icon">
                        cancel
                      </span>
                                        </button>
                                    </>
                                )}
                            </div>
                            <div className="post-control remove">
                                <button type="button" onClick={handleDeleteBtn}>
                  <span className="material-symbols-outlined control-icon">
                    delete
                  </span>
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="post-statistics">
                        <div className="post-statistic views">
              <span className="material-symbols-outlined statistic-icon">
                visibility
              </span>
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
                <span className="material-symbols-outlined statistic-icon">
                  thumb_up
                </span>
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
                <span className="material-symbols-outlined statistic-icon">
                  thumb_down
                </span>
                            </button>
                            <span className="statistic-value">{dislikes}</span>
                        </div>
                    </div>
                </article>
            )}
        </>
    );
}

export default Post;
