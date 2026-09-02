import React, { useState, useContext } from 'react'
import ItemCount from './ItemCount'
import { Link } from 'react-router-dom'
import { CartContext } from '../context/CartContext'

//5. PARA EL CONTEXTO, NESITO IMPORTAL EL HOOK USECONTEXT Y EL CONTEXTO QUE USAR

const ItemDetail = ({detail}) => {
const [purchase, setPurchase]= useState(false)
// const contexto = useContext(CartContext)

// console.log(contexto, 'contexto')
const {cart, addItem} = useContext(CartContext)

console.log(cart, 'contexto')
  const onAdd = (cantidad)=> {
    addItem(detail, cantidad)
    setPurchase(true)
  console.log('cantidad:', cantidad)
  }

  return (
    <div
    style={{
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '10px'
      }}>
        <h2>Detalle de: {detail.name}</h2>
        <img src={detail.img} alt={detail.name}/>
        <p>{detail.description}</p>
        <p>${detail.price},00</p>
        <p>stock: {detail.stock} unidades disponibles</p>
        
       {
        purchase 
        ? <div className='d-flex justify-content-between align-items-center p-4 w-25'>
        <Link className='btn btn-dark' to='/'>Seguir Comprando</Link>
        <Link className='btn btn-dark' to='/cart'>Ir al Carrito</Link>
        </div> 
        : <ItemCount stock={detail.stock} initial={1} onAdd={onAdd}/>
       }
      </div>
  )
}

export default ItemDetail