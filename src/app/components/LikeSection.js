import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { FaRegHeart, FaHeart } from 'react-icons/fa';
import { collection, deleteDoc, doc, getFirestore, onSnapshot, setDoc } from 'firebase/firestore';

const LikeSection = ({ id }) => {
    const { data: session } = useSession();
    const [hasLiked, setHasLiked] = useState(false);
    const [likes, setLikes] = useState([]);
    const db = getFirestore();

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, 'posts', id, 'likes'), (snapshot) => {
            const likesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setLikes(likesData);
        });
        return () => unsubscribe();
    }, [db, id]);

    useEffect(() => {
        if (session && likes.length > 0) {
            const hasLiked = likes.some(like => like.uid === session.user?.uid);
            setHasLiked(hasLiked);
        }
    }, [likes, session]);

    async function likePost() {
        if (!session || !session.user?.uid) return; // Ensure user is logged in
        try {
            if (hasLiked) {
                await deleteDoc(doc(db, 'posts', id, 'likes', session.user.uid));
            } else {
                await setDoc(doc(db, 'posts', id, 'likes', session.user.uid), {
                    uid: session.user.uid,
                    username: session.user.username,
                });
            }
            setHasLiked(!hasLiked); // Toggle the like status
        } catch (error) {
            console.error('Error:', error);
        }
    }

    return (
        <div>
            {session && (
                <>
                    <div className='flex items-center justify-between p-1 mt-2 border-t border-gray-100'>
                        <div className='flex gap-3'>
                            {hasLiked ? (
                                <FaHeart onClick={likePost} className='text-2xl hover:scale-110 transition-transform duration-200 ease-out' />
                            ) : (
                                <FaRegHeart onClick={likePost} className='text-2xl hover:scale-110 transition-transform duration-200 ease-out' />
                            )}
                            {/* <FaRegComment className='text-2xl hover:scale-110 transition-transform duration-200 ease-out' />
                            <RiSendPlaneFill className='text-2xl hover:scale-110 transition-transform duration-200 ease-out' /> */}
                        </div>
                        {/* <MdOutlineSaveAlt className='text-2xl hover:scale-110 transition-transform duration-200 ease-out' /> */}
                    </div>
                    <p className='text-gray-400 pl-2'>{likes.length} likes</p>
                </>
            )}
        </div>
    );
};

export default LikeSection;
