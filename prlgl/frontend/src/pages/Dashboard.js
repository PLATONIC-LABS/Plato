/**
 * Dashboard Component - Main Legal Clause Analysis Interface
 *
 * This is the primary component where users interact with the legal clause analysis system.
 * It provides a two-panel interface: left panel for text input and right panel for results.
 *
 * The component handles:
 * - Text input and highlighting of problematic phrases
 * - Real-time analysis of legal clauses for common errors
 * - Institution validation against a database of recognized arbitration bodies
 * - Display of analysis results with detailed explanations
 *
 * @component
 * @returns {JSX.Element} The main dashboard interface
 */

import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import UserInput from "../components/UserInput"
import institutions from '../institutions.js';

const Dashboard = () => {
  // State for the user's input text
  const [input, setInput] = useState("")

  // Database of problematic legal phrases organized by category
  // Each category represents a different type of legal issue that can make arbitration clauses problematic
  const [errorPhrases, setErrorPhrases] = useState([
    {
      category: 'Non-Binding Arbitration',
      phrases: ["only persuasive", "will be persuasive", "not binding", "non-binding"]
    },
    {
      category: 'Alternative Dispute Resolution',
      phrases: ["either arbitration", "either litigation", "either by arbitration", "either by litigation", " or by litigation", " or by arbitration", " or litigation", " or arbitration", " or in the courts of", "either in the courts of"]
    },
    {
      category: 'Optional Arbitration',
      phrases: ["may refer to arbitration", "may submit to arbitration", "may arbitrate", "may proceed to arbitrate", "may proceed to arbitration"]
    },
    {
      category: 'Non-arbitrable matters',
      phrases: ["citizenship", "legitimacy of marriage", "insolvency"]
    },
  ])

  // State for storing errors found during analysis
  const [foundErrors, setFoundErrors] = useState([]);

  // Total count of errors found (used for display in sidebar header)
  const [totalErrors, setTotalErrors] = useState(0);

  // Flag to track if initial analysis has been performed (controls sidebar display)
  const [firstCheck, setFirstCheck] = useState(false);

  // Array of phrases to highlight in red in the text input
  const [errorHighlights, setErrorHighlights] = useState([]);

  // Boolean indicating whether a recognized arbitration institution was found
  const [institutionFound, setInstitutionFound] = useState(null);

  // Utility function to generate unique IDs for error items
  const generateUniqueId = () => Date.now() + Math.random();


  /**
   * Main analysis function that scans the user's input for legal issues
   *
   * This function performs two types of analysis:
   * 1. Pattern matching against known problematic phrases
   * 2. Institution validation against a database of recognized arbitration bodies
   *
   * The results are used to highlight problems in the text and display detailed explanations
   */
  const analyseClause = () => {
    // Reset all previous analysis results
    setFoundErrors([]);
    setTotalErrors(0);
    setErrorHighlights([]);
    setInstitutionFound(null);

    // Search through each category of error phrases to find matches in the user's input
    const found = errorPhrases.reduce((acc, { category, phrases }) => {
      // Filter phrases that appear in the user's input text
      const foundInCategory = phrases.filter((phrase) => input.includes(phrase));

      // If any problematic phrases were found in this category, add them to results
      if (foundInCategory.length > 0) {
        acc.push({ category, phrases: foundInCategory, id: generateUniqueId() });
      }
      return acc;
    }, []);

    // Mark that the first analysis has been completed (enables sidebar display)
    setFirstCheck(true);

    // Store the found errors for display in the sidebar
    setFoundErrors(found);

    // Calculate total number of individual phrase errors found
    const total = found.reduce((total, { phrases }) => total + phrases.length, 0);
    setTotalErrors(total);

    // Create array of all problematic phrases for text highlighting
    const errors = found.reduce((acc, { phrases }) => {
      acc.push(...phrases);
      return acc;
    }, []);
    setErrorHighlights(errors);

    // Check if the clause mentions any recognized arbitration institutions
    const institutionFound = institutions.some((institution) => input.includes(institution));
    setInstitutionFound(institutionFound);
    console.log(institutionFound);
  }


  /**
   * Effect hook to update total error count based on institution validation
   *
   * This runs after analysis is complete and adjusts the total error count:
   * - If a recognized institution is found: count = number of phrase errors
   * - If no recognized institution is found: count = phrase errors + 1 (for institution error)
   */
  useEffect(() => {
    if (firstCheck) {
      setTotalErrors((institutionFound === true) ? foundErrors.length : foundErrors.length + 1);
    }
  }, [foundErrors, institutionFound, firstCheck]);


  return (
    <main className="h-screen v-screen m-0 overflow-auto">
      {/* Left panel: Text input area with highlighting */}
      <div className="w-1/2">
        <UserInput {...{input, setInput, errorHighlights}}/>
      </div>

      {/* Right panel: Results sidebar with analysis and suggestions */}
      <div className="w-1/2 fixed right-0 top-0 h-full">
        <Sidebar {...{foundErrors, setFoundErrors, analyseClause, totalErrors, firstCheck, setFirstCheck, institutionFound, input, setTotalErrors}}/>
      </div>
    </main>
  );
}
 
export default Dashboard;