"use client"
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Send } from 'lucide-react'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Suggestion, SUGGESTIONS } from '@/data/constant'

function Hero() {
    const [userInput, setUserInput] = useState<string>("");
    const [selectedType, setSelectedType] = useState<string>("course"); // State for Type
    const router = useRouter();

    const handleGenerate = () => {
        if (!userInput.trim()) {
            alert("Kuch likho toh sahi bhai! 😂");
            return;
        }

        // Ab prompt ke saath type bhi bhej rahe hain query params mein
        router.push(`/generate?prompt=${encodeURIComponent(userInput)}&type=${selectedType}`);
    }

    return (
        <div className='flex flex-col items-center justify-center mt-24 px-5 md:px-20 gap-8'>
            <div className='text-center space-y-4'>
                <h2 className='text-5xl md:text-6xl font-extrabold tracking-tight'>
                    Learn Smarter with <span className='text-primary'>AI</span>
                </h2>
                <p className='text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto'>
                    Turn any complex topic into an easy-to-understand video or story in seconds.
                </p>
            </div>

            <div className="w-full max-w-2xl relative p-1 shadow-2xl rounded-2xl border bg-card">
                <textarea
                    className="flex min-h-[140px] w-full resize-none bg-transparent px-4 py-4 text-lg outline-none border-none focus-visible:ring-0 placeholder:text-muted-foreground/60"
                    placeholder="What do you want to learn today?"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                />

                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-auto">
                    <div className="pointer-events-auto">
                        {/* value aur onValueChange add kiya */}
                        <Select value={selectedType} onValueChange={(value) => setSelectedType(value)}>
                            <SelectTrigger className="w-[160px] bg-background border-none shadow-sm h-9">
                                <SelectValue placeholder="Theme" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {/* Value ko backend logic se match karne ke liye 'long' aur 'quick' rakhte hain */}
                                    <SelectItem value="long">Full-Course</SelectItem>
                                    <SelectItem value="quick">Quick-Explain</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="pointer-events-auto">
                        <button
                            className="bg-primary text-primary-foreground p-3 rounded-xl shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center justify-center"
                            onClick={handleGenerate}
                        >
                            <Send className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            <div className='flex flex-wrap items-center justify-center gap-2 max-w-2xl'>
                <span className='text-sm text-muted-foreground mr-1'>Try:</span>
                {SUGGESTIONS.map((item: Suggestion) => (
                    <button
                        key={item.id}
                        onClick={() => setUserInput(item.prompt)}
                        className="text-xs font-medium bg-secondary/50 hover:bg-secondary border px-3 py-1.5 rounded-full transition-all flex items-center gap-1 shadow-sm"
                    >
                        <span>{item.icon}</span>
                        {item.title}
                    </button>
                ))}
            </div>
        </div>
    )
}
export default Hero