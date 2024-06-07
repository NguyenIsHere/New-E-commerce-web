import React from 'react'
import failtick from '../../Components/Assets/faillure.png'
import '../CSS/Failure.css'

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