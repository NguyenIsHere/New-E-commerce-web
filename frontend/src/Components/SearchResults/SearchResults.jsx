import React, { useState, useContext } from 'react';
import Item from '../Item/Item';
import './SearchResults.css';
import { useLocation } from 'react-router-dom';
import { ShopContext } from '../../Context/ShopContext'

const SearchResults = () => {
  const { all_product } = useContext(ShopContext);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchTerm = searchParams.get('term');

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const filteredProducts = all_product.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

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

  const currentProducts = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className='search-results'>
      <div className="search-results-indexSort">
        <p>
          <span>Showing {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, filteredProducts.length)} out of {filteredProducts.length} results</span>
        </p>
      </div>
      <div className="search-results-products">
        {currentProducts.map((item, i) => (
          <Item key={i} id={item.id} name={item.name} image={item.image} new_price={item.new_price} old_price={item.old_price} />
        ))}
      </div>
      <div className="search-results-buttons">
        <button onClick={handleClickPrev} disabled={currentPage === 1}>Previous</button>
        <button onClick={handleClickNext} disabled={currentPage === totalPages}>Next</button>
      </div>
    </div>
  );
};

export default SearchResults;