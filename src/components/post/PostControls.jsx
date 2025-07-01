import React, {useContext} from 'react';
import {AppContext} from "../../App.jsx";
import postService from "../../services/postService.js";
import toast from "react-hot-toast";
import './styles/PostControls.css'

const PostControls = ({
                          values,
                          isEdit,
                          post,
                          applyBtnRef,
                          setIsDeleted,
                          setIsLoading,
                          setFormValues,
                          setErrors,
                          setIsEdit,
                          setBtnDisabled
                      }) => {

    const {user, favorites, setFavorites} = useContext(AppContext);

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

    function handleEditBtn() {
        setBtnDisabled();
        setErrors({});
        setIsEdit(true);
    }

    const removeFromFavorite = (postId) => {
        if (favorites.includes(postId)) {
            const updatedFavorites = favorites.filter(id => id !== postId);
            setFavorites(updatedFavorites);
        }
    };
    return (
        user && (
            <div className="post-controls">
                <div className="post-control edit">
                    {!isEdit && (
                        <button type="button" onClick={handleEditBtn}>
              <span className="material-symbols-outlined control-icon">
                edit_square
              </span>
                        </button>
                    )}

                    {isEdit && (
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
        )
    );
};

export default PostControls;
