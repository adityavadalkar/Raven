import React, {useState, useEffect, useContext} from 'react'
import { Container, Row, Col, Form, ListGroup } from 'react-bootstrap';
import PriceRange from './PriceRange';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faPencil} from '@fortawesome/free-solid-svg-icons';
import { editUser, getUser, getBrands } from '../../api';
import { UserContext } from '../../App';
import { handleBudget } from '../../utils/helper';

function Preferences(props) {
    const [userBrands, setUserBrands] = useState([])
    const [brands, setBrands] = useState([])
    const [isEditable, setIsEditable] = useState({budget: false, brands: false});
    const [canSave, setCanSave] = useState({budget: false, brands: false});
    const [userInfo, setUserInfo] = useContext(UserContext)
    const [userData, setUserData] = useState(userInfo.data)
    const [budget, setBudget] = useState(userData.budget)
    const [surveyData, setSurveyData] = useState({})

    const handleCancel = (e) => {
        const {name, value} = e.target
        setIsEditable({...isEditable, [name]: false})
        setCanSave({...canSave, [name]: false})
        if(name=='budget'){
            setBudget(userData.budget)
        }
        else{
            setUserBrands(brands.filter(brand => userData.brands.includes(brand._id)))
        }
    }
    const handleSave = async (e) => {
        // TODO: Add validation to email and name fields
        const {name, value} = e.target
        setIsEditable({...isEditable, [name]: false})
        setCanSave({...canSave, [name]: false})
        if(name=='budget'){
            const query = {budget: budget}
            const response = await editUser(userInfo.accessToken, userInfo.idToken.sub, query)
            // console.log(response)
            setUserData({...userData, budget: budget})
            setUserInfo({...userInfo, data: {...userData, budget: budget}})
        }
        else{
            const query = {brands: userBrands.map(brand => brand._id)}
            const response = await editUser(userInfo.accessToken, userInfo.idToken.sub, query)
            // console.log(response)
            setUserData({...userData, brands: query.brands})
            setUserInfo({...userInfo, data: {...userData, brands: query.brands}})
        }
    }

    const handleChange = async (e, currBrand={}) => {
        const {name, value} = e.target
        if(name.includes("min") || name.includes("max")){
            setSurveyData({ ...surveyData, [e.target.name]: e.target.value})
            setCanSave({...canSave, budget: true})
            let [type, field] = e.target.name.split('-')
            setBudget({...budget, [type]: {...budget[type], [field]: parseInt(e.target.value.split('$')[1])}})
        }
        else{
            setCanSave({...canSave, brands: true})
            if(userBrands.some(obj => obj._id === currBrand._id)){
                setUserBrands(userBrands.filter(brand => brand._id !== currBrand._id))
            }
            else{
                setUserBrands([...userBrands, currBrand])
            }
        }
    }

    useEffect(() => {
        (async() => {

            const responses = await Promise.all([getBrands(userInfo.accessToken)])
            setUserBrands(responses[0].filter(brand => userData.brands.includes(brand._id)))
            // console.log(responses)
            setBrands(responses[0])
        })();
    }, [])
  return (
    <div>
        {/* {console.log(userData.budget)} */}
        <h4 className='my-3'>My Budget</h4>
        <hr />
        {['Tops', 'Bottoms', 'Outerwear', 'Footwear', 'Suit', 'Accessories'].map((type, key) => {
            const name = type.toLowerCase();
            try{
                return(
                    <div key={key}>
                        <p className='mt-2'><strong>{type}</strong></p>                    
                        {isEditable.budget ? <PriceRange 
                        label1={"Minimum"} label2={'Maximum'} 
                        name1={`${name}-min`} name2={`${name}-max`} 
                        defaultValue1={`$${userData.budget[`${name}`].min}`} defaultValue2={`$${userData.budget[`${name}`].max}`} 
                        handleChange={handleChange}/> : 
                        <Row>
                            <Col>
                                <ListGroup.Item className='p-2' key={key}>
                                    <p style={{fontSize: "12px"}}>Minimum</p>
                                    {userData.budget[`${name}`].min}
                                </ListGroup.Item>
                            </Col>
                            <Col>
                            <ListGroup.Item className='p-2' key={key}>
                                    <p style={{fontSize: "12px"}}>Maximum</p>
                                    {userData.budget[`${name}`].max}
                                </ListGroup.Item>
                            </Col>
                        </Row>}
                    </div>
                )
            }
            catch(err){
                return (
                    <div key={key}>
                        <p className='mt-2'><strong>{type}</strong></p>                    
                        <PriceRange 
                        label1={"Minimum"} label2={'Maximum'} 
                        name1={`${name}-min`} name2={`${name}-max`} 
                        handleChange={handleChange}/>
                        {console.log(err)}
                    </div>
                )
            }
        })}
        <div style={{ display: "flex", justifyContent: "space-between", position: 'relative' }}>
            <p></p>
            {!isEditable.budget ? <button className="btns black-btn btn-small m-1" name="budget" onClick={() => setIsEditable({...isEditable, budget: true})}>Edit info &nbsp;<FontAwesomeIcon icon={faPencil} /></button> : (<div className='d-flex'>
            <button className="btns black-btn btn-small m-1" name="budget" onClick={handleCancel}>Cancel</button>
            <button className="btns black-btn btn-small m-1" name="budget" onClick={handleSave} disabled={!canSave.budget}>Save Changes &nbsp;<FontAwesomeIcon icon={faPencil} /></button></div>)}
        </div>
        <h4>My Brands</h4>
        <hr />
        <ListGroup className='my-2' style={{maxHeight: "30vh", overflowY: "auto"}}>
            {isEditable.brands ? brands.map((brand, key) => {
                return(
                    <ListGroup.Item key={key}>
                        <Form.Check type='checkbox' label={brand.name} name={brand.name} onChange={(e) => handleChange(e, brand)} defaultChecked={userData.brands.includes(brand._id)}/>
                    </ListGroup.Item>
            )}) : 
            userBrands.map((brand, key) => {
                return(
                    <ListGroup.Item key={key}>
                        <p>{brand.name}</p>
                    </ListGroup.Item>
                )
            })}
        </ListGroup>
        <div style={{ display: "flex", justifyContent: "space-between", position: 'relative' }}>
            <p></p>
            {!isEditable.brands ? <button className="btns black-btn btn-small m-1" name="brands" onClick={() => setIsEditable({...isEditable, brands: true})}>Edit info &nbsp;<FontAwesomeIcon icon={faPencil} /></button> : (<div className='d-flex'>
            <button className="btns black-btn btn-small m-1" name="brands" onClick={handleCancel}>Cancel</button>
            <button className="btns black-btn btn-small m-1" name="brands" onClick={handleSave} disabled={!canSave.brands}>Save Changes &nbsp;<FontAwesomeIcon icon={faPencil} /></button></div>)}
        </div>
    </div>
  )
}

export default Preferences