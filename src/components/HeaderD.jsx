import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Slide, toast } from 'react-toastify';
import logo from "../assets/comp.png"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faBuilding, faPerson, faHeadset, faUser, faUserGear, faUserGroup, faArrowLeft, faUsersRectangle, faPhoneAlt, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { faFacebookF, faTwitter, faLinkedinIn, faYoutube } from '@fortawesome/free-brands-svg-icons';

const TOPBAR_HEIGHT = 44; // px, adjust if needed

const HeaderD = () => {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [loggedIn, setLoggedIn] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const navigate = useNavigate();
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const storedUser = localStorage.getItem('user');

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
                                <a id="a-nav-item" className="sidenav-link" href="/">
                                    <FontAwesomeIcon icon={faHouse} />
                                    <span className="mt-1 ml-2" id="nav_items">Accueil</span></a>
                            </li>
                            <li>
                                <a id="a-nav-item" onClick={handleCodeRDClick} className="sidenav-link">
                                    <FontAwesomeIcon icon={faBuilding} />
                                    <span className="mt-1 ml-2" id="nav_items-d">Entreprises</span></a>
                            </li>
                            <li>
                                <a id="a-nav-item" className="sidenav-link" href="/">
                                    <FontAwesomeIcon icon={faUsersRectangle} />
                                    <span className="mt-1 ml-2" id="nav_items">Personnes morales</span></a>
                            </li>
                            <li>
                                <a id="a-nav-item" className="sidenav-link" href="/">
                                    <FontAwesomeIcon icon={faPerson} />
                                    <span className="mt-1 ml-2" id="nav_items">Clients</span></a>
                            </li>
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
