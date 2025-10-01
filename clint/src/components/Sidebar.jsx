import React, { useState } from "react";
import { useAppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import moment from "moment";
const Sidebar = ({ isMenuOpen, setIsMenuOpen }) => {
  const { chats, setSelectedChat, theme, setTheme, user, navigate } =
    useAppContext();
  //for search history

  const [search, setSearch] = useState("");
  return (
    <>
    {!isMenuOpen && <img src={assets.menu_icon} className="absolute top-3 left-3 w-8 h-8 cursor-pointer md:hidden not-dark:inert" onClick={()=>setIsMenuOpen(true)}/>}
    <div
      className={`flex flex-col h-screen min-w-72 p-5 
  dark:bg-gradient-to-b from-[#242124]/30 to-[#000000]/30 
  border-r border-[#80609F]/30 backdrop-blur-3xl 
  transition-transform duration-200 
  max-md:absolute left-0 z-[1] 
  ${!isMenuOpen ? "max-md:-translate-x-full" : ""}`}
    >
      {/* Logo */}
      <div className="flex justify-center">
        <img
          src={theme === "dark" ? assets.logo_full : assets.logo_full_dark}
          alt="Logo"
          className="w-full max-w-44"
        />
      </div>

      {/* New chat button */}
      <button
        className="flex justify-center items-center w-full py-2 mt-8 
                 text-white bg-gradient-to-r from-[#A456F7] to-[#3D81F6] 
                 text-sm rounded-lg font-medium shadow-md 
                 hover:scale-105 active:scale-95 transition-transform"
      >
        <span className="mr-2 text-xl">+</span> New Chat
      </button>

      {/* Search Conversations */}
      <div
        className="flex items-center gap-2 p-2.5 mt-5 
                 bg-white/10 dark:bg-white/5 
                 border border-gray-300 dark:border-white/20 
                 rounded-lg focus-within:ring-2 focus-within:ring-[#A456F7]"
      >
        <img
          src={assets.search_icon}
          className="w-4 opacity-70 not-dark:invert"
          alt="Search"
        />
        <input
          onChange={(e) => setSearch(e.target.value)}
          value={search}
          type="text"
          placeholder="Search conversation"
          className="flex-1 bg-transparent text-sm 
                   placeholder:text-gray-400 dark:placeholder:text-gray-500 
                   text-gray-900 dark:text-gray-100 outline-none"
        />
      </div>
      {/* Recent chats */}
      {chats.length > 0 && <p className="mt-4 text-sm">Recent Chats </p>}
      <div className="flex-1 overflow-y-scroll mt-3 text-sm space-y-3">
        {chats
          .filter((chat) =>
            chat.messages[0]  
              ? chat.messages[0]?.content
                  .toLowerCase()
                  .includes(search.toLowerCase())
              : chat.name.toLowerCase().includes(search.toLowerCase())
          )
          .map((chat) => (
            <div
              key={chat._id}
              onClick={() => { setSelectedChat(chat); navigate("/"); setIsMenuOpen(false); }}
              className="p-2 px-4 dark:bg-[#57317C]/10 border border-gray-300 dark:border-[#80609F]/15 rounded-md cursor-pointer flex justify-between group"
            >
              <div>
                <p className="truncate w-full">
                  {chat.messages.length > 0
                    ? chat.messages[0].content.slice(0, 32)
                    : chat.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-[#B1A6C0]">
                  {moment(chat.updateAt).fromNow()}
                </p>
              </div>
              <img
                src={assets.bin_icon}
                className="hidden group-hover:block w-4 cursor-pointer not-dark:invert"
                alt="delete"
              />
            </div>
          ))}
      </div>
      {/* Community Image */}
      <div 
        onClick={() => {
          navigate("/community"); setIsMenuOpen(false);
        }}
        className="flex items-center gap-2 p-3 mt-4 border border-gray-300 dark:border-white/15 rounded-md cursor-pointer hover:scale-103 transition-all"
      >
        <img
          src={assets.gallery_icon}
          className="w-4.5 not-dark:invert"
          alt=""
        />
        <div className="flex flex-col text-sm">
          <p>Community Images</p>
        </div>
      </div>
      {/* Credit purchase option  */}
      <div
        onClick={() => {
          navigate("/credits"); setIsMenuOpen(false);
        }}
        className="flex items-center gap-2 p-3 mt-4 border border-gray-300 dark:border-white/15 rounded-md cursor-pointer hover:scale-103 transition-all"
      >
        <img
          src={assets.diamond_icon}
          className="w-4.5 dark:invert"
          alt="Credits icon"
        />
        <div className="flex flex-col text-sm">
          <p>Credits: {user?.credits}</p>
          <p className="text-xs text-gray-400">
            Purchase credits to use quickgpt
          </p>
        </div>
      </div>
      {/* Dark Mode Toggle  */}
      <div className="flex items-center justify-between gap-2 p-3 mt-4 border border-gray-300 dark:border-white/15 rounded-md">
        <div className="flex items-center gap-2 text-sm">
          <img
            src={assets.theme_icon}
            className="w-4 not-dark:invert"
            alt="Theme icon"
          />
          <p>Dark Mode</p>
        </div>
        <label
          htmlFor="darkModeToggle"
          className="relative inline-flex cursor-pointer"
        >
          <input
            type="checkbox"
            name="darkMode"
            id="darkModeToggle"
            className="sr-only peer"
            checked={theme === "dark"}
            onChange={() => setTheme(theme === "dark" ? "light" : "dark")}
          />
          <div className="w-9 h-5 bg-gray-400 rounded-full peer-checked:bg-purple-600 transition-all"></div>
          <span className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-transform peer-checked:translate-x-4"></span>
        </label>
      </div>
      {/* User Account */}
      <div className="flex items-center gap-3 p-3 mt-4 border border-gray-300 dark:border-white/15 rounded-md cursor-pointer group">
        <img src={assets.user_icon} className="w-7 rounded-full" alt="" />
        <p className="flex-1 text-sm dark:text-primary truncate">
          {user ? user.name : "Login Your Account"}
        </p>
        {user && (
          <img
            src={assets.logout_icon}
            className="h-5 w-4 cursor-pointer hidden group-hover:block not-dark:invert"
            alt="Logout"
          />
        )}
      </div>
      <img
        onClick={() => {
          console.log("Close icon clicked, isMenuOpen:", isMenuOpen);
          setIsMenuOpen(false);
        }}
        src={assets.close_icon}
        alt="Close"
        className="absolute top-3 right-3 w-5 h-5 cursor-pointer md:hidden not-dark:invert z-50"
      />
    </div>
    </>
  );
};

export default Sidebar;
