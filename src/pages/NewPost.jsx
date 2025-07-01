import {useRef, useState} from 'react';
import validationService from '../services/validationService.js';
import postService from '../services/postService.js';
import './styles/NewPost.css';
import Spinner from "../components/Spinner.jsx";
import toast from "react-hot-toast";
import {useNavigate} from "react-router-dom";

const NewPost = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const newPostFormRef = useRef();


    async function handleFormSubmit(e) {
        e.preventDefault();

        setIsLoading(true);

        try {
            await validationService.validateNewPostForm(
                newPostFormRef.current,
                setErrors,
            );
        } catch {
            toast.error('error validating new post form!');
            return;
        } finally {
            setIsLoading(false);
        }

        if (!newPostFormRef.current.checkValidity()) return;


        setIsLoading(true);

        try {
            const post = {
                title: newPostFormRef.current['post-title'].value,
                text: newPostFormRef.current['post-text'].value,
                statistics: {
                    likes: 0,
                    dislikes: 0,
                    views: 0,
                },
            };

            const createdPost = await postService.createPost(post);

            validationService.resetFormErrors(newPostFormRef.current, setErrors);
            newPostFormRef.current['post-title'].value = '';
            newPostFormRef.current['post-text'].value = '';

            toast.success(`You've successfully created post ${createdPost.title}!`);
        } catch {
            toast.error('error creating new post!');
            return;
        } finally {
            setIsLoading(false);
        }
        navigate('/blog');
    }

    return (
        <section className="new-post-page">
            {isLoading && (<Spinner/>)}

            <div className="new-post-wrapper">
                <div className="new-post-title">Create New Post</div>
                <form
                    ref={newPostFormRef}
                    className="new-post-form"
                    noValidate
                    onSubmit={handleFormSubmit}
                >
                    <div className="new-post-fields">
                        <div className="new-post-field">
                            <label htmlFor="post-title">Post Title</label>
                            <input
                                placeholder="Title"
                                type="text"
                                id="post-title"
                                name="post-title"
                                required
                                minLength="5"
                                maxLength="100"
                            />
                            {errors['post-title'] && (
                                <div className="err">{errors['post-title']}</div>
                            )}
                        </div>
                        <div className="new-post-field">
                            <label htmlFor="post-text">Post Text</label>
                            <textarea
                                placeholder="Text"
                                id="post-text"
                                name="post-text"
                                required
                                minLength="10"
                                maxLength="5000"
                            />
                            {errors['post-text'] && (
                                <div className="err">{errors['post-text']}</div>
                            )}
                        </div>
                    </div>
                    <button type="submit">Create</button>
                </form>
            </div>
        </section>
    );
}

export default NewPost;
