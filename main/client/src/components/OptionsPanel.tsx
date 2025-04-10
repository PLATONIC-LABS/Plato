import React from "react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

type OptionKey = 'autoCorrectGrammar' | 'highlightKeyPoints' | 'addCitations';

interface OptionsState {
  autoCorrectGrammar: boolean;
  highlightKeyPoints: boolean;
  addCitations: boolean;
}

export const OptionsPanel = () => {
  const [options, setOptions] = useState<OptionsState>({
    autoCorrectGrammar: false,
    highlightKeyPoints: true,
    addCitations: false
  });

  const toggleOption = (option: OptionKey): void => {
    setOptions({
      ...options,
      [option]: !options[option]
    });
  };

  return (
    <div className="sticky top-32 space-y-6">
      <div className="border-4 border-black p-6 bg-white">
        <h3 className="font-black uppercase text-lg mb-3">Options</h3>
        <ul className="font-mono space-y-4">
          <li 
            className="flex items-center gap-2 cursor-pointer" 
            onClick={() => toggleOption('autoCorrectGrammar')}
          >
            <div className={`w-4 h-4 border-2 border-black ${options.autoCorrectGrammar ? 'bg-black' : ''}`}></div>
            <span>Auto-correct grammar</span>
          </li>
          <li 
            className="flex items-center gap-2 cursor-pointer" 
            onClick={() => toggleOption('highlightKeyPoints')}
          >
            <div className={`w-4 h-4 border-2 border-black ${options.highlightKeyPoints ? 'bg-black' : ''}`}></div>
            <span>Highlight key points</span>
          </li>
          <li 
            className="flex items-center gap-2 cursor-pointer" 
            onClick={() => toggleOption('addCitations')}
          >
            <div className={`w-4 h-4 border-2 border-black ${options.addCitations ? 'bg-black' : ''}`}></div>
            <span>Add citations</span>
          </li>
        </ul>
      </div>
      
      <div className="relative">
        <div className="absolute -top-2 -left-2 w-full h-full bg-red-500 -z-10"></div>
        <div className="border-4 border-black p-6 bg-white">
          <h3 className="font-black uppercase text-lg mb-3">Need help?</h3>
          <p className="font-mono text-sm mb-4">
            Our AI can suggest improvements to your summary.
          </p>
          <a 
            href="https://prlgl.vercel.app/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="block w-full"
          >
            <Button className="w-full bg-black hover:bg-yellow-400 hover:text-black font-bold uppercase">
              GET SUGGESTIONS
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
};