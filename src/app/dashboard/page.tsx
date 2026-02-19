"use client"
import React, { useEffect, useState } from 'react'
import { db } from "@/config/db"
import { Courses } from "@/config/schema"
import { eq, desc } from "drizzle-orm"
import { useUser } from '@clerk/nextjs'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Play, BookOpen, Trash2, Zap } from 'lucide-react'

function Dashboard() {
    const { user } = useUser();
    const [courseList, setCourseList] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        if (user) {
            getUserCourses();
        }
    }, [user]);

    const getUserCourses = async () => {
        setLoading(true);
        // Direct DB call client side par allow nahi hoti, ideally ek API route banana chahiye
        // But testing ke liye tu isse fetch('/api/user-courses') se replace kar sakta hai
        const response = await fetch('/api/user-courses');
        const data = await response.json();
        setCourseList(data);
        setLoading(false);
    }

    return (
        <div className='p-10 md:px-20 lg:px-40 mt-10'>
            <div className='flex justify-between items-center mb-10'>
                <div>
                    <h2 className='text-3xl font-bold'>My AI Library</h2>
                    <p className='text-muted-foreground'>All your generated stories and courses in one place.</p>
                </div>
                <button
                    onClick={() => router.push('/')}
                    className='bg-primary text-white px-5 py-2 rounded-full hover:scale-105 transition-all text-sm font-medium'
                >
                    + Create New
                </button>
            </div>

            {loading ? (
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                    {[1, 2, 3].map((item) => (
                        <div key={item} className='h-48 w-full bg-gray-200 animate-pulse rounded-2xl'></div>
                    ))}
                </div>
            ) : (
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
                    {courseList.length > 0 ? courseList.map((course, index) => (
                        <motion.div
                            key={index}
                            whileHover={{ y: -5 }}
                            className='relative group cursor-pointer'
                            onClick={() => router.push(`/generate?prompt=${course.prompt}&type=${course.type}`)}
                        >
                            <div className='p-6 rounded-3xl border bg-card hover:shadow-xl transition-all h-full flex flex-col justify-between'>
                                <div>
                                    <div className='flex justify-between items-start mb-4'>
                                        <div className={`p-2 rounded-lg ${course.type === 'long' ? 'bg-blue-100 text-blue-600' : 'bg-orange-100 text-orange-600'}`}>
                                            {course.type === 'long' ? <BookOpen size={20} /> : <Zap size={20} />}
                                        </div>
                                        <Trash2 className='text-muted-foreground hover:text-red-500 transition-colors' size={18} />
                                    </div>
                                    <h3 className='text-xl font-bold line-clamp-2 mb-2'>{course.prompt}</h3>
                                    <p className='text-sm text-muted-foreground'>{course.content?.length} Slides</p>
                                </div>

                                <div className='mt-6 flex items-center text-primary font-semibold text-sm gap-2'>
                                    <Play size={16} fill="currentColor" />
                                    Watch Again
                                </div>
                            </div>
                        </motion.div>
                    )) : (
                        <div className='col-span-full text-center py-20 border-2 border-dashed rounded-3xl'>
                            <p className='text-muted-foreground'>Abhi tak kuch generate nahi kiya? Shuru ho jao! 🚀</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default Dashboard