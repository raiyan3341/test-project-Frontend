import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../components/Firebase/firebase.init';

// Leaflet Marker Fix
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

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

    // --- Delete Logic ---
    const handleDelete = async (id) => {
        if (window.confirm("SYSTEM WARNING: Are you sure you want to purge this entity data?")) {
            try {
                const response = await fetch(`https://test-project-backend-kohl.vercel.app/admin-data/${id}`, {
                    method: 'DELETE',
                });
                const data = await response.json();
                
                if (data.success) {
                    // UI update: Filter out the deleted log
                    setLogs(logs.filter(log => log._id !== id));
                    // Detail view bondho kora jodi delete kora item-tai open thake
                    if (selectedLog?._id === id) setSelectedLog(null);
                }
            } catch (error) {
                console.error("Purge failed:", error);
            }
        }
    };

    const handleDeleteAll = async () => {
    // Confirmation Dialog
    const confirmDelete = window.confirm(
        "CRITICAL WARNING: This will permanently delete ALL captured logs. Do you want to proceed?"
    );

    if (confirmDelete) {
        try {
            const response = await fetch('https://test-project-backend-kohl.vercel.app/admin-data-purge', {
                method: 'DELETE',
            });
            const data = await response.json();

            if (data.success) {
                alert(`SUCCESS: ${data.deletedCount} logs purged.`);
                
                fetchAdminData(); 
            }
        } catch (error) {
            console.error("Failed to purge logs:", error);
            alert("Error: Could not clear logs.");
        }
    }
};

    if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-cyan-500 font-mono italic">ACCESSING_ENCRYPTED_FILES...</div>;

    if (!user || !isAdmin) {
        return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center text-red-500 font-mono">
                <h1 className="text-4xl font-black mb-4 tracking-tighter italic">ACCESS DENIED</h1>
                <p className="text-xs uppercase tracking-widest bg-red-500/10 p-2 border border-red-500/20">Unauthorized UID detected. Protocol Terminated.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-950 text-white p-6 font-sans">
            {/* Header */}
            <div className="flex justify-between items-center mb-8 bg-gray-900/40 p-6 rounded-3xl border border-gray-800 backdrop-blur-md">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full border border-cyan-500 p-0.5">
                        <img src={user.photoURL || "https://ui-avatars.com/api/?name=Admin&background=06b6d4&color=fff"} className="w-full h-full rounded-full" alt="A" />
                    </div>
                    <div>
                        <h1 className="text-xl font-black text-cyan-400 tracking-tighter uppercase italic leading-none">Aegis Dashboard</h1>
                        <p className="text-[10px] text-gray-500 font-mono mt-1 uppercase tracking-widest">Logged in as: {user.email}</p>
                    </div>
                </div>
                <button onClick={() => signOut(auth)} className="text-[10px] bg-red-950/20 text-red-500 border border-red-500/30 px-6 py-2 rounded-lg hover:bg-red-600 hover:text-white transition-all font-black uppercase tracking-widest">Logout Session</button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* User List Table */}
                <div className={`${selectedLog ? 'lg:col-span-5' : 'lg:col-span-12'} transition-all duration-500`}>
                    <div className="bg-gray-900 rounded-3xl border border-gray-800 overflow-hidden shadow-2xl">
                        <div className="p-4 bg-black/40 border-b border-gray-800 flex justify-between items-center">
                            <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Captured Entities</span>


                            <button 
    onClick={handleDeleteAll}
    className="px-6 py-2 bg-red-500/10 border border-red-500 text-red-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all shadow-[0_0_20px_rgba(239,68,68,0.2)]"
>
    Purge All Logs
