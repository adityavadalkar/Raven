import React, {useState, useContext} from 'react'
import {Button, Modal, Form} from 'react-bootstrap';
import { ListsContext } from './Lists';
import { createList, editList } from '../../api';
import { UserContext } from '../../App';

function EditList(props) {
    const [lists, setLists] = useContext(ListsContext)
    const [userInfo, setUserInfo] = useContext(UserContext)
    const {add, setAdd, edit, setEdit, setList} = props;
    const handleClose = () => setEdit(false);
    const handleShow = () => setEdit(true);
    const handleSubmit = async () => {
        setList(list => ({...list, name: document.getElementById(props.list.name).value}))
        const query = {
          name: document.getElementById(props.list.name).value
        }
        const response = await editList(userInfo.accessToken, props.list._id, query)
        handleClose();
    }

    const handleAdd = async () => {
      const name = document.getElementById("new-list").value
      const query = {
        name: name,
        products: []
      }
      const response = [...lists, await createList(userInfo.accessToken, query)]
      // console.log(response)
      setLists(response)
      setAdd(false);
    }

  if(edit){
    return (
      <>
          {/* {console.log(edit)} */}
        <Modal show={edit} onHide={handleClose} centered>
          <Modal.Header closeButton>
            <Modal.Title>Edit List</Modal.Title>
          </Modal.Header>
          <Modal.Body>
              <Form>
                  <Form.Group className="mb-3">
                      <Form.Label>List Name</Form.Label>
                      <Form.Control id={props.list.name} htmlFor={props.list.name} defaultValue={props.list.name} type="text"/>
                  </Form.Group>
              </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button className='btns white-btn btn-large w-25' onClick={handleClose}>
              Cancel
            </Button>
            <Button className='btns black-btn btn-large w-25' onClick={handleSubmit}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    ) 
  }
  else if(add){
    return (
      <>
        <Modal show={add} onHide={() => setAdd(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Add New List</Modal.Title>
          </Modal.Header>
          <Modal.Body>
              <Form>
                  <Form.Group className="mb-3">
                      <Form.Label>List Name</Form.Label>
                      <Form.Control id={"new-list"} htmlFor={"new-list"} defaultValue={""} type="text"/>
                  </Form.Group>
              </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button className='btns white-btn btn-large w-25' onClick={() => setAdd(false)}>
              Cancel
            </Button>
            <Button className='btns black-btn btn-large w-25' onClick={handleAdd}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    )
  }
}

export default EditList