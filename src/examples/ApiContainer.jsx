import React, {useState, useEffect} from 'react'
import ListApi from './ListApi'
import { useFetch } from '../hooks/useFetch'

const ApiContainer = () => {
    // const [characters, setCharacters]= useState([])
    const {data, loading, error}= useFetch('https://rickandmortyapi.com/api/character')
        const {data: dataDG, loading: loadingDB, error: errorDB}= useFetch('https://dragonball-api.com/api/characters')
    
    // useEffect(()=>{
    //     //1. pedir data
    //     fetch('https://rickandmortyapi.com/api/character')
    //     .then((res)=> res.json()) //2. traducir
    //     .then((data)=>setCharacters(data.results)) //3. guardando data
    //     .catch((error)=> console.log(error))//4. atrapar el error
    // },[])
    console.log({data: dataDG, loading: loadingDB, error: errorDB})
  return (
    <div>
       {loadingDB ? <p>Cargando...</p> : <ListApi characters={dataDG?.items}/>}
       {loading ? <p>Cargando...</p> : <ListApi characters={data?.results}/>}
    </div>
  )
}

export default ApiContainer