import { useCallback } from 'react'
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api'
import '../assets/styles/cmps/StayMap.scss' // ודא שהנתיב נכון

const containerStyle = {
  width: '100%',
  height: '600px',
}

const center = {
  lat: 41.9028, // Rome center
  lng: 12.4964,
}

const mapOptions = {
  disableDefaultUI: true,
  zoomControl: false, // ⛔ מבטל את +/-
  fullscreenControl: true, // השאר אם תרצה מסך מלא
}

export function StayMapList({ stays, onSelectStay }) {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  })

  const handleMarkerClick = useCallback(
    (stayId) => {
      onSelectStay(stayId)
    },
    [onSelectStay]
  )

  if (!isLoaded) return <div>Loading Map...</div>

  return (
    <div className='map-container'>
      <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={12.8} options={mapOptions}>
        {stays.map((stay) => (
          <Marker
            key={stay._id}
            position={{ lat: stay.loc.lat, lng: stay.loc.lng }}
            label={{
              text: `$${stay.price}`,
              className: 'price-label',
            }}
            onClick={() => handleMarkerClick(stay._id)}
          />
        ))}
      </GoogleMap>
    </div>
  )
}

export default StayMapList
