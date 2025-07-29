import React, { useState } from 'react'
import '../assets/styles/cmps/DynamicGradientButton.scss'

const DynamicGradientButton = ({ children, ...rest }) => {
  const [coords, setCoords] = useState({ x: 50, y: 50 })

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setCoords({ x, y })
  }

  return (
    <button
      className='dynamic-gradient-button'
      onMouseMove={handleMouseMove}
      style={{
        '--x': `${coords.x}%`,
        '--y': `${coords.y}%`,
      }}
      {...rest}
    >
      <span>{children}</span>
    </button>
  )
}

export default DynamicGradientButton
