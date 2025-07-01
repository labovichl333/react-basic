import {useState} from 'react';
import './styles/Post.css';
import Spinner from "../Spinner.jsx";
import PostContent from "./PostContent.jsx";
import PostStatistics from "./PostStatistics.jsx";

const Post = ({post}) => {
    const [isDeleted, setIsDeleted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    return (
        <>
            {!isDeleted && (
                <article className="post">
                    {isLoading && (<Spinner/>)}

                    <PostContent post={post}
                                 setIsLoading={setIsLoading}
                                 setIsDeleted={setIsDeleted}
                    />

                    <PostStatistics post={post}/>

                </article>
            )}
        </>
    );
}

export default Post;
