import {React, useState, useEffect, useContext } from 'react'
import OutfitSettings from './OutfitSettings'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {OverlayTrigger, Offcanvas, Stack, Image, Row, Col, Tooltip, Button, Modal} from 'react-bootstrap'
import { faHeart } from '@fortawesome/free-regular-svg-icons';
import DislikeForms from './DislikeForms';
import AddListModal from './Lists/AddListModal';
import { UserContext } from '../App';
import { useAuth0 } from '@auth0/auth0-react';

function ItemCard(props) {
  const [item, setItem] = useState(props.outfit)
  const drawer = props.drawer
  const [liked, setLiked] = useState(false)
  const [showlist, setShowlist] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showDislike, setShowDislike] = useState(false)
  const [, , , , windowWidth] = useContext(UserContext)
  const { isAuthenticated, loginWithRedirect }= useAuth0();

  const handleLikeClick = () => {
    if(liked){
      setLiked(!liked);
      
    }
    else{
      setLiked(!liked);
      setShowlist(!showlist)
    }
  }  

  const handleClose = () => {
    setLiked(false);
    setShowDislike(false);
  }
  
  return (
    <div>
      <div className="card item-card">
        {isAuthenticated && <AddListModal showlist={showlist} setShowlist={setShowlist} item_id={item._id} setLiked={setLiked}/>}
        {!isAuthenticated && (liked || showDislike) && 
        <Modal show={liked || showDislike} onHide={handleClose} centered>
          <Modal.Header closeButton>
            <h5><b>Raven</b></h5>
          </Modal.Header>
          <Modal.Body>
            <h3>Sign Up to See Your Likes All in One Place</h3>
            <Button className="btns black-btn w-100" onClick={loginWithRedirect}>Sign up</Button>
          </Modal.Body>
        </Modal>
        }
        <div className='d-flex'>
          {props.dislike && <Button className="btn btn-light step-3" onClick={() => setShowDislike(true)} style={{height: "3rem", width: "3rem", borderRadius: "50%", position: "absolute", top: 0, left: 0 }}>
              <img src="/icons/dislike.svg" alt="dislike"/>
            </Button>}
          {isAuthenticated && props.dislike && <DislikeForms item={props.outfit} showDislike={showDislike} setShowDislike={setShowDislike}/>}
          {/* <img src={item.image} className={`card-img-top item-card-img mx-auto ${props.related_style}`} alt={item.product_type}/> */}
          <Image src={item.image} className={`card-img-top item-card-img mx-auto ${props.related_style}`} alt={item.product_type}/>
          <Button className="btn btn-light step-2" onClick={handleLikeClick} style={{height: "3rem", width: "3rem", borderRadius: "50%", position: "absolute", top: 0, right: 0 }}>
            {!liked && <FontAwesomeIcon icon={faHeart}/>}
            {liked && <img className="" src="/icons/like.svg" alt="button icon"/>}
          </Button>
        </div>

          <div className="card-body">
              <Stack direction={windowWidth>1024 ? 'horizontal' : 'vertical'}>
                  <OverlayTrigger
                    key={'top'}
                    placement={'top'}
                    overlay={
                      <Tooltip id={`tooltip-top`}>
                        {item.product_name}
                      </Tooltip>
                    }
                  >
                  <p className="card-title"><b>{item.product_name}</b></p>
                </OverlayTrigger>
                  <p className={windowWidth>1024 ? "ms-auto": ""}>${item.price}</p>
              </Stack>
            {(() => {
              try{
                if(typeof item.brand === 'string'){
                  return <p className='m-0'>{item.brand}</p>
                }
                else if(typeof item.brand === 'object'){
                  return <p className='m-0'>{item.brand.name}</p>
                }
              }
              catch(err){
                // console.log(item.brand)
                return <p className='m-0'>N/A</p>
              }
              
            })()}
            <Row className='mt-3' xs={1} lg={drawer ? 2 : 1}>
            {drawer && <Col className='px-1' xs={12}>
                <button className="btns white-btn w-100 item-card-btn step-5" type="button" id={item.product_name} onClick={() => setShowSettings(true)}>Find Similar</button>
              </Col>}
              <Col className='px-1' xs={12}>
                <a href={item.link} className="btns black-btn w-100 item-card-btn step-6" target={"_blank"} rel="noreferrer" style={{gap: "0.5rem"}}>
                  <img src="/icons/shopping-cart.svg" alt="shopping cart" style={{height: "1.25rem", width: "1.25rem"}}></img>
                  Shop Now
                </a>
              </Col>
            </Row>
            {drawer && <OutfitSettings showSettings={showSettings} index={props.index} setShowSettings={setShowSettings} outfit={item} attributes={item.attributes} drawer={drawer} />}
          </div>
      </div>
    </div>
  )
}

export default ItemCard