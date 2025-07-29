import React from 'react';
import Slider from 'react-slick';
import '../assets/styles/cmps/ImageModal.scss';

export function ImageModal({ isOpen, onClose, images }) {
  if (!isOpen) return null;

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    lazyLoad: 'ondemand',
    arrows: true,
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        <Slider {...settings}>
          {images.map((image, index) => (
            <div key={index} className="image-slide">
              <img src={image} alt={`Slide ${index}`} />
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
}