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
      name: formData.username,
      gender: formData.gender,
      age: formData.age,
      address: formData.address,
      password: formData.password,
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

  return (
    <div className='profile-display'>
      <h1>Profile</h1>
      <p>Name: {userData.name}</p>
      <p>Email: {userData.email}</p>
      <p>Gender: {userData.gender}</p>
      <p>Age: {userData.age}</p>
      <p>Address: {userData.address}</p>

      <hr className='hr' />
      
      <div className="profile-change">
        <h1>Change Profile</h1>
        <input name='username' value={formData.username} onChange={changeHandler} type="text" placeholder={userData.name} />
        <select name="gender" id="" value={formData.gender} onChange={changeHandler} defaultValue={formData.gender}>
          <option value="" disabled selected hidden>Choose your gender</option>
          <option value="male">Male</option>          
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
        <input name='age' value={formData.age} onChange={changeHandler} type="number" placeholder={userData.age} />
        <input name='address' value={formData.address} onChange={changeHandler} type="text" placeholder={userData.address} />
        <input name='password' value={formData.password} onChange={changeHandler} type="password" placeholder= "******" />
        <button onClick={handleClick}>CHANGE</button>
      </div>
    </div>
  );
};

export default ProfileDisplay;