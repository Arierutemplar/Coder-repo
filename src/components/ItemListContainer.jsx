import React, {useState, useEffect} from 'react'
import { getProducts } from '../mocks/data'
import ItemList from './ItemList'
import { useParams } from 'react-router-dom'
import LoaderComponent from './LoaderComponent'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { db } from '../service/firebase'


const ItemListContainer = ({greeting}) => {
  const [data, setData]= useState([])
  const [loading, setLoading]=useState(false)

 const {type}= useParams()


//FIREBASE
useEffect(()=>{
    setLoading(true)
    //1. CONECTAR CON NUESTRA COLECCION
    const prodCollection = type ? query(collection(db,"items"), where("category", "==", type)) : collection(db,"items")
    getDocs(prodCollection) //2.pedir los documentos
    .then((res)=> {
      // console.log(res.docs, 'sin tratar')
     const list = res.docs.map((doc)=> {
      return{
        id: doc.id,
        ...doc.data()
      }
     })
    //  console.log(list, 'tratado')
    setData(list)
    })//trato la promesa
    .catch((error)=> console.log(error))//atrapo el error
    .finally(()=> setLoading(false))
  },[type])

 //PROMESA LOCAL 
  // useEffect(()=>{
  //   setLoading(true)
  //   //1. PEDIR DATOS
  //   getProducts()
  //   .then((res)=> {
  //     if(type){
  //       //filtro
  //       setData(res.filter((prod)=> prod.category === type))
  //     }else{
  //       //no filtro
  //       setData(res)
  //     }
  //   })//trato la promesa
  //   .catch((error)=> console.log(error))//atrapo el error
  //   .finally(()=> setLoading(false))
   
 // },[type])
   
  return (
    <>
    {
      loading ?
      <LoaderComponent text={type ? 'Cargando Categoría...' : 'Cargando Productos...'}/>
      : <div>
        <h1>{greeting} {type && <span>{type}</span>}</h1>
        <ItemList data={data}/>
    </div>
    }
    </>
  )
}

export default ItemListContainer