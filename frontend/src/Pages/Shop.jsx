import React from 'react'
import Hero from '../Components/Hero/Hero'
import Popular from '../Components/Popular/Popular'
import Offers from '../Components/Offers/Offers'
import NewCollections from '../Components/NewCollections/NewCollections'
import NewsLetter from '../Components/NewsLetter/NewsLetter'
import Popularinmen from '../Components/Popularinmen/Popularinmen'
import Popularinkid from '../Components/Popularinkid/Popularinkid'
const Shop = () => {
  return (
    <div>
      <Hero />
      <NewCollections />
      <Offers />
      <Popular />
      <Popularinmen />
      <Popularinkid />
      <NewsLetter />
    </div>
  )
}

export default Shop
