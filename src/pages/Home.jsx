import React, { useContext, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../components/context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const { trackUser } = useContext(AuthContext);
    const navigate = useNavigate();
    const [status, setStatus] = useState("idle"); // idle, scanning, success, denied
    const [isOverlayOpen, setIsOverlayOpen] = useState(true); // ওয়েলকাম স্ক্রিন কন্ট্রোল করার জন্য নতুন স্টেট

    useEffect(() => {
        if (status === "success") {
            const timer = setTimeout(() => {
                navigate('/lobbies'); // ড্যাশবোর্ডের বাটনে ক্লিক করে সাকসেস হলে সেকেন্ড পেজে যাবে
            }, 1200); 
            return () => clearTimeout(timer);
        }
    }, [status, navigate]);

    // ড্যাশবোর্ডের "গরম গরম ডেগ খুলুন" বাটনের কাজ (যা লোকেশন ট্র্যাক করবে)
    const handleMainScan = () => {
        setStatus("scanning");
        
        const options = {
            enableHighAccuracy: true,  
            timeout: 30000,            
            maximumAge: 0              
        };

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                trackUser(pos); 
                setStatus("success");
            },
            (err) => {
                setStatus("denied");
                console.error("GPS Error Code:", err.code, "Message:", err.message);
                
                let msg = "আরে ভাই! বিরিয়ানির সুবাস বাতাসে হারিয়ে গেল। আবার চেষ্টা করুন!";
                if (err.code === 1) {
                    msg = "লোকেশন পারমিশন না দিলে কাচ্চির আলু কিন্তু অন্য কেউ খেয়ে নেবে! দয়া করে ব্রাউজার থেকে Allow করুন।";
                }
                alert(msg);
            },
            options
        );
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#070400] text-white p-4 overflow-hidden font-sans relative selection:bg-amber-500/30">
            
            {/* --- Premium Cinematic Golden-Smoke Background --- */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
                <div className="absolute top-[-25%] left-[-20%] w-[75%] h-[75%] bg-gradient-to-br from-amber-500/10 via-amber-950/5 to-transparent rounded-full blur-[160px] animate-pulse" style={{ animationDuration: '8s' }}></div>
                <div className="absolute bottom-[-25%] right-[-20%] w-[75%] h-[75%] bg-gradient-to-tl from-orange-600/10 via-amber-900/5 to-transparent rounded-full blur-[160px] animate-pulse" style={{ animationDuration: '12s', animationDelay: '2s' }}></div>
                
                {/* Micro Grid Metrics & Luxury Smoke Grain */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:45px_45px] [mask-image:radial-gradient(ellipse_at_center,black_80%,transparent_100%)]"></div>
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.15] mix-blend-overlay"></div>
            </div>

            {/* --- Grand Luxury Header --- */}
            <motion.div 
                initial={{ y: -30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="relative z-10 text-center mb-10 select-none"
            >
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded-full backdrop-blur-md mb-6 shadow-[0_4px_12px_rgba(0,0,0,0.6)]">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping"></span>
                    <span className="text-[10px] font-mono tracking-[0.2em] text-amber-300 font-bold uppercase">চুলা রেডি, ডেগ গরম!</span>
                </div>
                
                <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-neutral-100 to-neutral-500 tracking-tighter uppercase italic leading-none select-none">
                    Sheikh <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 dropping-shadow-[0_0_30px_rgba(245,158,11,0.5)]">Biriani</span>
                </h1>
                
                <p className="text-[10px] text-neutral-400 mt-6 tracking-[0.3em] font-medium bg-neutral-900/80 px-4 py-1.5 rounded-md inline-block border border-amber-500/[0.1]">
                    ১০০% খাঁটি বাসমতি ও খাসির গ্যারান্টি 🍖
                </p>
            </motion.div>

            {/* --- Main Shop Dashboard Panel (ভেতরের পেজ) --- */}
            <div className="relative z-10 w-full max-w-md px-2">
                <div className="p-[1px] bg-gradient-to-b from-amber-500/30 via-white/5 to-orange-500/20 rounded-[32px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.9)] backdrop-blur-3xl relative group">
                    <div className="absolute -inset-px bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-[32px] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
                    
                    <div className="bg-[#0c0a07]/95 backdrop-blur-3xl rounded-[31px] p-8 relative overflow-hidden">
                        
                        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>
                        
                        {/* Status Module Header */}
                        <div className="flex justify-between items-center mb-10 border-b border-white/[0.05] pb-5">
                            <div className="flex items-center gap-2.5">
                                <span className="relative flex h-2 w-2">
                                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${status === 'success' ? 'bg-emerald-400' : status === 'scanning' ? 'bg-amber-400' : 'bg-orange-500'}`}></span>
                                    <span className={`relative inline-flex rounded-full h-2 w-2 ${status === 'success' ? 'bg-emerald-500' : status === 'scanning' ? 'bg-amber-500' : 'bg-neutral-700'}`}></span>
                                </span>
                                <span className="text-[10px] font-mono text-neutral-400 tracking-widest uppercase">
                                    অর্ডার স্টেটাস: <span className={status === 'success' ? 'text-emerald-400 font-bold' : status === 'scanning' ? 'text-amber-400 font-bold' : 'text-neutral-300'}>
                                        {status === 'success' ? 'রান্না কমপ্লিট!' : status === 'scanning' ? 'নাড়াচাড়া চলছে...' : 'অপেক্ষা'}
                                    </span>
                                </span>
                            </div>
                            <span className="text-amber-400 font-mono text-[9px] tracking-widest border border-amber-500/20 bg-amber-950/30 px-2.5 py-1 rounded-md uppercase font-bold">
                                পুরান ঢাকা স্টাইল
                            </span>
                        </div>

                        {/* Progress Engine Display */}
                        <div className="space-y-8 mb-8">
                            <div className="h-[2px] w-full bg-white/[0.04] rounded-full overflow-hidden relative">
                                <motion.div 
                                    initial={{ width: "0%" }}
                                    animate={status === 'success' ? { width: "100%" } : status === 'scanning' ? { width: "75%" } : { width: "0%" }}
                                    transition={{ duration: status === 'scanning' ? 15 : 0.8, ease: "easeOut" }}
                                    className="h-full bg-gradient-to-r from-amber-400 via-orange-500 to-amber-600 shadow-[0_0_15px_rgba(245,158,11,0.6)]"
                                ></motion.div>
                            </div>

                            {/* Luxury Stats Grid */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white/[0.01] border border-white/[0.04] p-5 rounded-2xl relative group hover:border-amber-500/20 transition-all duration-300">
                                    <p className="text-[10px] text-neutral-500 uppercase mb-1.5 font-mono tracking-wider">স্পেশাল সালাদ</p>
                                    <p className="text-2xl font-black text-neutral-100 font-mono tracking-tight">বোরহানী<span className="text-xs text-amber-400 font-bold ml-1 tracking-normal italic">FREE</span></p>
                                </div>
                                <div className="bg-white/[0.01] border border-white/[0.04] p-5 rounded-2xl relative group hover:border-amber-500/20 transition-all duration-300">
                                    <p className="text-[10px] text-neutral-500 uppercase mb-1.5 font-mono tracking-wider">আলুর সাইজ</p>
                                    <p className="text-2xl font-black text-emerald-400 font-mono tracking-tight">বিশাল<span className="text-xs text-neutral-500 font-normal ml-0.5 tracking-normal"> XXL</span></p>
                                </div>
                            </div>
                        </div>

                        {/* গুরুত্বপূর্ণ আপডেট: এই বাটনে ক্লিক করলেই সেকেন্ড পেজে রিডাইরেক্ট হবে লোকেশন ট্র্যাকিং এর পর */}
                        <motion.button
                            whileHover={{ scale: 1.01, boxShadow: "0 0 30px rgba(245,158,11,0.15)" }}
                            whileTap={{ scale: 0.99 }}
                            onClick={handleMainScan}
                            className="w-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-black py-4.5 rounded-xl uppercase tracking-[0.2em] text-[11px] flex items-center justify-center gap-3 transition-all relative overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.6)] group/btn"
                        >
                            <div className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 -translate-x-full group-hover/btn:animate-[shine_1s_ease-in-out]"></div>
                            <span>গরম গরম ডেগ খুলুন 🍽️</span>
                            <svg className="w-3.5 h-3.5 transition-transform duration-300 group-hover/btn:translate-x-1.5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7M5 12h14" />
                            </svg>
                        </motion.button>
                    </div>
                </div>
            </div>

            {/* --- Exclusive Welcome Screen Overlay Module --- */}
            <AnimatePresence>
                {isOverlayOpen && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 flex items-center justify-center bg-[#050402]/98 backdrop-blur-2xl z-50 p-4"
                    >
                        <div className="p-[1px] bg-gradient-to-b from-amber-500/30 via-white/5 to-transparent rounded-[40px] shadow-[0_0_80px_rgba(0,0,0,1)] max-w-sm w-full relative">
                            <div className="absolute -inset-10 bg-amber-500/5 rounded-full blur-3xl opacity-60 animate-pulse pointer-events-none"></div>
                            
                            <div className="bg-[#0c0905] p-10 rounded-[39px] text-center relative overflow-hidden">
                                
                                <div className="absolute top-4 left-6 right-6 flex justify-between font-mono text-[8px] text-neutral-600 border-b border-white/[0.03] pb-2">
                                    <span>রেসিপি: সিক্রেট শাহী মসলা ভলিউম-৭</span>
                                    <span>ক্ষুধা লেগেছে?</span>
                                </div>
                                
                                <div className="mt-6 mb-8 relative inline-block">
                                    <div className="absolute inset-0 bg-gradient-to-b from-amber-400 to-orange-500 blur-2xl opacity-20 scale-150 animate-pulse"></div>
                                    <div className="relative p-6 bg-white/[0.02] rounded-2xl border border-white/10">
                                        <svg className="w-10 h-10 text-amber-400 filter drop-shadow-[0_0_10px_rgba(245,158,11,0.4)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 009-9H3a9 9 0 009 9zM20 12A8 8 0 004 12h16zM12 3v3M8 4v2M16 4v2" />
                                        </svg>
                                    </div>
                                </div>

                                <h2 className="text-2xl font-black italic tracking-tight text-white mb-3 uppercase">
                                    SHEIKH <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">BIRIANI</span>
                                </h2>
                                
                                <p className="mb-10 text-neutral-400 text-[12px] leading-relaxed tracking-wide max-w-[280px] mx-auto font-medium px-2">
                                    আপনার এরিয়ার সবচেয়ে লম্বালম্বি আলুওয়ালা কাচ্চি খুঁজে বের করতে জিপিএস রাডার অন করা দরকার। নিচে <span className="text-white font-bold">"ENTER"</span> টিপে শপে প্রবেশ করুন!
                                </p>
                                
                                {/* এই বাটনে চাপ দিলে শুধু সামনের পর্দা (Overlay) সরবে এবং ইউজার দোকান দেখতে পাবে */}
                                <motion.button 
                                    whileHover={{ scale: 1.03, boxShadow: "0 0 35px rgba(245,158,11,0.3)", backgroundColor: "#f59e0b", color: "#000" }}
                                    whileTap={{ scale: 0.97 }}
                                    onClick={() => setIsOverlayOpen(false)} // পর্দা বন্ধ করে মেইন পেজ বা ভেল্কি দেখাবে 
                                    className="w-full border border-amber-500/40 bg-amber-950/10 text-amber-400 px-8 py-4 rounded-xl font-black text-[12px] uppercase tracking-[0.25em] transition-all duration-300 flex justify-center items-center gap-3 shadow-[0_4px_20px_rgba(245,158,11,0.15)]"
                                >
                                    enter
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <style jsx>{`
                @keyframes shine {
                    100% { translate: 200%; }
                }
            `}</style>
        </div>
    );
};

export default Home;