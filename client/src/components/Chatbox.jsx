import React, { useContext, useEffect, useRef, useState } from 'react'
import { useAppContext } from '../context/AppContext'
import Logo from '../assets/Photo_1757667664451.png'
import Message from '../components/Message';
import { assets } from '../assets/assets';
import toast from 'react-hot-toast';

const Chatbox = () => {

  const containerRef = useRef(null);
  const { selectedChat, theme, user, axios, token, setUser} = useAppContext();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [mode, setMode] = useState('text');
  const [isPublished, setIsPublished] = useState(false);

  const onSubmit = async (e) => {
    try {
      e.preventDefault();
      if (!user) return toast('login to send message.')
      setLoading(true);
      const promptCopy = prompt;
      setPrompt('');
      setMessages(prev => [...prev, { role: 'User', content: prompt, timestamp: Date.now(), isImage: false }])
      const { data } = await axios.post(`/api/message/${mode}`, { chatId: selectedChat._id, prompt: prompt, isPublished }, { headers: { Authorization: token } })
      if (data.success) {
        setMessages(prev => [...prev, data.reply]);
        // if (mode == 'image') {
        //   setUser(prev => ({ ...prev, credits: prev.credits - 2 }))
        // } else {
        //   setUser(prev => ({ ...prev, credits: prev.credits - 1 }))
        // }
      } else {
        toast.error(data.message)
        setPrompt(promptCopy)
      }
    } catch (error) {
      toast.error(error.message)

    } finally {
      setPrompt('')
      setLoading(false)
    }
  }

  useEffect(() => {
    if (selectedChat) {
      setMessages(selectedChat.messages);
    }
  }, [selectedChat])

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: "smooth"
      })
    }
  }, [messages]);

  return (
    <div className='flex-1 flex flex-col justify-between m-5 md:m-10 xl:mx-30 max-md:mt-14 2xl:pr-40'>
      {/* Chat Messages */}
      <div ref={containerRef} className='flex-1 mb-4 overflow-y-scroll'>
        {messages.length === 0 && (
          <div className='h-full flex flex-col items-center justify-center gap-2 text-primary'>
            <div className='flex flex-row gap-x-2 items-center'>
              <img src={Logo} alt="" className='w-full max-w-44 sm:max-w-16' />
              <div className='flex flex-col items-start'>
                <span className='text-4xl'>Zeta AI</span>
                <p>The Fast Result AI</p>
              </div>
            </div>
            <p className='mt-5 text-4xl sm:text-6xl text-center text-gray-400 dark:text-white'>Ask Me Anythings </p>
          </div>

        )}

        {messages.map((message, index) => <Message key={index} message={message} />)}

        {loading && <div className='loader flex items-center gap-1.5'>
          <div className='w-1.5 h-1.5 rounded-full bg-gray-500 dark:bg-white animate-bounce'></div>
          <div className='w-1.5 h-1.5 rounded-full bg-gray-500 dark:bg-white animate-bounce'></div>
          <div className='w-1.5 h-1.5 rounded-full bg-gray-500 dark:bg-white animate-bounce'></div>
        </div>}

      </div>
      {/* Prompt Input Box  */}

      {mode === 'image' && (
        <label className='inline-flex items-center gap-2 mb-3 text-sm mx-auto'>
          <p className='text-xs'> Published Generated Image To Community</p>
          <input type="checkbox" className='cursor-pointer' checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)} />
        </label>
      )}

      <form onSubmit={onSubmit}>
        <label for="chat" class="sr-only">Your message</label>
        <div class="flex items-center px-3 py-4 rounded-2xl bg-gray-100 border border-gray-300 dark:bg-gray-900 dark:border-gray-700">
          <button onClick={(e) => setMode('image')} type="button" class="inline-flex justify-center p-2 text-gray-500 rounded-lg cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600">
            <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 18">
              <path fill="currentColor" d="M13 5.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0ZM7.565 7.423 4.5 14h11.518l-2.516-3.71L11 13 7.565 7.423Z" />
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 1H2a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1Z" />
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0ZM7.565 7.423 4.5 14h11.518l-2.516-3.71L11 13 7.565 7.423Z" />
            </svg>
            <span class="sr-only">Upload image</span>
          </button>
          <button onClick={(e) => setMode('text')} type="button" class="p-2 text-gray-500 rounded-lg cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600">
            <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.408 7.5h.01m-6.876 0h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM4.6 11a5.5 5.5 0 0 0 10.81 0H4.6Z" />
            </svg>
            <span class="sr-only">Add emoji</span>
          </button>
          <input type='text' onChange={(e) => setPrompt(e.target.value)} value={prompt} id="chat" rows="1" class="block h-12  mx-4 p-2.5 w-full text-sm text-gray-900 bg-white rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Your message..." />
          <button disabled={loading} type="submit" class="inline-flex justify-center p-2 text-blue-600 rounded-full cursor-pointer hover:bg-blue-100 dark:text-blue-500 dark:hover:bg-gray-600">
            <svg class="w-5 h-5 rotate-90 rtl:-rotate-90" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 20">
              <path d="m17.914 18.594-8-18a1 1 0 0 0-1.828 0l-8 18a1 1 0 0 0 1.157 1.376L8 18.281V9a1 1 0 0 1 2 0v9.281l6.758 1.689a1 1 0 0 0 1.156-1.376Z" />
            </svg>
            <span class="sr-only">Send message</span>
          </button>
        </div>
      </form>

      {/* <form action="" className='bg-primary/20 dark:bg-[#583c79]/30 border border-primary dark:border-[#80609f]/30 rounded-full w-full max-w-2xl p-3 pl-4 mx-auto flex gap-4 items-center'>
        <select value={mode} name="" id="" className='text-sm pl-3 pr-2 outline-note'>
          <option className='dark:bg-purple-900' value="text">Text</option>
          <option className='dark:bg-purple-900' value="image">Image</option>
        </select>
        <input onChange={(e) => setPrompt(e.target.value)} value={prompt} type="text" placeholder='Type Your Prompt Here....' className='flex-1 w-full text-sm outline-none' required />
        <button disabled={loading}>
          <img src={loading ? assets.stop_icon : assets.send_icon} className='w-8 cursor-pointer' alt="" />
        </button>
      </form> */}

    </div>
  )
}

export default Chatbox
