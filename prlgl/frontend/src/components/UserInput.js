import { useEffect, useRef, useState } from "react";
import { HighlightWithinTextarea } from 'react-highlight-within-textarea'
import 'draft-js/dist/Draft.css';
const UserInput = ({
    input,
    setInput,
    errorHighlights

}) => {
   

    return (
        <div className="w-full box-border p-10">
            <h3 className="font-semibold">Please input the clause below:</h3>
            <HighlightWithinTextarea
                className="bg-transparent w-full mt-4 box-border resize-none outline-none border-none h-full"
                placeholder="Type or paste (Ctrl + V) your text here."
                onChange={(v) => setInput(v)}
                highlight={errorHighlights.map((error)=> ({
                    highlight: error,
                    className: "highlight_red"
                }))}
                value={input}
            />
        </div>
    );
}

export default UserInput;