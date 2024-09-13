import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import Modal from 'react-modal';
import Image from "../assets/pokeball-icon.png"

const customStyles = {
  content: {
    textAlign: 'center',
    backgroundColor: 'white',
    fontWeight: 'bold',
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

Modal.setAppElement('#root');

export default function Detail() {
    const { name } = useParams()
    const [data, setData] = useState("")
    const [pokemon, setPokemon] = useState("")
    const [type, setType] = useState("")
    const [isCaught, setIsCaught] = useState(null);
    const [isCatching, setIsCatching] = useState(false); 
    const [loading, setLoading] = useState(false); 
    const [menu, setMenu] = useState("stats")
    const [open, setOpen] = useState(false);
    const [error, setError] = useState(false);
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
    }, [name]);

    const catchPokemon = () => {
        setIsCatching(true);
        setTimeout(() => {
            const success = Math.random() < 0.5;
            setOpen(true);
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
            navigate("/my-pokemon")
        } else {
            const myPokemon = JSON.parse(localStorage.getItem("myPokemon"));
            
            const exists = myPokemon.some(p => p.name === pokemonData.name && p.alias_name === pokemonData.alias_name);
            if (exists) {
                setError(true);
                return; 
            }
            
            myPokemon.push(pokemonData);
            localStorage.setItem("myPokemon", JSON.stringify(myPokemon));
            navigate("/my-pokemon")
        }
    }

    function changeMenu(value) {
        setMenu(value)
    }

    function formatStats(value) {
        if (value === "special-attack") return "sp. atk"
        if (value === "special-defense") return "sp. def"
        return value
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
        <div className="detail" style={!loading ? { backgroundColor: pokemonTypes[type] } : {}}>
            {
                !loading ?
                <div>
                    <div className="detail-header">
                        <label className="name">{data.name}</label>
                        <div className="detail-type">
                            {
                                data.types?.map((item, index) => 
                                    <label key={item.type.name}>
                                        {item.type.name}
                                    </label>
                                )
                            }
                        </div>
                    </div>
                    <div className="detail-image">
                        <img src={data?.sprites?.other?.home.front_default} alt={name}/>
                    </div>
                    <div className="detail-description">
                        <div className="list-description">
                            <div>
                                <label onClick={() => changeMenu('stats')} className={menu === 'stats' ? 'active' : '' }>Stats</label>
                                <label onClick={() => changeMenu('moves')} className={menu === 'moves' ? 'active' : '' }>Moves</label>
                            </div>
                            <button onClick={catchPokemon} disabled={isCatching} className="catch-button">
                                {isCatching ? 'Catching...' : 'Catch'}
                            </button>
                        </div>
                        <div hidden={menu !== "stats"}>
                            {
                                data.stats?.map((item, index) => 
                                    <div key={item.stat.name} className="detail-stats">
                                        <label>{formatStats(item.stat.name)}</label>
                                        <div className="progress-bar">
                                            <div
                                                className="progress-bar-fill"
                                                style={{ width: `${item.base_stat}%` }}
                                            >
                                                {item.base_stat}
                                            </div>
                                        </div>
                                    </div>
                                )
                            }
                        </div>

                        <div hidden={menu !== "moves"}>
                            {
                                data.moves?.map((item, index) => 
                                    <div key={item.move.name} className="detail-moves">
                                        <li>{formatStats(item.move.name)}</li>
                                    </div>
                                )
                            }
                        </div>
                    </div>
                </div> : 
                <div className="loading">
                    <img src={Image} alt='icon' className="pokeball-icon" style={{ width: 20, height: 20 }}  />
                    <img src={Image} alt='icon' className="pokeball-icon" style={{ width: 40, height: 40 }}  />
                    <img src={Image} alt='icon' className="pokeball-icon" style={{ width: 20, height: 20 }}  />
                </div>
            }

            <Modal
                isOpen={open}
                style={customStyles}
                contentLabel="Modal"
            >
                <label className="modal">
                    {isCaught ? 'Pokémon caught!' : 'Pokémon escaped!'}
                </label>
                <div hidden={!isCaught} className="modal-action">
                    <input 
                        hidden={!isCaught}
                        type="text" 
                        placeholder="Enter Pokémon name" 
                        value={pokemon.name || ''} 
                        onChange={(e) => setPokemon({ ...pokemon, name: e.target.value })} 
                    />
                    <p hidden={!error}>Pokémon with the same name and alias already exist!</p>
                    <button hidden={!isCaught} onClick={() => savePokemon()}>Save</button>
                    <button hidden={!isCaught} onClick={() => setOpen(false)} className="cancel">Cancel</button>
                    <button  hidden={isCaught || isCaught == null} onClick={() => setOpen(false)}>Ok</button>
                </div>
            </Modal>
        </div>
    )
}
