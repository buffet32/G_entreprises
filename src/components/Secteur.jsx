import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import "./HomeDashboard.css";

const Secteur = () => {
  const { secteur } = useParams();
  const [entreprises, setEntreprises] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/entreprises/")
      .then((res) => res.json())
      .then((data) => {
        setEntreprises(data.filter(e => e.secteur === secteur));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [secteur]);

  if (loading) {
    return <div className="dashboard-container">Chargement...</div>;
  }

  return (
    <div className="dashboard-container">
      <h2 style={{ color: "#8c54bc", marginBottom: 24 }}>Entreprises du secteur : {secteur}</h2>
      <div className="company-cards">
        {entreprises.length === 0 ? (
          <div style={{ color: '#fff', fontSize: 18 }}>Aucune entreprise trouvée pour ce secteur.</div>
        ) : (
          entreprises.map(company => (
            <div key={company.id} className="dashboard-company-card">
              <div className="dashboard-company-card-header">
                <img src={`https://placehold.co/60x60?text=${encodeURIComponent(company.nom_entreprise.charAt(0))}`} alt="Logo" className="dashboard-company-card-logo" />
                <div>
                  <div className="dashboard-company-card-title">{company.nom_entreprise}</div>
                  <div className="dashboard-company-card-sector">Secteur: {company.secteur}</div>
                </div>
              </div>
              <div className="dashboard-company-card-info">{company.ville} - {company.adresse}</div>
              <div className="dashboard-company-card-info">{company.email}</div>
              <Link to={`/voir-entreprise/${company.id}`} className="dashboard-company-card-link">Voir</Link>
            </div>
          ))
        )}
      </div>
      <button onClick={() => navigate(-1)} style={{ marginTop: 32, background: '#8c54bc', color: '#fff', border: 'none', borderRadius: 8, padding: '12px 24px', cursor: 'pointer' }}>Retour</button>
    </div>
  );
};

export default Secteur;
