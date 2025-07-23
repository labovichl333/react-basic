import {useContext, useEffect, useRef, useState} from 'react';
import {AppContext} from "../../App.jsx";
import validationService from "../../services/validationService.js";
import toast from "react-hot-toast";
import postService from "../../services/postService.js";
import userService from "../../services/userService.js";
import PostControls from "./PostControls.jsx";
import './styles/PostContent.css'
import clsx from "clsx";

const PostContent = ({post, setIsLoading, setIsDeleted}) => {
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

    const [isEdit, setIsEdit] = useState(false);
    const [errors, setErrors] = useState({});

    const postEditFormRef = useRef();
    const postTextRef = useRef();
    const [isApplyBtnDisabled, setIsApplyBtnDisabled] = useState(true);

    useEffect(() => {
        if (isEdit) {
            setTextareaHeight();
        }
    }, [isEdit]);


    useEffect(() => {
        setBtnDisabled();
    }, [formValues, isEdit]);

    function setBtnDisabled() {
        setIsApplyBtnDisabled(formValues.title === values.title && formValues.text === values.text);
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

        if (isApplyBtnDisabled) return;

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

    return (
        <>
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
                            maxLength="1500"
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
                className={clsx('material-symbols-outlined', 'fav-icon', {
                    active: isFavorite,
                })}
            >
              favorite
            </span>
                        </button>
                    </div>
                )}
            </div>

            <PostControls
                values={values}
                isEdit={isEdit}
                post={post}
                isApplyBtnDisabled={isApplyBtnDisabled}
                setIsDeleted={setIsDeleted}
                setIsLoading={setIsLoading}
                setFormValues={setFormValues}
                setErrors={setErrors}
                setIsEdit={setIsEdit}
                setBtnDisabled={setBtnDisabled}
            />
        </>

    );
};

export default PostContent;
