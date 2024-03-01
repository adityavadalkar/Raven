import React, { useState, useEffect, useContext } from 'react'
import { useDispatch } from 'react-redux';
import { setOutfitsList } from '../redux/outfits';
import config from '../config';
import { OutfitContext } from './Outfits';
import { Modal, Button, Row, Col } from 'react-bootstrap';
import { getAnother, storeDislike } from '../api';
import { UserContext } from '../App';
import { set } from '../redux/items';

const defaultReasons = [{name: 'brand', value: 'Brand'}, {name: 'price', value: 'Price'}, {name: 'design', value: 'Design'}, {name: 'unsure', value: 'Not sure'}]

function DislikeForms({ item, showDislike, setShowDislike, setLiked }) {
    const types = { bottoms: 2, top: 1, shoes: 3, outwear: 0 };
    const [outfits, setOutfits, toggle, setToggle] = useContext(OutfitContext);
    const [userInfo, setUserInfo] = useContext(UserContext)
    const [userData, setUserData] = useState(userInfo.data)
    const [reasons, setReasons] = useState([])
    const dispatch = useDispatch();

    const handleClose = () => setShowDislike(false);

    const handleDislike = async () => {        
          const dislikeQuery = {
            productID: item._id,
            event: 'dislike',
            reasons: reasons,
          };
          console.log(item)
          try {
            const [customItemsResponse, storeDislikeResponse] = await Promise.all([
                getAnother(userInfo.accessToken, item._id, item.sub_category),
              storeDislike(userInfo.accessToken, userInfo.idToken.sub, dislikeQuery),
            ]);
          
            var temp = [...outfits];
            temp[types[item.clothing_type]] = [customItemsResponse];
            // console.log('Custom Items Response:', customItemsResponse);
            // console.log('Store Dislike Response:', storeDislikeResponse);
            setOutfits(temp);
            dispatch(setOutfitsList(temp));
            setReasons([])
            handleClose()
            // You can access the individual responses if needed
            
          } catch (error) {
            // Handle any errors that occur during the requests
            console.error('Error:', error);
          }        
      }
    
    const handleClick = (e) => {
        if(reasons.includes(e.target.htmlFor)){
            // console.log(e.target.htmlFor, reasons.filter((reason) => reason != e.target.htmlFor))
            setReasons(reasons.filter((reason) => reason != e.target.htmlFor))
        }
        else{
            setReasons([...reasons, e.target.htmlFor]);
        }
    }
    const handleChange = () => {

    }

    useEffect(() => {
    }, [item._id])
    

  return (
    <div className="">
        {/* {console.log(reasons, reasons.includes('design'))} */}
        <Modal show={showDislike} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Why don't you like it?</Modal.Title>
        </Modal.Header>
        {/* {console.log(reasons)} */}
        <Modal.Body>
            <div className="card">
                <img src={item.image} className={`card-img-top item-card-img mx-auto`} style={{objectFit: "contain", height: "35vh"}} alt="Shirt"/>
                <div className="card-body">
                    <div style={{display: "flex", justifyContent: "space-between"}}>
                    <p className=""><b>{item.product_name}</b></p>
                    <p>${item.price}</p>
                    </div>
                    <p className='m-0'>{item.brand}</p>
                </div>
            </div>
            <Row className='d-flex justify-content-center my-2' xs={2} md={4} lg={4}>
              {defaultReasons.map((reason, idx) => {
                return(
                  <Col key={idx} className='d-flex justify-content-center my-1'>
                    <input type="checkbox" className="btn-check" name="survey" id={`${reason.name}`} autoComplete="off" checked={reasons.includes(reason.name)} onChange={handleChange}/>
                    <label className="btn btn-light" htmlFor={`${reason.name}`} style={{borderRadius: "0px", border: "1px solid black"}} onClick={handleClick}>{reason.value}</label>
                  </Col>
                )
              })}
            </Row>
            {/* <div className="modal fade" id={`myModal_${item.clothing_type}`} tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-scrollable" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                    <div className="modal-content" style={{maxWidth: "35vw", height: ""}}>
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Why don't you like it?</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        
                        
                        <div className="modal-footer">
                            <button type="button"   data-bs-dismiss="modal" >Save changes</button>
                        </div>
                    </div>
                </div>
            </div> */}
        </Modal.Body>
        <Modal.Footer>
          <Button className='btns white-btn btn-large w-25' onClick={handleClose}>
            Cancel
          </Button>
          <Button className="btns black-btn btn-large m-0" onClick={handleDislike} >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default DislikeForms