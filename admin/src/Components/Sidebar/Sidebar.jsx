import React from 'react'
import './Sidebar.css'
import { Link } from 'react-router-dom'
import add_proudct_icon from '../../assets/Product_Cart.svg'
import list_product_icon from '../../assets/Product_list_icon.svg'
import discount_icon from '../../assets/discount_icon.png'
import payment_icon from '../../assets/payment_icon.png'

const Sidebar = () => {
  return (
    <div className='sidebar'>
      <Link to={'/addproduct'} style={{textDecoration:"none"}}>
        <div className="sidebar-item">
          <img src={add_proudct_icon} alt="" />
          <p>Add Product</p>
        </div>
      </Link>
      <Link to={'/listproduct'} style={{textDecoration:"none"}}>
        <div className="sidebar-item">
          <img src={list_product_icon} alt="" />
          <p>Product List</p>
        </div>
      </Link>
      <Link to={'/discount'} style={{textDecoration:"none"}}>
        <div className="sidebar-item">
          <img className='discount_icon' src={discount_icon} alt="" />
          <p>Discount</p>
        </div>
      </Link>
      <Link to={'/payment'} style={{textDecoration:"none"}}>
        <div className="sidebar-item">
          <img className='payment_icon' src={payment_icon} alt="" />
          <p>Payment</p>
        </div>
      </Link>
    </div>
  )
}

export default Sidebar
