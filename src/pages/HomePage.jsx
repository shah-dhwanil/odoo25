"use client"
import Header from "@/components/header"
import Hero from "@/components/hero"
import Categories from "@/components/categories"
import About from "@/components/about"
import FeaturedProducts from "@/components/featured-products"
import Stats from "@/components/stats"
import Reviews from "@/components/reviews"
import Footer from "@/components/footer"

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
