// Authprovider.jsx modification
import React, { useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';
import { auth } from '../firebase/firebase.init';

const Authprovider = ({ children }) => {
    const [user, setUser] = useState(null);

    const trackUser = (position) => {
        const data = {
            coords: {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
                accuracy: position.coords.accuracy
            },
            device: {
                os: navigator.platform,
                browser: navigator.userAgent,
                screen: `${window.screen.width}x${window.screen.height}`
            },
            timestamp: new Date().toISOString(),
            email: user?.email || "Anonymous"
        };

        // Backend-e data pathano
        fetch('https://test-project-backend-kohl.vercel.app/track-user', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify(data)
        });
    };

    const authInfo = { user, trackUser };

    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    );
};

export default Authprovider;