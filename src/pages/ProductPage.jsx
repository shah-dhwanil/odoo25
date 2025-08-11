import React from 'react'
import ProductsGrid from '../../@/components/components/HomeComponent/ProductsGrid'
import Header from "../../@/components/components/HomeComponent/Header"
import Footer from "../../@/components/components/HomeComponent/Footer"

const ProductPage = () => {
  return (
    <div>
        <Header/>
        <ProductsGrid/>
        <Footer/>
    </div>
  )
}

export default ProductPage