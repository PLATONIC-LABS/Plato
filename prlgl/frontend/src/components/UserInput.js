/**
 * UserInput Component - Enhanced Text Input with Real-time Highlighting
 *
 * This component provides a sophisticated text input area that can highlight
 * specific phrases in real-time as the user types or pastes content.
 *
 * Key features:
 * - Real-time highlighting of problematic legal phrases
 * - Support for copy/paste operations
 * - Responsive design that adapts to different screen sizes
 * - Integration with the main analysis system
 *
 * @component
 * @param {Object} props - Component properties
 * @param {string} props.input - Current text content
 * @param {Function} props.setInput - Function to update text content
 * @param {Array} props.errorHighlights - Array of phrases to highlight in red
 * @returns {JSX.Element} Enhanced text input component
 */

import { useEffect, useRef, useState } from "react";
import { HighlightWithinTextarea } from 'react-highlight-within-textarea'
import 'draft-js/dist/Draft.css';

const UserInput = ({
    input,        // Current text content from parent component
    setInput,     // Function to update text content in parent component
    errorHighlights  // Array of problematic phrases to highlight

}) => {


    return (
        <div className="w-full box-border p-10">
            {/* Header instruction for users */}
            <h3 className="font-semibold">Please input the clause below:</h3>

            {/* Enhanced textarea with highlighting capabilities */}
            <HighlightWithinTextarea
                className="bg-transparent w-full mt-4 box-border resize-none outline-none border-none h-full"
                placeholder="Type or paste (Ctrl + V) your text here."

                // Update parent component state when text changes
                onChange={(v) => setInput(v)}

                // Configure highlighting: map each error phrase to a highlight rule
                highlight={errorHighlights.map((error)=> ({
                    highlight: error,           // The text to highlight
                    className: "highlight_red"  // CSS class for red highlighting
                }))}

                // Current text value (controlled component)
                value={input}
            />
        </div>
    );
}

export default UserInput;