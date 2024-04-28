import React from "react" 
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Download from "./Downloader"
import Insta from "./Insta";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Download/>}/>
        <Route path="/insta" element={<Insta/>}/>
      </Routes>
    </Router>
  );
}

export default App;
