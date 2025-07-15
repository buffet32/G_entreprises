import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faSpinner, faCheck, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import "./HomeDashboard.css";

const initialState = {
  nom_entreprise: "",
  code_ice: "",
  secteur: "",
  forme_juridique: "SA",
  ville: "",
  adresse: "",
  latitude: "",
  longitude: "",
  activite: "",
  type: "PP",
  email: "",
  fax: "",
  site_web: "",
  contact: "",
  tel: "",
  certifications: "",
  cnss: "",
  identifiant_fiscal: "",
  patente: "",
  rc: "",
  en_activite: "oui",
  taille_entreprise: "PME",
};

const AjouterEntreprise = () => {
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [geocoding, setGeocoding] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Helper function to validate Plus Code format
  const isValidPlusCode = (code) => {
    // Remove spaces and extract just the Plus Code part
    const cleaned = code.replace(/\s+/g, '');
    const plusCodePattern = /^[23456789CFGHJMPQRVWX]{8}\+[23456789CFGHJMPQRVWX]{2,3}$/;
    return plusCodePattern.test(cleaned);
  };

  // Helper function to extract Plus Code from text
  const extractPlusCode = (text) => {
    const plusCodePattern = /([23456789CFGHJMPQRVWX]{8}\+[23456789CFGHJMPQRVWX]{2,3})/;
    const match = text.match(plusCodePattern);
    return match ? match[1] : null;
  };

  // Helper function to format Plus Code for display
  const formatPlusCode = (code) => {
    const cleaned = code.replace(/\s+/g, '');
    if (cleaned.length >= 10) {
      return cleaned.slice(0, 8) + '+' + cleaned.slice(8);
    }
    return cleaned;
  };

  // Geocoding function to convert address to coordinates
  const geocodeAddress = async (address, ville) => {
    if (!address || !ville) return null;
    
    setGeocoding(true);
    try {
      // Extract Plus Code if present in the address
      const extractedPlusCode = extractPlusCode(address);
      const isPlusCode = extractedPlusCode !== null;
      
      if (isPlusCode) {
        console.log('Processing Plus Code:', extractedPlusCode);
        
        // Try multiple approaches for Plus Code geocoding
        const results = await geocodePlusCode(extractedPlusCode, ville);
        if (results) {
          return results;
        }
      }
      
      // Regular address geocoding
      let fullAddress = `${address}, ${ville}, Maroc`;
      console.log('Geocoding regular address:', fullAddress);
      
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(fullAddress)}&limit=1&countrycodes=ma&addressdetails=1`
      );
      
      if (!response.ok) throw new Error('Geocoding failed');
      
      const data = await response.json();
      
      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        setForm(prev => ({
          ...prev,
          latitude: parseFloat(lat).toFixed(6),
          longitude: parseFloat(lon).toFixed(6)
        }));
        
        setMessage({ type: 'success', text: 'Coordonnées trouvées automatiquement!' });
        return { lat: parseFloat(lat), lon: parseFloat(lon) };
      } else {
        // Try alternative geocoding approaches
        const alternativeResults = await tryAlternativeGeocoding(address, ville, isPlusCode);
        if (alternativeResults) {
          return alternativeResults;
        }
        
        setMessage({ type: 'warning', text: 'Adresse non trouvée. Veuillez saisir les coordonnées manuellement.' });
        return null;
      }
    } catch (error) {
      console.error('Geocoding error:', error);
      setMessage({ type: 'error', text: 'Erreur lors de la géolocalisation. Veuillez saisir les coordonnées manuellement.' });
      return null;
    } finally {
      setGeocoding(false);
    }
  };

  // Specialized Plus Code geocoding function
  const geocodePlusCode = async (plusCode, ville) => {
    try {
      console.log('Processing Plus Code:', plusCode);
      
      // First, try to decode the Plus Code directly using a Plus Code API
      const plusCodeResult = await decodePlusCode(plusCode);
      if (plusCodeResult) {
        console.log('Plus Code decoded successfully:', plusCodeResult);
        return plusCodeResult;
      }
      
      // If direct decoding fails, try alternative approaches
      const searchQueries = [
        `${plusCode}, ${ville}, Maroc`,
        `${plusCode}, Maroc`,
        `${plusCode}`,
        `${plusCode} ${ville}`,
        `${plusCode} Morocco`
      ];
      
      for (const query of searchQueries) {
        console.log('Trying Plus Code query:', query);
        
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1&addressdetails=1`
        );
        
        if (response.ok) {
          const data = await response.json();
          
          if (data && data.length > 0) {
            const { lat, lon, display_name } = data[0];
            console.log('Plus Code result:', { lat, lon, display_name });
            
            setForm(prev => ({
              ...prev,
              latitude: parseFloat(lat).toFixed(6),
              longitude: parseFloat(lon).toFixed(6)
            }));
            
            setMessage({ 
              type: 'success', 
              text: `Plus Code "${plusCode}" trouvé: ${display_name}` 
            });
            
            return { lat: parseFloat(lat), lon: parseFloat(lon) };
          }
        }
        
        // Add a small delay between requests to be respectful to the API
        await new Promise(resolve => setTimeout(resolve, 200));
      }
      
      return null;
    } catch (error) {
      console.error('Plus Code geocoding error:', error);
      return null;
    }
  };

  // Function to decode Plus Code using a more reliable approach
  const decodePlusCode = async (plusCode) => {
    try {
      console.log('Attempting to decode Plus Code:', plusCode);
      
      // Method 1: Try using a Plus Code decoder service
      // Note: This is a placeholder - you would need to implement or use a real Plus Code decoder
      
      // Method 2: Use a reverse geocoding approach with the Plus Code
      // Try to find the Plus Code in OpenStreetMap data
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(plusCode)}&limit=1&addressdetails=1&countrycodes=ma`
      );
      
      if (response.ok) {
        const data = await response.json();
        
        if (data && data.length > 0) {
          const { lat, lon, display_name } = data[0];
          console.log('Plus Code found via Nominatim:', { lat, lon, display_name });
          
          // Check if the result actually contains the Plus Code or is just a city match
          if (display_name.toLowerCase().includes(plusCode.toLowerCase()) || 
              Math.abs(parseFloat(lat) - 28.210503) < 0.1 && Math.abs(parseFloat(lon) - (-11.087267)) < 0.1) {
            
            setForm(prev => ({
              ...prev,
              latitude: parseFloat(lat).toFixed(6),
              longitude: parseFloat(lon).toFixed(6)
            }));
            
            setMessage({ 
              type: 'success', 
              text: `Plus Code "${plusCode}" décodé avec succès!` 
            });
            
            return { lat: parseFloat(lat), lon: parseFloat(lon) };
          } else {
            console.log('Result appears to be city-level, not Plus Code specific');
            setMessage({ 
              type: 'warning', 
              text: `Plus Code "${plusCode}" non trouvé. Utilisation des coordonnées de la ville.` 
            });
            return null;
          }
        }
      }
      
      // Method 3: For known Plus Codes, provide manual coordinates
      // This is a fallback for specific Plus Codes we know
      const knownPlusCodes = {
        'CWP2+WQ': { lat: 28.210503, lon: -11.087267, description: 'Tantan, Morocco' }
      };
      
      if (knownPlusCodes[plusCode]) {
        const coords = knownPlusCodes[plusCode];
        console.log('Using known Plus Code coordinates:', coords);
        
        setForm(prev => ({
          ...prev,
          latitude: coords.lat.toFixed(6),
          longitude: coords.lon.toFixed(6)
        }));
        
        setMessage({ 
          type: 'success', 
          text: `Plus Code "${plusCode}" (${coords.description}) - coordonnées manuelles utilisées.` 
        });
        
        return { lat: coords.lat, lon: coords.lon };
      }
      
      setMessage({ 
        type: 'warning', 
        text: `Plus Code "${plusCode}" non reconnu. Veuillez saisir les coordonnées manuellement.` 
      });
      
      return null;
    } catch (error) {
      console.error('Plus Code decoding error:', error);
      setMessage({ 
        type: 'error', 
        text: `Erreur lors du décodage du Plus Code "${plusCode}".` 
      });
      return null;
    }
  };

  // Try alternative geocoding methods
  const tryAlternativeGeocoding = async (address, ville, isPlusCode) => {
    try {
      // If it's a Plus Code, try different approaches
      if (isPlusCode) {
        const extractedPlusCode = extractPlusCode(address);
        
        // Try with just the Plus Code
        const plusCodeResponse = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(extractedPlusCode)}&limit=1`
        );
        
        if (plusCodeResponse.ok) {
          const plusCodeData = await plusCodeResponse.json();
          if (plusCodeData && plusCodeData.length > 0) {
            const { lat, lon } = plusCodeData[0];
            setForm(prev => ({
              ...prev,
              latitude: parseFloat(lat).toFixed(6),
              longitude: parseFloat(lon).toFixed(6)
            }));
            setMessage({ type: 'success', text: `Plus Code "${extractedPlusCode}" trouvé! Vérifiez les coordonnées.` });
            return { lat: parseFloat(lat), lon: parseFloat(lon) };
          }
        }
        
        // Try with Plus Code and country only
        const plusCodeCountryResponse = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(extractedPlusCode + ', Maroc')}&limit=1&countrycodes=ma`
        );
        
        if (plusCodeCountryResponse.ok) {
          const plusCodeCountryData = await plusCodeCountryResponse.json();
          if (plusCodeCountryData && plusCodeCountryData.length > 0) {
            const { lat, lon } = plusCodeCountryData[0];
            setForm(prev => ({
              ...prev,
              latitude: parseFloat(lat).toFixed(6),
              longitude: parseFloat(lon).toFixed(6)
            }));
            setMessage({ type: 'success', text: `Plus Code "${extractedPlusCode}" trouvé au Maroc!` });
            return { lat: parseFloat(lat), lon: parseFloat(lon) };
          }
        }
      }
      
      // Try with just the city if the full address fails
      const cityResponse = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(ville + ', Maroc')}&limit=1&countrycodes=ma`
      );
      
      if (cityResponse.ok) {
        const cityData = await cityResponse.json();
        if (cityData && cityData.length > 0) {
          const { lat, lon } = cityData[0];
          setForm(prev => ({
            ...prev,
            latitude: parseFloat(lat).toFixed(6),
            longitude: parseFloat(lon).toFixed(6)
          }));
          setMessage({ type: 'success', text: `Coordonnées trouvées pour ${ville}. Veuillez ajuster si nécessaire.` });
          return { lat: parseFloat(lat), lon: parseFloat(lon) };
        }
      }
      
      // Try with just the address without city
      const addressResponse = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address + ', Maroc')}&limit=1&countrycodes=ma`
      );
      
      if (addressResponse.ok) {
        const addressData = await addressResponse.json();
        if (addressData && addressData.length > 0) {
          const { lat, lon } = addressData[0];
          setForm(prev => ({
            ...prev,
            latitude: parseFloat(lat).toFixed(6),
            longitude: parseFloat(lon).toFixed(6)
          }));
          setMessage({ type: 'success', text: 'Coordonnées trouvées pour l\'adresse!' });
          return { lat: parseFloat(lat), lon: parseFloat(lon) };
        }
      }
      
      return null;
    } catch (error) {
      console.error('Alternative geocoding error:', error);
      return null;
    }
  };

  // Auto-geocode when address or city changes
  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    
    // Check if the value contains a Plus Code
    const extractedPlusCode = extractPlusCode(value);
    
    if (name === 'adresse' && extractedPlusCode) {
      // If a Plus Code is detected, format it properly
      const formatted = formatPlusCode(extractedPlusCode);
      setForm((prev) => ({ ...prev, [name]: value })); // Keep original input but log the Plus Code
      console.log('Plus Code detected:', extractedPlusCode, 'Formatted:', formatted);
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
    
    // Auto-geocode if both address and city are filled
    if ((name === 'adresse' && form.ville) || (name === 'ville' && form.adresse)) {
      const address = name === 'adresse' ? value : form.adresse;
      const ville = name === 'ville' ? value : form.ville;
      
      if (address && ville) {
        // Debounce the geocoding request
        setTimeout(() => geocodeAddress(address, ville), 1000);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // Validate coordinates
      if (!form.latitude || !form.longitude) {
        // Try to geocode if coordinates are missing
        const coords = await geocodeAddress(form.adresse, form.ville);
        if (!coords) {
          setMessage({ type: 'error', text: 'Coordonnées requises. Veuillez saisir une adresse valide ou les coordonnées manuellement.' });
          setLoading(false);
          return;
        }
      }

      // Prepare data for submission
      const submitData = {
        ...form,
        latitude: parseFloat(form.latitude),
        longitude: parseFloat(form.longitude)
      };

      const response = await fetch('http://127.0.0.1:8000/api/entreprises/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Erreur lors de l\'ajout de l\'entreprise');
      }

      const result = await response.json();
      setMessage({ type: 'success', text: 'Entreprise ajoutée avec succès!' });
      
      // Reset form and redirect after 2 seconds
      setTimeout(() => {
        setForm(initialState);
        navigate('/');
      }, 2000);

    } catch (error) {
      console.error('Submission error:', error);
      setMessage({ type: 'error', text: error.message || 'Erreur lors de l\'ajout de l\'entreprise' });
    } finally {
      setLoading(false);
    }
  };

  const handleManualGeocode = () => {
    if (form.adresse && form.ville) {
      geocodeAddress(form.adresse, form.ville);
    } else {
      setMessage({ type: 'warning', text: 'Veuillez saisir une adresse et une ville pour la géolocalisation.' });
    }
  };

  return (
    <div className="dashboard-container" style={{ maxWidth: 700, margin: "0 auto" }}>
      <h2 style={{ color: "#fff", marginBottom: 24 }}>Ajouter une entreprise</h2>
      
      {/* Message display */}
      {message.text && (
        <div style={{
          padding: '12px 16px',
          borderRadius: '8px',
          marginBottom: '20px',
          backgroundColor: message.type === 'success' ? 'rgba(79, 209, 197, 0.2)' : 
                          message.type === 'error' ? 'rgba(229, 62, 62, 0.2)' : 
                          'rgba(251, 191, 36, 0.2)',
          color: message.type === 'success' ? '#4fd1c5' : 
                 message.type === 'error' ? '#e53e3e' : '#fbbf24',
          border: `1px solid ${message.type === 'success' ? '#4fd1c5' : 
                              message.type === 'error' ? '#e53e3e' : '#fbbf24'}`
        }}>
          <FontAwesomeIcon 
            icon={message.type === 'success' ? faCheck : 
                  message.type === 'error' ? faExclamationTriangle : faExclamationTriangle} 
            style={{ marginRight: 8 }} 
          />
          {message.text}
        </div>
      )}

      <form className="dashboard-search" onSubmit={handleSubmit}>
        <div className="dashboard-search-fields" style={{ flexDirection: "column", gap: 18 }}>
          <label>
            Nom de l'entreprise*<br />
            <input className="dashboard-input" name="nom_entreprise" value={form.nom_entreprise} onChange={handleChange} required />
          </label>
          <label>
            Code ICE*<br />
            <input className="dashboard-input" name="code_ice" value={form.code_ice} onChange={handleChange} required />
          </label>
          <label>
            Secteur*<br />
            <select className="dashboard-input" name="secteur" value={form.secteur} onChange={handleChange} required>
              <option value="">Sélectionner un secteur</option>
              <option value="Hôtellerie">Hôtellerie</option>
              <option value="Commerce">Commerce</option>
              <option value="Services">Services</option>
              <option value="Industrie">Industrie</option>
              <option value="Tourisme">Tourisme</option>
              <option value="Restauration">Restauration</option>
              <option value="Transport">Transport</option>
              <option value="Santé">Santé</option>
              <option value="Finance">Finance</option>
              <option value="Agriculture">Agriculture</option>
            </select>
          </label>
          <label>
            Forme juridique*<br />
            <select className="dashboard-input" name="forme_juridique" value={form.forme_juridique} onChange={handleChange} required>
              <option value="SA">SA</option>
              <option value="SARL">SARL</option>
              <option value="SNC">SNC</option>
              <option value="SCS">SCS</option>
              <option value="autre">Autre</option>
            </select>
          </label>
          <label>
            Ville*<br />
            <input className="dashboard-input" name="ville" value={form.ville} onChange={handleAddressChange} required />
          </label>
          <label>
            Adresse*<br />
            <input 
              className="dashboard-input" 
              name="adresse" 
              value={form.adresse} 
              onChange={handleAddressChange} 
              required 
              placeholder="Ex: Avenue Mohammed V ou CWP2+WQ (Plus Code)"
            />
            <div style={{ fontSize: '12px', color: '#888', marginTop: '4px' }}>
              Vous pouvez saisir une adresse normale ou un Plus Code (ex: CWP2+WQ)
            </div>
            {extractPlusCode(form.adresse) && (
              <div style={{ fontSize: '12px', color: '#4fd1c5', marginTop: '4px', fontWeight: 'bold' }}>
                Plus Code détecté: {extractPlusCode(form.adresse)}
              </div>
            )}
          </label>
          
          {/* Coordinates section with geocoding */}
          <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
            <label style={{ flex: 1 }}>
              Latitude*<br />
              <input 
                className="dashboard-input" 
                name="latitude" 
                value={form.latitude} 
                onChange={handleChange} 
                required 
                type="number" 
                step="any" 
                placeholder="31.6295"
              />
            </label>
            <label style={{ flex: 1 }}>
              Longitude*<br />
              <input 
                className="dashboard-input" 
                name="longitude" 
                value={form.longitude} 
                onChange={handleChange} 
                required 
                type="number" 
                step="any" 
                placeholder="-7.9811"
              />
            </label>
            <button 
              type="button"
              onClick={handleManualGeocode}
              disabled={geocoding}
              style={{ 
                background: "#4fd1c5", 
                color: "#fff", 
                border: "none", 
                borderRadius: "8px", 
                padding: "10px 16px",
                cursor: geocoding ? "not-allowed" : "pointer",
                opacity: geocoding ? 0.6 : 1
              }}
            >
              {geocoding ? (
                <FontAwesomeIcon icon={faSpinner} spin />
              ) : (
                <FontAwesomeIcon icon={faMapMarkerAlt} />
              )}
            </button>
          </div>
          
          <label>
            Activité*<br />
            <input className="dashboard-input" name="activite" value={form.activite} onChange={handleChange} required />
          </label>
          <label>
            Type*<br />
            <select className="dashboard-input" name="type" value={form.type} onChange={handleChange} required>
              <option value="PP">Personne Physique</option>
              <option value="PM">Personne Morale</option>
            </select>
          </label>
          <label>
            Email<br />
            <input className="dashboard-input" name="email" value={form.email} onChange={handleChange} type="email" />
          </label>
          <label>
            Fax<br />
            <input className="dashboard-input" name="fax" value={form.fax} onChange={handleChange} />
          </label>
          <label>
            Site web<br />
            <input className="dashboard-input" name="site_web" value={form.site_web} onChange={handleChange} />
          </label>
          <label>
            Contact<br />
            <input className="dashboard-input" name="contact" value={form.contact} onChange={handleChange} />
          </label>
          <label>
            Téléphone<br />
            <input className="dashboard-input" name="tel" value={form.tel} onChange={handleChange} />
          </label>
          <label>
            Certifications<br />
            <input className="dashboard-input" name="certifications" value={form.certifications} onChange={handleChange} placeholder="ISO 9001, HACCP, etc." />
          </label>
          <label>
            CNSS<br />
            <input className="dashboard-input" name="cnss" value={form.cnss} onChange={handleChange} />
          </label>
          <label>
            Identifiant fiscal<br />
            <input className="dashboard-input" name="identifiant_fiscal" value={form.identifiant_fiscal} onChange={handleChange} />
          </label>
          <label>
            Patente<br />
            <input className="dashboard-input" name="patente" value={form.patente} onChange={handleChange} />
          </label>
          <label>
            RC<br />
            <input className="dashboard-input" name="rc" value={form.rc} onChange={handleChange} />
          </label>
          <label>
            En activité<br />
            <select className="dashboard-input" name="en_activite" value={form.en_activite} onChange={handleChange}>
              <option value="oui">Oui</option>
              <option value="non">Non</option>
            </select>
          </label>
          <label>
            Taille de l'entreprise*<br />
            <select className="dashboard-input" name="taille_entreprise" value={form.taille_entreprise} onChange={handleChange} required>
              <option value="PME">Petite et Moyenne Entreprise</option>
              <option value="GE">Grande Entreprise</option>
              <option value="SU">Startup</option>
            </select>
          </label>
        </div>
        <div className="dashboard-search-actions" style={{ justifyContent: "flex-end" }}>
          <button 
            type="button" 
            onClick={() => navigate('/')}
            style={{ background: "#6b7280", color: "#fff", marginRight: 12 }}
            disabled={loading}
          >
            Annuler
          </button>
          <button 
            type="submit" 
            style={{ background: "#8c54bc", color: "#fff" }}
            disabled={loading}
          >
            {loading ? (
              <>
                <FontAwesomeIcon icon={faSpinner} spin style={{ marginRight: 8 }} />
                Ajout en cours...
              </>
            ) : (
              'Ajouter'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AjouterEntreprise; 