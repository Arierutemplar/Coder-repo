import React from 'react'
import ApiCard from './ApiCard'

const ListApi = ({characters}) => {
  return (
    <div className='p-2 d-flex justify-content-between align-items-center flex-wrap'>
        {characters && characters?.map((pj)=> <ApiCard key={pj.id} pj={pj}/>)}
    </div>
  )
}

export default ListApi