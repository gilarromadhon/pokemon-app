import React, { useEffect, useState } from 'react'
import '../App.css';
import { useNavigate } from 'react-router-dom';
import { IoIosCloseCircle } from "react-icons/io";

export default function Pokemon() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
  
    useEffect(() => {
        if (localStorage.getItem("myPokemon") !== null || localStorage.getItem("myPokemon") !== undefined) {
            const myPokemon = JSON.parse(localStorage.getItem("myPokemon"));
            setData(myPokemon)
        }
    }, []);
    
    function handleDetail(names) {
        navigate('/detail/' + names, { state: { names } });
    }

    function handleRelease(id) {
        const myPokemon = JSON.parse(localStorage.getItem("myPokemon"));
        const updatedPokemon = myPokemon.filter(pokemon => pokemon.id !== id);
        localStorage.setItem("myPokemon", JSON.stringify(updatedPokemon));
        setData(updatedPokemon)
    }

    const pokemonTypes = {
        normal: '#A8A77A',
        fire: '#EE8130',
        water: '#6390F0',
        grass: '#7AC74C',
        ground: '#E2BF65',
        bug: '#A6B91A',
        poison: '#A33EA1',
        electric: '#F7D02C',
        rock: '#B6A136',
        psychic: '#F95587',
        fighting: '#C22E28',
        fairy: '#D685AD',
        dragon: '#6F35FC',
        ice: '#96D9D6',
        default: '#232730',
        flying: '#A98FF3',
        ghost: '#735797',
        dark: '#705746',
        stell: '#B7B7CE'
    };

    return (
      <div className="body">
            <h3>You have {data?.length || '0'} pokemon</h3>
            <div className="list">
                {
                    !loading && data?.map((item, index) => 
                        <div 
                            key={item.name} 
                            // onClick={() => handleDetail(item.name)} 
                            className="pokemon" 
                            style={{ 
                                backgroundColor: pokemonTypes[item.type],
                                position: 'relative'
                            }}
                        >   
                            <IoIosCloseCircle onClick={() => handleRelease(item.id)} size={30} style={{ position: 'absolute', right: 5, top: 5, cursor: 'pointer', zIndex: 999 }} />
                            <div>
                                <label className="name">{item.name}</label>
                                <label>{item.alias_name}</label>
                            </div>
                            <img key={index} src={item.image} alt='pokemon' />
                        </div>
                    )
                }
            </div>
      </div>
    );
}
