import React, { useEffect, useState } from 'react'
import '../App.css';
import { useNavigate } from 'react-router-dom';
import BeatLoader from "react-spinners/BeatLoader";

export default function List() {
    const [data, setData] = useState([]);
    const [limit] = useState(20)
    const [offSet, setOffSet] = useState(0)
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

    const override = {
        margin: "0 auto",
        height: "90vh",
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    };

    return (
      <div className="body">
            <BeatLoader
                color={'gray'}
                loading={loading}
                cssOverride={override}
                size={25}
                aria-label="Loading Spinner"
                data-testid="loader"
            />

            {
                !loading && 
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
                                    <img key={index} src={img[index]} alt='pokemon' />
                                </div>
                            )
                        }
                    </div>
        
                    <div className="pagination"> 
                        <button className="custom-button" disabled={offSet === 0} onClick={handlePrevious}>Previous</button>
                        <button className="custom-button" onClick={handleNext}>Next</button>
                    </div>
                </div>
            }
      </div>
    );
}
