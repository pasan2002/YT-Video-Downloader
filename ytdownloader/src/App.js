import React from "react" 
import { MemoryRouter as Router, Routes, Route } from "react-router-dom";
import Download from "./Downloader"
import Insta from "./Insta";
import Facebook from "./Facebook";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Download/>}/>
        <Route path="/insta" element={<Insta/>}/>
        <Route path="/facebook" element={<Facebook/>}/>
      </Routes>
    </Router>
  );
}

export default App;
