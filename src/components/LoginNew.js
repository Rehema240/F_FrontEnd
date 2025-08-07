import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Login.css';

const LoginNew = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [emailTouched, setEmailTouched] = useState(false);
    const [passwordTouched, setPasswordTouched] = useState(false);
    
    const navigate = useNavigate();
    const { login, user } = useAuth();

    // Validation functions
    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const isValidPassword = (password) => {
        return password.length >= 6;
    };

    const handleSubmit = async (e) => {
        console.log('handleSubmit triggered. Email:', email, 'Password:', password);
        e.preventDefault();
        setIsLoading(true);
        setError('');
        
        // Validation
        if (!isValidEmail(email)) {
            setError('Please enter a valid email address');
            setIsLoading(false);
            return;
        }
        
        if (!isValidPassword(password)) {
            setError('Password must be at least 6 characters long');
            setIsLoading(false);
            return;
        }
        
        try {
            await login(email, password);
            // The useEffect hook will handle the redirect
        } catch (err) {
            setError('Invalid email or password. Please try again.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    // Redirect if user is already logged in
    useEffect(() => {
        if (user) {
            switch (user.role) {
                case 'admin':
                    navigate('/admin/dashboard');
                    break;
                case 'student':
                    navigate('/student/dashboard');
                    break;
                case 'head':
                    navigate('/head/dashboard');
                    break;
                case 'employee':
                    navigate('/employee/dashboard');
                    break;
                default:
                    navigate('/login');
            }
        }
    }, [user, navigate]);

    // Clear error when user starts typing
    useEffect(() => {
        if (error && (email || password)) {
            setError('');
        }
    }, [email, password, error]);

    const handleEmailChange = (e) => {
        console.log('Email changed:', e.target.value);
        setEmail(e.target.value);
        if (!emailTouched) setEmailTouched(true);
    };

    const handlePasswordChange = (e) => {
        console.log('Password changed:', e.target.value);
        setPassword(e.target.value);
        if (!passwordTouched) setPasswordTouched(true);
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    // Determine input classes based on validation state
    const getEmailInputClass = () => {
        let className = 'form-input';
        if (emailTouched) {
            if (email && isValidEmail(email)) {
                className += ' success';
            } else if (email && !isValidEmail(email)) {
                className += ' error';
            }
        }
        return className;
    };

    const getPasswordInputClass = () => {
        let className = 'form-input';
        if (passwordTouched) {
            if (password && isValidPassword(password)) {
                className += ' success';
            } else if (password && !isValidPassword(password)) {
                className += ' error';
            }
        }
        return className;
    };

    console.log('Rendering LoginNew component. State:', { email, password, isLoading });
    return (
        <div className="login-container">
            <div className="login-form-container">
                <h2 className="login-title">Welcome Back</h2>
                <p className="login-subtitle">Sign in to your account to continue</p>
                
                <form onSubmit={handleSubmit} noValidate>
                    <div className="form-group">
                        <label className="form-label" htmlFor="email">
                            Email Address
                        </label>
                        <div className="form-input-container">
                            <input
                                id="email"
                                type="email"
                                placeholder="Enter your email"
                                className={getEmailInputClass()}
                                value={email}
                                onChange={handleEmailChange}
                                onBlur={() => setEmailTouched(true)}
                                required
                                autoComplete="email"
                                disabled={isLoading}
                            />
                            <EmailIcon className="input-icon" />
                        </div>
                        {emailTouched && email && !isValidEmail(email) && (
                            <div className="error-message">
                                <ExclamationIcon className="error-icon" />
                                Please enter a valid email address
                            </div>
                        )}
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="password">
                            Password
                        </label>
                        <div className="form-input-container">
                            <input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Enter your password"
                                className={getPasswordInputClass()}
                                value={password}
                                onChange={handlePasswordChange}
                                onBlur={() => setPasswordTouched(true)}
                                required
                                autoComplete="current-password"
                                disabled={isLoading}
                            />
                            <button
                                type="button"
                                className="input-icon"
                                onClick={togglePasswordVisibility}
                                style={{ 
                                    background: 'none', 
                                    border: 'none', 
                                    cursor: 'pointer',
                                    pointerEvents: 'auto',
                                    padding: 0
                                }}
                                disabled={isLoading}
                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                            >
                                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                            </button>
                        </div>
                        {passwordTouched && password && !isValidPassword(password) && (
                            <div className="error-message">
                                <ExclamationIcon className="error-icon" />
                                Password must be at least 6 characters long
                            </div>
                        )}
                    </div>

                    {error && (
                        <div className="error-message">
                            <ExclamationIcon className="error-icon" />
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading || !email || !password || !isValidEmail(email) || !isValidPassword(password)}
                        className="submit-button"
                    >
                        {isLoading && <span className="loading-spinner"></span>}
                        {isLoading ? 'Signing In...' : 'Sign In'}
                    </button>
                </form>

                <div className="forgot-password">
                    <a href="#" onClick={(e) => e.preventDefault()}>
                        Forgot your password?
                    </a>
                </div>
            </div>
        </div>
    );
};

// Simple SVG Icons as React Components
const EmailIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
    </svg>
);

const EyeIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
);

const EyeOffIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
    </svg>
);

const ExclamationIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.996-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
    </svg>
);

export default LoginNew;
