import { useState, useEffect } from 'react'
import { StayCarousel } from './StayCarousel'
import { stayService } from '../services/stay/index.js'

const CITIES = ["Rome", "Barcelona", "Athens", "London", "Bucharest", "Vienna", "Lisbon"]
const STAYS_PER_CITY = 8

export function StayList({ stays }) {
  const [cityStays, setCityStays] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchCityStays = async () => {
      setLoading(true)
      setError(null)
      
      try {
        const cityStaysData = {}

        const promises = CITIES.map(async (city) => {
          try {
            // Fetch stays from API
            const cityData = await stayService.query({ location: city, limit: 50 })

            // Filter stays with rating
            const staysWithRating = cityData.filter(stay => stay.rating > 0)

            // Sort descending and take top 8
            cityStaysData[city] = staysWithRating
              .sort((a, b) => b.rating - a.rating)
              .slice(0, STAYS_PER_CITY)

          } catch (err) {
            console.error(`Error fetching stays for ${city}:`, err)
            cityStaysData[city] = []
          }
        })

        await Promise.all(promises)

        // If some cities have no data, use fallback from prop
        CITIES.forEach(city => {
          if (!cityStaysData[city] || cityStaysData[city].length === 0) {
            cityStaysData[city] = getFallbackStaysForCity(city)
          }
        })

        setCityStays(cityStaysData)
      } catch (err) {
        console.error('Error fetching city stays:', err)
        setError('Failed to load stays')
      } finally {
        setLoading(false)
      }
    }

    fetchCityStays()
  }, [stays])

  const getFallbackStaysForCity = (city) => {
    if (!stays || stays.length === 0) return []

    const cityStays = stays.filter(stay => {
      const location = stay.loc?.address || stay.name || ''
      return location.toLowerCase().includes(city.toLowerCase())
    })

    return cityStays
      .filter(stay => stay.rating > 0)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, STAYS_PER_CITY)
  }

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
