"use client"
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion' // Smooth animations ke liye

export default function GeneratePage() {
    const searchParams = useSearchParams();
    const prompt = searchParams.get('prompt');
    const type = searchParams.get('type') || 'quick'; // Type bhi le liya

    const [slides, setSlides] = useState<any[]>([]);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchContent = async () => {
            if (!prompt) return;
            try {
                const response = await fetch('/api/generate-course', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ prompt, type }), // Type backend bhej rahe hain
                });
                const data = await response.json();

                // Agar backend directly slides array bhej raha hai
                if (data.content) {
                    setSlides(data.content); // Database se aa raha hai
                } else if (Array.isArray(data)) {
                    setSlides(data); // Direct mock array aa raha hai
                }
                setLoading(false);
            } catch (err) {
                console.error("Fetch error:", err);
            }
        };
        fetchContent();
    }, [prompt, type]);

    // Slide transition logic (Auto-play)
    useEffect(() => {
        if (slides.length > 0) {
            const timer = setInterval(() => {
                setCurrentSlide((prev) => (prev + 1) % slides.length);
            }, 7000); // 7 seconds for better reading
            return () => clearInterval(timer);
        }
    }, [slides]);

    if (loading) {
        return (
            <div className="h-screen bg-black text-white flex flex-col items-center justify-center">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    className="w-14 h-14 border-4 border-primary border-t-transparent rounded-full mb-6"
                />
                <p className="animate-pulse text-xl font-medium tracking-wide">
                    AI is crafting your {type === 'long' ? 'Full Course' : 'Quick Story'}...
                </p>
            </div>
        );
    }

    return (
        <div className="h-screen bg-black text-white flex flex-col items-center justify-center p-6 md:p-10 overflow-hidden relative">

            {/* Background Music - User interaction ke bina autoPlay aksar block ho jata hai chrome mein */}
            <audio src="/music.mp3" autoPlay loop />

            <AnimatePresence mode="wait">
                <motion.div
                    key={currentSlide}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.8 }}
                    className="max-w-5xl w-full flex flex-col items-center gap-8 text-center"
                >
                    {/* Header */}
                    <h2 className="text-4xl md:text-6xl font-black bg-gradient-to-b from-white to-gray-500 bg-clip-text text-transparent leading-tight">
                        {slides[currentSlide].title}
                    </h2>

                    {/* Image Container */}
                    <div className="relative w-full aspect-video max-w-3xl overflow-hidden rounded-3xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
                        <motion.img
                            initial={{ scale: 1.2 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 10 }} // Slow zoom effect like a movie
                            src={`https://pollinations.ai/p/${encodeURIComponent(slides[currentSlide].imagePrompt + " cinematic, hyper realistic, 8k, digital art, tech theme")}?width=1080&height=600&nologo=true`}
                            className="w-full h-full object-cover"
                            alt="Visual"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    </div>

                    {/* Content */}
                    <p className="text-xl md:text-3xl text-gray-300 font-light max-w-4xl leading-relaxed">
                        {slides[currentSlide].content}
                    </p>
                </motion.div>
            </AnimatePresence>

            {/* Progress Indicators */}
            <div className="absolute bottom-10 flex gap-3">
                {slides.map((_, index) => (
                    <div
                        key={index}
                        className={`h-1.5 rounded-full transition-all duration-700 ${index === currentSlide ? 'w-12 bg-primary shadow-[0_0_15px_#primary]' : 'w-3 bg-white/20'
                            }`}
                    />
                ))}
            </div>

            {/* Navigation Buttons (Optional) */}
            <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-4 pointer-events-none">
                <button
                    onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
                    className="p-4 rounded-full bg-white/5 hover:bg-white/10 pointer-events-auto transition-all"
                >
                    ←
                </button>
                <button
                    onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
                    className="p-4 rounded-full bg-white/5 hover:bg-white/10 pointer-events-auto transition-all"
                >
                    →
                </button>
            </div>
        </div>
    )
}