/**
 * Card Component - Individual Error Display with AI-Powered Explanations
 *
 * This component represents a single legal issue found in the clause analysis.
 * It displays the error category, problematic phrase, and provides detailed
 * AI-generated explanations and suggestions when expanded.
 *
 * Features:
 * - Expandable/collapsible interface
 * - Color-coded visual indicators (red for errors, green for success)
 * - Integration with backend AI explanation system
 * - Lazy loading of explanations (only when needed)
 * - Error handling for API failures
 *
 * @component
 * @param {Object} props - Component properties
 * @param {boolean} props.isError - Whether this card represents an error or success
 * @param {string} props.header - Category/type of the legal issue
 * @param {string} props.highlight - Specific problematic phrase or message
 * @param {string} props.input - Full clause text for context
 * @returns {JSX.Element} Interactive card displaying legal issue details
 */

import { useEffect, useState } from "react";

const Card = ({
    isError,    // Boolean: true for errors, false for success cases
    header,     // Category of the legal issue (e.g., "Non-Binding Arbitration")
    highlight,  // Specific problematic phrase found
    input      // Full clause text from user

}) => {
    // State for controlling card expansion
    const [isOpen, setIsOpen] = useState(false);

    // State for AI-generated explanation content
    const [explanation, setExplanation] = useState("Loading...")
    const [suggestion, setSuggestion] = useState("Loading...")

    // Visual styling based on error/success status
    const color = isError ? "bg-red-600" : "bg-green-600"

    // Flag to prevent duplicate API calls for explanations
    const [explanationGenerated, setExplanationGenerated] = useState(false)
    /**
     * Effect to initialize card state when component mounts
     * Ensures cards start in collapsed state with loading text
     */
    useEffect(() => {
        setIsOpen(false)
        setExplanation("Loading...")
    }, [])

    /**
     * Effect to fetch AI-powered explanations for error cards
     *
     * This effect:
     * 1. Only runs for error cards that haven't been explained yet
     * 2. Sends the clause, error, and rule to the backend AI system
     * 3. Receives detailed explanations and suggestions
     * 4. Handles API errors gracefully
     */
    useEffect(() => {
        if (isError && !explanationGenerated) {
            // API endpoint for getting AI explanations of legal errors
            const apiUrl = 'http://127.0.0.1:8000/dict-error/';

            // Prepare data to send to the AI system
            const requestBody = {
                clause: input,      // Full clause text for context
                error: highlight,   // Specific problematic phrase
                rule: header       // Category of legal rule violated
            };

            /**
             * Async function to fetch explanation from AI backend
             * Uses the legal knowledge base to provide contextual explanations
             */
            const fetchExplanation = async () => {
                try {
                    // Send request to AI backend
                    const response = await fetch(apiUrl, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(requestBody),
                    });

                    if (!response.ok) throw new Error('Network response was not ok');

                    // Parse AI response
                    const data = await response.json();

                    // Extract explanation and suggestion from AI response
                    console.log(data.reply[0]["Context and Legal Implications"])
                    setExplanation(data.reply[0]["Context and Legal Implications"])
                    setSuggestion(data.reply[0]["Suggestion"])
                    setExplanationGenerated(true)
                } catch (error) {
                    console.error('Failed to fetch explanation:', error);
                    setExplanation('Failed to fetch explanation.');
                }
            };

            fetchExplanation();
        }
    }, [isError, header, highlight, input]);


    return (
        <button
            onClick={() => setIsOpen(!isOpen)}
            className={"w-full shadow-md my-4 cursor-pointer text-left"}
            >
            {/* Color-coded top bar indicating error (red) or success (green) */}
            <div className={"h-2 w-full " + color}></div>

            {/* Main card content area */}
            <div className="p-3 box-border border-2 border-t-transparent">
                {/* Error category header */}
                <h4 className="font-semibold text-sm">{header}</h4>

                {/* Conditional content based on expansion state and card type */}
                {(!isOpen || header === "Unknown Institution") ? (
                    // Collapsed state: show only the problematic phrase or message
                    <p className="text-sm italic">{highlight}</p>
                ) : (
                    // Expanded state: show detailed AI explanation and suggestion
                    <>
                        <p className="text-sm italic">{explanation}</p>
                        <h4 className="font-semibold text-sm mt-4">Suggestion</h4>
                        <p className="text-sm italic">{suggestion}</p>
                    </>
                )}
            </div>

        </button>
    );
}

export default Card;