import './styles/ErrorMessage.css'
import {Link} from "react-router-dom";

const ErrorMessage = () => {
    return (
        <div className="error-msg">
            Sorry, something went wrong.
            <div className='content'>
                <Link to="/">Blog Page</Link>
            </div>
        </div>
    );
};

export default ErrorMessage;
