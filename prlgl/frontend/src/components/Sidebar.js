/**
 * Sidebar Component - Analysis Results Display Panel
 *
 * This component displays the results of legal clause analysis in a structured,
 * user-friendly format. It shows error counts, provides analysis controls,
 * and renders individual error cards with detailed explanations.
 *
 * Features:
 * - Dynamic error count display in header
 * - Review button to trigger new analysis
 * - Conditional rendering based on analysis state
 * - Integration with AI-powered explanation system
 * - Responsive card layout for different error types
 *
 * @component
 * @param {Object} props - Component properties
 * @param {Array} props.foundErrors - Array of detected errors with categories and phrases
 * @param {Function} props.analyseClause - Function to trigger clause analysis
 * @param {Function} props.setTotalErrors - Function to update total error count
 * @param {number} props.totalErrors - Current total number of errors found
 * @param {boolean} props.firstCheck - Whether initial analysis has been performed
 * @param {Function} props.setFirstCheck - Function to update first check status
 * @param {boolean} props.institutionFound - Whether recognized institution was found
 * @param {string} props.input - Current clause text being analyzed
 * @returns {JSX.Element} Sidebar with analysis results
 */

import logo from "../assets/prlgl-logo.png"
import Card from './Card';

const Sidebar = ({
    foundErrors,      // Array of errors found during analysis
    analyseClause,    // Function to trigger new analysis
    setTotalErrors,   // Function to update error count
    totalErrors,      // Current total error count
    firstCheck,       // Whether analysis has been performed
    setFirstCheck,    // Function to update analysis status
    institutionFound, // Whether recognized institution found
    input            // Current clause text
}) => {

    /**
     * Handler to reset analysis state and trigger new analysis
     *
     * This function:
     * 1. Resets error counts and analysis flags
     * 2. Uses setTimeout to ensure state updates are processed
     * 3. Triggers fresh analysis of the current text
     */
    const handleReviewClick = () => {
        setTotalErrors(0);
        setFirstCheck(false); // Reset analysis state

        // Use setTimeout to ensure state updates are processed before analysis
        setTimeout(() => {
            analyseClause(); // Trigger fresh analysis with updated state
        }, 0);
    };

    return (
        <div className="overflow-auto flex flex-col items-center w-full h-screen border-box bg-white shadow-[rgba(0,0,15,0.1)_-4px_0_4px_0px] px-8 py-6">
            {/* Header section with logo, title, and review button */}
            <div className="w-full rounded-md flex items-center gap-3">
                <img src={logo} width={75} height={75} alt="PRLGL Logo" />
                <div>
                    {/* Dynamic title showing current error count */}
                    <h2 className="font-bold text-lg">Suggested Reviews ({totalErrors})</h2>

                    {/* Button to trigger new analysis */}
                    <button onClick={() => {
                        handleReviewClick();
                    }} className=" bg-indigo-400 rounded-md shadow py-2 hover:bg-indigo-600 text-xs text-white font-semibold my-2 px-8">Review Clause</button>
                </div>
            </div>

            {/* Results section - only shown after first analysis */}
            {(firstCheck) ? <div className="flex flex-col items-center my-6 w-full">
                {/* Success case: no errors found and valid institution present */}
                {(totalErrors === 0 && institutionFound) ? (
                    <Card isError={false} header="No Errors" highlight="No Errors Found" {...{ input }} />
                ) : (
                    <>
                        {/* Display cards for each phrase-based error found */}
                        {foundErrors.length > 0 ? (
                            foundErrors.map((foundItem, index) => (
                                <div className="w-full" key={index}>
                                    {/* Create a separate card for each problematic phrase */}
                                    {foundItem.phrases.map((phrase, index) => (
                                        <Card
                                            isError={true}
                                            header={foundItem.category}
                                            highlight={phrase}
                                            key={index}
                                            {...{ input }}
                                        />
                                    ))}
                                </div>
                            ))
                        ) : <></>
                        }

                        {/* Display institution error card if no recognized institution found */}
                        {
                            (!institutionFound) ? (
                                <Card
                                    isError={true}
                                    header="Unknown Institution"
                                    highlight="The arbitration body or institution overseeing the proceedings is either: (i) not clearly stated, (ii) fictional, or (iii) not known for arbitration. Please review and confirm what is agreed between the parties."
                                    {...{ input }}
                                />
                            ) : <></>
                        }
                    </>
                )}

            </div> : <></>}
        </div>

    );
}
 
export default Sidebar;