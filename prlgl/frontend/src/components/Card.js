import { useEffect, useState } from "react";

const Card = ({
    isError,
    header, // rule?
    highlight, //error,
    input //clause from user

}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [explanation, setExplanation] = useState("Loading...")
    const [suggestion, setSuggestion] = useState("Loading...")
    const color = isError ? "bg-red-600" : "bg-green-600"
    const [explanationGenerated, setExplanationGenerated] = useState(false)
    useEffect(() => {
        setIsOpen(false)
        setExplanation("Loading...")
    }, [])
    useEffect(() => {
        if (isError && !explanationGenerated) {
            // Only proceed with the API call if there is an error and explanation has not been generated
            const apiUrl = 'http://127.0.0.1:8000/dict-error/';
            const requestBody = {
                clause: input,
                error: highlight,
                rule: header
            };

            const fetchExplanation = async () => {
                try {
                    const response = await fetch(apiUrl, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(requestBody),
                    });

                    if (!response.ok) throw new Error('Network response was not ok');
                    const data = await response.json();
                    //Context and Legal Implications
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
            <div className={"h-2 w-full " + color}></div>
            <div className="p-3 box-border border-2 border-t-transparent">
                <h4 className="font-semibold text-sm">{header}</h4>
                {(!isOpen || header === "Unknown Institution") ? (<p className="text-sm italic">{highlight}</p>
                ) : (
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