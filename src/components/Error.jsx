import React from 'react'
import {Link} from 'react-router-dom'

const Error = () => {
  return (
    <div style={{
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '10px'
      }}>
        <img src='https://i.postimg.cc/G3grHRxq/grumpy-cat-404-bandana.jpg' alt='error'/>
        <Link className='btn btn-dark' to='/'>Volver a Home</Link>
    </div>
  )
}

export default Error