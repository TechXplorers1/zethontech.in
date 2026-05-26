import React, { useState } from "react";
import '../styles/SignUp.css';
import { useNavigate } from 'react-router-dom';
import txlogo from "../assets/txlogo.png";
import { FcGoogle } from "react-icons/fc";
import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

export default function SignupPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
//   const [agreeToTerms, setAgreeToTerms] = useState(false);
//   const [termsError, setTermsError] = useState(false);
   const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

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

    // Clear previous errors
    setEmailError("");
    setPasswordError("");
    setConfirmPasswordError("");

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

    if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
      hasError = true;
    }

    if (hasError) return;

    console.log("User Registered with Email:", email);
    navigate('/candidateform');
  };

  return (
    <div className="signup-page">
      <div className="d-flex justify-content-between align-items-center p-4">
        <div className="d-flex align-items-center gap-2">
          <img src={txlogo} alt="TechXplorers" style={{ height: "50px" }} />
        </div>
        <div>
          <span className="me-2 text-primary">Have An Account?</span>
          <button onClick={() => navigate('/login')} className="btn btn-primary btn-sm rounded-pill">Login</button>
        </div>
      </div>

      <div className="d-flex justify-content-center align-items-center vh-90">
        <form onSubmit={handleSubmit} className="shadow-lg p-4 rounded bg-white signup-box">
          <h3 className="text-center fw-bold mb-3">Let’s sign up!</h3>

          <button type="button" className="btn btn-light w-100 border mb-3 d-flex align-items-center justify-content-center gap-2">
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
            <small className="text-muted">
              Password must be at least 8 characters, include one special character(@, _, $, -), one number, one lowercase and one uppercase letter.
            </small>
            {passwordError && <div className="text-danger mt-1">{passwordError}</div>}
          </div>

          {/* Confirm Password Field */}
          <div className="mb-3">
            <label className="form-label">Confirm Password</label>
            <div className="input-group">
              <span className="input-group-text"><RiLockPasswordFill /></span>
              <input
                type={showPassword ? "text" : "password"}
                className={`form-control ${confirmPasswordError ? 'is-invalid' : ''}`}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <span
                className="input-group-text"
                style={{ cursor: "pointer" }}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <AiFillEye /> : <AiFillEyeInvisible />}
              </span>
            </div>
            {confirmPasswordError && <div className="text-danger mt-1">{confirmPasswordError}</div>}
          </div>


          <button type="submit" className="btn btn-info w-100 text-white fw-bold">Sign Up</button>

          <div className="text-center mt-3">
            <span className="me-1 text-muted">Already Registered?</span>
            <a onClick={() => navigate('/login')} className="text-primary text-decoration-none" style={{ cursor: 'pointer' }}>
              Login
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
