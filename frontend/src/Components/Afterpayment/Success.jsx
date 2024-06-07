import React from 'react'
import tick from '../Assets/404-tick.png'
import './Success.css'

const Success = () => {
  return (
    <div className='popup'>
          <img src={tick} alt="" />
          <h2>Thank You!</h2>
          <p>Your payment was successful</p>
          </div>

  )
}

export default Success