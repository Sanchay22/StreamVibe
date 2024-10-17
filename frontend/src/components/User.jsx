import React, { useEffect, useState, useRef } from 'react';
import * as apiClient from "../apiClient";
import { useAppContext } from '../contexts/AppContext'; // Adjust the import path as needed
import { Link, useNavigate } from 'react-router-dom'; // Import Link for navigation

const User = () => {
    const { isLoggedIn} = useAppContext(); // Access isLoggedIn and logout functionality
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [dropdownOpen, setDropdownOpen] = useState(false); // State to control dropdown visibility
    const dropdownRef = useRef(null); // Reference to detect clicks outside of dropdown
    const navigate = useNavigate(); // For navigating to other routes

    // Function to toggle the dropdown menu
    const toggleDropdown = () => {
        setDropdownOpen(prevState => !prevState);
    };

    // Handle outside click to close the dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false); // Close dropdown if clicked outside
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Fetch the user data if logged in
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const user = await apiClient.getUser();
                setUserData(user);
            } catch (err) {
                if (isLoggedIn) {
                    setError(err.message);
                }
            } finally {
                setLoading(false);
            }
        };

        if (isLoggedIn) {
            fetchUser();
        } else {
            setLoading(false);
        }
    }, [isLoggedIn]);

    // Handle logout logic
    const handleLogout = async () => {
        // Logic for logging out the user
        await apiClient.logout(); // Assuming logout API call is available
        // setIsLoggedIn(false); // Update the context state to reflect the logout
        navigate('/'); // Redirect to the home page after logging out
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="flex items-center space-x-3 relative" ref={dropdownRef}>
            {isLoggedIn ? (
                userData ? (
                    <>
                        {/* Avatar Image */}
                        <img 
                            src={userData.user.avatar} 
                            alt="User Avatar" 
                            className="w-10 h-10 rounded-full object-cover cursor-pointer" 
                            onClick={toggleDropdown} // Toggle dropdown on click
                        />
                        {/* Username Label */}
                        <span 
                            className="text-amber-500 font-bold text-lg cursor-pointer" 
                            onClick={toggleDropdown} // Toggle dropdown on click
                        >
                            {userData.user.username}
                        </span>

                        {/* Dropdown Menu */}
                        {dropdownOpen && (
                            <div className="absolute right-0 top-12 bg-white border border-gray-200 rounded-lg shadow-lg w-40 z-10 overflow-hidden">
                                <ul className="text-gray-700">
                                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => navigate(`/user/${userData.user.id}`)}>
                                        Profile
                                    </li>
                                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={handleLogout}>
                                        Logout
                                    </li>
                                </ul>
                            </div>
                        )}
                    </>
                ) : (
                    <div>No user data available</div>
                )
            ) : (
                <div className="flex space-x-2">
                    <Link to="/login" className="bg-amber-500 text-white rounded px-3 py-1 hover:bg-amber-600">
                        Login
                    </Link>
                    <Link to="/register" className="bg-amber-500 text-white rounded px-3 py-1 hover:bg-amber-600">
                        Register
                    </Link>
                </div>
            )}
        </div>
    );
};

export default User;
