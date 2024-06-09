import React, {useEffect} from 'react'
import { useState } from 'react'
import './ListProduct.css'
import cross_icon from '../../assets/cross_icon.png'
import * as XLSX from 'xlsx';
import { io } from 'socket.io-client';

const ListProduct = () =>
{
  const [allproducts, setAllProducts] = useState([])

  const fetchInfo = async () =>
  {
    await fetch('http://localhost:4000/allproducts')
      .then((res) => res.json())
      .then((data) => {setAllProducts(data)})
  }

  useEffect(() => {
    const socket = io('http://localhost:4000'); // replace with your server's URL
  
    socket.on('product changed', (data) => {
      // update the product amount
      fetchInfo();
    });
  
    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() =>
  {
    fetchInfo();
  }, [])
  
  const remove_product = async (id) =>
  {
    await fetch('http://localhost:4000/removeproduct', {
      method: 'POST',
      headers:
      {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({id:id}),
    })
    await fetchInfo();
  }

  const exportToExcel = () => {
    const productsForExcel = allproducts.map(({ _id, id, name, image, category, new_price, old_price, amount, date }) => ({
      _id, id, name, image, category, new_price, old_price, amount, date
    }));
  
    const ws = XLSX.utils.json_to_sheet(productsForExcel);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Products");
    XLSX.writeFile(wb, "products.xlsx");
  }

  return (
    <div className='list-product'>
      <button className='export-excel' onClick={exportToExcel}>Export to Excel</button>
      <h1>All Products List</h1>
      <div className="listproduct-format-main">
        <p>Products</p>
        <p>Title</p>
        <p>Old Price</p>
        <p>New Price</p>
        <p>Category</p>
        <p>Amount</p>
        <p>Remove</p>
      </div>
      <div className="listproduct-allproducts">
        <hr />
        {allproducts.map((product,index) =>
        {
          return <>
            <div key={index} className="listproduct-format-main listproduct-format">
              <img src={product.image} alt="" className="listproduct-product-icon" />
              <p>{product.name}</p>
              <p>${product.old_price}</p>
              <p>${product.new_price}</p>
              <p>{product.category}</p>
              <p>{product.amount}</p>
              <img onClick={()=>{remove_product(product.id)}} className='listproduct-remove-icon' src={cross_icon} alt="" />
            </div>
            <hr />
          </>
        })}
      </div>
    </div>
  )
}

export default ListProduct
