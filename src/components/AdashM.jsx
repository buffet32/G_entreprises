import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/AdminDash.css';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAddressCard, faCheck, faTrash, faChevronUp, faChevronDown, faPen,faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

const AdashM = () => {
    const [users, setUsers] = useState([]);
    const [isCollapsed, setIsCollapsed] = useState({});
    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [lastPage, setLastPage] = useState(1);
    const [totalEntries, setTotalEntries] = useState(0);
    const [loggedIn, setLoggedIn] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, [search, page, perPage]);


    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const user = JSON.parse(storedUser);
            const token = user.access_token;
            const userId = user.user.id; // Ensure you have user ID here

            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            axios.get(`https://chahid.ma/api/auth/users/${userId}`) // Adjusted endpoint
                .then(response => {
                    const userProfile = response.data;
                    if (userProfile.role !== 'admin') {
                        navigate('/'); // Redirect if user is not an admin
                    } else {
                        setLoggedIn(true); // Set logged in if user is an admin
                    }
                })
                .catch(error => {
                    console.error('Error fetching user profile:', error);
                    navigate('/'); // Redirect on error
                });
        } else {
            console.error('JWT token not found');
            navigate('/'); // Redirect if token is not found
        }
    }, [navigate]);

    const fetchUsers = () => {
        axios.get('https://chahid.ma/api/auth/users', {
            params: { search, page, per_page: perPage }
        })
        .then(response => {
            setUsers(response.data.data);
            setLastPage(response.data.last_page);
            setTotalEntries(response.data.total);
        })
        .catch(error => {
            console.error('Error fetching users:', error);
        });
    };

    const updateUserStatus = (id) => {
        axios.put(`https://chahid.ma/api/auth/users/${id}/update-status`, { is_verified: true })
            .then(() => {
                setUsers(prevUsers => 
                    prevUsers.map(user => 
                        user.id === id ? { ...user, is_verified: true } : user
                    )
                );
            })
            .catch(error => {
                console.error('Error updating user status:', error);
            });
    };

    const deleteUser = (id) => {
        axios.delete(`https://chahid.ma/api/auth/users/${id}`)
            .then(() => {
                setUsers(prevUsers => prevUsers.filter(user => user.id !== id));
            })
            .catch(error => {
                console.error('Error deleting user:', error);
            });
    };

    const handleCollapseToggle = (id) => {
        setIsCollapsed(prevState => ({
            ...prevState,
            [id]: !prevState[id]
        }));
    };

    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= lastPage) {
            setPage(newPage);
        }
    };

    return (
        <div className="container mt-4">
            <h1 id='bnr'>Entreprise</h1>
            <div className="input-group mb-4">
                <form  d className="form-inline">
                    <label >Recherche<FontAwesomeIcon className='mx-2' icon={faMagnifyingGlass} /></label>
                    <input dir='ltr' type="" id="form1" className="form-control" value={search} onChange={(e) => setSearch(e.target.value)} />
                </form>
            </div>
            {users.map(user => (
                <table key={user.id} id='Ctable' className="table table-borderless bg-black">
                    <tbody>
                        <tr>
                            <td onClick={() => handleCollapseToggle(user.id)} data-toggle="collapse" data-target={`#user${user.id}`} className="toggle">
                                <div className="d-flex text-white mt-3">
                                    <FontAwesomeIcon
                                        icon={isCollapsed[user.id] ? faChevronUp : faChevronDown}
                                        className="mx-2"
                                    />
                                    <div><FontAwesomeIcon className="mx-2" icon={faAddressCard} /></div>
                                    <p className="mb-0">{user.username}</p>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td colSpan="6" className="hiddenRow">
                                <div id={`user${user.id}`} className="accordian-body collapse">
                                    <div className="p-3">
                                        <p className='text-white'>CIN: {user.cin.toUpperCase()}</p>
                                        <p className='text-white'>Telephone: {user.phone}</p>
                                        <p className='text-white'>Role: {user.role}</p>
                                        <p className='text-white'>MDP: {user.password}</p>
                                        <p className='text-white'>Status: <span className={`status ${user.is_verified ? 'text-success' : 'text-danger'}`}>&bull;</span> {user.is_verified ? 'Active' : 'Inactive'}</p>
                                        <button className="btn btn-danger btn-sm mr-2" onClick={() => deleteUser(user.id)}>
                                            <FontAwesomeIcon icon={faTrash} />
                                        </button>
                                        <button className="btn btn-info btn-sm mx-2">
                                            <FontAwesomeIcon icon={faPen} />
                                        </button>
                                        <button className="btn btn-success btn-sm mx-2" onClick={() => updateUserStatus(user.id)}>
                                            <FontAwesomeIcon icon={faCheck} />
                                        </button>

                                    </div>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            ))}

            {/* Pagination */}
            <div className="clearfix">
    <div className="hint-text">عرض <b id='g-font'>{(page - 1) * perPage + 1}</b> إلى <b id='g-font'>{Math.min(page * perPage, totalEntries)}</b> من <b id='g-font'>{totalEntries}</b> مدخلات</div>
    <ul id='pagination' className="pagination">
        <li className="page-item">
            <button id='a-font' className="page-link mx-1" onClick={() => handlePageChange(page - 1)}>السابق</button>
        </li>
        {Array.from({ length: lastPage }, (_, i) => i + 1).map(p => (
            <li key={p} className={`page-item ${page === p ? 'active' : ''}`}>
                <button className="page-link mx-1" onClick={() => handlePageChange(p)}>{p}</button>
            </li>
        ))}
        <li className="page-item">
            <button id='a-font' className="page-link mx-1" onClick={() => handlePageChange(page + 1)}>التالي</button>
        </li>
    </ul>
</div>


        </div>
    );
};

export default AdashM;
