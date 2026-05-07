import React from 'react';
import { motion } from 'framer-motion';

const Footer = () => {
    return (
        <footer className="relative bg-gray-950 border-t border-gray-900 pt-16 pb-8 px-6 overflow-hidden">
            {/* Background Glow Effect */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[200px] bg-cyan-500/5 blur-[120px] pointer-events-none"></div>

            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    
                    {/* Brand Section */}
                    <div className="col-span-1 md:col-span-1">
                        <h2 className="text-2xl font-black italic text-white mb-4 tracking-tighter">
                            AEGIS<span className="text-cyan-500">QUEST</span>
                        </h2>
                        <p className="text-gray-500 text-xs leading-relaxed font-medium">
                            The next generation of neural-linked gaming. Experience zero-latency lobbies powered by Aegis Intelligence.
                        </p>
                    </div>

                    {/* Legal Links */}
                    <div>
                        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 mb-6">Legal & Security</h3>
                        <ul className="text-gray-500 text-[11px] space-y-3 font-mono">
                            <li className="hover:text-cyan-400 cursor-pointer transition-colors uppercase">Privacy Protocol</li>
                            <li className="hover:text-cyan-400 cursor-pointer transition-colors uppercase">Terms of Engagement</li>
                            <li className="hover:text-cyan-400 cursor-pointer transition-colors uppercase">EULA Agreement</li>
                            <li className="hover:text-cyan-400 cursor-pointer transition-colors uppercase">DMCA Policy</li>
                        </ul>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 mb-6">Network Nodes</h3>
                        <ul className="text-gray-500 text-[11px] space-y-3 font-mono">
                            <li className="hover:text-cyan-400 cursor-pointer transition-colors uppercase">Server Status</li>
                            <li className="hover:text-cyan-400 cursor-pointer transition-colors uppercase">Neural API</li>
                            <li className="hover:text-cyan-400 cursor-pointer transition-colors uppercase">Global License</li>
                        </ul>
                    </div>

                    {/* Compliance & Verification */}
                    <div className="flex flex-col md:items-end">
                        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 mb-6">Certified Security</h3>
                        <div className="flex gap-4 items-center mb-4">
                            <motion.img 
                                whileHover={{ filter: "grayscale(0%)", opacity: 1 }}
                                src="https://upload.wikimedia.org/wikipedia/commons/b/be/SSL_certified.png" 
                                alt="SSL" 
                                className="h-8 opacity-40 grayscale transition-all" 
                            />
                            <div className="border border-gray-800 px-3 py-1.5 rounded-md text-[9px] text-gray-500 font-bold tracking-widest bg-gray-900/50">
                                GDPR COMPLIANT
                            </div>
                        </div>
                        <p className="text-[10px] text-gray-600 font-mono md:text-right uppercase">
                            Protected by <span className="text-cyan-900">Quantum-Shield v4.0</span>
                        </p>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-gray-900 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-[10px] text-gray-700 font-mono tracking-widest uppercase">
                        © 2026 AEGIS-QUEST INTERACTIVE. ALL RIGHTS RESERVED.
                    </p>
                    
                    {/* Fake Social Links / Status Indicators */}
                    <div className="flex gap-6">
                        {['discord', 'twitter', 'github'].map((platform) => (
                            <span key={platform} className="text-[10px] text-gray-600 hover:text-white cursor-pointer uppercase font-black tracking-widest transition-colors italic">
                                {platform}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;