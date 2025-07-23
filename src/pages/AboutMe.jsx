import {useEffect, useState} from 'react';
import postService from "../services/postService.js";
import Spinner from "../components/Spinner.jsx";
import './styles/AboutMe.css';
import toast from "react-hot-toast";
import PostSlider from "../components/PostSlider.jsx";

const AboutMe = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [postList, setPostList] = useState([]);

    useEffect(() => {
        const fetchPosts = async () => {
            setIsLoading(true);
            const response = await postService.getPosts({sort: 'views', order: 'desc'}, 1, 3);
            setIsLoading(false);

            if (response.error) {
                toast.error('error loading posts');
            } else if (response.data) {
                setPostList(response.data);
            }
        };

        fetchPosts();
    }, []);

    return (
        <div className="about-page">
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

            {isLoading && <Spinner/>}

            {postList.length > 0 && (
                <div className="about-top-posts">
                    <div className="title">
                        {postList.length === 1 && (
                            `The most popular post`
                        )}
                        {postList.length > 1 && (
                            `Top ${postList.length} popular posts`
                        )}
                    </div>
                    <PostSlider posts={postList}/>
                </div>
            )}
        </div>
    );
};

export default AboutMe;
