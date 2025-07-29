/* eslint react/prop-types: 0 */

import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api'
import houseIcon from '../../assets/styles/icons/house-icon.svg'

const containerStyle = {
  width: '100%',
  height: '480px',
}

export const StayMapLocation = ({ loc }) => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  })

  if (!isLoaded) return <div>Loading map...</div>

  const center = {
    lat: loc?.lat || 41.9028,
    lng: loc?.lng || 12.4964,
  }

  const locationString = loc?.city && loc?.country
    ? `${loc.city}, ${loc.country}`
    : 'Unknown Location'

  return (
    <section className="stay-map-location">
      <h3>Where you'll be</h3>
      <h4>{locationString}</h4>
      <div className="details-map">
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={15}
        >
          <Marker
            position={center}
            icon={{
              url: houseIcon,
              scaledSize: new window.google.maps.Size(40, 40), // Consistent marker size
            }}
            title="Your stay location" // Accessibility improvement
          />
        </GoogleMap>
      </div>
    </section>
  )
}
