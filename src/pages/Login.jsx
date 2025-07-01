import {useContext, useRef, useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import validationService from '../services/validationService.js';
import userService from '../services/userService.js';
import './styles/Login.css';
import Spinner from "../components/Spinner.jsx";
import {AppContext} from "../App.jsx";
import toast from "react-hot-toast";

const Login = ({isLogin}) => {

    const navigate = useNavigate();
    const {setUser} = useContext(AppContext);

    const [values, setValues] = useState({email: '', password: ''});
    const [errors, setErrors] = useState({});

    const [isLoading, setIsLoading] = useState(false);
    const [isPasswordShown, setIsPasswordShown] = useState(false);

    const loginFormRef = useRef();
    const passwordInputRef = useRef();

    const title = isLogin ? 'Log in' : 'Sign up';

    const msg = isLogin
        ? "Don't have an account yet? Please, click "
        : 'Have an account already? Please, click ';


    function handleValueChange(e) {
        const input = e.target;
        setValues((prev) => ({...prev, [input.name]: input.value}));
    }

    async function handleSubmit(e) {
        e.preventDefault();

        setIsLoading(true);

        try {
            const user = await validationService.validateLoginForm(
                loginFormRef.current,
                isLogin,
                setErrors,
            );

            if (loginFormRef.current.checkValidity()) {
                if (isLogin) {
                    setUser(user);
                    toast.success("You've logged in successfully!")
                    navigate('/blog');
                } else {
                    const newUser = await userService.createUser(
                        values.email,
                        values.password,
                    );
                    setUser(newUser);
                    toast.success("You've created a user successfully!");
                    navigate('/blog');
                }
            }
        } catch {
            toast.error(`Error ${isLogin ? 'authenticating' : 'creating'} a user!`);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <section className="login-page">
            <div className="login-wrapper">
                {isLoading && (<Spinner/>)}

                <header className="login-title">
                    <h2>{title}</h2>
                </header>
                <form
                    ref={loginFormRef}
                    className="login-form"
                    noValidate
                    onSubmit={handleSubmit}
                >
                    <div className="login-fields">
                        <div className="login-field">
                            <label htmlFor="email">Email address</label>
                            <input
                                value={values.email}
                                onChange={handleValueChange}
                                type="email"
                                name="email"
                                placeholder="Email"
                                required
                                minLength="5"
                                maxLength="30"
                            />
                            {errors.email && (
                                <>
                                    <div className="err">{errors.email}</div>
                                </>
                            )}
                        </div>
                        <div className="login-field">
                            <label htmlFor="password">Password</label>
                            <div className="password-wrapper">
                                <input
                                    ref={passwordInputRef}
                                    value={values.password}
                                    onChange={handleValueChange}
                                    type={isPasswordShown ? 'text' : 'password'}
                                    name="password"
                                    placeholder="Password"
                                    required
                                    minLength="5"
                                    maxLength="30"
                                />
                                <div className="password-visibility">
                                    <button
                                        type="button"
                                        onClick={() => setIsPasswordShown(!isPasswordShown)}
                                    >
                    <span className="material-symbols-outlined">
                      {isPasswordShown ? 'visibility' : 'visibility_off'}
                    </span>
                                    </button>
                                </div>
                            </div>
                            {errors.password && (
                                <>
                                    <div className="err">{errors.password}</div>
                                </>
                            )}
                        </div>
                    </div>
                    <div className="login-legend">
                        {msg}
                        <Link to={isLogin ? '/signup' : '/login'}>here</Link>
                        {'!'}
                    </div>
                    <div className="login-submit">
                        <button type="submit" className="login-submit">
                            {title}
                        </button>
                    </div>
                </form>
            </div>
        </section>
    );
}

export default Login;
