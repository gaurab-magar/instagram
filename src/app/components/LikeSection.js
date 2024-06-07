'use client'
import { useSession } from 'next-auth/react'
import React from 'react'
import { FcLike } from "react-icons/fc";
import { FaRegComment } from "react-icons/fa";
import { RiSendPlaneFill } from "react-icons/ri";
import { MdOutlineSaveAlt } from "react-icons/md";

const LikeSection = () => {
    const {data:session}=useSession();
  return (
    <div>
        {session && (
            <div className='flex items-center justify-between p-1 mt-2 border-t border-gray-100'>
                <div className='flex gap-3'>
                    <FcLike className='text-white text-2xl' />
                    <FaRegComment className='text-2xl' />
                    <RiSendPlaneFill className='text-2xl' />
                </div>
                    <MdOutlineSaveAlt className='text-2xl' />
            </div>
        )}
    </div>
  )
}

export default LikeSection