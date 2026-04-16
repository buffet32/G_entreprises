import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { Slide, toast } from 'react-toastify';
import logo from "../assets/comp.png"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faBuilding, faPerson, faHeadset, faUser, faUserGear, faUserGroup, faArrowLeft, faUsersRectangle, faPhoneAlt, faEnvelope, faBrain, faCrown, faChartBar, faLightbulb } from '@fortawesome/free-solid-svg-icons';
import { faFacebookF, faTwitter, faLinkedinIn, faYoutube } from '@fortawesome/free-brands-svg-icons';

const TOPBAR_HEIGHT = 44; // px, adjust if needed

const HeaderD = () => {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [loggedIn, setLoggedIn] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isPremium, setIsPremium] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [premiumDropdownVisible, setPremiumDropdownVisible] = useState(false);
    const storedUser = localStorage.getItem('user');

    // Helper function to determine if nav item is active
    const isActive = (path) => {
        if (path === '/' && location.pathname === '/') return true;
        if (path === '/regional-dashboard' && location.pathname === '/regional-dashboard') return true;
        if (path === '/premium-dashboard' && location.pathname === '/premium-dashboard') return true;
        if (path === '/premium-access' && location.pathname === '/premium-access') return true;
        if (path === '/ai-features' && location.pathname.startsWith('/ai-features')) return true;
        if (path === '/ai-interpretation' && location.pathname.startsWith('/ai-interpretation')) return true;
        return false;
    };

    const toggleDropdown = () => {
        const dropdown = document.getElementById('dropdown-menu');
    
        if (dropdownVisible) {
            dropdown.classList.add('slide-exit2');
            setTimeout(() => {
                setDropdownVisible(false);
                dropdown.classList.remove('slide-exit2');
            }, 300);
        } else {
            setDropdownVisible(true);
            dropdown.classList.add('slide-enter');
            setTimeout(() => {
                dropdown.classList.remove('slide-enter');
            }, 300);
        }
    };

    const togglePremiumDropdown = () => {
        const dropdown = document.getElementById('premium-dropdown-menu');
    
        if (premiumDropdownVisible) {
            dropdown.classList.add('slide-exit2');
            setTimeout(() => {
                setPremiumDropdownVisible(false);
                dropdown.classList.remove('slide-exit2');
            }, 300);
        } else {
            setPremiumDropdownVisible(true);
            dropdown.classList.add('slide-enter');
            setTimeout(() => {
                dropdown.classList.remove('slide-enter');
            }, 300);
        }
    };

    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                const user = JSON.parse(storedUser).user;
                setIsAdmin(user && user.role === 'admin');
                setIsPremium(user && (user.is_premium || user.subscription_type === 'premium'));
                setLoggedIn(true);
            } catch {}
        }
    }, []);


    const handleCodeRDClick = (e) => {
        e.preventDefault();
        const storedUser = localStorage.getItem('user');
      
        if (storedUser) {
            const user = JSON.parse(storedUser).user;
            
            if (!user.is_verified) {
                toast.error('Veuillez activer votre compte pour accéder à cette page', {
                    position: "top-center",
                    autoClose: 1500,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                    rtl: false,
                    transition: Slide,
                });
             
            } else {
                navigate('/Coderoute');
            
            }
        } else {
            toast.error('Vous devez vous connecter pour accéder à cette page', {
                position: "top-center",
                autoClose: 1500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
                theme: "colored",
                rtl: false,
                transition: Slide,
            });
  
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("user");
      
        navigate('/');
    };

    const handlePremiumClick = () => {
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

    let srcimage = logo;

    return windowWidth > 992 ? (
        <header>
            {/* Top Info Bar */}

            <nav id="main-navbar" className="navbar navbar-expand-lg navbar-light fixed-top" >
              <img id="logo-d" src={srcimage} alt="" draggable="false" className="img-fluid" />
                <div className="container-fluid justify-content-center">
                    <center>
                        <ul id="links" className="navbar-nav ml-auto d-flex flex-row">
                        <li className="nav-item dropdown">
                                <a id="a-nav-item" className={`sidenav-link ${isActive('/') ? 'active' : ''}`} href="/">
                                    <FontAwesomeIcon icon={faHouse} />
                                    <span className="mt-1 ml-2" id="nav_items">Accueil</span></a>
                            </li>
                                                        <li>
                                <a id="a-nav-item" href="/regional-dashboard" className={`sidenav-link ${isActive('/regional-dashboard') ? 'active' : ''}`}>
                                    <FontAwesomeIcon icon={faChartBar} />
                                    <span className="mt-1 ml-2" id="nav_items">Régions</span></a>
                            </li>
                            <li className="nav-item dropdown">
                                <a id="a-nav-item" className="sidenav-link dropdown-toggle" 
                                   onClick={togglePremiumDropdown}
                                   aria-expanded={premiumDropdownVisible}>
                                    <FontAwesomeIcon icon={faCrown} />
                                    <span className="mt-1 ml-2" id="nav_items">Premium</span></a>
                                <ul
                                    id="premium-dropdown-menu"
                                    className={`dropdown-menu dropdown-menu-right ${premiumDropdownVisible ? 'slide-enter' : 'slide-exit2'}`}
                                    aria-labelledby="premiumDropdown"
                                    style={{ display: premiumDropdownVisible ? 'block' : 'none' }}
                                >
                                    <li>
                                        <a id="sdropdown" onClick={handlePremiumClick} className="d-flex justify-content-start dropdown-item">
                                            <FontAwesomeIcon className="mr-2" icon={faBrain} />
                                            Accès Premium
                                        </a>
                                    </li>
                                    <li>
                                        <a id="sdropdown" href="/ai-features?tab=activity" className="d-flex justify-content-start dropdown-item">
                                            <FontAwesomeIcon className="mr-2" icon={faBrain} />
                                            Interprétation IA
                                        </a>
                                    </li>
                                    <li>
                                        <a id="sdropdown" href="/ai-interpretation?tab=market" className="d-flex justify-content-start dropdown-item">
                                            <FontAwesomeIcon className="mr-2" icon={faLightbulb} />
                                            Insights
                                        </a>
                                    </li>
                                </ul>
                            </li>
                            {isPremium && (
                                <li>
                                    <a id="a-nav-item" href="/premium-dashboard" className="sidenav-link">
                                        <FontAwesomeIcon icon={faBrain} />
                                        <span className="mt-1 ml-2" id="nav_items">IA Premium</span></a>
                                </li>
                            )}
                                                                                    <li className="nav-item dropdown">
                                <a id="a-nav-item" className="sidenav-link" href="#about">
                                    <FontAwesomeIcon icon={faHeadset} />
                                    <span className="mt-1 ml-2" id="nav_items">Contactez-nous</span></a>
                            </li>



                        </ul>
                    </center>
                </div>

                {storedUser ? (
                    <>
                        <a
                            className="nav-link dropdown-toggle hidden-arrow d-flex align-items-center"
                            id="navbarDropdownMenuLink"
                            role="button"
                            data-bs-toggle="dropdown"
                            aria-expanded={dropdownVisible}
                            onClick={toggleDropdown}
                        >
                            <FontAwesomeIcon id="account" icon={faUser} />
                        </a>

                        <ul
                            id="dropdown-menu"
                            className={`dropdown-menu dropdown-menu-right ${dropdownVisible ? 'slide-enter' : 'slide-exit2'}`}
                            aria-labelledby="navbarDropdownMenuLink"
                            style={{ display: dropdownVisible ? 'block' : 'none' }}
                        >
                            <li>
                                <a id="sdropdown" href="/Profile" className="d-flex justify-content-start dropdown-item">
                                    
                                    <FontAwesomeIcon className="mr-2" id="logout-m " icon={faUserGear} />
                                    Compte
                                </a>
                            </li>
                            {isPremium && (
                                <li>
                                    <a id="sdropdown" href="/premium-dashboard" className="d-flex justify-content-start dropdown-item">
                                        
                                        <FontAwesomeIcon className="mr-2" id="logout-m " icon={faCrown} />
                                        IA Premium
                                    </a>
                                </li>
                            )}
                            {isAdmin && (
                                <>
                                    <li>
                                        <a id="sdropdown" className="d-flex justify-content-start dropdown-item" href="/AdashM">
                                            
                                            <FontAwesomeIcon className="mr-2" id="logout-m " icon={faUserGroup} />
                                            Utilisateurs
                                        </a>
                                    </li>
                                </>
                            )}
                            <li>
                                <a id="sdropdown" className="d-flex justify-content-start dropdown-item" onClick={handleLogout}>
                                    <FontAwesomeIcon className="mr-2" id="logout-m " icon={faArrowLeft} /><span>Se déconnecter</span>
                                </a>
                            </li>
                        </ul>
                    </>
                ) : (
                    <a href="/Login">
                        <button id="login-btn-d" className="btn btn">Connexion</button>
                    </a>
                )}
            </nav>
        </header>
    ) : null;
}

export default HeaderD;
