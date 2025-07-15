import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css'
import HeaderD from './components/HeaderD';
import HeaderM from './components/HeaderM';
import HomeD from './components/HomeD';
import HomeM from './components/HomeM';
import Home from './components/Home';
import Footer from './components/Footer';
import Signin from './components/Signin'
import Signup from './components/Signup'
import AdashM from './components/AdashM';
import Profile from './components/Profile';
import AjouterEntreprise from './components/AjouterEntreprise';
import VoirEntreprise from './components/VoirEntreprise';
import ModifierEntreprise from './components/ModifierEntreprise';

function App() {

  const [isMobile, setIsMobile] = useState(window.innerWidth < 660);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 660);
    };

    window.addEventListener('resize', handleResize);

    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <Router>
      <div className="App">
        <ToastContainer />
        <HeaderM/>
        <HeaderD/>
        <div className='pages'>
          <Routes>
            <Route path='/' element={<Home />}/>
            <Route path='/AdashM' element={<AdashM />}/>
            <Route path='/Profile' element={<Profile />}/>
            <Route path='/Signup' element={<Signup />}/> 
            <Route path='/login' element={<Signin />}/> 
            <Route path='/ajouter-entreprise' element={<AjouterEntreprise />}/>
            <Route path='/voir-entreprise/:id' element={<VoirEntreprise />}/>
            <Route path='/modifier-entreprise/:id' element={<ModifierEntreprise />}/>
          </Routes>
        </div>
        <Footer/>
      </div>
    </Router>
  )
}

export default App
