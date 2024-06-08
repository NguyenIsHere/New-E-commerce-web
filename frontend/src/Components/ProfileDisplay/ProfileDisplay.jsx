import React, {useEffect, useState} from 'react';
import './ProfileDisplay.css';
import profile_icon from '../Assets/profile_icon.png'

const ProfileDisplay = () => {
  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    gender: "",
    age: "",
    address: "",
    password: "",
    email: ""
  })
  const changeHandler = (e) =>
    {
      setFormData({...formData, [e.target.name]: e.target.value})
    }
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    setUserData(user);
  }, []);

  const handleClick = async () => {
    await fetch('http://localhost:4000/updateuser', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: formData.email,
        name: formData.name,
        gender: formData.gender,
        age: formData.age,
        address: formData.address,
        password: formData.password,
      }
    )}).then((resp) => resp.json())
      .then((data) =>
    {
      data.success?alert(`${data}`):alert('Failed')
    })
  };
  

  if (!userData) {
    return <div className='loading-holder'>
      <p>Please Login</p>
    </div>;
  }

  return (
    <div className='profile-display'>
      <h1>Profile</h1>
        <p>Name: {userData.name}</p>
        <p>Email: {userData.email}</p>
        <p>Gender: {userData.gender}</p>
        <p>Age: {userData.age}</p>
        <p>Address: {userData.address}</p>
      
      <div className="profile-change">
        <input name='username' value={formData.username} onChange={changeHandler} type="text" placeholder='Your Name' />
        <input name='gender' value={formData.gender} onChange={changeHandler} type="text" placeholder='Gender' />
        <input name='age' value={formData.age} onChange={changeHandler} type="number" placeholder='Age' />
        <input name='address' value={formData.address} onChange={changeHandler} type="text" placeholder='Address' />
        <input name='password' value={formData.password} onChange={changeHandler} type="password" placeholder='Password' />
        <button onClick={handleClick}>change</button>
 

      </div>
    </div>
  );
};

export default ProfileDisplay;