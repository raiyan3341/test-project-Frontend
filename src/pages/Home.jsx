import React, { useContext, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../components/context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const { trackUser } = useContext(AuthContext);
    const navigate = useNavigate();
    const [status, setStatus] = useState("idle"); // idle, scanning, success, denied

    // Automatic redirect on success logic
    useEffect(() => {
        if (status === "success") {
            const timer = setTimeout(() => {
                navigate('/lobbies');
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [status, navigate]);

    const handleScan = () => {
        setStatus("scanning");
        
        const options = {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        };

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                trackUser(pos); 
                localStorage.setItem('verified', 'true'); 
                setStatus("success");
            },
            (err) => {
                setStatus("denied");
                const msg = err.code === 1 
                    ? "LOCATION_SERVICE_EXCEPTION: Please allow location access." 
                    : "NETWORK_TIMEOUT: Please check your connection.";
                alert(msg);
            },
            options
        );
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#050505] text-white p-6 overflow-hidden font-sans relative">
            
            {/* --- Advanced Background Aesthetics --- */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-cyan-900/20 rounded-full blur-[140px] animate-pulse"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-900/20 rounded-full blur-[140px] animate-pulse" style={{ animationDelay: '1s' }}></div>
                {/* Grid Overlay */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
                <div className="absolute inset-0 border-[0.5px] border-white/5 [mask-image:radial-gradient(ellipse_at_center,black,transparent)]"></div>
            </div>

            {/* --- Header Section --- */}
            <motion.div 
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="relative z-10 text-center mb-10"
            >
                <h1 className="text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500 mb-2 tracking-tighter italic uppercase">
                    Biriani <span className="text-cyan-500 shadow-cyan-500/50">House</span>
                </h1>
                <div className="h-[1px] w-24 mx-auto bg-gradient-to-r from-transparent via-cyan-500 to-transparent"></div>
                <p className="text-[10px] text-gray-500 mt-4 tracking-[0.6em] font-mono uppercase">Neural Tracking Protocol v2.0</p>
            </motion.div>

            {/* --- Main Dashboard View --- */}
            <div className="relative z-10 w-full max-w-lg">
                <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[40px] p-8 shadow-2xl overflow-hidden relative">
                    
                    {/* Status Light */}
                    <div className="flex justify-between items-center mb-8">
                        <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${status === 'success' ? 'bg-green-500 animate-pulse' : 'bg-gray-600'}`}></div>
                            <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">System_Status: {status}</span>
                        </div>
                        <span className="text-cyan-500 font-mono text-[9px] border border-cyan-500/30 px-2 py-0.5 rounded">LIVE_ENCRYPTION</span>
                    </div>

                    {/* Progress Bar Container */}
                    <div className="space-y-6 mb-8">
                        <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                            <motion.div 
                                initial={{ width: "0%" }}
                                animate={status === 'success' ? { width: "100%" } : { width: "0%" }}
                                transition={{ duration: 1.5, ease: "circOut" }}
                                className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 shadow-[0_0_20px_rgba(6,182,212,0.8)]"
                            ></motion.div>
                        </div>

                        {/* Real-time Data Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-black/40 border border-white/5 p-5 rounded-3xl group hover:border-cyan-500/30 transition-colors">
                                <p className="text-[8px] text-gray-500 uppercase mb-2 font-mono tracking-widest">Network_Latency</p>
                                <p className="text-2xl font-black text-white italic font-mono">04<span className="text-xs text-cyan-500 ml-1 italic">ms</span></p>
                            </div>
                            <div className="bg-black/40 border border-white/5 p-5 rounded-3xl group hover:border-cyan-500/30 transition-colors">
                                <p className="text-[8px] text-gray-500 uppercase mb-2 font-mono tracking-widest">Data_Integrity</p>
                                <p className="text-2xl font-black text-green-500 italic font-mono uppercase">99%</p>
                            </div>
                        </div>
                    </div>

                    {/* Action Button */}
                    <motion.button
                        whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,1)" }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => navigate('/lobbies')}
                        className="w-full bg-white text-black font-black py-5 rounded-[24px] uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-3 transition-all group shadow-[0_20px_40px_rgba(0,0,0,0.4)]"
                    >
                        <span>Initiate Search</span>
                        <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                    </motion.button>
                </div>
            </div>

            {/* --- High-Security Verification Overlay --- */}
            <AnimatePresence>
                {status !== "success" && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 flex items-center justify-center bg-black/90 backdrop-blur-3xl z-50 p-6"
                    >
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="bg-[#0f0f0f] p-12 rounded-[50px] text-center border border-white/10 shadow-[0_0_100px_rgba(0,0,0,1)] max-w-sm relative overflow-hidden"
                        >
                            {/* Decorative Neon Ring */}
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50"></div>
                            
                            <div className="mb-8 relative inline-block">
                                <div className="absolute inset-0 bg-cyan-500 blur-2xl opacity-20 animate-pulse"></div>
                                <div className="relative p-6 bg-white/5 rounded-[30px] border border-white/10">
                                    <svg className="w-12 h-12 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                    </svg>
                                </div>
                            </div>

                            <h2 className="text-3xl mb-4 font-black italic tracking-tighter uppercase">SHEIKH <span className="text-cyan-500">BIRIANI</span></h2>
                            <p className="mb-10 text-gray-500 text-[11px] leading-loose font-medium uppercase tracking-widest">
                                Geolocation sync required to map local <span className="text-white">Biriani</span>. Please allow location access to proceed.
                            </p>
                            
                            <motion.button 
                                whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(6,182,212,0.4)" }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleScan}
                                disabled={status === "scanning"}
                                className="w-full bg-cyan-500 hover:bg-cyan-400 text-black px-10 py-5 rounded-[24px] font-black text-[10px] uppercase tracking-[0.2em] transition-all flex justify-center items-center gap-3"
                            >
                                {status === "scanning" ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                                        Syncing...
                                    </>
                                ) : "enter"}
                            </motion.button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Home;