"use client"
import { Button } from '@/components/ui/button'
import { SignInButton, UserButton, useUser } from '@clerk/nextjs'
import Image from 'next/image'
import Link from 'next/link' // Next.js Link
import React from 'react'

function Header() {
    const { user } = useUser()

    return (
        <div className='flex items-center justify-between p-4 px-10 shadow-md border-b bg-background/80 backdrop-blur-md sticky top-0 z-50'>
            {/* Logo Section */}
            <Link href={"/"} className='flex items-center gap-3 hover:opacity-80 transition-all'>
                <Image src={"/globe.svg"} alt="logo" width={40} height={40} />
                <h2 className='font-bold text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
                    Vid Course
                </h2>
            </Link>

            {/* Menu Links */}
            <ul className='hidden md:flex gap-8 items-center font-medium'>
                <Link href={"/"}>
                    <li className='hover:text-primary cursor-pointer transition-all'>Home</li>
                </Link>
                <li className='hover:text-primary cursor-pointer transition-all'>Pricing</li>
            </ul>

            {/* Auth Section */}
            <div className='flex items-center gap-4'>
                {user ? (
                    <div className='flex items-center gap-4'>
                        {/* Dashboard Link */}
                        <Link href={"/dashboard"}>
                            <Button variant="ghost" className="hidden sm:inline-flex rounded-full">
                                Dashboard
                            </Button>
                        </Link>
                        <UserButton afterSignOutUrl="/" />
                    </div>
                ) : (
                    <SignInButton mode='modal'>
                        <Button className='rounded-full px-6 shadow-lg'>Get Started</Button>
                    </SignInButton>
                )}
            </div>
        </div>
    )
}

export default Header