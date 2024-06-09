'use client'
import { app } from '@/firebase';
import { addDoc, collection, getFirestore, onSnapshot, orderBy, query, serverTimestamp } from 'firebase/firestore';
import { useSession } from 'next-auth/react'
import Image from 'next/image';
import React, { useEffect, useState } from 'react'

const CommentSection = ({id}) => {
    const {data:session} = useSession();
    const [comment , setComment] = useState('');
    const [comments , setComments] = useState([]);
    const db = getFirestore(app); 

    async function PostComment(e){
        e.preventDefault()
        const commentToPost = comment;
        setComment('');

        await addDoc(collection(db,'posts',id,'comments'),{
            comment: commentToPost,
            username: session.user.username,
            userImage: session.user.image,
            timestamp: serverTimestamp(),
        })
    }
    useEffect(()=>{
        onSnapshot(query(collection(db,'posts',id,'comments'),
        orderBy('timestamp','desc'),
        (snapshot)=>{
            setComments(snapshot.docs);
        }))
    },[db])
  return (
    <div>
        {
            comments.length > 0 && (
                <div className='p-2 overflow-y-scroll max-h-60'>
                    {comments.map((comment)=>(
                        <div key={comment.id} className='flex items-center space-x-2 mb-2'>
                            <Image src={comment.data().userImage} alt='profileimage' width={100} height={100} className='w-8 h-8 rounded-full object-cover border mr-3'/>
                            <p className='text-sm'>
                                <span className='font-bold'>
                                    {comment.data().username}
                                </span>
                                {comment.data().comment}
                            </p>
                        </div>
                    ))}
                </div>
            )
        }
        {
            session && (
                <div className='p-2'>
                    <form onSubmit={PostComment} className='flex items-center justify-between'>
                        <div className='flex items-center'>
                            <Image src={session?.user?.image} alt='profileimage' width={100} height={100} className='w-8 h-8 rounded-full object-cover border mr-3'/>
                            <p className='text-gray-400 text-sm font-semibold'>{session?.user?.username}</p>
                        </div>
                        <input type='text' className='w-32 outline-none' placeholder='Comment here...' value={comment} onChange={(e)=>setComment(e.target.value)} />
                        <button disabled={!comment.trim()} type='submit' className='text-pink-400 disabled:cursor-not-allowed cursor-pointer' >Post</button>
                    </form>
                </div>
            )
        }
    </div>
  )
}

export default CommentSection