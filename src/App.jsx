import {createContext, useEffect, useState} from "react";
import localStorageService from "./services/localStorageService.js";
import themeService from "./services/themeService.js";
import Routing from "./pages/Routing.jsx";

const AppContext = createContext();

function App() {

    const [user, setUser] = useState(null);
    const [theme, setTheme] = useState();
    const [favorites, setFavorites] = useState([]);

    const userContextObj = {
        user,
        setUser,

        theme,
        setTheme,

        favorites,
        setFavorites,
    };

    useEffect(() => {
        async function fetchUser() {
            const loggedInUser = await localStorageService.getLoggedInUser();
            localStorageService.setLoggedInUser(user);
            if(loggedInUser){
                setUser(loggedInUser);
            }
        }

        fetchUser();
        setTheme(themeService.getTheme())
    }, []);

    useEffect(() => {
        themeService.applyTheme(theme);
    }, [theme]);

    return (
        <AppContext.Provider value={userContextObj}>
            <Routing user={user}/>
        </AppContext.Provider>
    );
}

export default App;
export {AppContext};
