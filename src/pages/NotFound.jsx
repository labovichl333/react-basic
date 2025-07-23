import {Link} from "react-router-dom";
import './styles/NotFound.css'

const NotFound = () => {
    return (
        <div className="not-found">
            Page not found!
            <div className='content'>
                <Link to="/">Blog Page</Link>
            </div>
        </div>
    );
};

export default NotFound;
