import React, { useEffect, useState, useContext } from 'react'
import { useLocation } from 'react-router'
import {useNavigate, Link} from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsis, faPlus, faXmark, faAngleLeft } from '@fortawesome/free-solid-svg-icons'
import ItemCard from '../ItemCard'
import { Dropdown, Container, Row, Col } from 'react-bootstrap'
import { getListItems, deleteList, deleteProductFromList } from '../../api'
import { ListsContext } from './Lists';
import EditList from './EditList'; 
import { UserContext } from '../../App'

function ListPage() {
    const {state} = useLocation()
    const navigate = useNavigate()
    const [userInfo, setUserInfo] = useContext(UserContext)
    const [userData, setUserData] = useState(userInfo.data)
    const [list, setList] = useState({})
    const [products, setProducts] = useState([])
    const [hoveredCard, setHoveredCard] = useState(null);
    const [edit, setEdit] = useState(false)
    const searchQuery = new URLSearchParams(window.location.search);
    const listId = searchQuery.get('listId');


    const handleCardHover = (key) => {
      setHoveredCard(key);
    };

    const handleCardLeave = () => {
      setHoveredCard(null);
    };

    const handleEdit = () => {
      setEdit(!edit)
    }

    const handleDelete = async () => {
      window.location.href = window.location.origin + '/lists'
      const response = await deleteList(userInfo.accessToken, state._id)
  }

    const handleDeleteProduct = async (key) => {
      // console.log(key)
      // console.log(products)
      const arr = products.filter((product) => key !== product._id);
      const response = await deleteProductFromList(userInfo.accessToken, listId, key)
      // console.log(response)
      setProducts(arr);
    }

    useEffect(() => {
      (async () => {
          const data = await getListItems(userInfo.accessToken, listId)
          setList(data)
          setProducts(data.items);
        })()
  }, [])

  if(products.length != 0){
    return (
      <div>
        <Container>
          <Link to={'/lists'} className='btns black-btn btn-large' id="back-btn"><FontAwesomeIcon icon={faAngleLeft}/>&nbsp;Go Back</Link>
        </Container>
        <div>
          <h3 className='text-center'>
            {list.name} &nbsp; 
            {/* CONVERT TO DROPDOWN */}
            <Dropdown className='d-inline-block'>
              <Dropdown.Toggle as={EditListToggle} />
              <Dropdown.Menu>
                <Dropdown.Item href={`#`} onClick={handleEdit}>Edit List</Dropdown.Item>
                <Dropdown.Item href="#" onClick={handleDelete}>Delete List</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </h3>
        </div>
          <EditList list={list} edit={edit} setEdit={setEdit} setList={setList}/>
          <div className="container">
            <Row xs={2} md={2}>
              {products.map((product, key) => {
                  return(
                    <Col xs={6} lg={3} key={product._id}>
                      <div
                        className={`list-page-card ${product._id === hoveredCard ? 'hovered' : ''}`}
                        onMouseEnter={() => handleCardHover(product._id)}
                        onMouseLeave={handleCardLeave}
                      >
                        <div className="cross-container" style={{cursor: "pointer"}}>
                          <FontAwesomeIcon icon={faXmark} className={`cross-icon ${product._id === hoveredCard ? 'visible' : ''}`} onClick={() => handleDeleteProduct(product._id)}/>
                        </div>
                        <ItemCard outfit={product.product} drawer={false} dislike={false} />
                      </div>
                    </Col>
                  )
              })}
            </Row>
          </div>
      </div>
    )
  }
  else{
    return (
      <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
        <h4 className='text-center'>Add products to {state.name} list!</h4>
        <a href="/" className='btns black-btn btn-large w-25 mt-4 text-center'>Browse More Outfits</a>
      </div>
    )
  }
}

const EditListToggle = React.forwardRef(({ children, onClick }, ref) => (
  <div style={{cursor: "pointer"}} onClick={onClick}>
    <FontAwesomeIcon 
    className='options'
    icon={faEllipsis}
    // style={{backgroundColor: 'grey', borderRadius: '50%', width: '20px', height: '20px', cursor: "pointer"}} 
  />
    {children}
  </div>
));

export default ListPage