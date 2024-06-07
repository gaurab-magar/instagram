'use client'
import React from 'react'
import {signIn,signOut,useSession} from 'next-auth/react'
import Image from 'next/image';


const MiniProfile = () => {
    const { data : session } = useSession();
  return (
    <div className='border flex items-center justify-between mt-14 p-2'>
        <div className='flex items-center justify-center'>
            <Image src={session?.user?.image || '/insta.png'} alt='profileimage' width={100} height={100} className='w-16 h-16 rounded-full p-2'/>
            <div>
                <h2 className='font-semibold'>{session?.user?.username}</h2>
                <p className='font-thin'>Welcome to instagram</p>
            </div>
        </div>
        {
            session ? (
                <button onClick={signOut} className='px-3 bg-pink-600 text-white p-1 rounded-md shadow-md font-semibold'>signOut</button>
            ):(
                <button onClick={signIn} className='px-3 bg-pink-600 text-white p-1 rounded-md shadow-md font-semibold'>signIn</button>
            )
        }
    </div>
  )
}

export default MiniProfile;
