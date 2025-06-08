import React, { useEffect, useState } from "react";
import { auth, db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import "./Dashboard.css";

const Dashboard = () => {
  const [name, setName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          setName(userDoc.data().name);
        } else {
          setName(user.displayName || "User");
        }
      } else {
        navigate("/");
      }
    });

    return () => unsubscribe(); // Clean up the listener
  }, [navigate]);

  const handleLogout = async () => {
    await auth.signOut();
    navigate("/");
  };

  const firstName = name.split(" ")[0];

  return (
    <div className="dashboard">
      {/* Navbar */}
      <nav className="navbar">
        <div className="logo">Real Mind Matters</div>
        <ul className="nav-links">
          <li>Home</li>
          <li>About</li>
          <li>Programs</li>
          <li>Contact</li>
        </ul>
        <div className="navbar-buttons">
          <button className="cta-button">Join Now</button>
          <button className="logout-button" onClick={handleLogout}>Log Out</button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="hero">
        <div className="hero-overlay">
          <h1 className="hero-title">Welcome, {firstName}!</h1>
          <p className="hero-subtitle">
            Helping young people thrive — mentally, emotionally, spiritually.
          </p>
        </div>
      </header>

      {/* Features */}
      <section className="features">
        <div className="feature">
          <i className="fas fa-brain feature-icon" />
          <h3>Mental Health</h3>
          <p>Support for anxiety, stress, and emotional well-being.</p>
        </div>
        <div className="feature">
          <i className="fas fa-heart feature-icon" />
          <h3>Emotional Support</h3>
          <p>We help build resilience and strong self-esteem.</p>
        </div>
        <div className="feature">
          <i className="fas fa-dove feature-icon" />
          <h3>Spiritual Guidance</h3>
          <p>Helping youth find meaning and purpose in life.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div>
          Need help?{" "}
          <a href="tel:+233530177612">+233 530 177 612</a> |{" "}
          <a href="mailto:support@realmindmatters@gmail.com">
            support@realmindmatters@gmail.com
          </a>
        </div>
        <div className="social-icons">
          <i className="fab fa-facebook-f" />
          <i className="fab fa-twitter" />
          <i className="fab fa-instagram" />
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
