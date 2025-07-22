import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBuilding,
  faUserGroup,
  faFileAlt,
  faUserTie,
  faPhoneAlt,
  faEnvelope,
  faSearch,
  faMapMarkerAlt
} from '@fortawesome/free-solid-svg-icons';
import {
  faFacebookF,
  faTwitter,
  faLinkedinIn,
  faYoutube
} from '@fortawesome/free-brands-svg-icons';
import { Link, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import "./HomeDashboard.css";

// Fix for default markers in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const Home = () => {
  const [entreprises, setEntreprises] = useState([]);
  const [filteredEntreprises, setFilteredEntreprises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const navigate = useNavigate();
  
  // Search filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSecteur, setSelectedSecteur] = useState('');
  const [selectedVille, setSelectedVille] = useState('');
  const [selectedForme, setSelectedForme] = useState('');
  const [selectedCertification, setSelectedCertification] = useState('');

  // Calcul du nombre de responsables (utilisateurs avec le rôle responsable)
  const [responsableCount, setResponsableCount] = useState(0);
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      const token = parsed.access || (parsed.user && parsed.user.access) || parsed.access_token;
      if (token) {
        fetch('http://127.0.0.1:8000/api/users/?role=responsable', {
          headers: { Authorization: `Bearer ${token}` }
        })
          .then(res => res.json())
          .then(data => {
            if (Array.isArray(data)) {
              setResponsableCount(data.length);
            } else if (data.results) {
              setResponsableCount(data.results.length);
            }
          })
          .catch(() => setResponsableCount(0));
      }
    }
  }, []);
  // Calcul du nombre d'entreprises récemment ajoutées (7 derniers jours)
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const recentEntreprises = entreprises.filter(e => new Date(e.date_creation) >= sevenDaysAgo);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/entreprises/")
      .then((res) => res.json())
      .then((data) => {
        setEntreprises(data);
        setFilteredEntreprises(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Filter companies based on search criteria
  useEffect(() => {
    let filtered = entreprises;

    if (searchTerm) {
      filtered = filtered.filter(e => 
        e.nom_entreprise.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.adresse.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.activite.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedSecteur) {
      filtered = filtered.filter(e => e.secteur === selectedSecteur);
    }

    if (selectedVille) {
      filtered = filtered.filter(e => e.ville === selectedVille);
    }

    if (selectedForme) {
      filtered = filtered.filter(e => e.forme_juridique === selectedForme);
    }

    if (selectedCertification) {
      filtered = filtered.filter(e => e.certifications.includes(selectedCertification));
    }

    setFilteredEntreprises(filtered);
  }, [entreprises, searchTerm, selectedSecteur, selectedVille, selectedForme, selectedCertification]);

  // Get unique values for dropdowns
  const secteurs = [...new Set(entreprises.map(e => e.secteur))];
  const villes = [...new Set(entreprises.map(e => e.ville))];
  const formes = [...new Set(entreprises.map(e => e.forme_juridique))];
  const certifications = [...new Set(entreprises.flatMap(e => e.certifications.split(', ')))];

  // Calculate city distribution for stats
  const cityStats = entreprises.reduce((acc, e) => {
    acc[e.ville] = (acc[e.ville] || 0) + 1;
    return acc;
  }, {});

  // Calculate sector distribution for stats
  const sectorStats = entreprises.reduce((acc, e) => {
    acc[e.secteur] = (acc[e.secteur] || 0) + 1;
    return acc;
  }, {});

  const totalCompanies = entreprises.length;

  // Calculate map center and bounds based on filtered companies
  const calculateMapCenter = () => {
    if (filteredEntreprises.length === 0) {
      return [31.6295, -7.9811]; // Default to Marrakech
    }
    
    const lats = filteredEntreprises.map(e => e.latitude);
    const lons = filteredEntreprises.map(e => e.longitude);
    
    // If filtering by a specific city, try to center more precisely
    if (selectedVille && filteredEntreprises.length > 0) {
      // Use the average of all companies in the selected city for better centering
      const cityCompanies = filteredEntreprises.filter(e => e.ville === selectedVille);
      if (cityCompanies.length > 0) {
        const cityLats = cityCompanies.map(e => e.latitude);
        const cityLons = cityCompanies.map(e => e.longitude);
        const centerLat = cityLats.reduce((sum, lat) => sum + lat, 0) / cityLats.length;
        const centerLon = cityLons.reduce((sum, lon) => sum + lon, 0) / cityLons.length;
        return [centerLat, centerLon];
      }
    }
    
    // Default calculation for all filtered companies
    const centerLat = (Math.min(...lats) + Math.max(...lats)) / 2;
    const centerLon = (Math.min(...lons) + Math.max(...lons)) / 2;
    
    return [centerLat, centerLon];
  };

  // Calculate appropriate zoom level based on filtered companies
  const calculateMapZoom = () => {
    if (filteredEntreprises.length === 0) return 12;
    if (filteredEntreprises.length === 1) return 16; // Zoom in more for single company
    
    // If filtering by a specific city, zoom in more for city-level focus
    if (selectedVille && filteredEntreprises.length > 0) {
      const cityCompanies = filteredEntreprises.filter(e => e.ville === selectedVille);
      if (cityCompanies.length > 0) {
        const cityLats = cityCompanies.map(e => e.latitude);
        const cityLons = cityCompanies.map(e => e.longitude);
        const cityLatDiff = Math.max(...cityLats) - Math.min(...cityLats);
        const cityLonDiff = Math.max(...cityLons) - Math.min(...cityLons);
        const cityMaxDiff = Math.max(cityLatDiff, cityLonDiff);
        
        // More aggressive zooming for city-specific filtering
        if (cityMaxDiff > 0.1) return 12; // City area
        if (cityMaxDiff > 0.05) return 14; // City center
        if (cityMaxDiff > 0.01) return 16; // Neighborhood
        return 18; // Street level
      }
    }
    
    const lats = filteredEntreprises.map(e => e.latitude);
    const lons = filteredEntreprises.map(e => e.longitude);
    
    const latDiff = Math.max(...lats) - Math.min(...lats);
    const lonDiff = Math.max(...lons) - Math.min(...lons);
    const maxDiff = Math.max(latDiff, lonDiff);
    
    // Adjust zoom based on the spread of companies - more aggressive zooming for city focus
    if (maxDiff > 2) return 6; // Very large spread - zoom out
    if (maxDiff > 1) return 8; // Large spread - zoom out
    if (maxDiff > 0.5) return 10; // Medium-large spread
    if (maxDiff > 0.1) return 12; // Medium spread
    if (maxDiff > 0.05) return 14; // Small spread - city level
    if (maxDiff > 0.01) return 16; // Very small spread - neighborhood level
    return 18; // Extremely small spread - street level
  };

  const mapCenter = calculateMapCenter();
  const mapZoom = calculateMapZoom();

  // Handle delete company
  const handleDelete = async (id, nomEntreprise) => {
    if (!window.confirm(`Êtes-vous sûr de vouloir supprimer l'entreprise "${nomEntreprise}" ?`)) {
      return;
    }

    setDeletingId(id);
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/entreprises/${id}/`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression');
      }

      // Remove from local state
      setEntreprises(prev => prev.filter(e => e.id !== id));
      setFilteredEntreprises(prev => prev.filter(e => e.id !== id));
      
      // Show success message (you can add a toast notification here)
      alert('Entreprise supprimée avec succès!');
    } catch (error) {
      console.error('Delete error:', error);
      alert('Erreur lors de la suppression de l\'entreprise');
    } finally {
      setDeletingId(null);
    }
  };

  const storedUser = localStorage.getItem('user');
  let isAdmin = false;
  let canAddEntreprise = false;
  if (storedUser) {
    try {
      const user = JSON.parse(storedUser).user;
      isAdmin = user && user.role === 'admin';
      canAddEntreprise = user && (user.role === 'admin' || user.role === 'responsable');
    } catch {}
  }

  return (
    <div className="dashboard-container">
      {/* Dashboard Stats */}
      <div className="dashboard-stats">
        {[
          { label: "Entreprises", value: entreprises.length, icon: faBuilding, color: "#8c54bc" },
          { label: "Personnes morales", value: entreprises.filter(e => e.type === 'PM').length, icon: faUserGroup, color: "#4fd1c5" },
          { label: "Nouvelles immat.", value: recentEntreprises.length, icon: faFileAlt, color: "#a78bfa" },
          ...(isAdmin ? [{ label: "Responsables", value: responsableCount, icon: faUserTie, color: "#fbbf24" }] : []),
        ].map((stat, idx) => (
          <div key={idx} className="dashboard-card">
            <div>
              <div style={{ color: "#aaa", fontSize: 14 }}>{stat.label}</div>
              <div style={{ fontWeight: 700, fontSize: 28 }}>{stat.value}</div>
            </div>
            <div className="dashboard-card-icon" style={{ background: stat.color }}>
              <FontAwesomeIcon icon={stat.icon} style={{ color: "#fff", fontSize: 22 }} />
            </div>
          </div>
        ))}
      </div>

      {/* Search/Filter Section */}
      <div className="dashboard-search">
        <h2>Recherche d'entreprises</h2>
        <div className="dashboard-search-fields">
          <input 
            className="dashboard-input" 
            placeholder="Nom de l'entreprise, adresse, activité..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select 
            className="dashboard-input"
            value={selectedSecteur}
            onChange={(e) => setSelectedSecteur(e.target.value)}
          >
            <option value="">Tous les secteurs</option>
            {secteurs.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select 
            className="dashboard-input"
            value={selectedVille}
            onChange={(e) => setSelectedVille(e.target.value)}
          >
            <option value="">Toutes les villes</option>
            {villes.map(v => <option key={v} value={v}>{v}</option>)}
          </select>
          <select 
            className="dashboard-input"
            value={selectedForme}
            onChange={(e) => setSelectedForme(e.target.value)}
          >
            <option value="">Toutes les formes</option>
            {formes.map(f => <option key={f} value={f}>{f}</option>)}
          </select>
          <select 
            className="dashboard-input"
            value={selectedCertification}
            onChange={(e) => setSelectedCertification(e.target.value)}
          >
            <option value="">Toutes les certifications</option>
            {certifications.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="dashboard-search-actions">
          <button 
            style={{ background: "#8c54bc", color: "#fff" }}
            onClick={() => {
              setSearchTerm('');
              setSelectedSecteur('');
              setSelectedVille('');
              setSelectedForme('');
              setSelectedCertification('');
              setFilteredEntreprises(entreprises);
            }}
          >
            <FontAwesomeIcon icon={faSearch} style={{ marginRight: 8 }} />
            Tout afficher
          </button>
          {canAddEntreprise && (
            <Link to="/ajouter-entreprise" style={{ textDecoration: 'none' }}>
              <button style={{ background: "#4fd1c5", color: "#fff" }}>
                <FontAwesomeIcon icon={faUserGroup} style={{ marginRight: 8 }} />
                Ajouter entreprise
              </button>
            </Link>
          )}
        </div>
        {filteredEntreprises.length !== entreprises.length && (
          <div style={{ color: '#4fd1c5', marginTop: 10 }}>
            {filteredEntreprises.length} résultat(s) trouvé(s) sur {entreprises.length} entreprises
          </div>
        )}
      </div>

      {/* Map and Quick Stats Section */}
      <div className="dashboard-map-quickstats">
        {/* Map Card */}
        <div className="dashboard-map-card">
          <h2>Localisation des entreprises</h2>
          <div style={{ height: '400px', width: '100%' }}>
            <MapContainer 
              key={`${mapCenter[0]}-${mapCenter[1]}-${mapZoom}-${filteredEntreprises.length}`}
              center={mapCenter} 
              zoom={mapZoom} 
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              {filteredEntreprises.map((entreprise) => (
                <Marker 
                  key={entreprise.id} 
                  position={[entreprise.latitude, entreprise.longitude]}
                >
                  <Popup>
                    <div style={{ minWidth: '200px' }}>
                      <h3 style={{ margin: '0 0 10px 0', color: '#8c54bc' }}>
                        {entreprise.nom_entreprise}
                      </h3>
                      <p style={{ margin: '5px 0', fontSize: '14px' }}>
                        <strong>Secteur:</strong> {entreprise.secteur}
                      </p>
                      <p style={{ margin: '5px 0', fontSize: '14px' }}>
                        <strong>Adresse:</strong> {entreprise.adresse}
                      </p>
                      <p style={{ margin: '5px 0', fontSize: '14px' }}>
                        <strong>Téléphone:</strong> {entreprise.tel}
                      </p>
                      <p style={{ margin: '5px 0', fontSize: '14px' }}>
                        <strong>Email:</strong> {entreprise.email}
                      </p>
                      <p style={{ margin: '5px 0', fontSize: '14px' }}>
                        <strong>Forme:</strong> {entreprise.forme_juridique}
                      </p>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>
        
        {/* Quick Stats Card */}
        <div className="dashboard-quickstats-card">
          <h2>Statistiques rapides</h2>
          <div>
            <h3>Répartition par ville</h3>
            {Object.entries(cityStats).map(([city, count]) => {
              const percentage = totalCompanies > 0 ? Math.round((count / totalCompanies) * 100) : 0;
              return (
                <div key={city} className="dashboard-bar">
                  <div className="dashboard-bar-labels">
                    <span>{city}</span>
                    <span>{percentage}%</span>
                  </div>
                  <div className="dashboard-bar-bg">
                    <div 
                      className="dashboard-bar-fill" 
                      style={{ 
                        width: `${percentage}%`, 
                        background: '#8c54bc' 
                      }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{ marginTop: 24 }}>
            <h3>Répartition par secteur</h3>
            {Object.entries(sectorStats).map(([secteur, count]) => {
              const percentage = totalCompanies > 0 ? Math.round((count / totalCompanies) * 100) : 0;
              return (
                <div key={secteur} className="dashboard-bar">
                  <div className="dashboard-bar-labels">
                    <span>{secteur}</span>
                    <span>{percentage}%</span>
                  </div>
                  <div className="dashboard-bar-bg">
                    <div 
                      className="dashboard-bar-fill" 
                      style={{ 
                        width: `${percentage}%`, 
                        background: '#4fd1c5' 
                      }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Company Cards Grid */}
      <div className="dashboard-cards">
        {loading ? (
          <div style={{ color: '#fff', fontSize: 18 }}>Chargement...</div>
        ) : filteredEntreprises.length === 0 ? (
          <div style={{ color: '#fff', fontSize: 18 }}>
            {entreprises.length === 0 ? 'Aucune entreprise trouvée.' : 'Aucune entreprise ne correspond à vos critères de recherche.'}
          </div>
        ) : (
          filteredEntreprises.map((e) => (
            <div key={e.id} className="dashboard-company-card">
              <div className="dashboard-company-card-header">
                <img 
                  src={`https://placehold.co/60x60?text=${encodeURIComponent(e.nom_entreprise.charAt(0))}`} 
                  alt="Logo" 
                  className="dashboard-company-card-logo" 
                />
                <div>
                  <div className="dashboard-company-card-title">{e.nom_entreprise}</div>
                  <div className="dashboard-company-card-sector">Secteur: {e.secteur}</div>
                </div>
              </div>
              <div className="dashboard-company-card-info">
                <FontAwesomeIcon icon={faMapMarkerAlt} style={{ marginRight: 5, color: '#8c54bc' }} />
                {e.adresse}
              </div>
              <div className="dashboard-company-card-info">
                <FontAwesomeIcon icon={faPhoneAlt} style={{ marginRight: 5, color: '#4fd1c5' }} />
                {e.tel || 'N/A'}
              </div>
              <div className="dashboard-company-card-info">
                <FontAwesomeIcon icon={faEnvelope} style={{ marginRight: 5, color: '#a78bfa' }} />
                {e.email}
              </div>
              <div className="dashboard-company-card-info">
                <strong>Forme:</strong> {e.forme_juridique} | <strong>Type:</strong> {e.type}
              </div>
              <div className="dashboard-company-card-actions">
                <button 
                  onClick={() => navigate(`/voir-entreprise/${e.id}`)}
                  style={{ 
                    background: "#8c54bc", 
                    color: "#fff",
                    border: "none",
                    borderRadius: "6px",
                    padding: "8px 16px",
                    cursor: "pointer",
                    fontSize: "14px"
                  }}
                >
                  Voir
                </button>
                <button 
                  onClick={() => navigate(`/modifier-entreprise/${e.id}`)}
                  style={{ 
                    background: "#4fd1c5", 
                    color: "#fff",
                    border: "none",
                    borderRadius: "6px",
                    padding: "8px 16px",
                    cursor: "pointer",
                    fontSize: "14px"
                  }}
                >
                  Modifier
                </button>
                <button 
                  onClick={() => handleDelete(e.id, e.nom_entreprise)}
                  disabled={deletingId === e.id}
                  style={{ 
                    background: deletingId === e.id ? "#6b7280" : "#e53e3e", 
                    color: "#fff",
                    border: "none",
                    borderRadius: "6px",
                    padding: "8px 16px",
                    cursor: deletingId === e.id ? "not-allowed" : "pointer",
                    fontSize: "14px",
                    opacity: deletingId === e.id ? 0.6 : 1
                  }}
                >
                  {deletingId === e.id ? 'Suppression...' : 'Supprimer'}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Home; 