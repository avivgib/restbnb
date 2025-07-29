/* eslint react/prop-types: 0 */

import { Link } from 'react-router-dom'
import { FiShare } from 'react-icons/fi'
import { FiHeart } from 'react-icons/fi'
import { FiArrowLeft } from 'react-icons/fi'

export function StayDetailsHeader({ stayName }) {
  return (
    <header className='stay-details-header'>
      <div className='stay-details-header-inner'>
        <Link to='/stay' className='back-link-mobile'>
          <FiArrowLeft size={24} />
        </Link>

        <div className='stay-title-desktop'>
          <h1>{stayName}</h1>
        </div>

        <div className='stay-actions-desktop'>
          <button className='stay-action-btn'>
            <FiShare size={16} style={{ marginRight: '6px' }} />
            Share
          </button>

          <button className='stay-action-btn'>
            <FiHeart size={16} style={{ marginRight: '6px' }} />
            Save
          </button>
        </div>
      </div>
    </header>
  )
}
