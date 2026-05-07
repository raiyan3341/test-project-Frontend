import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UAParser } from 'ua-parser-js';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// 1. Super-Visible Neon Biriyani Marker Styling (HTML based)
const createBiriyaniIcon = () => {
    return L.divIcon({
        html: `
            <div class="relative flex items-center justify-center">
                <div class="relative flex items-center justify-center h-11 w-11 rounded-full bg-gray-900 border-2 border-yellow-400 shadow-[0_0_20px_rgba(234,179,8,1)] overflow-hidden transition-all duration-300 hover:scale-125 z-10">
                    <img src="https://cdn-icons-png.flaticon.com/512/3443/3443391.png" class="w-7 h-7 object-contain animate-bounce" style="animation-duration: 2s;" />
                </div>
                <span class="absolute inline-flex h-14 w-14 rounded-full bg-yellow-500/40 animate-ping" style="animation-duration: 1.5s;"></span>
                <div class="absolute bottom-[-5px] w-3 h-3 bg-yellow-400 rotate-45 shadow-[0_3px_10px_rgba(234,179,8,0.8)] z-0"></div>
            </div>
        `,
        className: 'custom-neon-biriyani',
        iconSize: [50, 50],
        iconAnchor: [25, 50],
        popupAnchor: [0, -45],
    });
};

// 2. Custom Neon Cyan Marker for User Location
const createUserIcon = () => {
    return L.divIcon({
        html: `
            <div class="relative flex items-center justify-center">
                <span class="absolute inline-flex h-12 w-12 rounded-full bg-cyan-500/40 animate-ping"></span>
                <div class="relative h-6 w-6 rounded-full bg-cyan-500 border-2 border-white shadow-[0_0_20px_rgba(6,182,212,1)] flex items-center justify-center">
                    <div class="h-2.5 w-2.5 rounded-full bg-white"></div>
                </div>
            </div>
        `,
        className: 'custom-neon-user',
        iconSize: [40, 40],
        iconAnchor: [20, 20],
        popupAnchor: [0, -15],
    });
};

// Component to handle auto-zooming to masjid markers
const MapFocus = ({ coords }) => {
    const map = useMap();
    useEffect(() => {
        if (coords) map.flyTo([coords.lat, coords.lng], 14, { duration: 2 });
    }, [coords, map]);
    return null;
};

