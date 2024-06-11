import React, {useEffect, useRef} from 'react'
import {useState} from 'react'
import {useContext} from 'react'
import {ShopContext} from '../../Context/ShopContext'
import './Navbar.css'
import { useNavigate } from 'react-router-dom';
import logo from '../Assets/logo.png'
import cart_icon from '../Assets/cart_icon.png'
import nav_dropdown from '../Assets/big_dropdown_icon.png'
import {Link} from 'react-router-dom'
import profile_icon from '../Assets/profile_icon.png'
import admin_icon from '../Assets/admin_icon.png'

const Navbar = () =>
{

  const [menu,setMenu] = useState("shop")
  const {getTotalCartItems} = useContext(ShopContext);  

  const menuRef = useRef();

  const dropdown_toggle = (e) =>
  {
    menuRef.current.classList.toggle('nav-menu-visible')
    e.target.classList.toggle('open');
  }

  const [value, setValue] = useState('')
  const [showDropdown, setShowDropdown] = useState(false);

  const changeHandler = (e) => {
    setValue(e.target.value);
    const searchTerm = e.target.value.toLowerCase();
    const hasMatchingProduct = allproducts.some(item => item.name.toLowerCase().includes(searchTerm));
    setShowDropdown(e.target.value !== '' && hasMatchingProduct);
    
  };
  const [allproducts, setAllProducts] = useState([])
  
  useEffect(() =>
    {
      const fetchInfo = async () =>
        {
          await fetch('http://localhost:4000/allproducts')
            .then((res) => res.json())
            .then((data) => {setAllProducts(data)})
            console.log(allproducts)
        }
        fetchInfo();
      console.log(allproducts)
  }, [])

  const navigate = useNavigate();

  const searchHandler = () => {
    navigate(`/search?term=${value}`);
    setShowDropdown(false);
  };
  
  return (
    <div className='navbar'>
      <div onClick={() => {setMenu("shop")}}>
            <Link className='nav-logo' to='/' style={{ textDecoration: 'none' }}>
                <img src={logo} alt="" />
                <p>SHOPPER</p>
            </Link>
      </div>
      <div className="search-container">
        <div className="search-inner">
          <input type="text" value={value} onChange={changeHandler}  placeholder='Search product here' />
          <button className='search-btn' onClick={searchHandler}>Search</button>
        </div>
        <div className={`dropdown ${showDropdown ? '' : 'hidden'}`}>
          {allproducts.filter(item => {
            const searchTerm = value.toLowerCase()
            const name = item.name.toLowerCase()
            return searchTerm && name.includes(searchTerm)
          })
            .map((item) =>
            {
            return <>
              <div onClick={() => {window.location.href = `/product/${item.id}`}} className={`dropdown-row ${value  ? '' : 'hidden'}`}>{item.name}</div>           
            </>
          })}
        </div>
      </div>
      <img className='nav-dropdown' onClick={dropdown_toggle} src={nav_dropdown} alt="" />
      <ul ref={menuRef} className='nav-menu'>
        <li onClick={()=>{setMenu("shop")}}><Link style={{textDecoration:'none'}} to='/'>Shop</Link> {menu==="shop"?<hr/>:<></>}</li>
        <li onClick={()=>{setMenu("mens")}}><Link style={{textDecoration:'none'}} to='/mens'>Men</Link>  {menu==="mens"?<hr/>:<></>}</li>
        <li onClick={()=>{setMenu("womens")}}><Link style={{textDecoration:'none'}} to='/womens'>Women</Link> {menu==="womens"?<hr/>:<></>}</li>
        <li onClick={()=>{setMenu("kids")}}><Link style={{textDecoration:'none'}} to='/kids'>Kids</Link> {menu==="kids"?<hr/>:<></>}</li>
      </ul>
      <div className="nav-login-cart">
        <div className="nav-admin">
          {localStorage.getItem('auth-token') && JSON.parse(localStorage.getItem('user')).isAdmin === true
          ? <Link target='_blank' to='http://localhost:5173'><img src={admin_icon} alt="" /></Link>
          : <></>}
        </div>
        <div className="nav-profile">
          {localStorage.getItem('auth-token') ? <Link to='/profile'> <img src={profile_icon} alt="" /></Link> : <Link to='/login'><img src={profile_icon} alt="" /></Link>}
        </div>
        {localStorage.getItem('auth-token') ?  <Link to='/cart'><img src={cart_icon} alt="" /></Link> : <Link to='/login'><img src={cart_icon} alt="" /></Link>}      
        <div className="nav-cart-count">{getTotalCartItems()}</div>
        {localStorage.getItem('auth-token') ? <button onClick={() => {localStorage.removeItem('auth-token');localStorage.removeItem('user'); window.location.replace('/')}}>Logout</button> : <Link to='/login'><button>Login</button></Link>}
      </div>
    </div>
  )
}

export default Navbar
