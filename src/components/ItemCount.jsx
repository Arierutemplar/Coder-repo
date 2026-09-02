//1. IMPORT DEL HOOK
import React,{useState} from 'react'
//REGLA 1: HOOKS SIEMPRE DENTRO DEL COMPONENTE
// const [count, setCount]= useState(1)
const ItemCount = ({initial, stock, onAdd}) => {
    // let num = 99
    //REGLA 2: DENTRO DE IFS Y LOOPS
    // if(pepe){
    //     const [count, setCount]= useState(1)
    // }
    //REGLA 3: LOS HOOKS SE DELARAN AL PRINCIPIO
    const [count, setCount]= useState(initial)
    //ESTRUCTURA DE DECLARACION DEL HOOK
    // const [variableDeEstado, funcionModificadora] = useState(valorInicial)
    

    const sumar = () =>{
        if(count < stock){

            setCount(count + 1)
        }
    }


       const restar = () =>{
        if(count > 0){

            setCount(count - 1)
        }
    }

    const comprar = ()=> {
        onAdd(count)
    }
 

console.log('ItemCount')
  return (
  <div>
        <button className='btn btn-danger' onClick={restar} disabled={count === 0}>-</button>
        <span className='btn'>{count}</span>
        <button className='btn btn-success' onClick={sumar} disabled={count === stock}>+</button>
        <button className='btn btn-primary'  disabled={count === 0 || stock === 0} onClick={comprar}>Comprar</button>
    </div>
  )
}

export default ItemCount