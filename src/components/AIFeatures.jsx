import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMapMarkerAlt,
  faChartLine,
  faRobot,
  faLightbulb,
  faSearch,
  faSpinner,
  faCheckCircle,
  faExclamationTriangle
} from '@fortawesome/free-solid-svg-icons';
import './AIFeatures.css';

const AIFeatures = () => {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState('prediction-region');
  const [regionInput, setRegionInput] = useState('');
  const [activityInput, setActivityInput] = useState('');
  const [chatMessage, setChatMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'activity') {
      setActiveTab('activity-region');
    } else if (tab === 'chatbot') {
      setActiveTab('chatbot');
    }
  }, [searchParams]);

  // Mock data for demonstration
  const mockRegionResults = {
    region: "Marrakech",
    predictions: [
      { activity: "Tourisme", profitability: 95, confidence: 92 },
      { activity: "Agriculture", profitability: 88, confidence: 85 },
      { activity: "Commerce", profitability: 82, confidence: 78 }
    ]
  };

  const mockActivityResults = {
    activity: "Technologie",
    suggestions: [
      { region: "Casablanca", score: 96, reasons: ["Écosystème tech développé", "Accès aux talents", "Investissements étrangers"] },
      { region: "Rabat", score: 89, reasons: ["Proximité gouvernement", "Centres de recherche", "Éducation supérieure"] },
      { region: "Marrakech", score: 76, reasons: ["Coût de la vie abordable", "Tourisme croissant", "Écosystème naissant"] }
    ]
  };

  const handleRegionPrediction = async () => {
    if (!regionInput.trim()) return;

    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setResults({ type: 'region', data: mockRegionResults });
      setLoading(false);
    }, 2000);
  };

  const handleActivitySuggestion = async () => {
    if (!activityInput.trim()) return;

    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setResults({ type: 'activity', data: mockActivityResults });
      setLoading(false);
    }, 2000);
  };

  const handleChatSubmit = async () => {
    if (!chatMessage.trim()) return;

    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setResults({
        type: 'chat',
        data: {
          response: "Basé sur les données actuelles du marché marocain, je recommande de considérer les secteurs technologiques et touristiques qui montrent une croissance significative. Pour plus de détails spécifiques à votre situation, pourriez-vous me donner plus d'informations sur votre budget initial et vos compétences ?"
        }
      });
      setLoading(false);
      setChatMessage('');
    }, 1500);
  };

  const renderRegionPrediction = () => (
    <div className="ai-feature-section">
      <div className="ai-input-section">
        <h3>Prédiction d'activité rentable par région</h3>
        <p className="ai-description">
          Entrez une région et notre IA analysera les données économiques pour prédire
          les activités les plus rentables dans cette zone.
        </p>
        <div className="ai-input-group">
          <div className="ai-input-wrapper">
            <FontAwesomeIcon icon={faMapMarkerAlt} className="ai-input-icon" />
            <input
              type="text"
              placeholder="Ex: Marrakech, Casablanca, Rabat..."
              value={regionInput}
              onChange={(e) => setRegionInput(e.target.value)}
              className="ai-input"
            />
          </div>
          <button
            onClick={handleRegionPrediction}
            disabled={loading || !regionInput.trim()}
            className="ai-button primary"
          >
            {loading ? <FontAwesomeIcon icon={faSpinner} spin /> : <FontAwesomeIcon icon={faSearch} />}
            Analyser
          </button>
        </div>
      </div>

      {results && results.type === 'region' && (
        <div className="ai-results-section">
          <h4>Résultats pour {results.data.region}</h4>
          <div className="ai-predictions-grid">
            {results.data.predictions.map((pred, index) => (
              <div key={index} className="ai-prediction-card">
                <div className="ai-prediction-header">
                  <h5>{pred.activity}</h5>
                  <div className="ai-profitability-score">
                    <span className="score">{pred.profitability}%</span>
                    <span className="label">Rentabilité</span>
                  </div>
                </div>
                <div className="ai-confidence">
                  <span>Confiance: {pred.confidence}%</span>
                </div>
                <div className="ai-trend">
                  <FontAwesomeIcon icon={faChartLine} />
                  <span>Tendance positive</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderActivitySuggestion = () => (
    <div className="ai-feature-section">
      <div className="ai-input-section">
        <h3>Suggestion de région par activité</h3>
        <p className="ai-description">
          Entrez une activité et notre IA vous suggérera les meilleures régions
          pour développer cette activité au Maroc.
        </p>
        <div className="ai-input-group">
          <div className="ai-input-wrapper">
            <FontAwesomeIcon icon={faLightbulb} className="ai-input-icon" />
            <input
              type="text"
              placeholder="Ex: Technologie, Agriculture, Tourisme..."
              value={activityInput}
              onChange={(e) => setActivityInput(e.target.value)}
              className="ai-input"
            />
          </div>
          <button
            onClick={handleActivitySuggestion}
            disabled={loading || !activityInput.trim()}
            className="ai-button primary"
          >
            {loading ? <FontAwesomeIcon icon={faSpinner} spin /> : <FontAwesomeIcon icon={faSearch} />}
            Rechercher
          </button>
        </div>
      </div>

      {results && results.type === 'activity' && (
        <div className="ai-results-section">
          <h4>Régions recommandées pour {results.data.activity}</h4>
          <div className="ai-suggestions-list">
            {results.data.suggestions.map((sugg, index) => (
              <div key={index} className="ai-suggestion-card">
                <div className="ai-suggestion-header">
                  <div className="ai-region-info">
                    <FontAwesomeIcon icon={faMapMarkerAlt} />
                    <h5>{sugg.region}</h5>
                  </div>
                  <div className="ai-score">
                    <span className="score">{sugg.score}%</span>
                    <span className="label">Score</span>
                  </div>
                </div>
                <div className="ai-reasons">
                  <h6>Avantages :</h6>
                  <ul>
                    {sugg.reasons.map((reason, idx) => (
                      <li key={idx}>{reason}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderChatbot = () => (
    <div className="ai-feature-section">
      <div className="ai-chat-section">
        <h3>Assistant IA - Chatbot</h3>
        <p className="ai-description">
          Posez vos questions sur l'entrepreneuriat, les marchés, ou demandez des conseils personnalisés.
        </p>

        <div className="ai-chat-container">
          <div className="ai-chat-messages">
            <div className="ai-message ai-message-bot">
              <div className="ai-message-avatar">
                <FontAwesomeIcon icon={faRobot} />
              </div>
              <div className="ai-message-content">
                <p>Bonjour ! Je suis votre assistant IA spécialisé dans l'entrepreneuriat marocain.
                Comment puis-je vous aider aujourd'hui ?</p>
              </div>
            </div>

            {results && results.type === 'chat' && (
              <div className="ai-message ai-message-bot">
                <div className="ai-message-avatar">
                  <FontAwesomeIcon icon={faRobot} />
                </div>
                <div className="ai-message-content">
                  <p>{results.data.response}</p>
                </div>
              </div>
            )}
          </div>

          <div className="ai-chat-input">
            <input
              type="text"
              placeholder="Posez votre question..."
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleChatSubmit()}
              className="ai-chat-text-input"
            />
            <button
              onClick={handleChatSubmit}
              disabled={loading || !chatMessage.trim()}
              className="ai-button chat-send"
            >
              {loading ? <FontAwesomeIcon icon={faSpinner} spin /> : 'Envoyer'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="ai-features-container">
      <div className="ai-header">
        <h2>Fonctionnalités IA Premium</h2>
        <p>Découvrez les outils d'intelligence artificielle pour optimiser vos décisions entrepreneuriales</p>
      </div>

      <div className="ai-tabs">
        <button
          className={`ai-tab ${activeTab === 'prediction-region' ? 'active' : ''}`}
          onClick={() => setActiveTab('prediction-region')}
        >
          <FontAwesomeIcon icon={faChartLine} />
          Prédiction par région
        </button>
        <button
          className={`ai-tab ${activeTab === 'activity-region' ? 'active' : ''}`}
          onClick={() => setActiveTab('activity-region')}
        >
          <FontAwesomeIcon icon={faLightbulb} />
          Suggestion par activité
        </button>
        <button
          className={`ai-tab ${activeTab === 'chatbot' ? 'active' : ''}`}
          onClick={() => setActiveTab('chatbot')}
        >
          <FontAwesomeIcon icon={faRobot} />
          Chatbot IA
        </button>
      </div>

      <div className="ai-content">
        {activeTab === 'prediction-region' && renderRegionPrediction()}
        {activeTab === 'activity-region' && renderActivitySuggestion()}
        {activeTab === 'chatbot' && renderChatbot()}
      </div>

      <div className="ai-premium-banner">
        <FontAwesomeIcon icon={faCheckCircle} />
        <span>Cette fonctionnalité est réservée aux comptes Premium</span>
      </div>
    </div>
  );
};

export default AIFeatures;