import React, { useState, useContext } from 'react';
import './CSS/ShopCategory.css';
import { ShopContext } from '../Context/ShopContext';
import dropdown_icon from '../Components/Assets/dropdown_icon.png';
import Item from '../Components/Item/Item';

const ShopCategory = (props) => {
  const { all_product } = useContext(ShopContext);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const categoryProducts = all_product.filter(item => props.category === item.category);
  const totalPages = Math.ceil(categoryProducts.length / itemsPerPage);

  const handleClickNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  }

  const handleClickPrev = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  }

  const currentProducts = categoryProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className='shop-category'>
      <img className='shopcategory-banner' src={props.banner} alt="" />
      <div className="shopcategory-indexSort">
        <p>
        <span>Showing {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, categoryProducts.length)} out of {categoryProducts.length} products</span>
        </p>
      </div>
      <div className="shopcategory-products">
        {currentProducts.map((item, i) => (
          <Item key={i} id={item.id} name={item.name} image={item.image} new_price={item.new_price} old_price={item.old_price} />
        ))}
      </div>
      <div className="shopcategory-buttons">
        <button onClick={handleClickPrev} disabled={currentPage === 1}>Previous</button>
        <button onClick={handleClickNext} disabled={currentPage === totalPages}>Next</button>
      </div>
    </div>
  );
}

export default ShopCategory;