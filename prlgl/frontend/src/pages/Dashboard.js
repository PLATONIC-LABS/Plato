import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import UserInput from "../components/UserInput"
import institutions from '../institutions.js';

const Dashboard = () => {
  const [input, setInput] = useState("")
  const [errorPhrases, setErrorPhrases] = useState([
    { category: 'Non-Binding Arbitration', phrases: ["only persuasive", "will be persuasive", "not binding", "non-binding"] },
    { category: 'Alternative Dispute Resolution', phrases: ["either arbitration", "either litigation", "either by arbitration", "either by litigation", " or by litigation", " or by arbitration", " or litigation", " or arbitration", " or in the courts of", "either in the courts of"] },
    { category: 'Optional Arbitration', phrases: ["may refer to arbitration", "may submit to arbitration", "may arbitrate", "may proceed to arbitrate", "may proceed to arbitration"]},
    { category: 'Non-arbitrable matters', phrases: ["citizenship", "legitimacy of marriage", "insolvency"] },
  ])

  const [foundErrors, setFoundErrors] = useState([]);
  const [totalErrors, setTotalErrors] = useState(0);
  const [firstCheck, setFirstCheck] = useState(false); // if first check is false, i.e. no initial analysis is made, sidebar will be empty (no cards)
  const [errorHighlights, setErrorHighlights] = useState([]);
  const [institutionFound, setInstitutionFound] = useState(null);
  const generateUniqueId = () => Date.now() + Math.random();


  const analyseClause = () => {
    setFoundErrors([]);
    setTotalErrors(0);
    setErrorHighlights([]);
    setInstitutionFound(null);
    const found = errorPhrases.reduce((acc, { category, phrases }) => {
      const foundInCategory = phrases.filter((phrase) => input.includes(phrase));
      if (foundInCategory.length > 0) {
        acc.push({ category, phrases: foundInCategory, id: generateUniqueId() });
      }
      return acc;
    }, []);
    setFirstCheck(true);
    setFoundErrors(found);
    const total = found.reduce((total, { phrases }) => total + phrases.length, 0);
    setTotalErrors(total);
    const errors = found.reduce((acc, { phrases }) => {
      acc.push(...phrases);
      return acc;
    }, []);
    setErrorHighlights(errors);


    const institutionFound = institutions.some((institution) => input.includes(institution));
    setInstitutionFound(institutionFound);
    console.log(institutionFound);
  }

 
  useEffect(() => {
    if (firstCheck) {
      setTotalErrors((institutionFound === true) ? foundErrors.length : foundErrors.length + 1);
    }
  }, [foundErrors, institutionFound, firstCheck]);
  
  
  return (
    <main className="h-screen v-screen m-0 overflow-auto">
      <div className="w-1/2">
        <UserInput {...{input, setInput, errorHighlights}}/>
      </div>
      <div className="w-1/2 fixed right-0 top-0 h-full">
        <Sidebar {...{foundErrors, setFoundErrors, analyseClause, totalErrors, firstCheck, setFirstCheck, institutionFound, input, setTotalErrors}}/>
      </div>
    </main>
  );
}
 
export default Dashboard;