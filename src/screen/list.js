import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import '../App.css';
import Image from "../assets/pokeball-icon.png"
import pokemonTypes from './types';

export default function List() {
    const [data, setData] = useState([]);
    const [limit] = useState(10)
    const [offSet, setOffSet] = useState(0)
    const [loading, setLoading] = useState(false)
    const [img, setImg] = useState([])
    const [type, setType] = useState([])
    const [id, setId] = useState([])
    const navigate = useNavigate()
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const page = queryParams.get('page');

    useEffect(() => {
        if (page) {
            setOffSet(Number((page - 1) * 10))
        }
        setLoading(true);
        const fetchData = async () => {
            try {
                const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${page ? Number((page - 1) * 10) : offSet}`); 
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
        navigate('/list?page=' + Number((offSet - 10) / 10 + 1) );
    }
  
    function handleNext() {
        setImg([])
        setType([])
        setId([])
        setOffSet((prev) => prev + 10 )
        setLoading(true)
        navigate('/list?page=' + Number((offSet + 10) / 10 + 1) );
    }
    
    function handleDetail(names) {
        navigate('/detail/' + names, { state: { names } });
    }

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
                                        <label className="id">{
                                            Number(id[index]) > 99 ? `#${id[index]}` : 
                                            Number(id[index]) > 9 ? `#0${id[index]}` : `#00${id[index]}`
                                        }
                                        </label>
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
