import React, { useEffect, useState, useContext } from 'react';
import ItemCard from './ItemCard';
import { store } from '../redux/store';
import { useDispatch } from 'react-redux';
import { setOutfitsList } from '../redux/outfits';
import { Link, useLocation } from 'react-router-dom';
import { Button, Container, Row, Col, Dropdown, Form, Fade, Stack, ListGroup } from 'react-bootstrap';
import { getOutfits } from '../api';
import PriceRange from './Profile/PriceRange';
import { useAuth0 } from '@auth0/auth0-react';
import { UserContext } from '../App';

export const OutfitContext = React.createContext();

const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
  <a
    href="#"
    ref={ref}
    onClick={(e) => {
      e.preventDefault();
      onClick(e);
    }}
    className='btns btn-large border-0 p-1'
    style={{gap: "0.5rem", color: "#000000"}}
    onMouseEnter={(e) => e.target.style.textDecoration = "underline"}
    onMouseLeave={(e) => e.target.style.textDecoration = "none"}
  >
    {children}
    <img src="/icons/Down.svg" alt="down" style={{width: "1rem"}}/>
  </a>
));

export function Outfits(props) {
  const [outfits, setOutfits] = useState([]);
  const [index, setIndex] = useState(0);
  const location = useLocation();
  const dispatch = useDispatch();
  const [toggle, setToggle] = useState(false);
  const [userInfo, setUserInfo, , , windowWidth] = useContext(UserContext)
  const [userData, setUserData] = useState(userInfo.data)
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [defaultQuery, setDefaultQuery] = useState({
    budget: {
      tops : { min: 0, max: 10000 },
      outerwear : { min: 0, max: 10000 },
      footwear : { min: 0, max: 10000 },
      bottoms : { min: 0, max: 10000 },
      suit: { min: 0, max: 10000 },
      accessories: { min: 0, max: 10000 },
    }
  })

  const searchParams = new URLSearchParams(window.location.search);
  const style = searchParams.get('style');
  
  const getOutfitData = async () => {
    const data = await getOutfits(style, defaultQuery)
    setOutfits(data);
    dispatch(setOutfitsList(data));
  }

  useEffect(() => {
    const fits = store.getState().outfitList.outfits;
    if (outfits.length === 0 && fits.length === 0) {
      getOutfitData();
    } else if (outfits.length === 0 && fits.length > 0) {
      if (fits[0].style !== style) {
        getOutfitData();
      } else {
        setOutfits(fits);
      }
    }
  }, []);

  // const handleChange = () => {
  //   setOutfits(store.getState().outfitList.outfits);
  // };

  // store.subscribe(handleChange);

  const handleSwitch = (e) => {
    // console.log(userData.budget)
    setToggle(e.target.checked);
  }

  const handleApplyFilter = async () => {
    var query = null;
    if(toggle){
      query = {
        budget: userData.budget
      };
    }
    else{
      query = defaultQuery;
    }
    const response = await getOutfits(style, query);
    setOutfits(response);
  }

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    const [type, price] = name.split('-');
    setDefaultQuery({
      ...defaultQuery,
      budget: {
        ...defaultQuery.budget, 
        [type]: {
          ...defaultQuery.budget[type], 
          [price]: parseInt(value.split('$')[1])
      }
    }})
  }

  const generate = () => {
    // setIndex(i => i+1)
      getOutfitData();
      setToggle(!toggle);
  };
  document.title = 'Browse Outfits';

  if (outfits.length > 0 || index < outfits.length) {
    return (
      <OutfitContext.Provider value={[outfits, setOutfits, toggle, setToggle]}>
        <Fade in={true} appear={true} style={{transition: "opacity 1s ease-in-out"}}>
        <div className=''>
          <Stack direction={windowWidth < 576 ? 'vertical' : "horizontal"} className='content'>
            <Link to={'/'} className='btns black-btn me-auto mt-3' tabIndex='0' style={{gap: "0.5rem"}}>
              <img src='/icons/back.svg' alt='back'></img>
              Back to Idea Album
            </Link>
            <Stack className="ms-auto mt-3" direction='horizontal'>
              <Dropdown className="price-filter mx-3" align={"start"} >
                <Dropdown.Toggle as={CustomToggle}>
                  Price
                </Dropdown.Toggle>
                <Dropdown.Menu style={{padding: "1rem", maxHeight: "50vh", overflowY: "scroll"}}>
                  <Form>
                  {['Tops', 'Bottoms', 'Outerwear', 'Footwear', 'Suits', 'Accessories'].map((type, key) => {
                    const name = type.toLowerCase();
                    return(
                        <Row className=' align-items-center' key={`${type}-${key}`}>
                          <Col >
                            <p className=''>{type}</p>
                          </Col>
                          <Col lg={8}>
                            <PriceRange name1={`${name}-min`} name2={`${name}-max`} defaultValue1='' defaultValue2='' handleChange={handleSelectChange}/>
                          </Col>
                        </Row>
                    )
                  })}
                  </Form>
                  <hr />
                  {isAuthenticated && <div>
                    <Form.Check // prettier-ignore
                      type="switch"
                      id="use-preference"
                      label="Use my Preferences"
                      name="budget"
                      onChange={handleSwitch}
                    />
                    {['Tops', 'Bottoms', 'Outerwear', 'Footwear', 'Suits', 'Accessories'].map((type, key) => {
                      const name = type.toLowerCase();
                        try{
                          return(
                            <div key={key}>
                                <p className='mt-2' key={key}><strong>{type}</strong></p>                    
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
                                </Row>
                            </div>
                        )
                        }
                        catch(err){
                          return <p className='m-0'>N/A</p>
                        }
                    })}
                  </div>}
                  <Button className="btns black-btn m-1" onClick={handleApplyFilter}>Apply</Button>
                </Dropdown.Menu>
              </Dropdown>
              <button className='btns white-btn step-4' onClick={generate} style={{gap: "0.5rem"}}>
                <img src="/icons/shuffle.svg" alt="shuffle" style={{width: "1rem", height: "1rem"}}></img>Generate More Outfits
              </button>
            </Stack>
          </Stack>
          <div className='outfits'>
            <h4 className='text-center mt-2' style={{lineHeight: "3rem"}}>{location.state.style_name}</h4>
            <Container>
              <Row className='justify-content-center pb-2' xs={2} md={3} lg={3}>
              {outfits.map((outfit, index) => {
                try{
                  return (
                    <Col xs={6} md={4} lg={4} key={outfit._id}>
                      <ItemCard outfit={outfit} drawer={true} dislike={true} index={index} key={outfit._id}/>
                    </Col>
                  )
                }catch(err){
                  console.log(err)
                }
              })}
              </Row>
            </Container>
          </div>
        </div>
        </Fade>
      </OutfitContext.Provider>
    );
  }
}

export default Outfits;
