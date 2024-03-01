import React, { useState, useEffect, useContext } from 'react';
import RelatedItems from './RelatedItems';
import { OutfitContext } from './Outfits';
import { UserContext } from '../App';
// import { swap, set, get } from '../redux/items';
import DislikeForms from './DislikeForms';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-regular-svg-icons';
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
import { store } from '../redux/store';
import { useDispatch } from 'react-redux';
import { Modal, Container, Offcanvas, Row, Col, Button, Accordion  } from 'react-bootstrap';
import { getCustomItems } from '../api';
import { capitalize } from '../utils/helper';
import Settings from './Utils/Settings';
import MobileFindSimilar from './Utils/mobile_components/MobileFindSimilar';
import ErrorToast from './Utils/custom_components/ErrorToast';

export const RelatedItemsContext = React.createContext();

const settingsProps = {
  outerwear: {
    label_values: [['Cotton', 'Wool', 'Cashmere', 'Fleece'],['Crewneck', 'V-neck', 'Zip-neck']],
    attr_labels: ['Material', 'Collar Style'],
    attr_field: ['material', 'collar_style'],
    attr_num: 2,
  },
  tops: {
    label_values: [['Classic', 'Relaxed', 'Oversize'], ['Solid', 'Stripe', 'Check', 'Plaid']],
    attr_labels: ['Fit', 'Pattern'],
    attr_field: ['shirt_fit', 'pattern'],
    attr_num: 2,
  },
  bottoms: {
    label_values: [['Skinny', 'Slim', 'Straight', 'Tapered', 'Wide-leg'],['Full', 'Ankle', 'Cropped']],
    attr_labels: ['Fit', 'Length'],
    attr_field: ['fit', 'length'],
    attr_num: 2,
  },
  footwear: {
    label_values: [['Leather', 'Suede', 'Canvas', 'Knit', 'Mesh'],['Low-top', 'Mid-top', 'High-top']],
    attr_labels: ['Material', 'Top'],
    attr_field: ['upper_material', 'top'],
    attr_num: 2,
  },
};

function OutfitSettings(props) {
  const {showSettings, setShowSettings} = props;
  const [showDislike, setShowDislike] = useState(false);
  const handleShow = () => setShowSettings(true);
  const handleClose = () => setShowSettings(false);
  const dispatch = useDispatch();
  const types = { outerwear: 0, tops: 1, bottoms: 2, footwear: 3 };
  const [swapItem, setSwapItem] = useState({});
  const { image, attributes, drawer } = props;
  const [outfits, setOutfits, toggle, setToggle] = useContext(OutfitContext);
  const [, , , , windowWidth] = useContext(UserContext);
  const [item, setItem] = useState(props.outfit);
  const [properties, setProperties] = useState({});
  const [relatedItems, setRelatedItems] = useState([]);
  const [selected, setSelected] = useState(new Set());
  const [liked, setLiked] = useState(false);
  const [error, setError] = useState(false);

  const query = {
    main_category: props.outfit.main_category,
    filter: properties,
    selected_attr: [],
  };

  const handleLikeClick = () => {
    setLiked(!liked);
  };

  const handleSave = () => {
    const temp = [...outfits]
    temp[props.index] = item
    setOutfits(temp)
    setToggle(!toggle)
    handleClose()
  }

  const handleClick = (e) => {
    setProperties((prev) => ({
      ...prev,
      [e.target.name]: e.target.value.toString(),
    }));
    const updatedSet = new Set(selected);
    updatedSet.add(e.target.name);
    setSelected(updatedSet);
    // console.log(properties);
  };

  // const change = () => {
  //   setSwapItem(store.getState().itemsList.item);
  // };
  // store.subscribe(change);

  const handleSubmit = () => {
    const query = {
      filter: properties,
    };
    (async () => {
        const response = await getCustomItems(item._id, query);
        setError(response.error)
        if (response.length > 0) {
          setRelatedItems(response);
        }
      // console.log(selected, response.map((item) => item.product_name))
      // setSelected(new Set());
    })()
  };

  useEffect(() => {
    (async () => {
      const response = await getCustomItems(item._id, {});
      setRelatedItems(response);
      // dispatch(set(response));
    })()
  }, [toggle]);

  const newProps = {
    ...props,
    relatedItems, setRelatedItems,
    showSettings, setShowSettings,
    item, setItem,
    properties, setProperties,
    selected, setSelected,
    settingsProps,
    handleClick,
    handleSubmit, handleSave, handleLikeClick,
    liked, setLiked,
    showDislike, setShowDislike,
    outfits, setOutfits, index: props.index, error, setError
  }

  if (relatedItems.length > 0) {
    return (
      <RelatedItemsContext.Provider value={[relatedItems, setRelatedItems, showSettings, setShowSettings, item, setItem]}>   
      <ErrorToast show={error} setShow={setError} errorMessage={"No items found with selected filters"} autoHide={true} delay={2000}/>       
          {windowWidth>991 && <Modal className='outfit-settings' show={showSettings} onHide={handleClose} centered>
            <Modal.Header closeButton />
            <Modal.Body>
              <Container>
                <Row xs={1} md={1} lg={3}>
                  <Col xs={12} md={12} lg={3} className=' my-2'>
                  <h4>Filters</h4>
                    <div className='filters'>
                    <Accordion alwaysOpen>
                      <Accordion.Item eventKey="0">
                        <Accordion.Header><b>Colors</b></Accordion.Header>
                        <Accordion.Body>
                          {['black','blue','brown','charcoal','dark blue','green','grey','navy','purple ','red','white','yellow'].map((value, key) => {
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
                      if(props.outfit.main_category === key){
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
                  </Col>
                  <Col className='justify-content-center my-1' lg={6}>
                    <h4 className='modal-title'>More Like {outfits[props.index].product_name}</h4>
                    <div className=' related-images'>
                        <RelatedItems
                          relatedItems={relatedItems}
                          drawer={drawer}
                          key={relatedItems[0]._id}
                        />
                    </div>
                  </Col>
                  <Col className='d-flex justify-content-center align-items-center my-1' xs={12} md={12} lg={3}>
                    <div className='card item-card settings-card'>
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
                </Row>
              </Container>
            </Modal.Body>
            <Modal.Footer>
              <Button className='btns black-btn btn-small w-25 me-auto' onClick={handleSubmit}>Apply Filter</Button>
              <Button className='btns white-btn btn-large' onClick={handleClose}>
                Cancel
              </Button>
              <Button className={`btns btn-large black-btn`} onClick={handleSave}>
                Save to List
              </Button>
            </Modal.Footer>
          </Modal>}
          {windowWidth<=991 && <Offcanvas className='find-similar' show={showSettings} onHide={handleClose} placement={'bottom'}>
            <Offcanvas.Header closeButton />
            <Offcanvas.Body>
              <MobileFindSimilar {...newProps} />
            </Offcanvas.Body>
          </Offcanvas>}
      </RelatedItemsContext.Provider>
    );
  }
}

export default OutfitSettings;
