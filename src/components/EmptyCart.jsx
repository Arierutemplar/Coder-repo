import React from 'react'
import { Link } from 'react-router-dom'

const EmptyCart = () => {
  return (
        <div style={{
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '10px'
      }}>
        <img src='https://i.postimg.cc/266QGDJz/empty-cart.png' alt='error'/>
         <div>
                <h2 className="fw-bold">Tu carrito está vacío</h2>
                <p className="text-muted mb-0">
                    Todavía no agregaste productos. ¡Descubrí nuestro catálogo!
                </p>
            </div>
                <Link className='btn btn-dark' to='/'>Ir a Home</Link>
            </div>
  )
}

export default EmptyCart