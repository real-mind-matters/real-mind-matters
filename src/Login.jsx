import React, { useState } from "react";
import {
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth, provider, db } from "./firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const [isSignUp, setIsSignUp] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const handleEmailAuth = async () => {
    try {
      if (isSignUp) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Update Firebase auth profile
        await updateProfile(user, { displayName: name });

        // Store user data in Firestore
        await setDoc(doc(db, "users", user.uid), {
          uid: user.uid,
          email: user.email,
          name,
          createdAt: new Date(),
        });

        navigate("/dashboard");
      } else {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        navigate("/dashboard");
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Only create Firestore doc if it doesn't exist yet
      const userDoc = doc(db, "users", user.uid);
      const docSnap = await getDoc(userDoc);
      if (!docSnap.exists()) {
        await setDoc(userDoc, {
          uid: user.uid,
          email: user.email,
          name: user.displayName,
          createdAt: new Date(),
        });
      }

      navigate("/dashboard");
    } catch (error) {
      alert(error.message);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      alert("Please enter your email address first.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      alert("Password reset email sent! Please check your inbox.");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="wrapper">
      <div className="left">
        <h1 className="brand"></h1>
        <p className="quote"></p>
      </div>

      <div className="right">
        <div className="card">
          <h2 className="heading">{isSignUp ? "Sign Up" : "Sign In"}</h2>

          {isSignUp && (
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input"
            />
          )}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input"
          />

          {!isSignUp && (
            <p
              onClick={handleForgotPassword}
              style={{
                cursor: "pointer",
                color: "#007bff",
                fontSize: "0.9rem",
                textAlign: "right",
                marginTop: "5px",
              }}
            >
              Forgot Password?
            </p>
          )}

          <button onClick={handleEmailAuth} className="signupButton">
            {isSignUp ? "Sign Up" : "Sign In"}
          </button>

          <div className="divider">or</div>

          <button onClick={handleGoogleSignIn} className="googleButton">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
              alt="Google"
              className="googleIcon"
            />
            {isSignUp ? "Sign up with Google" : "Sign in with Google"}
          </button>

          <p className="toggleText">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}
            <span className="toggleLink" onClick={() => setIsSignUp(!isSignUp)}>
              {isSignUp ? " Sign in" : " Sign up"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