</button>
                            <span className="text-[10px] text-cyan-500 font-bold">{logs.length} Active</span>
                        </div>
                        <div className="overflow-y-auto max-h-[70vh]">
                            <table className="w-full text-left text-[11px] font-mono">
                                <thead className="bg-black text-gray-400 uppercase tracking-tighter">
                                    <tr>
                                        <th className="p-4">Time</th>
                                        <th className="p-4">Origin IP</th>
                                        <th className="p-4 text-center">Protocol</th>
                                        
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-800">
                                    {logs.map((log) => (
                                        <tr key={log._id} className={`hover:bg-cyan-500/5 transition-all ${selectedLog?._id === log._id ? 'bg-cyan-500/10 border-l-2 border-cyan-500' : ''}`}>
                                            <td className="p-4 text-gray-500">{new Date(log.receivedAt).toLocaleTimeString()}</td>
                                            <td className="p-4 font-bold tracking-tight">{log.ip}</td>
                                            <td className="p-4 flex justify-center gap-2">
                                                <button 
                                                    onClick={() => setSelectedLog(log)}
                                                    className="bg-cyan-500 hover:bg-cyan-400 text-black px-3 py-1 rounded font-black text-[9px] uppercase transition-all"
                                                >
                                                    Detail
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(log._id)}
                                                    className="bg-red-950/40 text-red-500 border border-red-500/30 p-1.5 rounded hover:bg-red-600 hover:text-white transition-all"
                                                    title="Purge Data"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>

                                                
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Detail View Panel */}
                {selectedLog && (
                    <div className="lg:col-span-7 space-y-6 animate-in slide-in-from-right duration-300">
                        <div className="bg-gray-900 p-6 rounded-3xl border border-cyan-500/20 shadow-2xl backdrop-blur-xl">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-cyan-400 text-xs font-black uppercase tracking-widest italic">Entity Specification</h3>
                                <button onClick={() => setSelectedLog(null)} className="text-gray-500 hover:text-white text-xs">✕</button>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4 mb-6">

                                {/* Admin.jsx - Detailed View Section */}
<div className="grid grid-cols-2 gap-4 mb-6">
    {/* Purono OS ar Browser card-er niche egula add koren */}
    <div className="bg-black/40 p-4 rounded-2xl border border-gray-800">
        <p className="text-[9px] text-gray-500 uppercase mb-1">Hardware Model</p>
        <p className="text-sm font-black text-white italic">
            {selectedLog.device?.vendor} {selectedLog.device?.model}
        </p>
    </div>
    <div className="bg-black/40 p-4 rounded-2xl border border-gray-800">
        <p className="text-[9px] text-gray-500 uppercase mb-1">Screen Resolution</p>
        <p className="text-sm font-black text-cyan-400 italic">
            {selectedLog.device?.resolution || "Unknown"}
        </p>
    </div>
    <div className="bg-black/40 p-4 rounded-2xl border border-gray-800 col-span-2">
        <p className="text-[9px] text-gray-500 uppercase mb-1">Architecture & Engine</p>
        <p className="text-xs font-mono text-gray-400">
            CPU: {selectedLog.device?.cpu} | Ver: {selectedLog.device?.browserVersion}
        </p>
    </div>
</div>

                                <div className="bg-black/40 p-4 rounded-2xl border border-gray-800">
                                    <p className="text-[9px] text-gray-500 uppercase mb-1">Operating System</p>
                                    <p className="text-sm font-black text-white italic">{selectedLog.device?.os || "N/A"}</p>
                                </div>
                                <div className="bg-black/40 p-4 rounded-2xl border border-gray-800">
                                    <p className="text-[9px] text-gray-500 uppercase mb-1">Browser Engine</p>
                                    <p className="text-sm font-black text-white italic">{selectedLog.device?.browser || "N/A"}</p>
                                </div>
                                <div className="bg-black/40 p-4 rounded-2xl border border-gray-800 col-span-2">
                                    <p className="text-[9px] text-gray-500 uppercase mb-1">Geolocation</p>
                                    <p className="text-sm font-black text-green-400 italic">
                                        {selectedLog.approximateCity}, {selectedLog.approximateCountry}
                                    </p>
                                </div>
                            </div>

                            {/* Leaflet Map */}
                            <div className="h-[300px] w-full rounded-2xl overflow-hidden border border-gray-800 relative shadow-inner">
                                <MapContainer center={[selectedLog.coords.lat, selectedLog.coords.lng]} zoom={13} style={{height: "100%", width: "100%"}} key={selectedLog._id}>
                                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                    <Marker position={[selectedLog.coords.lat, selectedLog.coords.lng]}>
                                        <Popup>Target Locked: {selectedLog.ip}</Popup>
                                    </Marker>
                                </MapContainer>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Admin;