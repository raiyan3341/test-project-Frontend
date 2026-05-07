import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router'; 
import { auth } from './Firebase/firebase.init'; // Path check koren (e.g. '../Firebase/firebase.init')
import { GoogleAuthProvider, signInWithPopup, signOut, signInWithEmailAndPassword } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';

const Navbar = () => {
    const [user] = useAuthState(auth);
    const [showAdminLogin, setShowAdminLogin] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    const navigate = useNavigate();
    const googleProvider = new GoogleAuthProvider();

    const handleGoogleLogin = () => {
        signInWithPopup(auth, googleProvider)
            .catch(err => console.log(err));
    };

    const handleAdminLogin = (e) => {
        e.preventDefault();
        signInWithEmailAndPassword(auth, email, password)
            .then(() => {
                setShowAdminLogin(false);
                navigate('/admin');
            })
            .catch(err => alert("Access Denied: Invalid Credentials"));
    };

    const handleLogout = () => {
        signOut(auth).then(() => navigate('/'));
    };

    return (
        <nav className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex justify-between items-center sticky top-0 z-50">
            {/* Logo */}
            <Link to="/" className="text-2xl font-black text-cyan-400 tracking-tighter italic">
                AEGIS-QUEST
            </Link>

            {/* Nav Links */}
            <div className="flex gap-4 text-sm font-bold uppercase tracking-widest text-gray-400">
                <Link to="/" className="hover:text-cyan-400 transition-all underline-offset-8">Home</Link>
                
                {/* Lobbies Link Fix */}
                <Link to="/lobbies" className="hover:text-cyan-400 transition-all underline-offset-8">Lobbies</Link>
                
                {user && (
                    <Link to="/admin" className="text-cyan-500 hover:text-cyan-300 transition-all font-black">Dashboard</Link>
                )}
            </div>

            {/* Login Actions */}
            <div className="flex items-center gap-4 relative">
                {user ? (
                    <div className="flex items-center gap-3 bg-gray-800 p-1 pr-4 rounded-full border border-gray-700">
                        <img 
                            src={user?.photoURL || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} 
                            className="w-8 h-8 rounded-full border border-cyan-500" 
                            alt="profile" 
                        />
                        <button onClick={handleLogout} className="text-[10px] font-black uppercase text-red-500">Logout</button>
                    </div>
                ) : (
                    <div className="flex gap-2">
                        {/* Google Login */}
                        <button 
                            onClick={handleGoogleLogin}
                            className="bg-white text-black px-4 py-2 rounded-lg font-black text-[10px] uppercase flex items-center gap-2"
                        >
                            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/layout/google.png" className="w-3" alt="" />
                            Login
                        </button>

                        {/* Admin Trigger */}
                        <button 
                            onClick={() => setShowAdminLogin(!showAdminLogin)}
                            className="bg-cyan-500 hover:bg-cyan-400 text-black px-4 py-2 rounded-lg font-black text-[10px] uppercase shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all"
                        >
                            Sign in
                        </button>
                    </div>
                )}

                {/* Admin Email Login Pop-up (Modal) */}
                {showAdminLogin && !user && (
                    <div className="absolute top-14 right-0 bg-gray-800 p-6 rounded-xl border border-cyan-500 shadow-2xl w-64 z-[100] animate-in fade-in zoom-in duration-200">
                        <h3 className="text-cyan-400 font-black mb-4 text-[10px] tracking-widest uppercase text-center">Enter email and password</h3>
                        <form onSubmit={handleAdminLogin} className="space-y-3">
                            <input 
                                type="email" placeholder="Email" 
                                className="w-full bg-black border border-gray-700 p-2 rounded text-xs text-white focus:border-cyan-500 outline-none"
                                onChange={(e) => setEmail(e.target.value)} required
                            />
                            <input 
                                type="password" placeholder="Password" 
                                className="w-full bg-black border border-gray-700 p-2 rounded text-xs text-white focus:border-cyan-500 outline-none"
                                onChange={(e) => setPassword(e.target.value)} required
                            />
                            <button className="w-full bg-cyan-500 text-black font-black py-2 rounded text-[10px] uppercase">
                                Sign in
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;