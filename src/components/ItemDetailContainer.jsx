import React, { useEffect, useState } from 'react'
import { getOneProduct } from '../mocks/data'
import ItemDetail from './ItemDetail'
import { useParams } from 'react-router-dom'
import LoaderComponent from './LoaderComponent'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../service/firebase'

const ItemDetailContainer = () => {
    const [detail, setDetail]=useState({})
    const [loading, setLoading]= useState(true)
    // const param = useParams()
     console.log('ItemDetailContainer')
    const {id}= useParams()

        //FIREBASE
     useEffect(()=> {
       const docRef= doc(db, "items", id)
        getDoc(docRef)
        .then((res)=> {
          if(res.data()){
            setDetail({id:res.id, ...res.data()})
          }else{
            navigate('/producto-inexistente')
          }
        })
        .catch((error)=> console.log(error))
        .finally(()=> setLoading(false))
    },[id])

    //PROMESA LOCAL
    // useEffect(()=> {
    //     getOneProduct(id)
    //     .then((res)=> setDetail(res))
    //     .finally(()=> setLoading(false))
    // },[id])

  return (
    <>
       {loading ? <LoaderComponent text='Cargando detalle...'/> :  <ItemDetail detail={detail} />}
    </>
  )
}

export default ItemDetailContainer