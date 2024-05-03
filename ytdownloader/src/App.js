import React from "react" 
import { MemoryRouter as Router, Routes, Route } from "react-router-dom";
import Download from "./Downloader"
import Insta from "./Insta";
import Facebook from "./Facebook";
import Tiktok from "./Tiktok";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Download/>}/>
        <Route path="/insta" element={<Insta/>}/>
        <Route path="/facebook" element={<Facebook/>}/>
        <Route path="/tiktok" element={<Tiktok/>}/>
      </Routes>
    </Router>
  );
}

export default App;
