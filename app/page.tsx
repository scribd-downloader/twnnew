
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

            <div className="w-full max-w-7xl mx-auto z-10 flex flex-col gap-10 mt-10 md:mt-20 px-4 md:px-0">

                {/* Hero Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="w-full space-y-4 md:space-y-6"
                >
                    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 tracking-tight w-full">
                        Twitter Video Downloader
                    </h1>
                    <p className="text-base sm:text-lg md:text-xl text-slate-300 w-full leading-relaxed">
                        Download Twitter videos &amp; GIFs from tweets easily and instantly.
                    </p>
                </motion.div>

                {/* Search Input */}
                <motion.form
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2, duration: 0.4 }}
                    onSubmit={handleSubmit}
                    className="w-full max-w-4xl relative group"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-500" />
                    <div className="relative flex flex-col sm:flex-row items-center bg-slate-800/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-2 shadow-2xl gap-2 sm:gap-0">
                        <div className="pl-4 text-slate-400 hidden sm:block">
                            <Search className="w-6 h-6" />
                        </div>
                        <input
                            type="text"
                            placeholder="Paste tweet URL here (e.g., https://x.com/...)"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            className="w-full bg-transparent border-none outline-none text-white text-base sm:text-lg placeholder:text-slate-500 px-4 py-3 sm:py-4"
                        />
                        <button
                            disabled={loading}
                            type="submit"
                            className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold rounded-xl px-8 py-3 transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
                        >
                            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Download'}
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
                                    <p className="text-slate-400 text-xs sm:text-sm">@{data.user.screen_name}</p>
                                    <p className="mt-2 text-slate-200 leading-relaxed text-sm md:text-base break-words">
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

                <div className="w-full mt-8 md:mt-12 mb-4">
                    <p className="text-sm md:text-lg text-slate-300 w-full leading-relaxed text-left">
                        Twitter video downloader allow users to save publicly available videos shared on Twitter. Since Twitter itself does not provide a built-in option to directly download videos, our website helps bridge that gap by extracting the video file from the tweet link and preparing it for download. This service works directly from your browser. You do not need to install any application or create an account.
                    </p>
                </div>

                <div className="w-full text-left mt-12 mb-8">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        Download a Twitter Video
                        <span className="block text-purple-400 mt-2 text-2xl md:text-3xl">with Easy Steps</span>
                    </h2>
                    <p className="text-slate-400 mb-8 w-full">Follow these simple steps to download any public Twitter video using our downloader</p>

                    <div className="flex flex-col gap-8 w-full max-w-4xl mx-auto">
                        {/* Step 1 */}
                        <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6 lg:p-8 hover:border-purple-500/50 transition-colors flex flex-col gap-6">
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-3">
                                    <span className="bg-purple-600 text-white min-w-[32px] w-8 h-8 rounded-full flex items-center justify-center font-bold">1</span>
                                    <h3 className="text-white font-semibold text-xl">Open Twitter</h3>
                                </div>
                                <p className="text-slate-300 text-base leading-relaxed pl-11">First, open Twitter in your browser or mobile app and find the tweet that contains the video you want to download.</p>
                            </div>
                            <img src="/images/Open Twitter  X.webp" alt="Open Twitter" className="w-full h-auto rounded-xl shadow-lg object-cover" />
                        </div>

                        {/* Step 2 */}
                        <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6 lg:p-8 hover:border-purple-500/50 transition-colors flex flex-col gap-6">
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-3">
                                    <span className="bg-purple-600 text-white min-w-[32px] w-8 h-8 rounded-full flex items-center justify-center font-bold">2</span>
                                    <h3 className="text-white font-semibold text-xl">Copy the Tweet Link</h3>
                                </div>
                                <p className="text-slate-300 text-base leading-relaxed pl-11">Once you locate the video: Click or tap the <strong className="text-white">Share</strong> icon on the tweet. Select <strong className="text-white">Copy Link</strong> or <strong className="text-white">Copy Tweet Link</strong>. This will copy the video URL to your clipboard.</p>
                            </div>
                            <img src="/images/Copy the Tweet Link.webp" alt="Copy the Tweet Link" className="w-full h-auto rounded-xl shadow-lg object-cover" />
                        </div>

                        {/* Step 3 */}
                        <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6 lg:p-8 hover:border-purple-500/50 transition-colors flex flex-col gap-6">
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-3">
                                    <span className="bg-purple-600 text-white min-w-[32px] w-8 h-8 rounded-full flex items-center justify-center font-bold">3</span>
                                    <h3 className="text-white font-semibold text-xl">Paste the Link</h3>
                                </div>
                                <p className="text-slate-300 text-base leading-relaxed pl-11">Go to our Twitter Video Download page on this website. You will see an input box where you can paste the copied Twitter link. Paste the tweet URL into the provided field.</p>
                            </div>
                            <img src="/images/Paste the Link.webp" alt="Paste the Link" className="w-full h-auto rounded-xl shadow-lg object-cover" />
                        </div>

                        {/* Step 4 */}
                        <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6 lg:p-8 hover:border-purple-500/50 transition-colors flex flex-col gap-6">
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-3">
                                    <span className="bg-purple-600 text-white min-w-[32px] w-8 h-8 rounded-full flex items-center justify-center font-bold">4</span>
                                    <h3 className="text-white font-semibold text-xl">Start Processing</h3>
                                </div>
                                <p className="text-slate-300 text-base leading-relaxed pl-11">After pasting the link, click the Download button. Our system will automatically analyze the tweet and extract the available video formats. This process usually takes only a few seconds.</p>
                            </div>
                            <img src="/images/Start Processing.webp" alt="Start Processing" className="w-full h-auto rounded-xl shadow-lg object-cover" />
                        </div>

                        {/* Step 5 */}
                        <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6 lg:p-8 hover:border-purple-500/50 transition-colors flex flex-col gap-6">
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-3">
                                    <span className="bg-purple-600 text-white min-w-[32px] w-8 h-8 rounded-full flex items-center justify-center font-bold">5</span>
                                    <h3 className="text-white font-semibold text-xl">Choose Video Quality</h3>
                                </div>
                                <div className="pl-11">
                                    <p className="text-slate-300 text-base leading-relaxed mb-2">Once the video is processed, you will see different download options depending on the original video quality. These may include:</p>
                                    <ul className="list-disc pl-5 text-slate-300 text-base space-y-1 mb-2">
                                        <li>Standard quality</li>
                                        <li>High quality (HD)</li>
                                        <li>Mobile-optimized version</li>
                                    </ul>
                                    <p className="text-slate-300 text-base leading-relaxed">Select the version that best fits your needs.</p>
                                </div>
                            </div>
                            <img src="/images/Choose Video Quality.webp" alt="Choose Video Quality" className="w-full h-auto rounded-xl shadow-lg object-cover" />
                        </div>

                        {/* Step 6 */}
                        <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6 lg:p-8 hover:border-purple-500/50 transition-colors flex flex-col gap-6">
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-3">
                                    <span className="bg-purple-600 text-white min-w-[32px] w-8 h-8 rounded-full flex items-center justify-center font-bold">6</span>
                                    <h3 className="text-white font-semibold text-xl">Download the Video</h3>
                                </div>
                                <p className="text-slate-300 text-base leading-relaxed pl-11">Click the download option you prefer. The video will start downloading to your device and will be saved in your default downloads folder.</p>
                            </div>
                            <img src="/images/Download the Video.webp" alt="Download the Video" className="w-full h-auto rounded-xl shadow-lg object-cover" />
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <footer className="w-full mt-12 md:mt-20 border-t border-slate-700/50 pt-8 pb-8 flex flex-col items-center gap-8 px-4 md:px-0">
                    <div className="w-full max-w-7xl flex flex-col md:flex-row justify-between items-center md:items-start gap-8 md:gap-4">
                        <div className="flex flex-col gap-2 max-w-md text-center md:text-left">
                            <h4 className="text-xl font-bold text-white">
                                Twitter Video Downloader
                            </h4>
                            <p className="text-slate-400 text-sm leading-relaxed">
                                A free, fast, and secure tool to download Twitter videos and GIFs directly to your device. No app installation required.
                            </p>
                        </div>

                        <div className="flex flex-col items-center md:items-end gap-4">
                            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-sm font-medium">
                                <a href="#" className="text-slate-300 hover:text-purple-400 transition-colors">Privacy Policy</a>
                                <a href="#" className="text-slate-300 hover:text-purple-400 transition-colors">Terms of Service</a>
                                <a href="#" className="text-slate-300 hover:text-purple-400 transition-colors">Contact Us</a>
                            </div>
                        </div>
                    </div>

                    <div className="w-full border-t border-slate-800/50 pt-6 mt-2 flex flex-col items-center justify-center text-center">
                        <p className="text-slate-500 text-sm md:text-sm">
                            © {new Date().getFullYear()} Twitter Video Downloader. All rights reserved.<br />
                            Not affiliated with Twitter, Inc. or X Corp.
                        </p>
                    </div>
                </footer>
            </div>
        </main>
    );
}
