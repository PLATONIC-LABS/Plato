import React from "react";
import { FileUploader } from "./FileUploader";

interface UploadSectionProps {
  isUploading: boolean;
  isProcessing: boolean;
  onDrop: (acceptedFiles: File[]) => void;
}

export const UploadSection = ({
  isUploading,
  isProcessing,
  onDrop
}: UploadSectionProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
      <div className="md:col-span-7 md:order-2">
        <div className="relative">
          <div className="absolute -top-4 -left-4 w-full h-full bg-yellow-400 -z-10"></div>
          <div className="border-4 border-black bg-white p-8 md:p-12 relative">
            <h1 className="text-4xl md:text-6xl font-black uppercase leading-none mb-8">
              TRANSFORM
              <br />YOUR 
              <span className="inline-block bg-red-500 text-white ml-4 px-2">CONTRACTS</span>
            </h1>
            
            <div className="absolute top-0 right-0 -mt-4 -mr-4 bg-black text-white px-4 py-2 font-bold rotate-3">
              NEW!
            </div>
            
            <p className="text-lg mb-8 font-mono">
              Upload your PDF and get an AI summary you can edit in real-time.
            </p>
            
            <FileUploader 
              isUploading={isUploading}
              isProcessing={isProcessing}
              onDrop={onDrop}
            />
            
            <div className="flex items-center justify-between mt-6 font-mono text-xs">
              <span>* PDF FILES ONLY</span>
              <span>MAX SIZE: 10MB</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="md:col-span-5 md:order-1 flex flex-col justify-center">
        <div className="sticky top-32">
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="aspect-square bg-blue-500 flex items-center justify-center p-6">
              <span className="text-white font-bold text-center uppercase text-sm">Upload your contract</span>
            </div>
            <div className="aspect-square border-4 border-black flex items-center justify-center p-6">
              <span className="font-bold text-center uppercase text-sm">AI creates a summary</span>
            </div>
            <div className="aspect-square border-4 border-black flex items-center justify-center p-6">
              <span className="font-bold text-center uppercase text-sm">Edit in real-time</span>
            </div>
            <div className="aspect-square bg-red-500 flex items-center justify-center p-6">
              <span className="text-white font-bold text-center uppercase text-sm">Export the final result</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 