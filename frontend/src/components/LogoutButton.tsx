import React from 'react';
import { Button } from './button';
import { useNavigate } from 'react-router-dom';




export const LogoutButton = () => {
    const navigate = useNavigate();

    function signOut(event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void {
        event.preventDefault();
        localStorage.removeItem('token');
        navigate('/login');
    }
    return (
        // Correct the closing tag for the Button component

        <Button onClick={signOut} style={{ position: 'absolute', top: 0, right: 0 }}>
            Sign out
        </Button>

    );
};

