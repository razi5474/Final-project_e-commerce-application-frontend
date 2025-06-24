import React, { useEffect, useState } from 'react'

import { api } from '../../config/axiosInstance'

const ProductList = ()=> {

    const fetchProducts = async () => {
      try {
        // baseUrl/api/product/all
        const response = await api({method:"GET",url:"/product/all"})
        console.log(response)
      } catch (error) {
        console.log(error)
      }
    }
    
    useEffect(()=>{
      fetchProducts();
    },[])
    
    return (
      <div>
        
      </div>
    )
}

export default ProductList
