import React, { useEffect } from 'react'
import { assets } from '../assets/assets'
import moment from 'moment'
import Markdown from 'react-markdown'
import Prism from 'prismjs'

const Message = ({ message }) => {

  useEffect(()=>{
    Prism.highlightAll();
  },[message.content])

  return (
    <div>
      {message.role == 'User' ? (
        <div className='flex items-center justify-end my-4 gap-2'>
          <div className='flex flex-col gap-2 px-4 bg-slate-50 dark:bg-gray-800 border border-[#80609f]/30 rounded-md max-w-2xl'>
            <p className='text-sm dark:text-gray-200 pt-3' dir='rtl'>{message.content}</p>
            <span className='text-md text-gray-400 dark:text-gray-400 mb-2'>{moment(message.timestamp).fromNow()}</span>
          </div>
          <img src={assets.user_icon} alt=""  className='w-8 rounded-full'/>
        </div>
      )
        :
        (
          <div className='inline-flex flex-col gap-2 p-2 px-4 max-w-2xl bg-gray-100 dark:bg-gray-800 border border-[#80609f]/30 rounded-md my-4 '>
            {message.isImage ? (
              <img src={message.content} className='w-full max-w-md mt-2' />
            ):
            (
              <div className='text-md dark:text-gray-300 leading-8' dir='rtl'>
                <Markdown>
                  {message.content}
                </Markdown>
              </div>
            )}

            <span className='text-xs text-gray-400 dark:text-[#b1a6c0]'>{moment(message.timestamp).fromNow()}</span>

          </div>
        )
      }
    </div>
  )
}

export default Message
