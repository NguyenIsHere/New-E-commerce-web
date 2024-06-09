import React, {useEffect, useState} from 'react';
import './ProfileDisplay.css';

const ProfileDisplay = () => {
  const [userData, setUserData] = useState(null);
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    setUserData(user);
  }, []);
  const [formData, setFormData] = useState({
    username: "",
    gender: "",
    age: "",
    address: "",
    password: ""
  })
  const changeHandler = (e) =>
    {
      setFormData({...formData, [e.target.name]: e.target.value})
    }


  const handleClick = async () => {
    const requestBody = {
      email: userData.email,
      name: formData.username === "" ? userData.name : formData.username,
      gender: formData.gender === "" ? userData.gender : formData.gender,
      age: formData.age === "" ? userData.age : formData.age,
      address: formData.address === "" ? userData.address : formData.address,
      password: formData.password === "" ? userData.password : formData.password,
    };

    try {
      const response = await fetch('http://localhost:4000/updateuser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        // Handle successful response
        console.log('User updated successfully');
        alert('User updated successfully');
      } else {
        // Handle error response
        console.error('Failed to update user');
        alert('Failed to update user');
      }
    } catch (error) {
      // Handle network error
      console.error('Network error:', error);
    }
    const response = await fetch("http://localhost:4000/getusers");
    const allusers = await response.json();
    const userafterupdate = allusers.find((user) => user.email === userData.email);
    localStorage.setItem('user', JSON.stringify(userafterupdate));
    window.location.reload();
  };
  

  if (!userData) {
    return <div className='loading-holder'>
      <p>Please Login</p>
    </div>;
  }

  function toSentenceCase(str) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  return (
    <div className='profile-display'>
      <div className="profile-show">
        <h1>Profile</h1>
        <div className="info-box">
          <p>Username: {userData.name}</p>
        </div>
        <div className="info-box">
          <p>Email: {userData.email}</p>
        </div>
          <div className="info-box">
          <p>Gender: {userData.gender}</p>
        </div>
        <div className="info-box">
          <p>Age: {userData.age}</p>
        </div>
        <div className="info-box">
          <p>Adress: {userData.address}</p>    
        </div>
      </div>

      <hr className='hr' />

      <div className="profile-change">
        <h1>Change Profile</h1>
        <div className="info-box">
        <label for='username'>Username:</label>
        <input name='username' value={formData.username} onChange={changeHandler} type="text" placeholder="Your name" />
        </div>
        <div className="info-box">
        <label for='gender'>Gender:</label>
        <select name="gender" id="" value={formData.gender} onChange={changeHandler}>
          <option value="" selected disabled hidden>Choose your gender</option>
          <option value="male">Male</option>          
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
        </div>
        <div className="info-box">
        <label for='age'>Age:</label>
        <input name='age' value={formData.age} onChange={changeHandler} type="number" placeholder="Your age" />
        </div>
        <div className="info-box">
        <label for='address'>Address:</label>
        <input name='address' value={formData.address} onChange={changeHandler} type="text" placeholder="Your address" />
       </div>
        <div className="info-box">
        <label for='password'>Password:</label>
        <input name='password' value={formData.password} onChange={changeHandler} type="password" placeholder= "Your password" />
        </div>       
        <button onClick={handleClick}>CHANGE</button>
      </div>
    </div>
  );
};

export default ProfileDisplay;