import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import '../App.css';
import Image from "../assets/pokeball-icon.png"

export default function List() {
    const [data, setData] = useState([]);
    const [limit] = useState(10)
    const [offSet, setOffSet] = useState(localStorage.getItem("offset") != null ? Number(localStorage.getItem("offset")) : 0)
    const [loading, setLoading] = useState(false)
    const [img, setImg] = useState([])
    const [type, setType] = useState([])
    const [id, setId] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        setLoading(true);
        const fetchData = async () => {
            try {
                const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offSet}`); 
                const result = await response.json();

                if (result) {
                    for (const item of result.results) {
                        await fetchImage(item.url);
                    }
                    setData(result.results); 
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
        localStorage.setItem("offset", offSet)
    }, [offSet, limit]);


    const fetchImage = async (url) => {
        try {
          const response = await fetch(url); 
          const result = await response.json();
          setImg((prev) => [...prev, result.sprites.other.home.front_default])
          setType((prev) => [...prev, result.types[0].type.name])
          setId((prev) => [...prev, result.id])
        } catch (error) {
          console.error('Error fetching data:', error);
        }
    };
  
    function handlePrevious() {
        setImg([])
        setType([])
        setId([])
        setOffSet((prev) => prev - 10 )
        setLoading(true)
    }
  
    function handleNext() {
        setImg([])
        setType([])
        setId([])
        setOffSet((prev) => prev + 10 )
        setLoading(true)
    }
    
    function handleDetail(names) {
        navigate('/detail/' + names, { state: { names } });
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
            {
                !loading ?
                <div>
                    <div className="list">
                        {
                            data.map((item, index) => 
                                <div 
                                    key={item.name} 
                                    onClick={() => handleDetail(item.name)} 
                                    className="pokemon" 
                                    style={{ 
                                        backgroundColor: pokemonTypes[type[index]] || pokemonTypes.default,
                                    }}
                                >
                                    <div>
                                        <label className="id">#0{id[index]}</label>
                                        <label>{item.name}</label>
                                        <label>{type[index]}</label>
                                    </div>
                                    <img key={item.name} src={img[index]} alt='pokemon' />
                                </div>
                            )
                        }
                    </div>
        
                    <div className="pagination"> 
                        <button className="custom-button" disabled={offSet === 0} onClick={handlePrevious}>Previous</button>
                        <button className="custom-button" onClick={handleNext}>Next</button>
                    </div>
                </div> : 
                <div className="loading">
                    <img src={Image} alt='icon' className="pokeball-icon" style={{ width: 20, height: 20 }}  />
                    <img src={Image} alt='icon' className="pokeball-icon" style={{ width: 40, height: 40 }}  />
                    <img src={Image} alt='icon' className="pokeball-icon" style={{ width: 20, height: 20 }}  />
                </div>
            }
      </div>
    );
}
