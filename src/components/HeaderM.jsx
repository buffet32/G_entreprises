import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import { Slide, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import logo from "../assets/comp.png"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'
import { faArrowRightToBracket } from '@fortawesome/free-solid-svg-icons'
import { faUser } from '@fortawesome/free-solid-svg-icons'
import { faUserGear } from '@fortawesome/free-solid-svg-icons'
import { faUserGroup } from '@fortawesome/free-solid-svg-icons'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'


const HeaderM = () => {

    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [isAdmin, setIsAdmin] = useState(false);
    const navigate = useNavigate();
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const storedUser = localStorage.getItem('user');

    const toggleDropdown = () => {
        const dropdown = document.getElementById('dropdown-menu');
    
        if (dropdownVisible) {
            // If the dropdown is currently visible, start the slide-out animation
            dropdown.classList.add('slide-exit');
    
            // Wait for the animation duration before hiding the dropdown
            setTimeout(() => {
                setDropdownVisible(false);
                dropdown.classList.remove('slide-exit'); // Reset for next open
            }, 300); // Match this duration with your animation duration
        } else {
            setDropdownVisible(true); // Show the dropdown
            dropdown.classList.add('slide-enter2'); // Start the slide-in animation
    
            // Cleanup after animation
            setTimeout(() => {
                dropdown.classList.remove('slide-enter2'); // Reset for next close
            }, 300); // Match this duration with your animation duration
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
          const user = JSON.parse(storedUser);
          const token = user.access_token;
          const userId = user.user.id;

          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

          axios.get(`https://chahid.ma/api/auth/users/${userId}`)
              .then(response => {
                  const userProfile = response.data;
                  setIsAdmin(userProfile.role === 'admin');
              
              })

      }
  }, [navigate]);



  const handleLogout = () => {
    localStorage.removeItem("user");
   
    navigate('/');
};

    let srcimage = logo

    return windowWidth < 992 ? (
        <nav id="main-navbar" className="navbar navbar-expand-lg navbar-light fixed-top">
       
        <div className="container-fluid">

          <button id="btn" data-toggle="sidenav" data-target="#sidenav-1" className="btn btn-lg shadow-0 p-3 mr-3 d-block d-xxl-none"
            aria-controls="#sidenav-1" aria-haspopup="true" data-mdb-ripple-duration="0">
      
              <FontAwesomeIcon icon={faBars} />
          </button>
  

          <img id="logo-s" src={srcimage} alt="" draggable="false" className="img-fluid" />
          
            {storedUser ? (
              <>
                <a
                  className="nav-link dropdown-toggle hidden-arrow d-flex align-items-center"
                  id="navbarDropdownMenuLink"
                  role="button"
                  data-bs-toggle="dropdown" // Ensure MDB dropdown is triggered
                  aria-expanded={dropdownVisible}
                  onClick={toggleDropdown}
                >
                  <FontAwesomeIcon id="account"  icon={faUser} />
                </a>

                <ul
                  id="dropdown-menu"
                  className={`dropdown-menu dropdown-menu-right ${dropdownVisible ? 'slide-enter2' : 'slide-exit'}`}
                  aria-labelledby="navbarDropdownMenuLink"
                  style={{ display: dropdownVisible ? 'block' : 'none' }} // Control display for MDB compatibility
                >
                  <li>
                    <a id="sdropdown" href="/Profile" className="d-flex justify-content-start dropdown-item">
                      
                      <FontAwesomeIcon className="mr-2" id="logout-m " icon={faUserGear} />
                      Compte
                    </a>
                  </li>
                  {isAdmin ? (
                    <li>
                      <a id="sdropdown" className="d-flex justify-content-start dropdown-item" href="/AdashM">
                        
                        <FontAwesomeIcon className="mr-2" id="logout-m " icon={faUserGroup} />
                        Utilisateurs
                      </a>
                    </li>
                  ) : null}
                  <li>
                    <a id="sdropdown" className="d-flex justify-content-start dropdown-item" onClick={handleLogout}>
                      <FontAwesomeIcon className="mr-2" id="logout-m "  icon={faArrowLeft} /><span>Se déconnecter</span>
                    </a>
                  </li>
                </ul>
              </>
            ) : (
              <a href="/Login">
        
                <span id="login-btn-m" class="material-symbols-outlined">
                <FontAwesomeIcon icon={faArrowRightToBracket} />
              </span>
              </a>

            )}

        </div>

      </nav>
    ): null;
}

export default HeaderM;