import React, {useEffect, useState, useContext} from 'react'
import ListItem from './ListItem'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faCartShopping } from '@fortawesome/free-solid-svg-icons'
import { getLists, createList, getListItems } from '../../api'
import { Container, Row, Col } from 'react-bootstrap'
import ItemCard from '../ItemCard'
import EditList from './EditList'
import { ListContext, UserContext } from '../../App'

export const ListsContext = React.createContext();

function Lists() {
  const [lists, setLists] = useContext(ListContext);
  const [userLists, setUserLists] = useState(lists.filter(list => list.name !== "DefaultLiked"))
  const [count, setCount] = useState(4)
  const [recentlyAdded, setRecentlyAdded] = useState([])
  const [userInfo, setUserInfo] = useContext(UserContext)
  const [userData, setUserData] = useState(userInfo.data)
  const [newListName, setNewListName] = useState("");
  const [add, setAdd] = useState(false)

  const handleAddList = async () => {
    setAdd(true)
  }
  
  useEffect(() => {
    (async () => {
      const defaultLiked = lists.filter(list => list.name === "DefaultLiked")[0];
      const likedItems = await getListItems(userInfo.accessToken, defaultLiked._id)
      // console.log(defaultLiked)
      setRecentlyAdded(likedItems.items.map((item) => item.product))
    })()
  }, [])
  

  return (
    <ListsContext.Provider value={[userLists, setUserLists]}>
      <div className='container'>
        <h3 className='text-center'>Likes</h3>
        <p className='text-center'>Make purposeful shopping choice and organize your favorite items according to their intended use. Enjoy the flexibility to add, delete, and edit your lists as you please</p>
        <EditList add={add} setAdd={setAdd} />
        <h4 className='mt-4'>Recently Liked</h4>
        <p>View and add recently favorited items here.</p>
        <Row className='mx-2'>
          {recentlyAdded.map((product, key) => {
            return(
              <Col xs={6} md={4} lg={3} key={`${product._id}${key}`}>
                <ItemCard outfit={product} drawer={false} dislike={false}/>
              </Col>
            )})}
        </Row>
        <h4 className='mt-4'>Liked Lists</h4>
        <Row className='mx-2'>
          {userLists.map((list) => (
                <Col xs={6} md={4} lg={3} key={list._id}>
                  <ListItem id={list._id} list={list}/>
                </Col>
          ))}

          <Col className="add-item" xs={6} md={4} lg={3} onClick={handleAddList}>
              <FontAwesomeIcon icon={faPlus} className='mb-2'/>
              <p>Add List</p>
          </Col>
        </Row>
      </div>
    </ListsContext.Provider>
  )
}

export default Lists