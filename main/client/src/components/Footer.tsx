import React from "react";

export const Footer = () => {
  return (
    <footer className="border-t-8 border-black py-8 bg-white">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <p className="font-black uppercase text-2xl">PLATO</p>
          <p className="font-mono text-sm mt-2">© {new Date().getFullYear()} All rights reserved</p>
        </div>
        
        <div className="font-mono text-sm">
          <p className="uppercase font-bold mb-2">Links</p>
          <div className="grid grid-cols-2 gap-2">
            <a href="#" className="hover:underline">About</a>
            <a href="#" className="hover:underline">Privacy</a>
            <a href="#" className="hover:underline">Terms</a>
            <a href="#" className="hover:underline">Contact</a>
          </div>
        </div>
        
        <div className="flex justify-start md:justify-end items-end">
          <div className="grid grid-cols-3 gap-2">
            <div className="w-8 h-8 bg-red-500"></div>
            <div className="w-8 h-8 bg-yellow-400"></div>
            <div className="w-8 h-8 bg-blue-500"></div>
          </div>
        </div>
      </div>
    </footer>
  );
}; 