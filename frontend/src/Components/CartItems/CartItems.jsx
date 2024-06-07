import {React,useContext} from 'react'
import './CartItems.css'
import {ShopContext} from '../../Context/ShopContext'
import remove_icon from '../Assets/cart_cross_icon.png'
import {Link} from 'react-router-dom'
import { loadStripe } from '@stripe/stripe-js'


const CartItems = () =>
{
  const {getTotalCartAmount,all_product,cartItems,removeFromCart} = useContext(ShopContext);

  const makePayment = async () =>{
    const stripe = await loadStripe('pk_test_51PP0KJP3vlpoz5z2PYbfTHIyfD8HxzbR9YHJkV9UW8KMfHtHjpcXVzdeMleSJY90JxeewHFD6DAc645ysLNkpy5100DwC5R9vv');
    const body ={
      products: cartItems,
    }
    const headers ={
      "Content-Type": "application/json",
    }
    try {
      const response = await fetch('http://localhost:4000/create-payment-intent',{
        method: 'POST',
        headers: headers,
        body: JSON.stringify(body)
      });
    
      if (!response.ok) {
        throw new Error('Failed to fetch payment intent');
      }
    
      const session = await response.json();
      const result = await stripe.redirectToCheckout({
        sessionId: session.id,
      });
    } catch (error) {
      console.error(error);
      // Handle the error here, e.g., show an error message to the user
    }
  }
  return (
    <div className='cartitems'>
      <div className="cartitems-format-main">
        <p>Products</p>
        <p>Titile</p>
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
          <button onClick={makePayment}>PROCEED TO CHECKOUT</button>
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
