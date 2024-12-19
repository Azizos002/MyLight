import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import axios from 'axios'; // Import Axios for API requests

import registerVector from '../../Assets/registerVector.svg';
import googleHome from '../../Assets/googleBtn.svg';
import usernameIcon from '../../Assets/usernameIcon.svg';
import emailIcon from '../../Assets/emailIcon.svg';
import passwordIcon from '../../Assets/passwordIcon.svg';

const Signup = () => {

    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});

    const validationRegisterSchema = Yup.object().shape({
        username: Yup.string().required('Username is required'),
        email: Yup.string().email(`That doesn't look like an email address`).required('Email is required'),
        password: Yup.string()
            .min(8, 'Password is too short - should be 8 chars minimum')
            .required('Password is required')
    });

    // Function to validate field on change
    const handleFieldValidation = async (name, value) => {
        try {
            await validationRegisterSchema.validateAt(name, { [name]: value });
            setErrors((prevErrors) => ({ ...prevErrors, [name]: '' })); // Clear the error if valid
        } catch (err) {
            setErrors((prevErrors) => ({ ...prevErrors, [name]: err.message })); // Set specific error
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        // Update state for form fields
        if (name === 'username') setUsername(value);
        if (name === 'email') setEmail(value);
        if (name === 'password') setPassword(value);

        // Validate the input as the user types
        handleFieldValidation(name, value);
    };

    const switchToSigninModal = () => {
        navigate('/login');
    };

    // Handle Register form submission
    const handleSubmitRegister = async (e) => {
        e.preventDefault();
        setErrors({});

        try {
            // Validate the form before submitting
            await validationRegisterSchema.validate({ username, email, password }, { abortEarly: false });

            // 🚀 **API Request to Register**
            const response = await axios.post('http://localhost:5000/api/auth/register', { username, email, password });

            const { token } = response.data;
            console.log('JWT Token:', token);

            // ✅ **Store token in localStorage or sessionStorage**
            localStorage.setItem('token', token); // Or use sessionStorage.setItem('token', token);

            // ✅ **Navigate to Login page**
            navigate('/login');

            // Clear the form fields
            setUsername('');
            setEmail('');
            setPassword('');
        } catch (err) {
            if (err.response) {
                // Server-side validation error (API response)
                console.log("first");
            } else if (err.name === 'ValidationError') {
                // Yup validation errors
                const validationErrors = {};
                err.inner.forEach((error) => {
                    validationErrors[error.path] = error.message;
                });
                setErrors(validationErrors);
            } else {
                // General errors
                console.log("second");
            }
        }
    };

    return (
        <div className="ModalContent">
            <div className="modal-left">
                <h2 className='SignInModalTitle'>Create an account</h2>
                <button className="googleBtn">
                    <img src={googleHome} alt="Google Icon" /> Sign up with Google
                </button>
                <div className="divider">
                    <hr />
                    <span>Or</span>
                    <hr />
                </div>


                <form onSubmit={handleSubmitRegister}>
                    {/* Username Input */}
                    <div className="input-wrapper">
                        <label>Username</label>
                        <div className="input-icon">
                            <img
                                src={usernameIcon}
                                alt='username-icon'
                                className={`icon ${errors.username ? 'icon-error' : ''}`}
                            />
                            <input
                                type="text"
                                name="username"
                                placeholder='Enter your username'
                                value={username}
                                onChange={handleInputChange}
                                className={errors.username ? 'input-error' : ''}
                            />
                        </div>
                        {errors.username && <div className='errorMsg'>{errors.username}</div>}
                    </div>

                    {/* Email Input */}
                    <div className="input-wrapper">
                        <label>Email</label>
                        <div className="input-icon">
                            <img
                                src={emailIcon}
                                alt="email icon"
                                className={`icon ${errors.email ? 'icon-error' : ''}`}
                            />
                            <input
                                type="text"
                                name="email"
                                placeholder='Enter your email'
                                value={email}
                                onChange={handleInputChange}
                                className={errors.email ? 'input-error' : ''}
                            />
                        </div>
                        {errors.email && <div className='errorMsg'>{errors.email}</div>}
                    </div>

                    {/* Password Input */}
                    <div className="input-wrapper">
                        <label>Password</label>
                        <div className="input-icon">
                            <img
                                src={passwordIcon}
                                alt="password icon"
                                className={`icon ${errors.password ? 'icon-error' : ''}`}
                            />
                            <input
                                type="password"
                                name="password"
                                placeholder='Enter your password'
                                value={password}
                                onChange={handleInputChange}
                                className={errors.password ? 'input-error' : ''}
                            />
                        </div>
                        {errors.password && <div className='errorMsg'>{errors.password}</div>}
                    </div>

                    <button type="submit" className="signInBtn">Sign Up</button>
                </form>

                <p className='linkRegister'>
                    Already have an account? {' '}
                    <span>
                        <button onClick={switchToSigninModal} className='linkToRegister'>
                            Sign in
                        </button>
                    </span>
                </p>
            </div>

            <div className="modal-rightRegister">
                <img src={registerVector} alt="" className="right-image" />
            </div>
        </div>
    );
};

export default Signup;