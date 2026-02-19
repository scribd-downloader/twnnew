
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Download, Image as ImageIcon, Video, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function Home() {
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<any>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!url) return;

        setLoading(true);
        setError(null);
        setData(null);

        try {
            const res = await fetch('/api/harvest', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url }),
            });

            const json = await res.json();

            if (!res.ok) {
                throw new Error(json.error || 'Failed to fetch tweet');
            }

            setData(json);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 text-white p-4 md:p-8 flex flex-col items-center">
            {/* Background blobs */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[100px]" />
            </div>

            <div className="w-full max-w-3xl z-10 flex flex-col items-center gap-12 mt-12 md:mt-24">

                {/* Hero Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center space-y-4"
                >
                    <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 tracking-tight">
                        Media Harvest
                    </h1>
                    <p className="text-lg md:text-xl text-slate-300 max-w-xl mx-auto">
                        The premium tool to extract high-quality videos and images from X (formerly Twitter).
                    </p>
                </motion.div>

                {/* Search Input */}
                <motion.form
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2, duration: 0.4 }}
                    onSubmit={handleSubmit}
                    className="w-full relative group"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-500" />
                    <div className="relative flex items-center bg-slate-800/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-2 shadow-2xl">
                        <div className="pl-4 text-slate-400">
                            <Search className="w-6 h-6" />
                        </div>
                        <input
                            type="text"
                            placeholder="Paste tweet URL here (e.g., https://x.com/...)"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            className="w-full bg-transparent border-none outline-none text-white text-lg placeholder:text-slate-500 px-4 py-4"
                        />
                        <button
                            disabled={loading}
                            type="submit"
                            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold rounded-xl px-8 py-3 transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Harvest'}
                        </button>
                    </div>
                </motion.form>

                {/* Error Message */}
                <AnimatePresence>
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="w-full bg-red-500/10 border border-red-500/20 text-red-200 p-4 rounded-xl flex items-center gap-3 backdrop-blur-md"
                        >
                            <AlertCircle className="w-6 h-6 flex-shrink-0" />
                            <span>{error}</span>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Results */}
                <AnimatePresence>
                    {data && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="w-full grid gap-8"
                        >
                            {/* User Info */}
                            <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6 flex items-start gap-4">
                                <img
                                    src={data.user.profile_image_url}
                                    alt={data.user.name}
                                    className="w-12 h-12 rounded-full ring-2 ring-purple-500/50"
                                />
                                <div>
                                    <h3 className="font-bold text-lg">{data.user.name}</h3>
                                    <p className="text-slate-400 text-sm">@{data.user.screen_name}</p>
                                    <p className="mt-2 text-slate-200 leading-relaxed text-sm md:text-base">
                                        {data.text}
                                    </p>
                                </div>
                            </div>

                            {/* Media Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {data.media.map((item: any, idx: number) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: idx * 0.1 }}
                                        className="bg-slate-800/50 backdrop-blur-md border border-slate-700/50 rounded-2xl overflow-hidden group hover:border-purple-500/50 transition-colors"
                                    >
                                        <div className="aspect-square relative flex items-center justify-center bg-black/40">
                                            {item.type === 'photo' ? (
                                                <img
                                                    src={item.url}
                                                    alt="Media"
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="relative w-full h-full">
                                                    <img
                                                        src={item.poster}
                                                        alt="Video Thumbnail"
                                                        className="w-full h-full object-cover opacity-80"
                                                    />
                                                    <div className="absolute inset-0 flex items-center justify-center">
                                                        <div className="w-16 h-16 bg-white/10 rounded-full backdrop-blur-sm flex items-center justify-center border border-white/20 shadow-xl">
                                                            <Video className="w-8 h-8 text-white" />
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <div className="p-4 space-y-3">
                                            <div className="flex items-center gap-2 text-slate-400 text-xs uppercase tracking-wider font-medium">
                                                {item.type === 'photo' ? <ImageIcon className="w-4 h-4" /> : <Video className="w-4 h-4" />}
                                                {item.type}
                                            </div>

                                            {item.type === 'photo' ? (
                                                <a
                                                    href={item.url}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="block w-full text-center bg-slate-700 hover:bg-slate-600 text-white rounded-lg py-2.5 font-medium transition-colors border border-slate-600"
                                                >
                                                    View Full Size
                                                </a>
                                            ) : (
                                                <div className="space-y-2">
                                                    {item.variants.map((v: any, vIdx: number) => (
                                                        <a
                                                            key={vIdx}
                                                            href={v.url}
                                                            download
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="flex items-center justify-between w-full bg-slate-700 hover:bg-purple-600 text-white rounded-lg px-4 py-2.5 font-medium transition-colors border border-slate-600 hover:border-purple-500 group/btn"
                                                        >
                                                            <span className="text-sm">Video ({v.content_type.split('/')[1]})</span>
                                                            <Download className="w-4 h-4 opacity-50 group-hover/btn:opacity-100" />
                                                        </a>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </main>
    );
}
