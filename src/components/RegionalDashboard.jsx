import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMapMarkerAlt,
  faBuilding,
  faChartBar,
  faChartLine,
  faArrowUp,
  faArrowDown,
  faUsers,
  faStar,
  faIndustry,
  faBarChart,
  faCalendarAlt,
  faArrowRight
} from '@fortawesome/free-solid-svg-icons';
import './RegionalDashboard.css';

const RegionalDashboard = () => {
  const navigate = useNavigate();
  const [selectedRegion, setSelectedRegion] = useState('Marrakech');
  const [regionData, setRegionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState('annual');

  const handleCalendarClick = () => {
    const storedUser = localStorage.getItem('user');
    
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser).user;
        const premiumStatus = user && (user.is_premium || user.subscription_type === 'premium');
        
        if (premiumStatus) {
          navigate('/premium-dashboard');
        } else {
          navigate('/premium-access');
        }
      } catch (error) {
        navigate('/premium-access');
      }
    } else {
      navigate('/premium-access');
    }
  };

  // Liste des régions marocaines
  const regions = [
    'Casablanca',
    'El-Jadida',
    'Settat',
    'Mohammedia',
    'Benslimane'
  ];

  // Mock data pour les régions (à remplacer par des appels API)
  const mockRegionalData = {
    'Marrakech': {
      region: 'Marrakech',
      totalEntreprises: 1_245,
      entreprisesActives: 987,
      secteurDominant: 'Tourisme',
      populationActive: 2_345_000,
      tauxCroissance: 12.5,
      tauxChomage: 8.2,
      investissementsMois: 450_000_000,
      statistiques: {
        top_secteurs: [
          { secteur: 'Tourisme', nombre: 350, pourcentage: 28 },
          { secteur: 'Commerce', nombre: 280, pourcentage: 22 },
          { secteur: 'Technologie', nombre: 210, pourcentage: 17 },
          { secteur: 'Agriculture', nombre: 180, pourcentage: 14 },
          { secteur: 'Construction', nombre: 140, pourcentage: 11 },
          { secteur: 'Autres', nombre: 85, pourcentage: 8 }
        ],
        taille_entreprises: [
          { taille: 'Micro (<10)', nombre: 750, pourcentage: 60 },
          { taille: 'PME (10-50)', nombre: 350, pourcentage: 28 },
          { taille: 'ETI (50-250)', nombre: 110, pourcentage: 9 },
          { taille: 'GE (>250)', nombre: 35, pourcentage: 3 }
        ]
      },
      evolution: {
        annual: [
          { mois: 'Jan', entreprises: 1050, activites: 780 },
          { mois: 'Fév', entreprises: 1085, activites: 810 },
          { mois: 'Mar', entreprises: 1120, activites: 850 },
          { mois: 'Avr', entreprises: 1155, activites: 890 },
          { mois: 'Mai', entreprises: 1190, activites: 920 },
          { mois: 'Juin', entreprises: 1210, activites: 940 },
          { mois: 'Juil', entreprises: 1230, activites: 960 },
          { mois: 'Août', entreprises: 1245, activites: 987 },
          { mois: 'Sep', entreprises: 1240, activites: 985 },
          { mois: 'Oct', entreprises: 1245, activites: 987 },
          { mois: 'Nov', entreprises: 1245, activites: 987 },
          { mois: 'Déc', entreprises: 1245, activites: 987 }
        ]
      },
      insights: [
        { type: 'positive', title: 'Croissance forte', description: 'Le secteur touristique affiche une croissance de 15% cette année', score: 95 },
        { type: 'opportunity', title: 'Nouvelle tendance', description: 'Tech & Digital en expansion avec 12% de nouvelles startups', score: 88 },
        { type: 'warning', title: 'Tendance à surveiller', description: 'Taux de chômage légèrement en hausse dans le secteur retail', score: 62 }
      ]
    },
    'Casablanca': {
      region: 'Casablanca',
      totalEntreprises: 2_890,
      entreprisesActives: 2_456,
      secteurDominant: 'Finance',
      populationActive: 4_250_000,
      tauxCroissance: 18.3,
      tauxChomage: 6.5,
      investissementsMois: 892_000_000,
      statistiques: {
        top_secteurs: [
          { secteur: 'Finance', nombre: 580, pourcentage: 20 },
          { secteur: 'Commerce', nombre: 520, pourcentage: 18 },
          { secteur: 'Technologie', nombre: 450, pourcentage: 15 },
          { secteur: 'Industrie', nombre: 400, pourcentage: 14 },
          { secteur: 'Construction', nombre: 360, pourcentage: 12 },
          { secteur: 'Autres', nombre: 580, pourcentage: 21 }
        ],
        taille_entreprises: [
          { taille: 'Micro (<10)', nombre: 1912, pourcentage: 66 },
          { taille: 'PME (10-50)', nombre: 678, pourcentage: 23 },
          { taille: 'ETI (50-250)', nombre: 217, pourcentage: 8 },
          { taille: 'GE (>250)', nombre: 83, pourcentage: 3 }
        ]
      },
      evolution: {
        annual: [
          { mois: 'Jan', entreprises: 2450, activites: 1890 },
          { mois: 'Fév', entreprises: 2520, activites: 1950 },
          { mois: 'Mar', entreprises: 2610, activites: 2010 },
          { mois: 'Avr', entreprises: 2690, activites: 2100 },
          { mois: 'Mai', entreprises: 2760, activites: 2180 },
          { mois: 'Juin', entreprises: 2820, activites: 2250 },
          { mois: 'Juil', entreprises: 2850, activites: 2340 },
          { mois: 'Août', entreprises: 2890, activites: 2456 },
          { mois: 'Sep', entreprises: 2875, activites: 2430 },
          { mois: 'Oct', entreprises: 2890, activites: 2456 },
          { mois: 'Nov', entreprises: 2890, activites: 2456 },
          { mois: 'Déc', entreprises: 2890, activites: 2456 }
        ]
      },
      insights: [
        { type: 'positive', title: 'Leaders des investissements', description: 'Casablanca reçoit 35% des investissements nationaux', score: 98 },
        { type: 'opportunity', title: 'Hub financial', description: 'Développement du secteur fintech avec 20 nouveaux projets', score: 92 },
        { type: 'positive', title: 'Création d\'emplois', description: '2500+ postes créés dans le secteur tech cette année', score: 89 }
      ]
    },
    'Rabat': {
      region: 'Rabat',
      totalEntreprises: 856,
      entreprisesActives: 712,
      secteurDominant: 'Administration',
      populationActive: 1_230_000,
      tauxCroissance: 9.2,
      tauxChomage: 7.8,
      investissementsMois: 234_000_000,
      statistiques: {
        top_secteurs: [
          { secteur: 'Administration', nombre: 250, pourcentage: 29 },
          { secteur: 'Éducation', nombre: 180, pourcentage: 21 },
          { secteur: 'Santé', nombre: 150, pourcentage: 17 },
          { secteur: 'Technologie', nombre: 120, pourcentage: 14 },
          { secteur: 'Commerce', nombre: 100, pourcentage: 12 },
          { secteur: 'Autres', nombre: 56, pourcentage: 7 }
        ],
        taille_entreprises: [
          { taille: 'Micro (<10)', nombre: 513, pourcentage: 60 },
          { taille: 'PME (10-50)', nombre: 214, pourcentage: 25 },
          { taille: 'ETI (50-250)', nombre: 99, pourcentage: 11 },
          { taille: 'GE (>250)', nombre: 30, pourcentage: 4 }
        ]
      },
      evolution: {
        annual: [
          { mois: 'Jan', entreprises: 750, activites: 620 },
          { mois: 'Fév', entreprises: 780, activites: 640 },
          { mois: 'Mar', entreprises: 800, activites: 660 },
          { mois: 'Avr', entreprises: 820, activites: 680 },
          { mois: 'Mai', entreprises: 840, activites: 700 },
          { mois: 'Juin', entreprises: 856, activites: 712 },
          { mois: 'Juil', entreprises: 856, activites: 712 },
          { mois: 'Août', entreprises: 856, activites: 712 },
          { mois: 'Sep', entreprises: 856, activites: 712 },
          { mois: 'Oct', entreprises: 856, activites: 712 },
          { mois: 'Nov', entreprises: 856, activites: 712 },
          { mois: 'Déc', entreprises: 856, activites: 712 }
        ]
      },
      insights: [
        { type: 'positive', title: 'Stabilité', description: 'Croissance régulière et stable des activités adminstratives', score: 85 },
        { type: 'opportunity', title: 'Numérisation', description: 'Opportunités dans la transformation digitale de l\'État', score: 80 },
        { type: 'info', title: 'Secteur public', description: 'Focus sur développement de l\'écosystème public', score: 75 }
      ]
    }
  };

  useEffect(() => {
    // Charger les données de la région sélectionnée
    setLoading(true);
    
    // Simuler un délai réseau
    const timer = setTimeout(() => {
      const data = mockRegionalData[selectedRegion] || mockRegionalData['Marrakech'];
      setRegionData(data);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [selectedRegion]);

  if (loading || !regionData) {
    return (
      <div className="regional-dashboard-container">
        <div className="loading-spinner">
          <FontAwesomeIcon icon={faMapMarkerAlt} spin size="2x" />
          <p>Chargement des données...</p>
        </div>
      </div>
    );
  }

  const getGrowthColor = (rate) => rate > 0 ? '#4fd1c5' : '#ff6b6b';
  const getGrowthIcon = (rate) => rate > 0 ? faArrowUp : faArrowDown;

  return (
    <div className="regional-dashboard-container">
      {/* Header */}
      <div className="regional-header">
        <div className="regional-selector">
          <FontAwesomeIcon icon={faMapMarkerAlt} className="selector-icon" />
          <select 
            value={selectedRegion} 
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="region-select"
          >
            {regions.map(region => (
              <option key={region} value={region}>{region}</option>
            ))}
          </select>
        </div>

        <div className="header-title">
          <h1>Dashboard Régional: {regionData.region}</h1>
          <p>Statistiques, analyses et évolution économique</p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon">
            <FontAwesomeIcon icon={faBuilding} />
          </div>
          <div className="metric-content">
            <div className="metric-value">{regionData.totalEntreprises.toLocaleString()}</div>
            <div className="metric-label">Entreprises totales</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">
            <FontAwesomeIcon icon={faUsers} />
          </div>
          <div className="metric-content">
            <div className="metric-value">{regionData.entreprisesActives.toLocaleString()}</div>
            <div className="metric-label">Entreprises actives</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">
            <FontAwesomeIcon icon={faChartLine} />
          </div>
          <div className="metric-content">
            <div className="metric-value" style={{ color: getGrowthColor(regionData.tauxCroissance) }}>
              <FontAwesomeIcon icon={getGrowthIcon(regionData.tauxCroissance)} /> {regionData.tauxCroissance}%
            </div>
            <div className="metric-label">Taux de croissance</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">
            <FontAwesomeIcon icon={faIndustry} />
          </div>
          <div className="metric-content">
            <div className="metric-value">{regionData.secteurDominant}</div>
            <div className="metric-label">Secteur dominant</div>
          </div>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="overview-grid">
        <div className="overview-card">
          <div className="card-header">Population active</div>
          <div className="card-value">{(regionData.populationActive / 1_000_000).toFixed(2)}M</div>
          <div className="card-subtext">habitants</div>
        </div>

        <div className="overview-card">
          <div className="card-header">Taux de chômage</div>
          <div className="card-value" style={{ color: '#ff6b6b' }}>{regionData.tauxChomage}%</div>
          <div className="card-subtext">de la population active</div>
        </div>

        <div className="overview-card">
          <div className="card-header">Investissements (mois)</div>
          <div className="card-value">{(regionData.investissementsMois / 1_000_000).toFixed(0)}M MAD</div>
          <div className="card-subtext">cette année</div>
        </div>
      </div>

      {/* Top Sectors */}
      <div className="sectors-section">
        <h2>Top Secteurs d'activité</h2>
        <div className="sectors-grid">
          {regionData.statistiques.top_secteurs.map((sector, index) => (
            <div key={index} className="sector-card">
              <div className="sector-header">
                <h4>{sector.secteur}</h4>
                <span className="sector-percentage">{sector.pourcentage}%</span>
              </div>
              <div className="sector-progress">
                <div className="progress-bar" style={{ width: `${sector.pourcentage}%` }}></div>
              </div>
              <div className="sector-count">{sector.nombre} entreprises</div>
            </div>
          ))}
        </div>
      </div>

      {/* Company Size Distribution */}
      <div className="size-distribution-section">
        <h2>Distribution par taille d'entreprise</h2>
        <div className="size-grid">
          {regionData.statistiques.taille_entreprises.map((size, index) => (
            <div key={index} className="size-card">
              <div className="size-label">{size.taille}</div>
              <div className="size-percentage">{size.pourcentage}%</div>
              <div className="size-count">{size.nombre} entreprises</div>
              <div className="size-bar" style={{ width: `${size.pourcentage}%` }}></div>
            </div>
          ))}
        </div>
      </div>

      
      {/* Insights */}
      <div className="insights-section">
        <h2>Analyses et Insights</h2>
        <div className="insights-grid">
          {regionData.insights.map((insight, index) => (
            <div key={index} className={`insight-card ${insight.type}`}>
              <div className="insight-header">
                <h3>{insight.title}</h3>
                <span className="insight-score">{insight.score}%</span>
              </div>
              <p>{insight.description}</p>
              <div className="insight-bar">
                <div className="insight-progress" style={{ width: `${insight.score}%` }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="actions-section">
        <h2>Actions rapides</h2>
        <div className="actions-grid">
          <button className="action-btn">
            <FontAwesomeIcon icon={faChartBar} />
            Générer un rapport PDF
          </button>
          <button className="action-btn">
            <FontAwesomeIcon icon={faBarChart} />
            Exporter les données
          </button>
          <button className="action-btn" onClick={() => navigate('/ville/Marrakech')}>
            <FontAwesomeIcon icon={faUsers} />
            Voir les entreprises
          </button>
          <button className="action-btn premium-action" onClick={handleCalendarClick}>
            <FontAwesomeIcon icon={faCalendarAlt} />
            Planifier une analyse
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegionalDashboard;