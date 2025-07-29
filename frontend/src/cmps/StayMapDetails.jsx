// StayMapDetails.jsx
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api'
import houseIcon from '../assets/styles/icons/house-icon.svg'
const containerStyle = {
  width: '100%',
  height: '300px',
}

export function StayMapDetails({ stay }) {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  })

  if (!isLoaded) return <div>Loading map...</div>

  const center = {
    lat: stay.loc.lat,
    lng: stay.loc.lng,
  }

  return (
    <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={15}>
      <Marker
        position={center}
        icon={{
          url: houseIcon,
          scaledSize: new window.google.maps.Size(40, 40),
        }}
      />
    </GoogleMap>
  )
}

export default StayMapDetails
