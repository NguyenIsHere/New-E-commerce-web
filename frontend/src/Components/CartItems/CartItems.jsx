import {React,useContext, useState} from 'react'
import './CartItems.css'
import {ShopContext} from '../../Context/ShopContext'
import remove_icon from '../Assets/cart_cross_icon.png'
import {Link} from 'react-router-dom'

const CartItems = () =>
{
  const {getTotalCartAmount,all_product,cartItems,removeFromCart} = useContext(ShopContext);
  const handleClick = async () =>{
    try {
      const requestbody = {
        amount:getTotalCartAmount()+1000,
        email:JSON.parse(localStorage.getItem('user')).email,
      };
      const response = await fetch('http://localhost:4000/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestbody),
      });
      const data = await response.json();
      console.log(data);      
      window.location.href = data.shortLink;
    } catch (error) {
      console.log('Network error:', error)
    }
  }
  return (
    <div className='cartitems'>
      <div className="cartitems-format-main">
        <p>Products</p>
        <p>Title</p>
        <p>Price</p>
        <p>Quantity</p>
        <p>Total</p>
        <p>Remove</p>
      </div>
      <hr />
      {all_product.map((e) =>
      {
        if (cartItems[e.id] > 0)
        {
          return (
            <div>
            <div className="cartitems-format cartitems-format-main ">
            <Link to={`/product/${e.id}`}> {/* Wrap img tag with Link component */}
                <img src={e.image} alt="" className='carticon-product-icon' />
              </Link>
                <p>{e.name}</p>
                <p>${e.new_price}</p>
                <button className='cartitems-quantity'>{cartItems[e.id]}</button>
                <p>${e.new_price*cartItems[e.id]}</p>
              <img className='cartitems-remove-icon' src={remove_icon} onClick={()=>{removeFromCart(e.id)}} alt="" />
            </div>
            <hr/>
          </div>)
        }
        return null;
      })}
      <div className="cartitems-down">
        <div className="cartitems-total">
          <h1>Cart Totals</h1>
          <div>
            <div className="cartitems-total-item">
              <p>Subtotal</p>
              <p>${getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className="cartitems-total-item">
              <p>Shipping Fee</p>
              <p>Free</p>
            </div>
            <hr />
            <div className="cartitems-total-item">
              <h3>Total</h3>
              <h3>${getTotalCartAmount()}</h3>
            </div>
          </div>
          <button onClick={handleClick}>PROCEED TO CHECKOUT</button>
        </div>
        <div className="cartitems-promocode">
          <p>If you have a promo code, Enter it here</p>
          <div className='cartitems-promobox'>
            <input type="text" placeholder='promo code' />
            <button>Submit</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartItems
