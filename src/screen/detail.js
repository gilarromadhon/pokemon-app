import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';

export default function Detail() {
    const { name } = useParams()
    const [data, setData] = useState("")
    const [pokemon, setPokemon] = useState("")
    const [type, setType] = useState("")
    const [isCaught, setIsCaught] = useState(null);
    const [isCatching, setIsCatching] = useState(false); 
    const [loading, setLoading] = useState(false); 
    const navigate = useNavigate()



    useEffect(() => {
        setLoading(true);
        const fetchData = async (status) => {
          try {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`); 
            const result = await response.json();
            setLoading(false);
            setData(result); 
            setType(result.types[0].type.name)
          } catch (error) {
            console.error('Error fetching data:', error);
          }
        };
        fetchData();
    }, []);

    const catchPokemon = () => {
        setIsCatching(true);
        setTimeout(() => {
            const success = Math.random() < 0.5;
            setIsCaught(success);
            setIsCatching(false);
        }, 1000); 
    };

    function savePokemon() {
        let pokemonData = {
            id: data.id,
            name: data.name,
            image: data.sprites.other.home.front_default,
            type: data.types[0].type.name,
            alias_name: pokemon.name,
        }
        if (localStorage.getItem("myPokemon") == null || localStorage.getItem("myPokemon") === undefined) {
            localStorage.setItem("myPokemon", JSON.stringify([pokemonData]));
        } else {
            const myPokemon = JSON.parse(localStorage.getItem("myPokemon"));
            
            const exists = myPokemon.some(p => p.name === pokemonData.name && p.alias_name === pokemonData.alias_name);
            if (exists) {
                alert("Pokémon dengan nama dan alias yang sama sudah ada!");
                return; // Hentikan eksekusi jika sudah ada
            }
            
            myPokemon.push(pokemonData);
            localStorage.setItem("myPokemon", JSON.stringify(myPokemon));
        }
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
        <div className="detail"  style={{ backgroundColor: pokemonTypes[type] }}>
            {
                !loading && 
                <div>
                    <div className="detail-header">
                        <label className="name">{data.name}</label>
                        <div className="detail-type">
                            {
                                data.types?.map((item, index) => 
                                    <label key={index}>
                                        {item.type.name}
                                    </label>
                                )
                            }
                        </div>
                    </div>
                    <div className="detail-image" style={{ position: 'relative' }}>
                        <img src={data?.sprites?.other?.home.front_default} alt={name}/>
                    </div>
                    <div className="detail-description">
                        <div className="list-description">
                            <label>Stats</label>
                            <label>Move</label>
                        </div>
                        {
                            data.stats?.map((item, index) => 
                                <div key={index}>
                                    {item.stat.name}
                                    <div className="progress-bar">
                                    <div
                                        className="progress-bar-fill"
                                        style={{ width: `${item.base_stat}%` }}
                                    >
                                        {item.base_stat}%
                                    </div>
                                    </div>
                                </div>
                            )
                        }
                    </div>
                </div>
            }

            {/* <h1>Catch a Pokémon</h1> */}
            {/* <div style={{ fontSize: '2rem', marginBottom: '20px' }}>
                {isCatching ? 'Catching...' : isCaught === null ? 'Try to catch a Pokémon!' : isCaught ? 'Pokémon caught!' : 'Pokémon escaped!'}
            </div>
            <button onClick={catchPokemon} disabled={isCatching} style={{ padding: '10px 20px', fontSize: '1.5rem' }}>
                {isCatching ? 'Catching...' : 'Catch Pokémon'}
            </button>

            <div hidden={!isCaught}>
                <input 
                    type="text" 
                    placeholder="Masukkan nama Pokémon" 
                    value={pokemon.name || ''} 
                    onChange={(e) => setPokemon({ ...pokemon, name: e.target.value })} 
                />
                <button onClick={() => savePokemon()}>Simpan</button>
            </div>
            <div hidden={isCaught || isCaught == null}>
                <label>Pokemon Escape</label>
                <button onClick={() => navigate(-1)}>Ok</button>
            </div> */}
        </div>
    )
}
