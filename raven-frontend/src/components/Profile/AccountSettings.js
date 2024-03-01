import React, {useState} from 'react'
import { ListGroup, Button, Form } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faPencil} from '@fortawesome/free-solid-svg-icons';
import { editUser } from '../../api';
import { set } from '../../redux/items';
import { capitalize } from '../../utils/helper';
import LocationAutoComplete from '../Utils/LocationAutoComplete';

function AccountSettings(props) {
    const userInfo = JSON.parse(localStorage.getItem('user_info'));
    const [userData, setUserData] = useState(props.user);
    const [isEditable, setIsEditable] = useState(false);
    const [canSave, setCanSave] = useState(false);
    const fields = [
        {label: "name", value: "Name"},
        {label: "userName", value: "User Name"},
    ]

    const handleSave = async () => {
        // TODO: Add validation to email and name fields
        setIsEditable(!isEditable)
        setCanSave(false)
        const response = await editUser(userInfo.accessToken, userInfo.userID, userData)
        props.setUser(response)
    }

    const handleInputChange = (e) => {
        if(!canSave){
            setCanSave(true)
        }
        if(e.target.name=='location'){
            setUserData({...userData, location: {name: e.target.value, placeId: ""}})    
        }
        setUserData({...userData, [e.target.name]: e.target.value})
    }

    const handleCancel = () => {
        setIsEditable(!isEditable)
        setUserData(props.user)
        setCanSave(false)
    }
    
  return (
    <div>
        <div style={{ display: "flex", justifyContent: "space-between", position: 'relative' }}>
            <h4 className='my-3'>Account Content</h4>
            {!isEditable ? <button className="btns black-btn btn-small m-1" onClick={() => setIsEditable(!isEditable)}>Edit info &nbsp;<FontAwesomeIcon icon={faPencil} /></button> : (<div className='d-flex'>
            <button className="btns black-btn btn-small m-1" onClick={handleCancel}>Cancel</button>
            <button className="btns black-btn btn-small m-1" onClick={handleSave} disabled={!canSave}>Save Changes &nbsp;<FontAwesomeIcon icon={faPencil} /></button></div>)}
        </div>
        <hr />
            <ListGroup className='my-2'>
                <ListGroup.Item >
                    <p>Email</p>
                    <Form.Control
                        type="text"
                        name={`email`}
                        defaultValue={userData.email}
                        onChange={handleInputChange}
                        disabled
                        style={{border: 'none'}}
                    />
                </ListGroup.Item>
                {fields.map(({label, value}, index) => {
                    return <ListGroup.Item key={index}>
                                <p>{value}</p>
                                <Form.Control
                                    type="text"
                                    name={label}
                                    value={capitalize(userData[`${label}`])}
                                    onChange={handleInputChange}
                                    disabled={!isEditable}
                                     style={{border: 'none'}}
                                />
                            </ListGroup.Item>
                })}
                <ListGroup.Item>
                    <p>Location</p>
                    <LocationAutoComplete data={userData} setData={setUserData} isEditable={isEditable} setCanSave={setCanSave}/>
                </ListGroup.Item>
            </ListGroup>
    </div>
  )
}

export default AccountSettings