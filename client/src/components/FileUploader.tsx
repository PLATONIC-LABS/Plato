import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Progress } from "@/components/ui/progress";

interface FileUploaderProps {
  isUploading: boolean;
  isProcessing: boolean;
  onDrop: (acceptedFiles: File[]) => void;
}

export const FileUploader = ({ 
  isUploading, 
  isProcessing, 
  onDrop 
}: FileUploaderProps) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
    },
    maxFiles: 1,
  });

  return (
    <div
      {...getRootProps()}
      className={`border-4 border-black transition-all cursor-pointer relative overflow-hidden p-8 group 
        ${isDragActive ? 'bg-yellow-400' : 'bg-white hover:bg-gray-100'}`}
    >
      <input {...getInputProps()} />
      
      <div className="flex flex-col items-center justify-center gap-5 text-center">
        <div className="absolute top-0 right-0 w-6 h-6 bg-blue-500 -mt-3 -mr-3 hidden md:block"></div>
        <div className="absolute bottom-0 left-0 w-6 h-6 bg-red-500 -mb-3 -ml-3 hidden md:block"></div>
        <div className="w-24 h-24 border-4 border-black flex items-center justify-center group-hover:bg-red-500 group-hover:text-white transition-colors duration-200">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
        </div>
        
        {isUploading ? (
          <p className="text-2xl font-bold uppercase">Uploading...</p>
        ) : isProcessing ? (
          <p className="text-2xl font-bold uppercase">Processing PDF...</p>
        ) : (
          <>
            <p className="text-2xl font-bold uppercase">Drop PDF Here</p>
            <p className="font-mono">or click to browse files</p>
          </>
        )}
        
        {(isUploading || isProcessing) && (
          <div className="w-full mt-4 border-2 border-black p-1">
            <Progress 
              value={isUploading ? 60 : 90} 
              className="h-4 bg-white"
            />
          </div>
        )}
      </div>
    </div>
  );
}; 