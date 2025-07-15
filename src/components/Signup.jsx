import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { Slide, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Signup = () => {
    const [formData, setFormData] = useState({
        username: '',
        phone: '',
        password: '',
        password_confirmation: '',
        cin: '',

    });
    const navigate = useNavigate();

    const onChangeInput = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        const { username, phone, password, password_confirmation, cin } = formData;

        if (!username || !phone || !password || !password_confirmation || !cin) {
            toast.error('Veuillez remplir toutes les informations !', {
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
            return; // Stop submission if any field is empty
        }
        try {
            const res = await axios.post('https://chahid.ma/api/auth/register', formData);
            console.log(res.data.message);
            if (res.data.message === "User successfully registered") {
                navigate('/');
                toast.success('Inscription réussie !',
                     {
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
        } catch (error) {
            if (error.response && error.response.data) {
                let errorObject;
                if (typeof error.response.data === 'string') {
                    try {
                        errorObject = JSON.parse(error.response.data);
                    } catch (e) {
                        
                        alert("An error occurred. Please try again later."); // Fallback error message
                        return;
                    }
                } else {
                    errorObject = error.response.data;
                    console.log(errorObject)
                }   

                 if (errorObject.hasOwnProperty("cin")) {
                    toast.error(<li>Cette carte d'identité nationale a déjà été utilisée !</li>, {
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

                } if (errorObject.hasOwnProperty("username")) {
                    toast.error(<li style={{ fontSize:'15px' }}>Ce nom d'utilisateur a déjà été utilisé !</li>, {
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

                } if (errorObject.hasOwnProperty("password")) {
                    toast.error(<li >Le mot de passe doit contenir au moins 6 caractères !</li>, {
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

                }if (errorObject.hasOwnProperty("password")) {
                    if (errorObject.password.includes("The password confirmation does not match.")) {
                        toast.error('La confirmation du mot de passe ne correspond pas !', {
                            position: "top-center",
                            autoClose: 1000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: false,
                            draggable: true,
                            progress: undefined,
                            theme: "colored",
                            rtl: false,
                            transition: Slide,
                        });
                       
                    }}
            } else {
                alert("An error occurred. Please try again later."); // Fallback error message
            }
        }
    };
    
    

    return (
        <div className="limiter">
            <div className="container-login100">
                <div className="wrap-login100">
                    <form className="login100-form validate-form p-l-55 p-r-55 p-t-178" onSubmit={onSubmit}>
                        <span className="login100-form-title">S'inscrire</span>
                        <label className='my-2' id='iname' >Utilisateur</label>
                        <div className="wrap-input100 validate-input m-b-16">
                            <input
                                className="input100 placeholder-right"
                                type="text"
                                dir='ltr'
                                onChange={onChangeInput}
                                name="username"
                                value={formData.username}
                                id='g-font'
                            />
                            <span className="focus-input100"></span>
                        </div>
                        <label className='my-2' id='iname' >Numéro de téléphone</label>
                        
                        <div className="wrap-input100 validate-input m-b-16">
                            <input
                                className="input100 placeholder-right"
                                type="number"
                                dir='ltr'
                                onChange={onChangeInput}
                                name="phone"
                                value={formData.phone}
                                id='g-font'
                            />
                            <span className="focus-input100"></span>
                        </div>
                        <label className='my-2' id='iname' >Mot de passe</label>
                        <div className="wrap-input100 validate-input m-b-16">
                            <input
                                className="input100 placeholder-right"
                                type="password"
                                dir='ltr'
                                onChange={onChangeInput}
                                name="password"
                                value={formData.password}
                                id='g-font'
                            />
                            <span className="focus-input100"></span>
                        </div>
                        
                        <label className='my-2' id='iname' >Confirmer le mot de passe</label>
                        <div className="wrap-input100 validate-input m-b-16">
                            <input
                                className="input100 placeholder-right"
                                type="password"
                                dir='ltr'
                                onChange={onChangeInput}
                                name="password_confirmation"
                                value={formData.password_confirmation}
                                id='g-font'
                            />
                            <span className="focus-input100"></span>
                        </div>
                        <label className='my-2' id='iname' >Numéro de carte</label>
                        <div className="wrap-input100 validate-input m-b-16">
                            <input
                                className="input100 placeholder-right"
                                type="text"
                                dir='ltr'
                                onChange={onChangeInput}
                                name="cin"
                                value={formData.cin}
                                id='g-font'
                            />
                            <span className="focus-input100"></span>
                        </div>
                        <br/>
                        

                        
<br/>
                        <div className="container-login100-form-btn">
                            <button type="submit" className="login100-form-btn">Continuer</button>
                        </div>

                        <div className="flex-col-c p-t-170 p-b-40">
                            <span className="txt1 p-b-9">Vous avez déjà un compte ?</span>
                            <Link to="/Login" className='header-link'><p id='a-font' className="txt3">Connexion</p></Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Signup;
