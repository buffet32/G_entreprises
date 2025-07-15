import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AccountManagement = () => {
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [userId, setUserId] = useState(null);
    const [userData, setUserData] = useState({});
    const [loggedIn, setLoggedIn] = useState(true);
    const storedUser = localStorage.getItem('user');
    const user = JSON.parse(storedUser).user;
    const navigate = useNavigate();

    useEffect(() => {
        const udata = localStorage.getItem('user');
        if (!udata) {
            setLoggedIn(false);
        } else {
            const odata = JSON.parse(udata);
            setUserId(odata.user.id);
            axios.defaults.headers.common['Authorization'] = `Bearer ${odata.access_token}`;
            fetchUserData(odata.user.id);     
        }
    }, []);

    useEffect(() => {
        if (!loggedIn) {
            navigate('/signin');
        }
    }, [loggedIn, navigate]);

    const fetchUserData = (id) => {
        axios.get(`https://chahid.ma/api/auth/users/${id}`)
            .then(response => {
                setUserData(response.data);
            })
            .catch(error => {
                console.error('Error fetching user data:', error);
            });
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSaveChanges = (e) => {
        e.preventDefault();
    
        if (formData.newPassword !== formData.confirmPassword) {
            toast.error('كلمة المرور الجديدة وتأكيد كلمة المرور غير متطابقين.', {
                position: "top-center",
                autoClose: 1500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
                theme: "colored",
                rtl: true,
                transition: Slide,
            });
            return;
        }
    
        const updatedData = {
            current_password: formData.currentPassword,
            new_password: formData.newPassword,
            new_password_confirmation: formData.confirmPassword
        };
    
        axios.put(`https://chahid.ma/api/auth/users/${userId}/update-password`, updatedData)
            .then(response => {
                console.log('Password updated:', response.data);
                toast.success('تم تحديث كلمة المرور بنجاح.', {
                    position: "top-center",
                    autoClose: 1500,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                    rtl: true,
                    transition: Slide,
                });
            })
            .catch(error => {
                if (error.response) {
                    console.error('Error updating password:', error.response.data);
                    toast.error('خطأ في تحديث كلمة المرور ' , {
                        position: "top-center",
                        autoClose: 1500,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: false,
                        draggable: true,
                        progress: undefined,
                        theme: "colored",
                        rtl: true,
                        transition: Slide,
                    });
                } else {
                    console.error('Error updating password:', error.message);
                }
            });
    };
    

    const handleDeleteAccount = (e) => {
        e.preventDefault();
        if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
            axios.delete(`https://chahid.ma/api/auth/users/${userId}`)
                .then(response => {
                    console.log('Account deleted:', response.data);
                    localStorage.removeItem('user');
                    navigate('/signin');
                    toast.success('تم حذف الحساب بنجاح', {
                        position: "top-center",
                        autoClose: 1500,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: false,
                        draggable: true,
                        progress: undefined,
                        theme: "colored",
                        rtl: true,
                        transition: Slide,
                    });
                })
                .catch(error => {
                    console.error('Error deleting account:', error);
                    toast.error('خطأ في حذف الحساب.', {
                        position: "top-center",
                        autoClose: 1500,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: false,
                        draggable: true,
                        progress: undefined,
                        theme: "colored",
                        rtl: true,
                        transition: Slide,
                    });
                });
        }
    };
    

    return (
        <>
            <div className="limiter">
                <div className="container-login100">
                    <div className="wrap-login100">
                        <form className="login100-form validate-form p-l-55 p-r-55 p-t-178" onSubmit={handleSaveChanges}>
                            <span className="login100-form-title">مرحبًا <span id='g-font'>{user.username}</span></span> 
                            <center>
                                <p id='a-font' className='text-white'>حالة الحساب : <span className={`status ${userData.is_verified ? 'text-success' : 'text-danger'}`}> &bull;</span> <span>{userData.is_verified ? 'مفعل' : 'جامد'}</span></p>
                            </center>
                       
                            <label className='mb-2' id='iname'>كلمة المرور السابقة</label>
                         
                            <div className="wrap-input100 validate-input mb-2">
                                <input
                                    className="input100 placeholder-right"
                                    type="password"
                                    name="currentPassword"
                                    value={formData.currentPassword}
                                    onChange={handleChange}
                                    required
                                    dir='ltr'
                                    id='g-font'
                                />
                                <span className="focus-input100"></span>
                            </div>
                            <label className='mb-2' id='iname'>كلمة المرور</label>
                            <div className="wrap-input100 validate-input mb-2">
                                <input
                                    className="input100 placeholder-right"
                                    type="password"
                                    name="newPassword"
                                    value={formData.newPassword}
                                    onChange={handleChange}
                                    required
                                    dir='ltr'
                                    id='g-font'
                                />
                                <span className="focus-input100"></span>
                            </div>
                            <label className='mb-2' id='iname'>تأكيد كلمة المرور</label>
                            <div className="wrap-input100 validate-input mb-5">
                                <input
                                    className="input100 placeholder-right"
                                    type="password"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    required
                                    dir='ltr'
                                    id='g-font'
                                />
                                <span className="focus-input100"></span>
                            </div>
                    
                                <div className="container-login100-form-btn">
                                    <button type="submit" className="login100-form-btn">حفظ البيانات</button>
                                    <button id='a-font' type="button" onClick={handleDeleteAccount} className="login200-form-btn mt-3 mb-3">حذف الحساب</button>
                                </div>
                            
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AccountManagement;
