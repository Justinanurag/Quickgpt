import React, { useContext, useEffect, useState,useRef } from "react";
import { useAppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import Message from "./Message";

const ChatBox = () => {
  const containerRef=useRef(null)
  const { selectedChat, theme } = useAppContext();
  const [messages, setMessages] = useState([]);
  const [loading, setloading] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [mode, setMode] = useState("text");
  const [isPublished, setIsPublished] = useState(false);

  //On Submit
  const onSubmit = async (e) => {
    e.preventDefault();
  };
  useEffect(() => {
    if (selectedChat?.messages) {
      setMessages(selectedChat.messages);
    } else {
      setMessages([]);
    }
  }, [selectedChat]);
  useEffect(()=>{
    if(containerRef.current){
      containerRef.current.scrollTo({
        top:containerRef.current.scrollHeight,
        behavior:"smooth",
      })
    }
  },[messages])

  return (
    <div className="flex-1 flex flex-col justify-between m-5 md:m-10 xl:mx-30 max-md:mt-14 2xl:pr-40">
      {/* Chat messages */}
      <div ref={containerRef} className="flex-1 mb-5 overflow-y-auto">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center gap-4 text-primary">
            <img
              src={theme === "dark" ? assets.logo_full : assets.logo_full_dark}
              alt="App Logo"
              className="w-full max-w-56 sm:max-w-72"
            />
            <p className="mt-6 text-2xl sm:text-3xl text-gray-400 dark:text-white text-center">
              Ask me anything.
            </p>
          </div>
        )}
        {messages.map((message, index) => (
          <Message key={index} message={message} />
        ))}
        {/* Three dot loading animation */}
        {loading && (
          <div className="loader flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-gray-200 dark:bg-white animate-bounce"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-gray-200 dark:bg-white animate-bounce [animation-delay:0.2s]"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-gray-200 dark:bg-white animate-bounce [animation-delay:0.3s]"></div>
          </div>
        )}
      </div>
      {mode==='image' && (
        <label className="inline-flex items-center gap-2 mb-3 text-sm mx-auto">
          <p className="text-xs">Publish Generated Image to Community</p>
          <input type="checkbox" className=" cursor-pointer" checked={isPublished}
          onChange={(e)=>setIsPublished(e.target.checked)}/>
        </label>
      )}

      {/* Prompt input box */}
      <form
        onSubmit={(e) => e.preventDefault()}
        onChange={onSubmit}
        className="bg-primary/20 dark:bg-[#583C79]/30 
             border border-primary dark:border-[#80609F]/30 
             rounded-full w-full max-w-2xl mx-auto 
             p-3 pl-4 flex gap-4 items-center"
      >
        {/* Mode Selector */}
        <select
          onChange={(e) => setMode(e.target.value)}
          value={mode}
          className="text-sm pl-3 pr-2 outline-none bg-transparent dark:text-white cursor-pointer"
          aria-label="Select mode"
        >
          <option className="dark:bg-purple-900" value="text">
            Text
          </option>
          <option className="dark:bg-purple-900" value="image">
            Image
          </option>
        </select>

        {/* Prompt Input */}
        <input
          onChange={(e) => setPrompt(e.target.value)}
          value={prompt}
          type="text"
          placeholder="Type your prompt here..."
          className="flex-1 w-full text-sm outline-none bg-transparent dark:text-white"
          required
        />

        {/* Send/Stop Button */}
        <button
          type="submit"
          disabled={loading}
          className={`transition transform active:scale-90 ${
            loading ? "opacity-50 cursor-not-allowed" : "hover:opacity-80"
          } cursor-pointer`}
        >
          <img
            src={loading ? assets.stop_icon : assets.send_icon}
            className="w-8"
            alt={loading ? "Stop" : "Send"}
          />
        </button>
      </form>
    </div>
  );
};

export default ChatBox;
