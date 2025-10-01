import React, { useEffect } from 'react'
import { assets } from '../assets/assets'
import moment from 'moment';
import Markdown from 'react-markdown'
import Prism from 'prismjs'
const Message = ({message}) => {
  useEffect(()=>{
    Prism.highlightAll()
  },[message.content])
  return (
  <div>
    {message.role === "user" ? (
      // User Message (Right side)
      <div className="flex items-start justify-end my-4 gap-2">
        <div className="flex flex-col gap-1 p-3 px-4 bg-gray-50 dark:bg-[#57317C]/30 
                        border border-[#80609F]/30 rounded-2xl max-w-2xl shadow-sm">
          <p className="text-sm text-gray-800 dark:text-primary">
            {message.content}
          </p>
          <span className="text-xs text-gray-400 dark:text-gray-500 self-end">
            {moment(message.timestamp).fromNow()}
          </span>
        </div>
        <img
          src={assets.user_icon}
          alt="User"
          className="w-9 h-9 rounded-full object-cover"
        />
      </div>
    ) : (
      // Assistant Message (Left side)
      <div className="flex items-start my-4 gap-2">
           {/* <img
          src={assets.file}
          alt="User"
          className="w-9 h-9 rounded-full object-cover"
        /> */}
        <div className="flex flex-col gap-1 p-3 px-4 bg-primary/20 dark:bg-[#57317C]/30 
                        border border-[#80609F]/30 rounded-2xl max-w-2xl shadow-sm">
          {message.isImage ? (
            <img
              src={message.content}
              alt="Generated"
              className="w-full max-w-md mt-2 rounded-md"
            />
          ) : (
            <p className="text-sm text-gray-800 dark:text-primary leading-relaxed">
             <Markdown>{message.content}</Markdown> 
            </p>
          )}
          <span className="text-xs text-gray-400 dark:text-gray-500 self-end">
            {moment(message.timestamp).fromNow()}
          </span>
        </div>
      </div>
    )}
  </div>
);

}

export default Message