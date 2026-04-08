import React, { useState } from 'react'
import './Home.css'
import Header from '../../components/Header/Header'
import ExploreMenu from '../../components/ExploreMenu/ExploreMenu'
import FoodDisplay from '../../components/FoodDisplay/FoodDisplay'
import RecommendedSection from '../../components/RecommendedSection/RecommendedSection'
import { useContext } from 'react'
import { StoreContext } from '../../context/StoreContext'

const Home = () => {
  const [category, setCategory] = useState("All");

  return (
    <div className="bg-white">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 py-12 transition-all duration-500">
        <RecommendedSection />
        <ExploreMenu category={category} setCategory={setCategory} />
        <FoodDisplay category={category} />
      </div>
    </div>
  )
}

export default Home
