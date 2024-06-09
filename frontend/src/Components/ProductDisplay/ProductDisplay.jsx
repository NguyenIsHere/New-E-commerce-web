import React, { useState, useContext } from 'react';
import './ProductDisplay.css'
import star_icon from '../Assets/star_icon.png'
import star_dull_icon from '../Assets/star_dull_icon.png'
import {ShopContext} from '../../Context/ShopContext'
import tick from '../Assets/404-tick.png'


const ProductDisplay = (props) =>
{
  const {product} = props;
  const {addToCart} = useContext(ShopContext);

  const [showPopup, setShowPopup] = useState(false);
  const handleAddToCart = () => {
    if (localStorage.getItem('auth-token')) {
      addToCart(product.id);
      setShowPopup(true);
      setTimeout(() => {
        setShowPopup(false);
      }, 1000);
    }
    else
    {
      window.location.replace('/login');
    }
  };

  if (!product) {
    return null; 
  }

    return (
      <div className='productdisplay'>
        <div className="productdisplay-left">
          <div className="productdisplay-img-list">
            <img src={product.image} alt="" />
            <img src={product.image} alt="" />
            <img src={product.image} alt="" />
            <img src={product.image} alt="" />
          </div>
          <div className="productdisplay-img">
            <img className='productdisplay-main-img' src={product.image} alt="" />
          </div>
        </div>
        <div className="productdisplay-right">
          <h1>{product.name}</h1>
          <div className="productdisplay-right-stars">
            <img src={star_icon} alt="" />
            <img src={star_icon} alt="" />
            <img src={star_icon} alt="" />
            <img src={star_icon} alt="" />
            <img src={star_dull_icon} alt="" />
            <p>(122)</p>
          </div>
          <div className="productdisplay-right-prices">
            <div className="productdisplay-right-price-old">${product.old_price}</div>
            <div className="productdisplay-right-price-new">${product.new_price}</div>
          </div>
          <div className="productdisplay-right-description">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Consectetur magnam nisi culpa velit ipsam dignissimos nulla cupiditate voluptatem officia corrupti eos assumenda et voluptates aliquid, accusamus quas. Aperiam, aut asperiores!
          </div>
          <button onClick={handleAddToCart}>ADD TO CART</button>
          <p className='productdisplay-right-category'><span>Category :</span> Women, T-Shirt, Crop Top</p>
          <p className='productdisplay-right-category'><span>Tags :</span> Modern, Latest</p>
        </div>
        {showPopup && (
          <div className='popup'>
          <img src={tick} alt="" />
          <h2>Thank You!</h2>
          <p>Your Product has been successfully added to <span>CART</span></p>
      </div>
        )}
      </div>
    );
  };
export default ProductDisplay