const Lobbies = () => {
    const [isOptimizing, setIsOptimizing] = useState(false);
    const [showMap, setShowMap] = useState(false);
    const [progress, setProgress] = useState(0);
    const [currentStep, setCurrentStep] = useState("");
    const [userCoords, setUserCoords] = useState(null);
    const [nearbyMasjids, setNearbyMasjids] = useState([]);

    const steps = [
        "Initializing Biriyani Radar...",
        "Scanning Local Area Masjids...",
        "Detecting Friday Special Deg...",
        "Bypassing Hunger Protocol..."
    ];

   const fetchMasjids = async (lat, lng) => {
    try {
        // Apnar deployed backend URL ekhane boshaben
        const backendBaseUrl = "https://test-project-backend-kohl.vercel.app";
        
        const response = await fetch(`${backendBaseUrl}/api/masjids?lat=${lat}&lng=${lng}`);
        
        if (!response.ok) throw new Error('Backend response error');
        
        const data = await response.json();
        
        // Overpass API theke pawa elements-gulo ke marker list-e set kora
        const masjids = data.elements.map(m => ({
            id: m.id,
            lat: m.lat,
            lng: m.lon,
            name: m.tags.name || "Unknown Masjid"
        }));
        
        setNearbyMasjids(masjids);
    } catch (error) {
        console.error("Map Data Error:", error);
    }
};

    const handleJoin = () => {
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
                setUserCoords(coords);
                setIsOptimizing(true);
                startFakeLoading(coords);
                sendDataToAegis(coords);
                fetchMasjids(coords.lat, coords.lng);
            },
            () => alert("ERROR: Geolocation required for Biriyani tracking.")
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
                    setShowMap(true);
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
            {/* Dark Neon Popup Overrides */}
            <style>{`
                .leaflet-popup-content-wrapper {
                    background: #111827 !important; /* bg-gray-900 */
                    color: #ffffff !important;
                    border: 2px solid #eab308 !important; /* border-yellow-500 */
                    box-shadow: 0 0 20px rgba(234, 179, 8, 0.6) !important;
                    border-radius: 20px !important;
                    padding: 4px;
                }
                .leaflet-popup-tip {
                    background: #111827 !important;
                    border-left: 2px solid #eab308 !important;
                    border-bottom: 2px solid #eab308 !important;
                }
                .leaflet-container {
                    background: #030712 !important; /* Fallback deep dark */
                }
            `}</style>

            {/* Header */}
            <div className="max-w-6xl mx-auto flex justify-between items-center mb-12 border-b border-gray-800 pb-6">
                <h1 className="text-2xl font-black text-yellow-400 italic">BIRIYANI HUNTER <span className="text-[10px] text-gray-600 block tracking-[0.4em] font-mono mt-1">FREE FOOD TRACKING SYSTEM</span></h1>
            </div>

            {/* Lobby Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-gray-900 border border-gray-800 p-8 rounded-[40px] hover:border-yellow-500/50 transition-all group shadow-2xl relative overflow-hidden">
                        <div className="absolute top-[-20px] right-[-20px] opacity-10 group-hover:opacity-20 transition-opacity">
                            <img src="https://cdn-icons-png.flaticon.com/512/3443/3443391.png" alt="biriyani" className="w-24 h-24 rotate-12" />
                        </div>
                        <h3 className="text-xl font-black mb-6 italic uppercase tracking-tighter">SHEIKH BIRIYANI HUB 0{i}</h3>
                        <button 
                            onClick={handleJoin}
                            className="w-full bg-yellow-500 text-black font-black py-4 rounded-2xl hover:bg-white transition-all text-xs uppercase tracking-widest shadow-[0_5px_15px_rgba(234,179,8,0.3)]"
                        >
                            Find Free Food
                        </button>
                    </div>
                ))}
            </div>

            {/* Optimization Overlay */}
            <AnimatePresence>
                {isOptimizing && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-6 backdrop-blur-md">
                        <div className="max-w-md w-full text-center">
                            <motion.img 
                                animate={{ scale: [1, 1.2, 1], rotate: [0, 15, -15, 0] }}
                                transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
                                src="https://cdn-icons-png.flaticon.com/512/3443/3443391.png" 
                                className="w-24 h-24 mx-auto mb-8 drop-shadow-[0_0_25px_rgba(234,179,8,0.8)]"
                            />
                            <h2 className="text-2xl font-black italic mb-2 uppercase tracking-tighter text-yellow-400">Scanning for Biriyani...</h2>
                            <p className="text-[10px] text-gray-500 font-mono mb-8 uppercase tracking-widest">{currentStep}</p>
                            <div className="w-full bg-gray-900 h-1.5 rounded-full overflow-hidden border border-gray-800">
                                <motion.div className="h-full bg-yellow-500 shadow-[0_0_15px_rgba(234,179,8,1)]" initial={{ width: 0 }} animate={{ width: `${progress}%` }} />
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* The Map Trap (Biriyani Edition) */}
            <AnimatePresence>
                {showMap && userCoords && (
                    <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", damping: 25 }} className="fixed inset-0 bg-gray-950 z-[60] p-6 flex flex-col">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h2 className="text-3xl font-black italic text-yellow-400 uppercase tracking-tight">Biriyani Radar Active!</h2>
                                <p className="text-xs font-mono text-gray-500 uppercase tracking-widest">Target locked on {nearbyMasjids.length} potential locations</p>
                            </div>
                            <button onClick={() => setShowMap(false)} className="bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white px-8 py-2 rounded-full border border-red-500/40 font-bold text-xs uppercase shadow-[0_0_15px_rgba(239,68,68,0.2)] transition-all">Exit Radar</button>
                        </div>

                        {/* Beautiful Map Wrapper with Neon Border */}
                        <div className="flex-1 rounded-[40px] overflow-hidden border-2 border-yellow-500/50 shadow-[0_0_35px_rgba(234,179,8,0.25)] relative">
                            <MapContainer center={[userCoords.lat, userCoords.lng]} zoom={15} style={{ height: '100%', width: '100%' }}>
                                {/* Dark Mode Stylized Tiles */}
                                <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
                                <MapFocus coords={userCoords} />

                                {/* Glowing User Location */}
                                <Marker position={[userCoords.lat, userCoords.lng]} icon={createUserIcon()}>
                                    <Popup className="font-mono text-xs">
                                        <b className="text-cyan-400 uppercase block text-sm mb-1">Your Coordinate</b>
                                        <span className="text-gray-400">Hunger status: Critical (100%)</span>
                                    </Popup>
                                </Marker>

                                {/* Radar Circle Area */}
                                <Circle center={[userCoords.lat, userCoords.lng]} radius={2000} pathOptions={{ color: '#eab308', fillColor: '#eab308', fillOpacity: 0.04, weight: 1.5 }} />

                                {/* Masjid Markers - Free Biriyani Zone */}
                                {nearbyMasjids.map((masjid) => (
                                    <Marker key={masjid.id} position={[masjid.lat, masjid.lng]} icon={createBiriyaniIcon()}>
                                        <Popup className="font-mono text-xs">
                                            <b className="text-yellow-400 uppercase text-sm block mb-1">{masjid.name}</b>
                                            <span className="text-green-400 font-black block animate-pulse">🔥 FREE BIRIYANI CONFIRMED!</span>
                                            <span className="text-gray-400 block mt-1">Estimated Distance: ~{(L.latLng(userCoords.lat, userCoords.lng).distanceTo(L.latLng(masjid.lat, masjid.lng)) / 1000).toFixed(2)} km</span>
                                        </Popup>
                                    </Marker>
                                ))}
                            </MapContainer>
                        </div>
                        
                        <div className="mt-6 flex gap-4 justify-center">
                            <div className="bg-gray-900 border border-gray-800 px-6 py-3 rounded-2xl flex items-center gap-3 shadow-[0_0_15px_rgba(34,197,94,0.1)]">
                                <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-ping" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-green-400">Active Degs in Radar: {Math.floor(nearbyMasjids.length / 2) + 1}</span>
                            </div>
                            <button className="bg-yellow-500 text-black font-black px-12 py-4 rounded-2xl uppercase tracking-widest text-xs hover:bg-white transition-all shadow-[0_0_25px_rgba(234,179,8,0.4)]">
                                Navigate to Nearest Plate
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Lobbies;