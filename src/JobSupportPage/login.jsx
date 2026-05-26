import React, { useState } from "react";
import '../styles/login.css'; // for custom styles
import { useNavigate } from 'react-router-dom';

import { FcGoogle } from "react-icons/fc";
import txlogo from "../assets/txlogo.png";
import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

export default function LoginPage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");

    const validatePassword = (value) => {
        if (value.length < 8) return 'Password must be at least 8 characters';
        if (!/[A-Z]/.test(value)) return 'Password must contain at least one uppercase letter';
        if (!/[a-z]/.test(value)) return 'Password must contain at least one lowercase letter';
        if (!/[0-9]/.test(value)) return 'Password must contain at least one number';
        if (!/[@_\$\-]/.test(value)) return 'Password must contain at least one special character (@, _, $, -)';
        return null;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setEmailError("");
        setPasswordError("");
        let hasError = false;

        if (!email.includes("@") || !email.includes(".")) {
            setEmailError("Please enter a valid email address");
            hasError = true;
        }

        const passwordValidation = validatePassword(password);
        if (passwordValidation) {
            setPasswordError(passwordValidation);
            hasError = true;
        }

        if (hasError) return;

        console.log("User Registered with Email:", email);
        navigate('/clientdashboard');
    };


    return (
        <div className="login-page">
            <div className="d-flex justify-content-between align-items-center p-4">
                <img src={txlogo} alt="TechXplorers Logo" style={{ height: "50px" }} />
                <div>
                    <span className="me-2 text-primary">Don’t Have An Account?</span>
                    <button onClick={() => navigate('/signup')} className="btn btn-primary btn-sm rounded-pill">Sign Up</button>
                </div>
            </div>

            <div className="d-flex justify-content-center align-items-center vh-100">
                <form onSubmit={handleSubmit} className="w-100 d-flex justify-content-center">
                    <div className="shadow-lg p-5 rounded bg-white login-box">
                        <h3 className="text-center fw-bold mb-3">Welcome back!</h3>
                        <button className="btn btn-light w-100 border mb-3 d-flex align-items-center justify-content-center gap-2">
                            <FcGoogle size={20} />
                            Continue With Google
                        </button>
                        <div className="text-center text-muted mb-2">──────── OR ────────</div>

                        {/* Email Field */}
                        <div className="mb-3">
                            <label className="form-label">Email</label>
                            <div className="input-group">
                                <span className="input-group-text"><MdEmail /></span>
                                <input
                                    type="email"
                                    className={`form-control ${emailError ? 'is-invalid' : ''}`}
                                    placeholder="Enter Your Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            {emailError && <div className="text-danger mt-1">{emailError}</div>}
                        </div>

                        {/* Password Field */}
                        <div className="mb-3">
                            <label className="form-label">Password</label>
                            <div className="input-group">
                                <span className="input-group-text"><RiLockPasswordFill /></span>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    className={`form-control ${passwordError ? 'is-invalid' : ''}`}
                                    placeholder="Enter Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <span
                                    className="input-group-text"
                                    style={{ cursor: "pointer" }}
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <AiFillEye /> : <AiFillEyeInvisible />}
                                </span>
                            </div>
                            {passwordError && <div className="text-danger mt-1">{passwordError}</div>}
                        </div>

                        <button type="submit" className="btn btn-info w-100 text-white fw-bold">Log In</button>

                        <div className="text-center mt-3">
                            <span className="me-1 text-muted">Don’t Have An Account?</span>
                            <a onClick={() => navigate('/signup')} className="text-primary text-decoration-none" style={{ cursor: "pointer" }}>
                                Sign Up
                            </a>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
