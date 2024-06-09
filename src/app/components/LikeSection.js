'use client'
import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { FaRegHeart, FaHeart } from 'react-icons/fa';

function LikeSection({id}) {
    
    const {data:session} = useSession();
    const [hasLiked , setHasLiked] = useState(false);

    async function likePost() {
       setHasLiked(!hasLiked);
    }
    
  return (
    <div className='my-2'>
        {session && (
            <div>
                {hasLiked ? (
                    <FaHeart onClick={likePost} className='text-2xl hover:scale-110 transition-transform duration-200 ease-out text-red-500' />
                ) : (
                    <FaRegHeart onClick={likePost} className='text-2xl hover:scale-110 transition-transform duration-200 ease-out' />
                )}
            </div>
        )
        }
    </div>
  )
}

export default LikeSection

