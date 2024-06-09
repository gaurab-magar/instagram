'use client'
import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { FaRegHeart, FaHeart } from 'react-icons/fa';
import { collection, deleteDoc, doc, getFirestore, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '../../firebase'; // Ensure the correct import path

function LikeSection({id}) {
    
    const {data:session} = useSession();
    const [hasLiked , setHasLiked] = useState(false);
    const [likes,setLikes] = useState([]);

    console.log(`from like section ${id}`)
    console.log(`session from LikeSection:::${session.user.username}`)

    useEffect(() => {
        if (!id) return; // Ensure id is available
        const unsubscribe = onSnapshot(collection(db, "posts", id, "likes"),
            (snapshot) => {
                setLikes(snapshot.docs);
            }
        );
        return () => unsubscribe();
    }, [db, id]);
    

    useEffect(() => {
        if (!session?.user) return; // Ensure session and user are available
        setHasLiked(likes.findIndex((like) => like.id === session.user.uid) !== -1);
    }, [likes, session]);
    
    async function likePost() {
        if (!session?.user) {
            console.log("User not logged in");
            return;
        }
    
        try {
            const likeRef = doc(db, "posts", id, "likes", session.user.uid);
            if (hasLiked) {
                await deleteDoc(likeRef); // Remove the like document
            } else {
                await setDoc(likeRef, {
                    username: session.user.username
                }); // Add the like document
            }
            setHasLiked(!hasLiked); // Toggle the like status locally
        } catch (error) {
            console.error('Error liking post:', error);
        }
    }
    
  return (
    <div>
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

