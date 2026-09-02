import React from 'react'
import {Link} from 'react-router-dom'

const Item = ({prod}) => {
    return (
        <div className="card" style={{ width: '18rem' }}>
            <img src={prod.img} className="card-img-top" alt={prod.description} />
            <div className="card-body">
                <h5 className="card-title">{prod.name}</h5>
                <p className="card-text">${prod.price}</p>
                <Link className="btn btn-primary" to={`/item/${prod.id}`}>Ver más</Link>
            </div>
        </div>
    )
}

export default Item