import React from 'react'
import failtick from '../Assets/faillure.png'
import './Failure.css'

const Failure = () => {
  return (
    <div className='popup'>
          <img src={failtick} alt="" />
          <h2>Payment Cancled!</h2>
          <p>Your payment was failure</p>
          </div>
  )
}

export default Failure