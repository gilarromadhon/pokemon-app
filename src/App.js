import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate, useLocation } from 'react-router-dom';
import List from './screen/list';
import Detail from './screen/detail';
import Pokemon from './screen/pokemon';
import './App.css';
import { SiPokemon } from "react-icons/si";
import { MdCatchingPokemon } from "react-icons/md";
import { TbLayoutDashboardFilled } from "react-icons/tb";
import Image from "./assets/pokeball-icon.png"


function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <header>
      <SiPokemon size={70} color='yellow' onClick={() => navigate('/list')} />
        {
          location.pathname === "/list" 
            // ? <MdCatchingPokemon size={30} onClick={() => navigate('/my-pokemon')} />
            ? <img src={Image} alt='icon' style={{ width: 30 }} onClick={() => navigate('/my-pokemon')} />
            : <TbLayoutDashboardFilled size={30} onClick={() => navigate('/list')} />
        }
      
    </header>
  );
}

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route
          path="/list"
          element={<List />}
        />
        <Route
          path="/detail"
          element={<Detail /> }
        />
        <Route
          path="/detail/:name"
          element={<Detail /> }
        />
        <Route
          path="/my-pokemon"
          element={<Pokemon /> }
        />
        <Route
          path="*"
          element={<Navigate to={"/list"} />}
        />
      </Routes>
    </Router>
  );
}

export default App;
