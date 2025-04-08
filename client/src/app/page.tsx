"use client";

import { useState, useCallback } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { UploadSection } from "@/components/UploadSection";
import { SummaryEditor } from "@/components/SummaryEditor";
import { DecorativeElements } from "@/components/DecorativeElements";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [summary, setSummary] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles?.length) {
      const selectedFile = acceptedFiles[0];
      setFile(selectedFile);
      handleFileUpload(selectedFile);
    }
  }, []);

  const handleFileUpload = async (uploadedFile: File) => {
    setIsUploading(true);
    
    // Simulate file upload and processing
    setTimeout(() => {
      setIsUploading(false);
      setIsProcessing(true);
      
      // Simulate document summarization
      setTimeout(() => {
        setIsProcessing(false);
        setSummary("This is a simulated summary of your PDF document. In a real application, this would be the AI-generated summary of your uploaded document. You can edit this text in real-time to refine the summary based on your needs.\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eget ultricies ultricies, nisl nisl ultricies nisl, eget ultricies nisl nisl eget ultricies.\n\nVivamus auctor, nisl eget ultricies ultricies, nisl nisl ultricies nisl, eget ultricies nisl nisl eget ultricies.");
        setIsEditing(true);
      }, 2000);
    }, 1500);
  };

  const handleReset = () => {
    setFile(null);
    setSummary("");
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-[#f2f2f2] text-black">
      <DecorativeElements />
      
      <Header />

      <main className="container mx-auto px-6 py-12 relative z-20">
        {!isEditing ? (
          <UploadSection 
            isUploading={isUploading}
            isProcessing={isProcessing}
            onDrop={onDrop}
          />
        ) : (
          <SummaryEditor 
            fileName={file?.name || ""}
            summary={summary}
            onSummaryChange={setSummary}
            onReset={handleReset}
          />
        )}
      </main>
      
      <Footer />
    </div>
  );
}
