import React, { useState, useEffect, useContext } from 'react';
import {Button, Modal, Form, Offcanvas} from 'react-bootstrap';
import { addItemToList, getLists, createList } from '../../api';
import { useAuth0 } from '@auth0/auth0-react';
import { UserContext, ListContext } from '../../App';
import { OutfitContext } from '../Outfits';

function AddListModal(props) {
  const {showlist, setShowlist} = props;
  const [addNew, setAddNew] = useState(false); // true if user wants to create a new list
  const [listName, setListName] = useState("");
  const handleShow = () => setShowlist(true);
  const [selected, setSelected] = useState("");
  const selectedStyle = "bg-secondary text-white"
  const [userInfo, setUserInfo] = useContext(UserContext)
  const [userData, setUserData] = useState(userInfo.data)
  const [lists, setLists] = useContext(ListContext);
  const [userLists, setUserLists] = useState(lists.filter(list => list.name !== "DefaultLiked"))
  const defaultLiked = lists.filter(list => list.name === "DefaultLiked")[0];
  const sub = "";
  const buttonStyle = selected === "" ? {
    cursor: "default"
  } : {
    cursor: "pointer"
  }

  const handleClose = () => {
    setShowlist(false);
    setSelected("")
  }

  const handleChange = (e) => {
    setListName(e.target.value)
  }

  const handleClick = (e) => {
    e.stopPropagation();
    const id = e.currentTarget.id;
    if(selected == id) {
      setSelected("")
      return
    }
    setSelected(id)
    setListName("")
    setAddNew(false)
  }

  const handleSubmit = async () => {
    if(addNew){
      const query = {
        name: listName,
        products: [props.item_id]
      }
      const response = await createList(userInfo.accessToken, query)
      setUserLists([...userLists, response])
      setSelected(response._id)
      setAddNew(false)
    }
    else{
      const query = {
        product: [props.item_id]
      }
      const response = await addItemToList(userInfo.accessToken, selected, query)
      // console.log(userLists, response)
    }
    handleClose();
  }

  const clickCreateList = () => {
    // (async () => {
    //   const query = {
    //     name: listName,
    //     products: [props.item_id]
    //   }
    //   setList([...userLists, await createList(userInfo.accessToken, query)])
    // })()
    setSelected("")
    setAddNew(!addNew)
  }

  useEffect(() => {
    if(showlist){
      (async () => {
        const query = {
          product: [props.item_id]
        }
        const response = await addItemToList(userInfo.accessToken, defaultLiked._id, query)
      })()
    }
  }, [showlist])

  if(userLists){
    return (
      <>
        <Modal show={showlist} onHide={handleClose} centered>
          <Modal.Header closeButton>
            <Modal.Title>Save to My Lists</Modal.Title>
          </Modal.Header>
          <Modal.Body>
              <h6>Item has been added likes!</h6>
              {userLists.map((list, index) => {
                  return (
                      <div className={`add-list-items row align-items-center ${selected==list._id ? selectedStyle : ""}`} key={index} onClick={(e) => handleClick(e)}  id={list._id}>
                          <div className='col-2 mb-4' id="images">
                              {list.products.map((product, key) => {
                              if (key % 2 === 0) {
                                  return (
                                  <div className="row row-cols-1 row-cols-sm-1 row-cols-md-2"  key={key} >
                                      <div className="col-sm-3 col-md-6 g-2">
                                      <img src={list.products[key].image} style={{ height: "20px", width: "20px" }} />
                                      </div>
                                      <div className="col-sm-3 col-md-6 g-2">
                                      {key < list.products.length - 1 && (
                                          <img src={list.products[key+1].image} style={{ height: "20px", width: "20px" }} />
                                      )}
                                      </div>
                                  </div>
                                  );
                              }
                              })}
                          </div>
                          <p id="name" className='col' style={{ alignItems: 'center', marginLeft: "20px" }}>{list.name}</p>
                      </div>
  
                  )
              })}
              <p className='clickable w-50' style={{ alignItems: 'center' }} onClick={clickCreateList}>Create New List</p>
              {addNew && (<Form>
                <Form.Group>
              <Form.Label>List Name</Form.Label>
              <Form.Control onChange={e => handleChange(e)}/>
              </Form.Group>
              </Form>)}
          </Modal.Body>
          <Modal.Footer>
            <Button className='btns white-btn btn-large w-25' onClick={handleClose}>
              Cancel
            </Button>
            <Button className={`btns btn-large w-25 ${selected === "" && listName === "" ? "bg-secondary" : "black-btn" }`} onClick={handleSubmit} disabled={selected === "" && listName === ""}>
              Save to List
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
  else{
    <div>
      Loading...
    </div>
  }
  
}

export default AddListModal