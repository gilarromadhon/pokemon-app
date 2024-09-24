import React, { useEffect, useState } from 'react'
import '../App.css';
import { IoIosCloseCircle } from "react-icons/io";
import pokemonTypes from './types';

export default function Pokemon() {
    const [data, setData] = useState([]);
  
    useEffect(() => {
        if (localStorage.getItem("myPokemon") !== null || localStorage.getItem("myPokemon") !== undefined) {
            const myPokemon = JSON.parse(localStorage.getItem("myPokemon"));
            setData(myPokemon)
        }
    }, []);
    
    function handleRelease(name) {
        const myPokemon = JSON.parse(localStorage.getItem("myPokemon"));
        const updatedPokemon = myPokemon.filter(pokemon => pokemon.alias_name !== name);
        localStorage.setItem("myPokemon", JSON.stringify(updatedPokemon));
        setData(updatedPokemon)
    }

    return (
      <div className="body">
            {
                data?.length > 0 
                    ? <h3>You have {data.length} pokemon</h3>
                    : <h3>You don't have pokemon</h3>
            }
            <div className="list">
                {
                    data?.map((item, index) => 
                        <div 
                            key={item.name} 
                            className="pokemon" 
                            style={{ 
                                backgroundColor: pokemonTypes[item.type],
                                position: 'relative'
                            }}
                        >   
                            <IoIosCloseCircle onClick={() => handleRelease(item.alias_name)} size={30} style={{ position: 'absolute', right: 5, top: 5, cursor: 'pointer', zIndex: 998 }} />
                            <div>
                                <label className="name">{item.name}</label>
                                <label>{item.alias_name}</label>
                            </div>
                            <img key={item.name} src={item.image} alt='pokemon' />
                        </div>
                    )
                }
            </div>
      </div>
    );
}
