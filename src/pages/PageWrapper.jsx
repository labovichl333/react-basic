import React, {useContext, useEffect} from 'react';
import {Outlet, useLocation, useNavigate} from "react-router-dom";
import ErrorBoundary from "../components/ErrorBoundary.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";
import localStorageService from "../services/localStorageService.js";
import Header from "../components/Header.jsx";
import './styles/PageWrapper.css'
import {AppContext} from "../App.jsx";
import {Toaster} from "react-hot-toast";

const PageWrapper = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const {user, setFavorites} = useContext(AppContext);

    useEffect(() => {
        if (location.pathname === '/') {
            navigate('/blog');
        }
    }, [location]);

    useEffect(() => {
        if (user) {
            localStorageService.setLoggedInUser(user);
            setFavorites(user.favorites ? user.favorites : [])
        }
    }, [user]);

    return (
        <section className="page-wrapper">
            <Toaster/>
            <Header/>
            <div className="page-content-wrapper">
                <main className="page-main">
                    <ErrorBoundary fallback={<ErrorMessage/>}>
                        <Outlet/>
                    </ErrorBoundary>
                </main>
            </div>
        </section>
    );
}

export default PageWrapper;
