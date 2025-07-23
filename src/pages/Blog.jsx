import {useContext} from 'react';
import {Link} from "react-router-dom";
import SearchSort from "../components/SearchSort.jsx";
import PostList from "../components/PostList.jsx";
import './styles/Blog.css'
import {AppContext} from "../App.jsx";

const Blog = () => {

    const {user} = useContext(AppContext);

    return (
        <section className="blog-page">
            {user && (
                <div className="add-new-post-wrapper">
                    <Link to="/new-post">Add new post</Link>
                </div>
            )}
            <SearchSort/>
            <PostList/>
        </section>
    );
};

export default Blog;
