import React, { useState } from 'react'
import './Home.css'
import Header from '../../components/Header/Header'
import ExploreMenu from '../../components/ExploreMenu/ExploreMenu'
import FoodDisplay from '../../components/FoodDisplay/FoodDisplay'
import TimeRecommendations from '../../components/TimeRecommendations/TimeRecommendations'
import { useContext } from 'react'
import { StoreContext } from '../../context/StoreContext'

const Home = () => {
  const [category, setCategory] = useState("All");
  const { url } = useContext(StoreContext);

  return (
    <div>
      <Header />
      <div className="container">
        <TimeRecommendations />
        <ExploreMenu category={category} setCategory={setCategory} />
        <FoodDisplay category={category} />
      </div>
    </div>
  )
}

export default Home
