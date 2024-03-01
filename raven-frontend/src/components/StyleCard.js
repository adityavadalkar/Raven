import React from 'react'
import { Link } from 'react-router-dom';

function StyleCard({ style, available }) {
  return (
    <div>
      <div className="flip-card">
        <div className="flip-card-inner">
          <div className="flip-card-front rounded" style={{ backgroundImage: `url(${style.image})` }}></div>
          <div className="flip-card-back rounded"  style={{ backgroundImage: `url(${style.image})` }}>
            {available && <Link to={`/outfits?style=${encodeURIComponent(style._id)}`} className="flip-card-button btns transparent-btn btn-large" tabIndex="0" state={{style_name: style.name}}>View Outfits</Link>}
            {!available && <p style={{color: "white"}}>Coming Soon!</p>}
          </div>
        </div>
      </div>
      <p style={{fontWeight: 600}}>{style.name}</p>
    </div>
  )
}

export default StyleCard