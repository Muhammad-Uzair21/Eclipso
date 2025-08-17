import React from 'react'
import { FaPaperPlane } from 'react-icons/fa'

const Chatbot = () => {
  return (
    <div className='h-[100vh] w-full flex items-center justify-center'>
        <div className='h-full w-[70%] relative'>
            <div className='mt-5 w-full flex flex-col gap-5'>
                {/* TOP HEADING */}
                <h1 className='font-bold text-white text-center'>ECLIPSO</h1>
                
                
                {/* CHAT AREA */}


                {/* INPUT SECTION */}
                <div className='w-full bg-gray-500/10 p-3 rounded-full shadow-2xl text-white absolute bottom-5'>
                    <div className='w-[95%] mx-auto flex items-center justify-between'>
                        <input type="text" placeholder='type here..' className='border-none outline-none w-[90%] '/>
                        <span className='rounded-full w-10 h-10 flex items-center justify-center hover:bg-gray-400/20 cursor-pointer'>
                            <FaPaperPlane size={18}/>
                        </span>

                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Chatbot