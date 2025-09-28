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
        
        // Fetch stays for each city asynchronously with limit
        const promises = CITIES.map(async (city) => {
          try {
            // Use limit parameter to get more stays than needed for better sorting
            const cityStays = await stayService.query({ 
              location: city, 
              limit: 50 // Get more stays to ensure we have enough with ratings
            })
            
            // Filter stays with ratings and sort by rating (highest first)
            const staysWithRating = cityStays.filter(stay => 
              stay.rating !== undefined && stay.rating !== null && stay.rating > 0
            )
            
            // Sort by rating (highest first) and take top 8
            const sortedStays = staysWithRating
              .sort((a, b) => {
                const ratingA = a.rating || 0
                const ratingB = b.rating || 0
                return ratingB - ratingA // Sort descending (highest first)
              })
              .slice(0, STAYS_PER_CITY)
            
            // Log for debugging (only in development)
            if (process.env.NODE_ENV === 'development') {
              console.log(`${city}: Found ${cityStays.length} total, ${staysWithRating.length} with rating, limited to ${sortedStays.length}`)
            }
            
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
    
    // Filter stays with ratings and sort by rating (highest first)
    const staysWithRating = cityStays.filter(stay => 
      stay.rating !== undefined && stay.rating !== null && stay.rating > 0
    )
    
    // Sort by rating (highest first) and take top 8
    return staysWithRating
      .sort((a, b) => {
        const ratingA = a.rating || 0
        const ratingB = b.rating || 0
        return ratingB - ratingA // Sort descending (highest first)
      })
      .slice(0, STAYS_PER_CITY)
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
        
        // Final verification - ensure we never exceed STAYS_PER_CITY
        if (cityStaysList.length > STAYS_PER_CITY) {
          cityStaysList = cityStaysList.slice(0, STAYS_PER_CITY)
          if (process.env.NODE_ENV === 'development') {
            console.warn(`${city}: Final verification limited stays to ${STAYS_PER_CITY}`)
          }
        }
        
        // Only render carousel if there are stays for this city
        if (cityStaysList.length === 0) {
          return null
        }
        
        // Final log to verify the result
        if (process.env.NODE_ENV === 'development') {
          console.log(`${city}: Final result - ${cityStaysList.length} stays`)
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
