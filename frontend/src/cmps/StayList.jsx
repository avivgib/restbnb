import { useState, useEffect } from 'react'
import { StayCarousel } from './StayCarousel'
import { stayService } from '../services/stay/index.js'

const CITIES = ["Rome", "Barcelona", "Athens", "London", "Bucharest", "Vienna", "Lisbon"]
const STAYS_PER_CITY = 8

export function StayList({ stays }) {
  const [cityStays, setCityStays] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Helper function to filter and sort stays consistently
  const filterAndSortStays = (staysList) => {
    if (!staysList || staysList.length === 0) return []
    
    return staysList
      .filter(stay => stay && (stay.rating > 0 || stay.rating === undefined))
      .sort((a, b) => {
        const ratingA = a.rating || 0
        const ratingB = b.rating || 0
        if (ratingB !== ratingA) return ratingB - ratingA
        // Secondary sort by price (lower is better for display)
        return (a.price || 0) - (b.price || 0)
      })
      .slice(0, STAYS_PER_CITY)
  }

  // Helper function to get stays for a city from the prop stays array
  const getStaysForCity = (city, staysList) => {
    if (!staysList || staysList.length === 0) return []

    const cityStays = staysList.filter(stay => {
      if (!stay) return false
      const cityMatch = stay.loc?.city?.toLowerCase() === city.toLowerCase()
      const countryMatch = stay.loc?.country?.toLowerCase() === city.toLowerCase()
      const addressMatch = stay.loc?.address?.toLowerCase().includes(city.toLowerCase())
      return cityMatch || countryMatch || addressMatch
    })

    return filterAndSortStays(cityStays)
  }

  useEffect(() => {
    const fetchCityStays = async () => {
      setLoading(true)
      setError(null)
      
      try {
        const cityStaysData = {}

        // Try to fetch from API for each city
        const promises = CITIES.map(async (city) => {
          try {
            // Fetch stays from API
            const cityData = await stayService.query({ location: city })

            // Filter and sort stays consistently
            const processedStays = filterAndSortStays(cityData)
            
            // If API returned data, use it; otherwise will fallback below
            if (processedStays && processedStays.length > 0) {
              cityStaysData[city] = processedStays
            } else {
              cityStaysData[city] = []
            }

          } catch (err) {
            console.error(`Error fetching stays for ${city}:`, err)
            cityStaysData[city] = []
          }
        })

        await Promise.all(promises)

        // If some cities have no data from API, use fallback from prop
        CITIES.forEach(city => {
          if (!cityStaysData[city] || cityStaysData[city].length === 0) {
            const fallbackStays = getStaysForCity(city, stays)
            if (fallbackStays && fallbackStays.length > 0) {
              cityStaysData[city] = fallbackStays
            }
          }
        })

        setCityStays(cityStaysData)
      } catch (err) {
        console.error('Error fetching city stays:', err)
        // On complete failure, try to use prop stays
        const fallbackCityStays = {}
        CITIES.forEach(city => {
          fallbackCityStays[city] = getStaysForCity(city, stays)
        })
        setCityStays(fallbackCityStays)
        setError(null) // Don't show error if we have fallback data
      } finally {
        setLoading(false)
      }
    }

    fetchCityStays()
  }, [stays])

  const getCityTitle = (city) => {
    const titles = {
      "Rome": "Popular homes in Rome",
      "Barcelona": "Available next month in Barcelona", 
      "Athens": "Stay in Athens",
      "London": "Available in London this weekend",
      "Bucharest": "Available next month in Bucharest",
      "Vienna": "Popular homes in Vienna",
      "Lisbon": "Stay in Lisbon"
    }
    return titles[city] || `Popular homes in ${city}`
  }

  if (loading) return <div>Loading city stays...</div>
  if (error) return <div>Error: {error}</div>

  // Added check to ensure at least one city has stays
  const visibleCities = CITIES.filter(city => cityStays[city] && cityStays[city].length > 0)
  if (visibleCities.length === 0) return <div>No stays available!</div>

  return (
    <>
      {CITIES.map(city => {
        let cityStaysList = cityStays[city] || []

        // Final verification: never exceed STAYS_PER_CITY
        if (cityStaysList.length > STAYS_PER_CITY) {
          cityStaysList = cityStaysList.slice(0, STAYS_PER_CITY)
        }

        if (cityStaysList.length === 0) return null

        // Always log final result (helps debugging production issues)
        console.log(`${city}: ${cityStaysList.length} stays loaded`)

        return (
          <StayCarousel
            key={city}
            title={getCityTitle(city)}
            stays={cityStaysList}
          />
        )
      })}
    </>
  )
}
