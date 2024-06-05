import React from 'react'
import Hero from '../Components/Hero/Hero'
import Poplaur from '../Components/Popular/Popular'
import Offers from '../Components/Offers/Offers'
import NewCollections from '../Components/NewCollections/NewCollections'
import NewsLetter from '../Components/NewsLetter/NewsLetter'
const Shop = () => {
  return (
    <div>
      <Hero />
      <Poplaur />
      <Offers />
      <NewCollections />
      <NewsLetter />
    </div>
  )
}

export default Shop
