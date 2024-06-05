'use client'
import React from 'react'
import Link from "next/link"
import { FaInstagram } from "react-icons/fa6";
import { IoSearchOutline } from "react-icons/io5";
import { RxAvatar } from "react-icons/rx";
import { signIn, useSession , signOut } from 'next-auth/react';
import Image from 'next/image';


const Navbar = () => {
    const {data:session} = useSession();
    console.log(session);
  return (
    <header className="flex h-16 w-full items-center justify-between px-4 md:px-6 border-b shadow-md sticky ">
        <Link className="" href="/">
        <FaInstagram className="text-3xl text-pink-600" />
        </Link>
        <div className="flex items-center justify-center w-2/3 md:w-1/3  relative">
            <input className='border-none w-full py-2 pr-8 text-gray-900 text-base bg-transparent  outline-none dark:text-gray-50 placeholder:text-gray-500 dark:placeholder:text-gray-400' placeholder='Write a caption...' id="search" type="text" />
            <button className="absolute right-5">
                <IoSearchOutline className="text-xl text-pink-500" />
            </button>
        </div>

        {session ? (
            <div className="rounded-full overflow-hidden cursor-pointer hover:scale-105 duration-200 ease-in-out">
                <Image onClick={() => signOut()} src={session.user.image} alt={session.user.name} width={40} height={40} />
            </div>      
        ):(
            <div className='p-1 cursor-pointer hover:scale-105 duration-75 ease-in-out' onClick={()=> signIn()}>
                <RxAvatar className="text-3xl" />
            </div>
        )}
        
  </header>
    
)
}

export default Navbar
