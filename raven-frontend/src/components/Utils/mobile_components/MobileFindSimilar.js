import React, { useState, useEffect, useContext } from 'react';
import RelatedItems from '../../RelatedItems';
import DislikeForms from '../../DislikeForms';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-regular-svg-icons';
import { Container, Offcanvas, Row, Col, Button, Accordion, Stack  } from 'react-bootstrap';
import { capitalize } from '../../../utils/helper';
import Settings from '../Settings';
import ErrorToast from '../custom_components/ErrorToast';

function MobileFindSimilar(props) {
  const { relatedItems, setRelatedItems,
    showSettings, setShowSettings,
    item, setItem,
    properties, setProperties,
    selected, setSelected,
    settingsProps,
    handleClick,
    handleSubmit, handleSave, handleLikeClick,
    liked, setLiked,
    showDislike, setShowDislike,
    outfits, setOutfits, index, error, setError } = props;
  
  const [showFilter, setShowFilter] = useState(false);
  const handleShow = () => setShowFilter(true);
  const handleClose = () => setShowFilter(false);

  return (
    <div>
      <Container>
        <Row xs={1} md={1} lg={3}>

        <Col className='d-flex justify-content-center align-items-center my-1' xs={12} md={12} lg={3}>
            <div className='card item-card settings-card w-100'>
              <div className='d-flex'>
                <Button className="btn btn-light likes" onClick={() => setShowDislike(true)} style={{height: "3rem", width: "3rem", borderRadius: "50%", position: "absolute", top: 0, left: 0  }}>
                  <img src="/icons/dislike.svg" alt="dislike"/>
                </Button>
                <img src={item.image} className={`card-img-top item-card-img mx-auto`} alt='Item'/>
                <DislikeForms item={item} showDislike={showDislike} setShowDislike={setShowDislike}/>
                <Button className="btn btn-light likes" onClick={handleLikeClick} style={{height: "3rem", width: "3rem", borderRadius: "50%", position: "absolute", top: 0, right: 0  }}>
                  {!liked && <FontAwesomeIcon icon={faHeart}/>}
                  {liked && <img className="" src="/icons/like.svg" alt="button icon"/>}
                </Button>
              </div>
              <div className='card-body'>
                <div style={{ display: 'flex', justifyContent: 'space-between'}}>
                  <p className='card-title'>
                    <b>{item.product_name}</b>
                  </p>
                  <p>${item.price}</p>
                </div>
                <p className='m-0'>{item.brand}</p>
                <div className='d-flex'>
                  <a href={item.link} className='btns black-btn btn-small m-1 w-100'target={'_blank'} rel="noreferrer"> Shop Now </a>
                </div>
              </div>
            </div>
          </Col>
          <Col xs={12} md={12} lg={3} className='d-flex justify-content-center my-2'>
            <Button className='btns white-btn mt-3 mx-1 w-100' onClick={handleShow}>Filter and Sort</Button>
            <Offcanvas className="mobile-filter" backdropClassName="mobile-filter-backdrop" show={showFilter} onHide={handleClose} scroll={false} backdrop={true} style={{zIndex: 1055}}>
              <Offcanvas.Header closeButton>
                <Offcanvas.Title><h4>Filters</h4></Offcanvas.Title>
              </Offcanvas.Header>
              <Offcanvas.Body>
              <div className='filters'>
                <Accordion alwaysOpen>
                  <ErrorToast show={error} setShow={setError} errorMessage={"No items found with selected filters"} autoHide={true}/>
                  <Accordion.Item eventKey="0">
                    <Accordion.Header><b>Colors</b></Accordion.Header>
                    <Accordion.Body>
                      {['black','blue','brown','charcoal','dark blue','green','gray','navy','purple ','red','white','yellow'].map((value, key) => {
                        return (
                          <div className='form-check' key={key}>
                            <input className='form-check-input'type='radio'name='color_hue' id={`filter1-${key}`}value={value}onClick={(e) => handleClick(e)} />
                            <label className={`form-check-label ${value}`}htmlFor={value}>
                              {capitalize(value)}
                            </label>
                          </div>
                        );
                      })}
                    </Accordion.Body>
                  </Accordion.Item>
                  <Accordion.Item eventKey="1">
                    <Accordion.Header><b>Brightness</b></Accordion.Header>
                    <Accordion.Body>
                      {['1 - Light','2 - Light Medium','3 - Medium Dark','4 - Dark',].map((value, key) => {
                        return (
                          <div className='form-check' key={key}>
                            <input
                              className='form-check-input'
                              type='radio'
                              name='color_lightness'
                              id='filter1'
                              value={key + 1}
                              onClick={(e) => handleClick(e)}
                            />
                            <label className='form-check-label' htmlFor={value}>
                              {value}
                            </label>
                          </div>
                        );
                      })}
                    </Accordion.Body>
                  </Accordion.Item>
                  <Accordion.Item eventKey="2">
                    <Accordion.Header><b>Saturation</b></Accordion.Header>
                    <Accordion.Body>
                    {['1 - Pastels','2 - Muted','3 - Vibrant','4 - Bold',].map((value, key) => {
                      return (
                        <div className='form-check' key={key}>
                          <input
                            className='form-check-input'
                            type='radio'
                            name='color_saturation'
                            id='filter1'
                            value={key + 1}
                            onClick={(e) => handleClick(e)}
                          />
                          <label className='form-check-label' htmlFor={value}>
                            {value}
                          </label>
                        </div>
                      );
                    })}
                    </Accordion.Body>
                  </Accordion.Item>
                  {Object.keys(settingsProps).map((key, index) => {
                  if(props.outfit.clothing_type === key){
                    return (
                      <Settings
                        key={index}
                        attributes={properties}
                        setSelected={setSelected}
                        setProperties={setProperties}
                        selected={selected}
                        attr_num={settingsProps[key].attr_num}
                        attr_labels={settingsProps[key].attr_labels}
                        attr_field={settingsProps[key].attr_field}
                        label_values={settingsProps[key].label_values}
                      />
                    );
                  }
                })}
                </Accordion>
                </div>
                <button className='btns black-btn btn-small mb-auto mt-3 w-100' onClick={handleSubmit}>Apply Filter</button>
              </Offcanvas.Body>
            </Offcanvas>
          </Col>
          <Col className='justify-content-center my-1' lg={6}>
            <h4 className='modal-title' style={{marginBottom: "1.5rem"}}>More Like {outfits[index].product_name}</h4>
            <div className=' related-images'>
                <RelatedItems
                  relatedItems={relatedItems}
                  key={relatedItems[0]._id}
                />
            </div>
          </Col>
        </Row>
        <Stack className='' direction="horizontal">
          <Button className='btns white-btn btn-large ms-auto' onClick={handleClose}>
            Cancel
          </Button>
          <Button className={`btns btn-large black-btn mx-1`} onClick={handleSave}>
            Save to List
          </Button>
        </Stack>
      </Container>
    </div>
  )
}

export default MobileFindSimilar