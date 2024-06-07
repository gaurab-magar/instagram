'use client'
import React, { useState , useRef , useEffect} from 'react'
import Link from "next/link"
import { FaInstagram } from "react-icons/fa6";
import { IoSearchOutline } from "react-icons/io5";
import { RxAvatar } from "react-icons/rx";
import { signIn, useSession , signOut } from 'next-auth/react';
import Image from 'next/image';
import { IoIosAddCircle } from "react-icons/io";
import { TiCamera } from "react-icons/ti";

import Modal from 'react-modal';
import { IoIosCloseCircle } from "react-icons/io";

import { db , storage , app } from '@/firebase';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { Timestamp, addDoc, collection, serverTimestamp } from 'firebase/firestore';







const Navbar = () => {
    const {data:session} = useSession();
    console.log(session);
    const [isOpenModal , setOpenModal] = useState(false);

    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadingImgFile, setUploadingImgFile] = useState(false);

    const [caption, setCaption] = useState('');
    const [imageFileUrl, setImageFileUrl] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');

    const [postUploading, setPostUploading] = useState(false);


    const filePickerRef = useRef(null);

    function addImageToPost(e) {
        const file = e.target.files[0];
        const maxSize = 2 * 1024 * 1024; // 2MB
    
        if (file) {
          if (file.size > maxSize) {
            setErrorMessage('File size is too large. Please select a file smaller than 2MB.');
            setSelectedFile(null);
            setImageFileUrl(null);
          } else {
            setErrorMessage('');
            setSelectedFile(file);
            setImageFileUrl(URL.createObjectURL(file));
          }
        }
      }

      useEffect(()=>{
        if(selectedFile){
            uploadImageToStorage();
        }
      },[selectedFile]);

      async function uploadImageToStorage(){
        setUploadingImgFile(true);
        const storage = getStorage(app);
        const fileName = new Date().getTime() + '-' + selectedFile.name;
        const storageRef = ref(storage,fileName);
        const uploadTask = uploadBytesResumable(storageRef,selectedFile);

        uploadTask.on(
            'state_changed',
            (snapshot)=>{
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('upload is' + progress + '% done');
            },
            (error) => {
                console.log(error);
                setUploadingImgFile(false);
                setImageFileUrl(null);
                setSelectedFile(null);
            },
            ()=>{
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL)=>{
                    setImageFileUrl(downloadURL);
                    setUploadingImgFile(false);
                    console.log('file available at', downloadURL);
                })
            }
        )
      }

      async function handleSubmit(){
        setPostUploading(true);
        const docRef = await addDoc(collection(db,'posts'),{
            username : session.user.username,
            caption,
            profileImg: session.user.image,
            image: imageFileUrl,
            Timestamp: serverTimestamp(),
        });
        setPostUploading(false);
        setOpenModal(false);
        setSelectedFile(null);
        setImageFileUrl(null);
        setCaption('');
      }

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
            <div className='flex gap-2 items-center justify-center '>
                <IoIosAddCircle onClick={()=>setOpenModal(true)} className='text-3xl text-pink-600 cursor-pointer hover:scale-105 duration-200 ease-in-out' />
                <div className="rounded-full overflow-hidden cursor-pointer hover:scale-105 duration-200 ease-in-out">
                    <Image onClick={() => signOut()} src={session.user.image} alt={session.user.name} width={40} height={40} />
                </div>      
            </div>
        ):(
            <div className='p-1 cursor-pointer hover:scale-105 duration-75 ease-in-out' onClick={()=> signIn()}>
                <RxAvatar className="text-3xl" />
            </div>
        )}
        {isOpenModal && 
            <Modal isOpen={isOpenModal} onRequestClose={() => setOpenModal(false)} ariaHideApp={false} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 md:w-[30%] w-[80%] flex flex-col items-center justify-center gap-2 bg-white p-5 rounded-md shadow-2xl border-none outline-none">
                <button onClick={() => setOpenModal(false)} className='absolute top-3 right-3 focus:scale-110 hover:scale-110 duration-200'>
                    <IoIosCloseCircle className='text-pink-700 text-2xl' />
                </button>
                <div className='overflow-hidden rounded-md'>
                    {selectedFile ? (
                        <Image src={imageFileUrl} alt="image" className={`max-h-[250px] w-full object-contain ${uploadingImgFile ? 'animate-pulse' : ''}`} width={300} height={100} />
                    ) : (
                        <TiCamera className='text-8xl p-1' onClick={() => filePickerRef.current.click()} />
                    )} 
                </div>
                <input hidden ref={filePickerRef} type='file' accept='image/*' onChange={addImageToPost} />
                <input onChange={(e) => setCaption(e.target.value)} type='text' className='focus:outline-none text-center m-4 w-full' placeholder='Please enter your caption..' maxLength='150' />
                {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
                <button disabled={!selectedFile || caption.trim() === '' || postUploading } onClick={handleSubmit} className='w-full rounded-md shadow-xl disabled:bg-pink-200 font-semibold bg-pink-600 text-white py-1 hover:brightness-105'>Upload Post</button>
            </Modal>
        }
    </header>
    
)
}

export default Navbar
