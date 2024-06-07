import {React, useState} from 'react'
import './NewsLetter.css'
const NewsLetter = () => {

  const [email,setEmail] = useState('');
  const handleSubscribe = ()=>{
    sendEmail(email);
  }
  const sendEmail = async (email) =>{
    try {
      const response = await fetch('http://localhost:4000/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to subscribe. Please try again later.');
      }
  
      const result = await response.text();
      alert(result); // Or use a more user-friendly way to display the success message
    } catch (error) {
      console.error('Error:', error);
      alert('Error sending subscription. Please try again later.');
    }
  }
  return (
    <div className='newsletter'>
      <h1>Get Exclusive Offers On Your Email</h1>
      <p>Subscribe to our newsletter and stay updated</p>
      <div>
        <input type="email" placeholder='Your Email id' value={email} onChange={(e) =>{setEmail(e.target.value);}} />
        <button onClick={handleSubscribe}>Subscribe</button>
      </div>
    </div>
  )
}

export default NewsLetter
