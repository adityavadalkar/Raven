import React, { useEffect, useState, useRef, useContext } from 'react'
import {Form, Carousel, Container, Col, Row, ButtonGroup, ToggleButton, Button} from 'react-bootstrap'
import { arrayRange } from '../../utils/helper'
import { getBrands, getLocation, editUser, getPlaceAutocomplete } from '../../api'
import PriceRange from '../Profile/PriceRange'
import { SurveyContext } from '../Home'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight, faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import {handleBudget} from '../../utils/helper'
import { UserContext } from '../../App'
import LocationAutoComplete from '../Utils/LocationAutoComplete'
import CustomCheckboxButton from '../Utils/custom_components/CustomCheckboxButton'
import { useAuth0 } from '@auth0/auth0-react'

function UserInfoSurvey() {
    const [setShowSurvey, setShowIdeas] = useContext(SurveyContext)
    const [selectedBrands, setSelectedBrands] = useState([]);
    const { user } = useAuth0();

    const [brands, setBrands] = useState([]);
    const [surveyData, setSurveyData] = useState({location: {name: "", placeId: ""}, "bottoms-max": 10000, "bottoms-min": 0, "tops-max": 10000, "tops-min": 0, "outerwear-max": 10000, "outerwear-min": 0, "footwear-max": 10000,"footwear-min": 0, "suit-max": 10000, "suit-min": 0, "accessories-max": 10000, "accessories-min": 0})
    const [autoComplete, setAutoComplete] = useState([])
    const [userInfo, setUserInfo] = useContext(UserContext)
    const [userData, setUserData] = useState(userInfo.data)

    const ref = useRef(null);
    const surveyButtonStyle = {
        backgroundColor: 'transparent',
        color: "black"
    }

    const onPrevClick = () => {
        ref.current.prev();
    };
    const onNextClick = () => {
        ref.current.next();
    };

    const onFinishClick = async () => {
        setShowSurvey(value => !value)
        setShowIdeas(true)
        localStorage.setItem('showSurvey', false);
        const query = {
            brands: selectedBrands,
            budget: surveyData.budget || {},
            gender: surveyData.gender || "",
            dateOfBirth: (surveyData.month && surveyData.year) ? `${surveyData.month} ${surveyData.year}` : "",
            location: surveyData.location
        }
        const response = await editUser(userInfo.accessToken, user.sub, query)
        setUserData(response) // TODO: Add brand names to patch response as well
    }

    const handleChange = async (e) => {
        if(e.target.name.includes("min") || e.target.name.includes("max")){
            var budget = handleBudget({ ...surveyData, [e.target.name]: e.target.value})
            setSurveyData({ ...surveyData, [e.target.name]: e.target.value, budget: budget})
        }
        else{
            setSurveyData({ ...surveyData, [e.target.name]: e.target.value})
            if(e.target.name=="location" && e.target.value.length>2){
                const response = await getPlaceAutocomplete(userInfo.accessToken, e.target.value)
                setAutoComplete(response.predictions)
            }
        }   
    }

    const handleLocationClick = (e) => {
        const place = autoComplete.find(place=> place.description==e.target.innerText).place_id
        setSurveyData({ ...surveyData, location: {name: e.target.innerText, placeId: place}})
        setAutoComplete([])
    }

  const handleRadioChange = (e) => {
    if(e.target.name=="gender"){
        setSurveyData({...surveyData, gender: e.target.value})
    }
  };

  const genders = [
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' },
    { label: 'Non-binary', value: 'non-binary' },
    { label: 'Prefer not to say', value: 'not-answered' }
  ];

  useEffect(() => {
    (async () => {
        const response = await getBrands()
        setBrands(response);
    })()
  }, [])

  return (
    <div className='survey-container'>
    <Carousel interval={null} controls={false} ref={ref} wrap={false}>
      <Carousel.Item className="mt-5">
        <div className='text-center'>
            <h3 >When is your birthday?</h3>
        </div>
      <div className='survey-item'>
            <Container className='mb-3'>
                <Row>
                    <Col>
                        <Form.Label>Month</Form.Label>
                        <Form.Select name="month" label={'Month'} onChange={handleChange} style={{borderRadius: "0px"}}>
                            {['', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map((month, idx) => {
                                return <option key={idx} value={month}>{month}</option>
                            })}
                        </Form.Select>
                    </Col>
                    <Col>
                        <Form.Label>Year</Form.Label>
                        <Form.Select name="year" label={'Year'} onChange={handleChange} style={{borderRadius: "0px"}}>
                            {['', ...arrayRange(new Date().getFullYear(), 1900, -1)].map((month, idx) => {
                                return <option key={idx} value={month}>{month}</option>
                            })}
                        </Form.Select>
                    </Col>
                </Row>
            </Container>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", position: 'relative' , marginTop: "1rem"}}>
            <span></span>
            <Button variant="light" onClick={onNextClick} style={surveyButtonStyle}>Next <FontAwesomeIcon icon={faArrowRight} /></Button>
        </div>
      </Carousel.Item>
      {/* <Carousel.Item className="mt-5">
      <div className='text-center'>
            <h3>What gender do you identify as?</h3>
            <p>Please note that we only offer male outfits at the moment.</p>
        </div>
      <div className='survey-item'>
            <Container className='mb-3'>
                <Row xs={2} lg={4}>
                    {genders.map((gender, idx) => (
                    <Col key={idx}>
                        <ToggleButton
                            id={`radio-${idx}`}
                            type="radio"
                            variant={"light"}
                            name="gender"
                            className={`${surveyData.gender === gender.value ? 'border border-dark' : ''}`}
                            value={gender.value}
                            checked={surveyData.gender === gender.value}
                            onChange={handleRadioChange}
                            style={{margin: "0.5rem", borderRadius: "0px"}}
                        >
                            {gender.label}
                        </ToggleButton>
                    </Col>
                    ))}
                </Row>
            </Container>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", position: 'relative' , marginTop: "1rem"}}>
            <Button variant="light" onClick={onPrevClick} style={surveyButtonStyle}><FontAwesomeIcon icon={faArrowLeft} />&nbsp;Back</Button>
            <Button variant="light" onClick={onNextClick} style={surveyButtonStyle}>Next <FontAwesomeIcon icon={faArrowRight} /></Button>
        </div>
      </Carousel.Item> */}
      <Carousel.Item className="mt-5">
        <div className='text-center'>
            <h3>Where are you located?</h3>
            <p>Get outfit ideas for your local weather!</p>
        </div>
        <div className='survey-item'>
            <LocationAutoComplete label={"Location"} data={surveyData} setData={setSurveyData} isEditable={true}/>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", position: 'relative' , marginTop: "1rem"}}>
            <Button variant="light" onClick={onPrevClick} style={surveyButtonStyle}><FontAwesomeIcon icon={faArrowLeft} />&nbsp;Back</Button>
            <Button variant="light" onClick={onNextClick} style={surveyButtonStyle}>Next <FontAwesomeIcon icon={faArrowRight} /></Button>
        </div>
      </Carousel.Item>
      <Carousel.Item className="mt-5">
        <div className='text-center'>
            <h3>What's your per item budget?</h3>
            <p>Think about your most recent purchases.</p>
        </div>
      <div className='survey-item'>
            {['Tops', 'Bottoms', 'Outerwear', 'Footwear', 'Suit', 'Accessories'].map((type, key) => {
                const name = type.toLowerCase();
            return(
                <div key={key}>
                    <p>{type}</p>
                    <PriceRange label1={'Minimum'} label2={'Maximum'} name1={`${name}-min`} name2={`${name}-max`} handleChange={handleChange}/>
                </div>
                )
            })}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", position: 'relative' , marginTop: "1rem"}}>
            <Button variant="light" onClick={onPrevClick} style={surveyButtonStyle}><FontAwesomeIcon icon={faArrowLeft} />&nbsp;Back</Button>
            <Button variant="light" onClick={onNextClick} style={surveyButtonStyle}>Next <FontAwesomeIcon icon={faArrowRight} /></Button>
        </div>
      </Carousel.Item>
      <Carousel.Item className="mt-5">
        <div className='text-center'>
            <h3>Interested in particular brands?</h3>
            <p>We will try our best to bring them to you!</p>
        </div>
      <div className='survey-item '>
            <Row className='d-flex justify-content-center mx-0' xs={2} md={2} lg={4}>
            {brands.map((brand, key) => {
                return(
                    <CustomCheckboxButton brand={brand} key={brand._id} selectedBrands={selectedBrands} setSelectedBrands={setSelectedBrands}/>
                )
            })}
            </Row>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", position: 'relative' , marginTop: "1rem"}}>
            <Button variant="light" onClick={onPrevClick} style={surveyButtonStyle}><FontAwesomeIcon icon={faArrowLeft} />&nbsp;Back</Button>
            <Button variant="light" onClick={onFinishClick} style={surveyButtonStyle}>Finish <FontAwesomeIcon icon={faArrowRight} /></Button>
        </div>
      </Carousel.Item>
    </Carousel>
    </div>
  )
}

export default UserInfoSurvey