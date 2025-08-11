"use client"
import Header from "../../@/components/components/HomeComponent/Header"
import Hero from "../../@/components/components/HomeComponent/Hero"
import Categories from "../../@/components/components/HomeComponent/Categories"
import About from "../../@/components/components/HomeComponent/About"
import FeaturedProducts from "../../@/components/components/HomeComponent/FeaturedProducts"
import Stats from "../../@/components/components/HomeComponent/Stats"
import Reviews from "../../@/components/components/HomeComponent/Reviews"
import Footer from "../../@/components/components/HomeComponent/Footer"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main>
        <Hero />
        <Categories />
        <About />
        <FeaturedProducts />
        <Stats />
        <Reviews />
      </main>
      <Footer />
    </div>
  )
}
