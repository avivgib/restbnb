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
        
        // Fetch all stays once and filter client-side for better production compatibility
        console.log('Fetching all stays...')
        let allStays = []
        try {
          allStays = await stayService.query({})
          console.log(`Received ${allStays.length} total stays from service`)
        } catch (err) {
          console.error('Error fetching from service, using fallback stays:', err)
          allStays = stays || []
        }
        
        // Process each city with client-side filtering
        CITIES.forEach((city) => {
          try {
            console.log(`Filtering stays for city: ${city}`)
            
            // Client-side filtering for each city
            const filteredStays = allStays.filter(stay => {
              const location = stay.loc?.address || stay.loc?.city || stay.loc?.country || stay.name || ''
              const matchesCity = location.toLowerCase().includes(city.toLowerCase())
              return matchesCity
            })
            
            console.log(`Found ${filteredStays.length} stays for ${city}`)
            
            // Sort by rating (highest first) and take top 8
            const sortedStays = filteredStays
              .sort((a, b) => {
                const ratingA = a.rating || 0
                const ratingB = b.rating || 0
                return ratingB - ratingA // Sort descending (highest first)
              })
              .slice(0, 8)
            
            console.log(`After sorting and slicing, ${sortedStays.length} stays for ${city}`)
            cityStaysData[city] = sortedStays
          } catch (err) {
            console.error(`Error processing stays for ${city}:`, err)
            cityStaysData[city] = []
          }
        })
        
        // If no stays found from service, try using the passed stays prop
        const hasAnyStays = Object.values(cityStaysData).some(stays => stays.length > 0)
        if (!hasAnyStays && stays && stays.length > 0) {
          console.log('No stays found from service, using passed stays prop')
          CITIES.forEach((city) => {
            const cityStays = stays.filter(stay => {
              const location = stay.loc?.address || stay.loc?.city || stay.loc?.country || stay.name || ''
              return location.toLowerCase().includes(city.toLowerCase())
            }).sort((a, b) => {
              const ratingA = a.rating || 0
              const ratingB = b.rating || 0
              return ratingB - ratingA
            }).slice(0, 8)
            
            cityStaysData[city] = cityStays
          })
        }
        
        console.log('Final cityStaysData:', cityStaysData)
        setCityStays(cityStaysData)
      } catch (err) {
        console.error('Error fetching stays:', err)
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
