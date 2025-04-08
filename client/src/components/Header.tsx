import React from "react";

export const Header = () => {
  return (
    <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 px-6 md:px-12 py-8 border-b-8 border-black sticky top-0 bg-[#f2f2f2] z-30">
      <div className="flex items-center">
        <div className="relative">
          <div className="w-12 h-12 bg-black flex items-center justify-center text-white font-black text-xl">P</div>
          <div className="absolute -right-1 -bottom-1 w-6 h-6 bg-red-500"></div>
        </div>
        <h1 className="ml-4 text-4xl font-black uppercase tracking-tighter">PLATO</h1>
      </div>
      <div className="uppercase text-sm font-bold tracking-widest border-2 border-black px-4 py-2 inline-block">
        LAWYERS × AI
      </div>
    </header>
  );
}; 