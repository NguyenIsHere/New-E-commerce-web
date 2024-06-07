import React, {useEffect, useState} from 'react';
import './ProfileDisplay.css';

const ProfileDisplay = () => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    setUserData(user);
  }, []);

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
    </div>
  );
};

export default ProfileDisplay;