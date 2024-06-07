import Image from 'next/image';
import React from 'react'
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { FcLike } from "react-icons/fc";
import { FaRegComment } from "react-icons/fa";
import { RiSendPlaneFill } from "react-icons/ri";
import { MdOutlineSaveAlt } from "react-icons/md";
import LikeSection from './LikeSection';


const Post = ({post}) => {
  return (
    <div className='shadow-md bg-white my-5 rounded-md p-4'>
        <div className='flex items-center p-2 border-b border-gray-200 mb-1'>
            <Image src={post.image} alt='profileimage' width={100} height={100} className='w-12 h-12 rounded-full p-1 object-cover border mr-3'/>
            <p className='font-bold flex-1'>{post.username}</p>
            <HiOutlineDotsHorizontal className='cursor-pointer text-2xl' />
        </div>
        <Image src={post.image} alt='profileimage' width={100} height={100} className='w-full h-96 object-center rounded-sm p-1 object-cover mr-3'/>
        <LikeSection id={post.id} likes={post.likes} />
        <p className='p-5 truncate'>
            <span className='font-bold mr-2'>{post.username}</span>
            {post.caption}
        </p>
    </div>
  )
}

export default Post;