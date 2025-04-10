import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { OptionsPanel } from "./OptionsPanel";

interface SummaryEditorProps {
  fileName: string;
  summary: string;
  onSummaryChange: (value: string) => void;
  onReset: () => void;
}

export const SummaryEditor = ({
  fileName,
  summary,
  onSummaryChange,
  onReset
}: SummaryEditorProps) => {
  const editorRef = useRef<HTMLTextAreaElement>(null);

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
      <div className="md:col-span-9">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <h2 className="text-3xl font-black uppercase">
            {fileName || "Document Summary"}
          </h2>
          <Button 
            onClick={onReset}
            variant="outline"
            className="border-4 border-black hover:bg-yellow-400 hover:text-black font-bold uppercase px-6"
          >
            Upload new
          </Button>
        </div>
        
        <div className="relative">
          <div className="absolute -top-4 -left-4 w-full h-full bg-blue-500 -z-10"></div>
          <div className="absolute bottom-6 right-6 w-12 h-12 bg-yellow-400 rotate-12 -z-5 hidden md:block"></div>
          <Card className="border-4 border-black shadow-none bg-white rounded-none">
            <CardHeader className="border-b-4 border-black">
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl font-black uppercase">Edit Summary</CardTitle>
                <div className="flex gap-2">
                  <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                  <div className="w-4 h-4 bg-yellow-400 rounded-full"></div>
                  <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                </div>
              </div>
              <CardDescription className="font-mono">
                Your document has been summarized. Refine the text below.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Textarea
                ref={editorRef}
                className="min-h-[50vh] border-none rounded-none focus-visible:ring-0 font-mono text-base p-8"
                value={summary}
                onChange={(e) => onSummaryChange(e.target.value)}
                style={{ resize: 'none' }}
              />
            </CardContent>
            <CardFooter className="flex justify-between border-t-4 border-black">
              <div className="font-mono text-sm">
                {summary.split(/\s+/).length} words
              </div>
              <div className="flex gap-4">
                <Button 
                  variant="default"
                  className="bg-black hover:bg-red-500 text-white font-bold uppercase"
                >
                  Save Changes
                </Button>
                <Button 
                  variant="outline"
                  className="border-4 border-black hover:bg-yellow-400 font-bold uppercase"
                >
                  Export
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
      
      <div className="md:col-span-3">
        <OptionsPanel />
      </div>
    </div>
  );
}; 