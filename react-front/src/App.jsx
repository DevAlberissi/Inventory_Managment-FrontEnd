import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';
import CadastroSeller from './CadastroSeller';
import Login from './Login';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cadastrar" element={<CadastroSeller />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;