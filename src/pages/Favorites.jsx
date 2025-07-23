import {useContext, useEffect, useState} from 'react';
import postService from "../services/postService.js";
import Spinner from "../components/Spinner.jsx";
import Post from "../components/post/Post.jsx";
import './styles/Favorites.css';
import PaginationControls from "../components/PaginationControls.jsx";
import {AppContext} from "../App.jsx";
import toast from "react-hot-toast";


const MAX_PAGES_TO_SHOW = 4;
const PAGES_AROUND_CURRENT = Math.floor((MAX_PAGES_TO_SHOW - 2) / 2);
const POSTS_PER_PAGE = 2

const Favorites = () => {
    const {favorites} = useContext(AppContext);

    const [postList, setPostList] = useState([]);
    const [page, setPage] = useState(1);

    const totalPages = Math.ceil(favorites.length / POSTS_PER_PAGE);

    const [pageNumbers, setPageNumbers] = useState(calcPageNumbers());

    const [isLoading, setIsLoading] = useState(false);

    const [response, setResponse] = useState({});

    function calcPageNumbers() {
        let numbers = [];
        for (let i = 1; i <= totalPages; i++) {
            numbers.push(i);
        }
        return numbers
    }

    function getPostsForPage() {
        const startIndex = (page - 1) * POSTS_PER_PAGE;
        const endIndex = page * POSTS_PER_PAGE;

        return favorites.slice(startIndex, endIndex);
    }

    useEffect(() => {
        async function fetchData() {
            if (favorites?.length >= 0) {
                if (totalPages < page) {
                    setPage(totalPages);
                }
                setIsLoading(true);
                const data = await postService.getFavoritePosts(getPostsForPage());
                setIsLoading(false);
                setResponse(data);
            }
        }

        fetchData();

    }, [page, favorites]);


    useEffect(() => {
        if (response.error) {
            toast.error('error loading posts!');
        } else if (response.data) {
            setPostList(response.data);

            setPagination();
        }

    }, [response]);

    function setPagination() {
        if (response.data.length === 0) {
            setPageNumbers([]);
            return;
        }

        const curPage = page;
        const pageNumbersTemp = [];

        if (totalPages <= MAX_PAGES_TO_SHOW) {
            for (let i = 1; i <= totalPages; i++) {
                pageNumbersTemp.push(i);
            }
        } else {
            const firstPage = 1;
            const lastPage = totalPages;
            const startPage = Math.max(curPage - PAGES_AROUND_CURRENT, firstPage + 1);
            const endPage = Math.min(curPage + PAGES_AROUND_CURRENT, lastPage - 1);

            pageNumbersTemp.push(firstPage);

            for (let i = startPage; i <= endPage; i++) {
                pageNumbersTemp.push(i);
            }

            pageNumbersTemp.push(lastPage);

            if (startPage > firstPage + 1) {
                pageNumbersTemp.splice(1, 0, '...');
            }

            if (endPage < lastPage - 1) {
                pageNumbersTemp.splice(pageNumbersTemp.length - 1, 0, '...');
            }
        }

        setPageNumbers(pageNumbersTemp);
    }

    function handlePageChange(e) {
        const targetPage = +e.currentTarget.dataset.pageNum;

        if (!targetPage || targetPage === page) {
            return;
        }

        setPage(targetPage);
    }

    return (
        <section className="favorites-page">
            {isLoading && (
                <Spinner/>
            )}

            <div className="favorites-title">
                {favorites?.length > 0
                    ? 'Your favorite posts.'
                    : "You don't have favorite posts yet."}
            </div>

            {postList.length > 0 && (
                <ul className="post-list">
                    {postList.map((post) => (
                        <li key={post.id}>
                            <Post post={post}/>
                        </li>
                    ))}
                </ul>
            )}

            {pageNumbers?.length > 0 && (
                <PaginationControls
                    page={page}
                    onPageChange={handlePageChange}
                    pageNumbers={pageNumbers}
                />
            )}
        </section>
    );
}

export default Favorites;
