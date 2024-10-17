import React from 'react';
import { useAppContext } from '../contexts/AppContext'; // Adjust the import path as needed

const CurrentUser = () => {
    const { isLoggedIn } = useAppContext();

    return (
        <div>
            {isLoggedIn ? (
                <p>User is logged in</p>
            ) : (
                <p>User is not logged in</p>
            )}
        </div>
    );
};

export default CurrentUser;