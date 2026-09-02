import React from 'react'

const CartWidget = ({count}) => {
  return (
    <div>
        <span>🛒</span>
        <span style={{color:'red'}}>{count}</span>
    </div>
  )
}

export default CartWidget