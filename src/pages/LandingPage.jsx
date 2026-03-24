import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Activity, Brain, Flame, Trophy, Play, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import './LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target); // Animate only once
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll('.landing-container .fade-up');
    elements.forEach((el) => observer.observe(el));

    return () => elements.forEach((el) => observer.unobserve(el));
  }, []);

  return (
    <div className="landing-container">
      <div className="landing-top-fold">
        {/* Navbar */}
        <nav className="landing-nav fade-up">
          <div className="landing-logo">
            <Activity className="logo-icon" />
            <span>FitAI</span>
          </div>
          <div className="landing-nav-actions">
            <button className="btn btn-ghost" onClick={() => navigate('/login')}>
              Login
            </button>
            <button className="btn btn-primary" onClick={() => navigate('/login?signup=true')}>
              Get Started
            </button>
          </div>
        </nav>

        {/* Hero Section */}
        <header className="landing-hero fade-up" style={{ animationDelay: '0.1s' }}>
          <div className="hero-badge">Next-Gen Fitness Tracking</div>
          <h1 className="hero-title">
            Your Intelligent <span className="highlight-text">Personal Trainer</span>
          </h1>
          <p className="hero-subtitle">
            AI-driven workouts, precise analytics, and gamified streak tracking to help you achieve your fitness goals faster.
          </p>
          <div className="hero-cta">
            <button className="btn btn-primary btn-lg" onClick={() => navigate('/login?signup=true')}>
              Start Your Journey <ArrowRight size={20} />
            </button>
            <button className="btn btn-ghost btn-lg" onClick={() => navigate('/login')}>
              <Play size={20} fill="currentColor" /> See How it Works
            </button>
          </div>
        </header>
      </div>

      {/* Highlights */}
      <section className="landing-stats fade-up" style={{ animationDelay: '0.2s' }}>
        <div className="stat-item">
          <div className="stat-number">
            <Zap size={40} className="logo-icon" style={{ marginBottom: '-8px' }} />
          </div>
          <div className="stat-label">Lightning Fast</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">
            <Brain size={40} className="logo-icon" style={{ marginBottom: '-8px' }} />
          </div>
          <div className="stat-label">AI Powered</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">
            <ShieldCheck size={40} className="logo-icon" style={{ marginBottom: '-8px' }} />
          </div>
          <div className="stat-label">Privacy First</div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="landing-features fade-up" style={{ animationDelay: '0.3s' }}>
        <h2 className="feature-section-title">Everything you need to succeed</h2>

        <div className="features-grid">
          <div className="card feature-card">
            <div className="feature-icon-wrapper blue">
              <Brain className="feature-icon" />
            </div>
            <h3>AI Personalization</h3>
            <p>Our machine learning model analyzes your past performance to adjust your optimal weights and reps.</p>
          </div>

          <div className="card feature-card">
            <div className="feature-icon-wrapper orange">
              <Flame className="feature-icon" />
            </div>
            <h3>Streak Tracking</h3>
            <p>Stay motivated with our gamified streak system. Hit your weekly goals and keep the fire burning.</p>
          </div>

          <div className="card feature-card">
            <div className="feature-icon-wrapper green">
              <Activity className="feature-icon" />
            </div>
            <h3>Real-time Analytics</h3>
            <p>Monitor your cardiovascular health, muscle fatigue, and overall progress with interactive charts.</p>
          </div>

          <div className="card feature-card">
            <div className="feature-icon-wrapper purple">
              <Trophy className="feature-icon" />
            </div>
            <h3>Milestones & Rewards</h3>
            <p>Earn badges and track personal bests automatically as you break through your plateaus.</p>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="landing-bottom-cta fade-up" style={{ animationDelay: '0.4s' }}>
        <h2>Ready to transform your body?</h2>
        <p>Join thousands of users who have already upgraded their workouts.</p>
        <button className="btn btn-primary btn-lg" onClick={() => navigate('/login?signup=true')}>
          Create Free Account
        </button>
      </section>

      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-logo">
            <Activity size={20} className="logo-icon" /> FitAI
          </div>
          <p className="footer-copy">&copy; {new Date().getFullYear()} FitAI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
