//1. IMPORT CREATE CONTEXT
import { useState } from "react";
import { createContext } from "react";

//2. CREACION DEL CONTEXTO
export const CartContext = createContext();

//3. CREAMOS NUESTRO CUSTOM PROVIDER

export const CartProvider = ({children})=> {
    const [cart, setCart]= useState([])

//todas las funciones

  //1. AGREGAR UN PROD AL CARRITO Y QUE CONTEMPLE REPETIDOS

  const addItem = (item, qty)=> {
    //console.log({item, qty})
    //  console.log(item, qty)
     //console.log({...item, quantity: qty})
     if(isInCart(item.id)){
        //existe
        setCart(
            cart.map((prod)=> {
                if(prod.id === item.id){
                    //sumar cantidades
                    return {...prod, quantity: prod.quantity + qty}
                }else{
                    //no modifico
                    return prod
                }
            })
        )
     }else{
         setCart([...cart,{...item, quantity: qty}])
      }
  }

  //2. BORRE TODO EL CARRITO

  const clear = ()=> {
    setCart([])
  }

  //3. eliminar un producto

  const removeItem = (id)=> {
     setCart(cart.filter((prod)=> prod.id !== id))
  }

  //4. SI ESTA O NO EN EL CARRITO
  const isInCart = (id)=> {
    return cart.some((prod)=> prod.id === id)
  }

 //total a pagar 

    const total = ()=> {
        return cart.reduce((acc, prod)=> acc += prod.quantity * prod.price, 0)
    }

     const totalConImp = ()=> {
        return cart.reduce((acc, prod)=> acc += prod.quantity * prod.price, 1.5)
    }

    //la cantidad total de items en carrito

    const cartQty = ()=> {
        return cart.reduce((acc, prod)=> acc += prod.quantity, 0)
    }


    return(
        <CartContext.Provider value={{cart, addItem, clear, removeItem, total, totalConImp, cartQty}}>
            {children}
        </CartContext.Provider>
    )
}