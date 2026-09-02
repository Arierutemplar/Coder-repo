import React from 'react'
import { Spinner } from 'react-bootstrap'

const LoaderComponent = ({text}) => {
  return (
    <div style={{width:'100%', height:'85vh', display:'flex', justifyContent:'center', alignItems:'center', flexDirection:'column'}}>
        <Spinner variant='dark' animation='border'/>
        <span>{text}</span>
    </div>
  )
}

export default LoaderComponent