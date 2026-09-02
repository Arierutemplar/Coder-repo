import React, {useContext} from 'react'
import { BsCart4 } from "react-icons/bs";
import Badge from 'react-bootstrap/Badge';
import { CartContext } from '../context/CartContext';

const CartWidgetRI = () => {
  const {cart, cartQty}= useContext(CartContext)
  console.log(cart)



  
  return (
    <div>
        <BsCart4 fontSize={'1.4rem'} color='black'/>
       {cart.length > 0 && <Badge bg="danger">
   {cartQty()}
      </Badge>}
    </div>
  )
}

export default CartWidgetRI