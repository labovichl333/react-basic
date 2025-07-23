import {lazy, Suspense} from 'react';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Spinner from "../components/Spinner.jsx";
import ErrorBoundary from "../components/ErrorBoundary.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";
import PageWrapper from "./PageWrapper.jsx";

const Blog = lazy(() => import('./Blog.jsx'));
const Login = lazy(() => import('./Login.jsx'));
const NewPost = lazy(() => import('./NewPost.jsx'));
const Favorites = lazy(() => import('./Favorites.jsx'));
const AboutMe = lazy(() => import('./AboutMe.jsx'));
const NotFound = lazy(() => import('./NotFound.jsx'));

const Routing = ({user}) => {
    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/"
                    element={
                        <Suspense fallback={<Spinner/>}>
                            <ErrorBoundary fallback={<ErrorMessage/>}>
                                <PageWrapper/>
                            </ErrorBoundary>
                        </Suspense>
                    }
                >
                    <Route
                        index
                        element={
                            <Suspense fallback={<Spinner/>}>
                                <Blog/>
                            </Suspense>
                        }
                    />
                    <Route
                        path="blog"
                        element={
                            <Suspense fallback={<Spinner/>}>
                                <Blog/>
                            </Suspense>
                        }
                    />

                    {user && (
                        <>
                            <Route
                                path="about"
                                element={
                                    <Suspense fallback={<Spinner/>}>
                                        <AboutMe/>
                                    </Suspense>
                                }
                            />
                            <Route
                                path="favorites"
                                element={
                                    <Suspense fallback={<Spinner/>}>
                                        <Favorites/>
                                    </Suspense>
                                }
                            />
                            <Route
                                path="new-post"
                                element={
                                    <Suspense fallback={<Spinner/>}>
                                        <NewPost/>
                                    </Suspense>
                                }
                            />
                        </>
                    )}

                    <Route
                        path="login"
                        element={
                            <Suspense fallback={<Spinner/>}>
                                <Login key={"key_1"} isLogin={true}/>
                            </Suspense>
                        }
                    />
                    <Route
                        path="signup"
                        element={
                            <Suspense fallback={<Spinner/>}>
                                <Login key={"key_2"} isLogin={false}/>
                            </Suspense>
                        }
                    />
                    <Route path="*" element={<NotFound/>}/>
                </Route>
            </Routes>
        </BrowserRouter>
    );
};

export default Routing;
