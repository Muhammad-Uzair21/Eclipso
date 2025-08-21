import React from 'react'
import { FaPaperPlane } from 'react-icons/fa'
import Image from 'next/image'

const Chatbot = () => {
  return (
    <div className='h-[100vh] w-full flex items-center justify-center'>
        <div className='h-full w-[70%] relative'>
            <div className='mt-5 w-full h-full flex flex-col gap-5 items-center'>
                {/* TOP HEADING */}
                <span><Image src='/Eclipso.svg' height={160} width={160} alt='logo'></Image></span>
                
                
                {/* CHAT AREA */}
                <textarea name="Hello" id="chat" className='w-full h-[68%] outline-none bg-[color:var(--Charc)]/10 backdrop-blur-sm shadow-2xl rounded-2xl overflow-hidden text-[color:var(--secondary)] p-4 resize-none cursor-not-allowed'></textarea>


                {/* INPUT SECTION */}
                <div className='w-full bg-[color:var(--Charc)] p-3 rounded-full shadow-2xl text-[color:var(--secondary)] absolute bottom-5'>
                    <div className='w-[95%] mx-auto flex items-center justify-between'>
                        <input type="text" placeholder="What's on your mind?" className='border-none outline-none w-[85%] sm:w-[90%] text-lg '/>
                        <span className='rounded-full p-2 flex items-center justify-center hover:bg-[var(--neon-purp)] cursor-pointer text-[color:var(--neon-purp)] hover:text-[color:var(--pBlack)]'>
                            <FaPaperPlane size={22} className=''/>
                        </span>

                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Chatbot