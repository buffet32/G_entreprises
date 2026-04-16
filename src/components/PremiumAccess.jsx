import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCrown, faLock, faArrowRight, faCreditCard } from '@fortawesome/free-solid-svg-icons';
import './PremiumAccess.css';

const PremiumAccess = () => {
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(true);
  const [processingPayment, setProcessingPayment] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser).user;
        const premiumStatus = user && (user.is_premium || user.subscription_type === 'premium');
        setIsPremium(premiumStatus);
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
    setLoading(false);
  }, []);

  const handlePayment = async () => {
    setProcessingPayment(true);
    
    // Simulate payment processing
    setTimeout(() => {
      // Update user's premium status in localStorage
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          if (userData.user) {
            userData.user.is_premium = true;
            userData.user.subscription_type = 'premium';
            localStorage.setItem('user', JSON.stringify(userData));
          }
        } catch (error) {
          console.error('Error updating user data:', error);
        }
      }
      
      setProcessingPayment(false);
      // Redirect to premium dashboard after successful payment
      navigate('/premium-dashboard');
    }, 2000); // 2 second payment simulation
  };

  if (loading) {
    return (
      <div className="premium-access-container">
        <div className="loading-spinner">
          <FontAwesomeIcon icon={faCrown} spin size="2x" />
          <p>Vérification de votre statut...</p>
        </div>
      </div>
    );
  }

  if (!isPremium) {
    return (
      <div className="premium-access-container">
        <div className="premium-locked">
          <div className="premium-icon">
            <FontAwesomeIcon icon={faLock} size="3x" />
          </div>
          <h2>Fonctionnalités IA Premium</h2>
          <p>Cette section est réservée aux utilisateurs Premium.</p>
          <div className="premium-benefits">
            <h3>Avantages Premium :</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                {
                  bg: '#E6F1FB', stroke: '#185FA5',
                  label: "Prédiction d'activités rentables par région",
                  icon: <><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></>
                },
                {
                  bg: '#EEEDFE', stroke: '#534AB7',
                  label: "Suggestion de régions optimales par activité",
                  icon: <><circle cx="12" cy="12" r="3"/><circle cx="12" cy="12" r="8" strokeDasharray="3 2"/><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/></>
                },
                {
                  bg: '#E1F5EE', stroke: '#0F6E56',
                  label: "Chatbot IA spécialisé en entrepreneuriat",
                  icon: <><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><line x1="9" y1="10" x2="15" y2="10"/><line x1="9" y1="13" x2="13" y2="13"/></>
                },
                {
                  bg: '#FAEEDA', stroke: '#854F0B',
                  label: "Analyse de données avec insights intelligents",
                  icon: <><rect x="3" y="3" width="18" height="18" rx="2"/><polyline points="8 17 12 7 16 17"/><line x1="9.5" y1="13" x2="14.5" y2="13"/></>
                },
                {
                  bg: '#EAF3DE', stroke: '#3B6D11',
                  label: "Insights marché en temps réel",
                  icon: <><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></>
                },
                {
                  bg: '#FAECE7', stroke: '#993C1D',
                  label: "Recommandations personnalisées",
                  icon: <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/>
                },
              ].map(({ bg, stroke, label, icon }, i) => (
                <li key={i} style={{ 
  display: 'flex', 
  alignItems: 'center', 
  gap: '14px', 
  background: 'rgba(255, 255, 255, 0.05)', 
  border: '1px solid rgba(255,255,255,0.1)', 
  borderRadius: '12px', 
  padding: '14px 16px' 
}}>
                  <div style={{ width: 36, height: 36, borderRadius: 8, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      {icon}
                    </svg>
                  </div>
                  <span style={{ fontSize: 14, color: '#ffffff' }}>
                    {label}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className="premium-cta">
            <p>Contactez-nous pour passer à Premium et accéder à ces fonctionnalités !</p>
            <div className="premium-actions">
              <button 
                className="pay-btn" 
                onClick={handlePayment}
                disabled={processingPayment}
              >
                {processingPayment ? (
                  <>
                    <FontAwesomeIcon icon={faCreditCard} spin />
                    <span>Traitement...</span>
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faCreditCard} />
                    <span>Payer maintenant</span>
                  </>
                )}
              </button>
              <Link to="/" className="back-home-btn">
                Retour à l'accueil
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="premium-access-container">
      <div className="premium-welcome">
        <div className="premium-badge">
          <FontAwesomeIcon icon={faCrown} />
          <span>Accès Premium Confirmé</span>
        </div>
        <h2>Bienvenue dans votre espace IA Premium !</h2>
        <p>Explorez toutes les fonctionnalités d'intelligence artificielle conçues pour optimiser vos décisions entrepreneuriales.</p>

        <div className="premium-quick-access">
          <h3>Accès rapide :</h3>
          <div className="quick-access-grid">
            <Link to="/premium-dashboard" className="quick-access-card">
              <div className="card-icon">
                <FontAwesomeIcon icon={faCrown} />
              </div>
              <div className="card-content">
                <h4>Dashboard Premium</h4>
                <p>Vue d'ensemble de toutes vos fonctionnalités IA</p>
              </div>
              <FontAwesomeIcon icon={faArrowRight} className="card-arrow" />
            </Link>

            <Link to="/ai-features" className="quick-access-card">
              <div className="card-icon">
                🤖
              </div>
              <div className="card-content">
                <h4>Prédictions & Chatbot</h4>
                <p>Analyses prédictives et assistant IA</p>
              </div>
              <FontAwesomeIcon icon={faArrowRight} className="card-arrow" />
            </Link>

            <Link to="/ai-interpretation" className="quick-access-card">
              <div className="card-icon">
                📊
              </div>
              <div className="card-content">
                <h4>Analyse de données</h4>
                <p>Insights intelligents et tendances marché</p>
              </div>
              <FontAwesomeIcon icon={faArrowRight} className="card-arrow" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumAccess;