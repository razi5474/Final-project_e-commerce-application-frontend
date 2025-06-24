import React from 'react'
import { Outlet } from 'react-router-dom'
import Carousel from '../components/layout/Carousel'
import CategorySection from '../components/layout/CategorySection'
import ProductSection from '../components/Product/ProductSection'

const Home = () => {
  return (
    <div>
      <Carousel/>
      <CategorySection/>
      <ProductSection/>
       
        <Outlet /> 
        
    </div>
  )
}

export default Home
