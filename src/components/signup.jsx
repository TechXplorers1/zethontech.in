// In signup.jsx, replace the entire file content with this code.
import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { FcGoogle } from "react-icons/fc";
import { MdEmail, MdArrowBack } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { Card, Button, Form, InputGroup, Modal, Spinner } from 'react-bootstrap'; // Import Spinner
import { useAuth } from '../components/AuthContext';
import '../styles/AuthForm.css';

import { auth, database } from "../firebase";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup
} from "firebase/auth";
import { ref, set, get, child } from "firebase/database";

export default function SignupPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isSigningUp, setIsSigningUp] = useState(false); // NEW: State for loading

  const validatePassword = (value) => {
    if (value.length < 8) return 'Password must be at least 8 characters';
    if (!/[A-Z]/.test(value)) return 'Must include one uppercase letter';
    if (!/[a-z]/.test(value)) return 'Must include one lowercase letter';
    if (!/[0-9]/.test(value)) return 'Must include one number';
    if (!/[@_\$\-]/.test(value)) return 'Must include one special character (@, _, $, -)';
    return null;
  };

  const processGoogleUser = async (user) => {
    // FIX: Use specific path instead of root ref
    const userRef = ref(database, `users/${user.uid}`);
    const snapshot = await get(userRef);
    let userDataFromDb;

    if (snapshot.exists()) {
      userDataFromDb = snapshot.val();
    } else {
      userDataFromDb = {
        email: user.email,
        roles: ['client'],
      };
      await set(userRef, userDataFromDb);
    }

    let extractedRoles = ['client'];
    if (userDataFromDb) {
      if (Array.isArray(userDataFromDb.roles)) {
        extractedRoles = userDataFromDb.roles.map(r => String(r).toLowerCase());
      } else if (typeof userDataFromDb.roles === 'string') {
        extractedRoles = [userDataFromDb.roles.toLowerCase()];
      } else if (userDataFromDb.roles && typeof userDataFromDb.roles === 'object') {
        extractedRoles = Object.values(userDataFromDb.roles)
            .filter(val => typeof val === 'string')
            .map(r => r.toLowerCase());
      } else if (typeof userDataFromDb.role === 'string') {
        extractedRoles = [userDataFromDb.role.toLowerCase()];
      } else if (Array.isArray(userDataFromDb.role)) {
        extractedRoles = userDataFromDb.role.map(r => String(r).toLowerCase());
      }
    }

    const finalUserData = {
      uid: user.uid,
      email: user.email,
      roles: extractedRoles.length > 0 ? extractedRoles : ['client'],
      avatar: user.photoURL || `https://placehold.co/40x40/007bff/white?text=${user.email.charAt(0).toUpperCase()}`
    };

    sessionStorage.setItem('loggedInEmployee', JSON.stringify(finalUserData));
    login(finalUserData);

    if (finalUserData.roles.includes('admin')) {
      navigate('/adminpage');
    } else if (finalUserData.roles.includes('manager')) {
      navigate('/managerworksheet');
    } else if (finalUserData.roles.includes('employee')) {
      navigate('/employees');
    } else {
      navigate('/clientdashboard');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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

    if (!hasError) {
      setIsSigningUp(true); // NEW: Start loading
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        const userRecord = {
          email: user.email,
          roles: ['client'],
        };

        const clientRecord = {
          email: user.email,
          firstName: '',
          lastName: '',
          displayStatuses: ['registered'],
        };

        try {
          // Atomic update to avoid partial writes when network or rules errors appear
          await set(ref(database, 'users/' + user.uid), userRecord);
          await set(ref(database, 'clients/' + user.uid), clientRecord);
          console.log('Realtime DB: user and client created', { uid: user.uid });
          setShowSuccessModal(true);
          setTimeout(() => {
            navigate('/login');
          }, 2000);
        } catch (dbError) {
          console.error('Realtime DB write error:', dbError);
          setPasswordError('Unable to save user data. Please try again later.');
          // Optionally rollback auth user to avoid orphaned auth profiles
          return;
        }

      } catch (error) {
        if (error.code === 'auth/email-already-in-use') {
          setEmailError("An account with this email already exists.");
        } else {
          setPasswordError("Failed to create an account. Please try again.");
          console.error("Firebase signup error:", error);
        }
      } finally {
        setIsSigningUp(false); // NEW: Stop loading
      }
    }
  };

  const handleGoogleLogin = async () => {
    setIsSigningUp(true); // NEW: Start loading for Google login
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      await processGoogleUser(result.user);
    } catch (error) {
      setPasswordError("Failed to sign in with Google. Please try again.");
      console.error("Firebase Google login error:", error);
    } finally {
      setIsSigningUp(false); // NEW: Stop loading
    }
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    navigate('/login');
  };

  return (
    <>
      <div className="auth-page-wrapper">
        <button className="auth-back-button" onClick={() => navigate('/')}>
          <MdArrowBack size={20} />
          Back to Home
        </button>
        <div className="auth-card">
          <h3 className="text-center auth-title">Create an Account</h3>
          <Button
            variant="outline-secondary"
            className="w-100 mb-3 d-flex align-items-center justify-content-center gap-2 google-btn"
            onClick={handleGoogleLogin}
            disabled={isSigningUp} // NEW: Disable during signup
          >
            <FcGoogle size={22} /> Continue with Google
          </Button>
          <div className="or-divider">OR</div>

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label className="form-label-modern">Email</Form.Label>
              <div className={`input-group-modern ${emailError ? 'border-danger' : ''}`}>
                <span className="input-group-icon"><MdEmail /></span>
                <Form.Control
                  className="form-control-modern"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  isInvalid={!!emailError}
                />
              </div>
              <Form.Control.Feedback type="invalid" className="d-block mt-1">{emailError}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="form-label-modern">Password</Form.Label>
              <div className={`input-group-modern ${passwordError ? 'border-danger' : ''}`}>
                <span className="input-group-icon"><RiLockPasswordFill /></span>
                <Form.Control
                  className="form-control-modern"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  isInvalid={!!passwordError}
                />
                <span className="password-toggle-icon" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <AiFillEye size={20} /> : <AiFillEyeInvisible size={20} />}
                </span>
              </div>
              <div className="password-hint">
                At least 8 chars, incl. uppercase, lowercase, number, and special character (@, _, $, -)
              </div>
              <Form.Control.Feedback type="invalid" className="d-block mt-1">{passwordError}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label className="form-label-modern">Confirm Password</Form.Label>
              <div className={`input-group-modern ${confirmPasswordError ? 'border-danger' : ''}`}>
                <span className="input-group-icon"><RiLockPasswordFill /></span>
                <Form.Control
                  className="form-control-modern"
                  type={showPassword ? "text" : "password"}
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  isInvalid={!!confirmPasswordError}
                />
              </div>
              <Form.Control.Feedback type="invalid" className="d-block mt-1">{confirmPasswordError}</Form.Control.Feedback>
            </Form.Group>

            <Button type="submit" className="w-100 btn btn-primary text-white fw-bold auth-btn-modern" disabled={isSigningUp}>
              {isSigningUp ? (
                <>
                  <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                  Signing Up...
                </>
              ) : (
                'Sign Up'
              )}
            </Button>


            <div className="text-center mt-3">
              <span className="auth-link-text">Already have an account?</span>
              <span
                style={{ color: '#007bff', fontWeight: 600, marginLeft: '0.5rem', cursor: 'pointer' }}
                onClick={() => navigate("/login")}
              >
                Login
              </span>
            </div>
          </Form>
        </div>
      </div>

      <Modal show={showSuccessModal} onHide={handleCloseSuccessModal} centered>
        <Modal.Body className="text-center p-4">
          <img
            src="https://cdn-icons-png.flaticon.com/512/845/845646.jpeg"
            alt="Success"
            style={{ width: '80px' }}
            onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/80x80/28a745/white?text=OK'; }}
          />
          <h5
            className="mt-3 text-success"
            style={{
              fontFamily: 'Inter, system-ui, sans-serif',
              fontWeight: 700,
              fontSize: '1.25rem',
              letterSpacing: '0.02em',
              fontStyle: 'normal'
            }}
          >
            Account successfully created!
          </h5>
        </Modal.Body>
      </Modal>
    </>
  );
}