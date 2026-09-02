import React from 'react'
import Item from './Item'

const ItemList = ({data}) => {
  return (
    <div className='p-2 d-flex justify-content-between align-items-center flex-wrap'>
        {data.map((prod)=> <Item key={prod.id} prod={prod}/>)}
    </div>
  )
}

export default ItemList