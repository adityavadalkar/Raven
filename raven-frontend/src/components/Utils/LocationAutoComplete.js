import React, {useEffect, useState, useContext } from 'react'
import { Form } from 'react-bootstrap'
import { getPlaceAutocomplete } from '../../api'
import { UserContext } from '../../App'

function LocationAutoComplete({label=null, data, setData, isEditable, setCanSave}) {
  const [autoComplete, setAutoComplete] = useState([])
  try {
    var name = data.location.name
  }
  catch(err){
    var name = ''
  }
  const [location, setLocation] = useState(name)
  const [userInfo, setUserInfo] = useContext(UserContext);

  const handleChange = async (e) => {
    const {name, value} = e.target
    setLocation(value)
    if(setCanSave){
      setCanSave(true)
    }
    console.log(value, data)
    if(value.length > 2){
        const response = await getPlaceAutocomplete(userInfo.accessToken, value)
        setAutoComplete(response.predictions)
    }
  }

  const handleClick = (e, place) => {
    setData({...data, location: {name: e.target.innerText, placeId: place.place_id}})
    setLocation(place.description)
    setAutoComplete([])
  }

  return (
    <div>
        {label && <Form.Label>{label}</Form.Label>}
        <Form.Control size="sm" type="text" placeholder="Location" name="location" autoComplete="off" value={location} onChange={handleChange} disabled={!isEditable}/>
        {autoComplete.length > 0 && (
            <ul className="suggestions">
            {autoComplete.map((place, index) => (
                <li key={index} onClick={(e) => handleClick(e, place)}>{place.description}</li>
            ))}
            </ul>
        )}
    </div>
  )
}

export default LocationAutoComplete