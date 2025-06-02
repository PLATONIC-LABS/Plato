/**
 * Main Application Component
 *
 * This is the root component of the PRLGL legal clause analysis application.
 * It sets up the routing structure and renders the main Dashboard component.
 *
 * The application uses React Router for navigation, though currently it only
 * has one route (the Dashboard). This structure allows for easy expansion
 * to multiple pages in the future.
 *
 * @component
 * @returns {JSX.Element} The main application with routing configured
 */

import { Route, BrowserRouter, Routes } from 'react-router-dom';
import './App.css';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <div className="App">
      {/* BrowserRouter enables client-side routing for the application */}
      <BrowserRouter>
          <Routes>
            {/* Main route - displays the Dashboard component when users visit the root URL */}
            <Route
            path="/"
            element={<Dashboard/>}/>
          </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
