import { useState, useEffect } from 'react'
import { StayCarousel } from './StayCarousel'
import { stayService } from '../services/stay/index.js'

const CITIES = ["Rome", "Barcelona", "Athens", "London", "Bucharest", "Vienna", "Lisbon"]

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
        
        // Fetch stays for each city asynchronously
        const promises = CITIES.map(async (city) => {
          try {
            const cityStays = await stayService.query({ location: city })
            
            // Sort by rating (highest first) and take top 8
            const sortedStays = cityStays
              .sort((a, b) => {
                const ratingA = a.rating || 0
                const ratingB = b.rating || 0
                return ratingB - ratingA // Sort descending (highest first)
              })
              .slice(0, 8)
            
            cityStaysData[city] = sortedStays
          } catch (err) {
            console.error(`Error fetching stays for ${city}:`, err)
            cityStaysData[city] = []
          }
        })
        
        await Promise.all(promises)
        setCityStays(cityStaysData)
      } catch (err) {
        console.error('Error fetching city stays:', err)
        setError('Failed to load stays')
      } finally {
        setLoading(false)
      }
    }

    fetchCityStays()
  }, [])

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

  // Fallback function to get stays for a city from the passed stays prop
  const getFallbackStaysForCity = (city) => {
    if (!stays || stays.length === 0) return []
    
    // Filter stays by city name in the location data
    const cityStays = stays.filter(stay => {
      const location = stay.loc?.address || stay.name || ''
      return location.toLowerCase().includes(city.toLowerCase())
    })
    
    // Sort by rating (highest first) and take top 8
    return cityStays
      .sort((a, b) => {
        const ratingA = a.rating || 0
        const ratingB = b.rating || 0
        return ratingB - ratingA // Sort descending (highest first)
      })
      .slice(0, 8)
  }

  if (loading) {
    return <div>Loading city stays...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  return (
    <>
      {CITIES.map((city) => {
        // Use city-specific stays if available, otherwise fallback to filtering from passed stays
        let cityStaysList = cityStays[city] || []
        
        // If no city-specific stays found, try fallback
        if (cityStaysList.length === 0) {
          cityStaysList = getFallbackStaysForCity(city)
        }
        
        // Only render carousel if there are stays for this city
        if (cityStaysList.length === 0) {
          return null
        }
        
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
