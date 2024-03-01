import React, {useState, useContext, useEffect} from 'react'
import { Link } from 'react-router-dom';
import { ListsContext } from './Lists';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons'
import { getItem, deleteList, addItemToList } from '../../api';
import { Dropdown, Row, Col } from 'react-bootstrap';
import EditList from './EditList'; 
import { UserContext } from '../../App';

function ListItem(props) {
    const [userLists, setUserLists] = useContext(ListsContext)
    const [list, setList] = useState(props.list)
    // const [products, setProducts] = useState([])
    const [showDropdown, setShowDropdown] = useState(false);
    const [edit, setEdit] = useState(false)
    const [userInfo, setUserInfo] = useContext(UserContext)
    const [userData, setUserData] = useState(userInfo.data)

    const handleDelete = async () => {
        const arr = userLists.filter(list => list._id!=props.list._id)
        setUserLists(arr)
        const response = await deleteList(userInfo.accessToken, props.list._id)
    }

    const handleEdit = () => {
      setEdit(!edit)
    }

    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    };

    useEffect(() => {
      async function updateData() {
        
        const query = {
          name: list.name,
          products: list.products
        }
        // const temp = await addItemToList(userInfo.accessToken, userInfo.userID, list._id, query)
        // console.log(temp)
      }
      updateData();
    }, [list.name])

    useEffect(() => {
        const handleMouseDown = (event) => {
          if (event.target.closest("#dropdown-content") || event.target.closest(".options")) {
            return;
          }
          setShowDropdown(false);
        };
        window.addEventListener("mousedown", handleMouseDown);
        return () => {
          window.removeEventListener("mousedown", handleMouseDown);
        };
      }, []);
    
  return (
    <div className="list-item">
       <div className="lists-imgs">
        {list.products.length > 0 && list.products.map((product, key) => {
            if(key%2==0){
                return (
                  <Row className='align-items-center' key={product._id}>
                    <Col className='col-6'>
                      <img
                        src={list.products[key].image || "https://via.placeholder.com/150x150"}
                        alt="Product Image"
                        className="img-fluid img-thumbnail border-0 rounded-0"
                      />
                    </Col>
                      {key < list.products.length-1 && (
                      <Col  className='col-6'>
                        <img
                          src={list.products[key+1].image || "https://via.placeholder.com/150x150"}
                          alt="Product Image"
                          className="img-fluid img-thumbnail border-0 rounded-0"
                        />
                      </Col>)}
                  </Row>
                )
            }
        })}
        </div>
        <hr />
        <div className='mt-3' style={{display: "flex", justifyContent: "space-between", position: "relative"}}>
            <p className=''>{list.name}</p>
            <Dropdown>
              <Dropdown.Toggle as={EditListToggle} />
              <Dropdown.Menu>
                <Dropdown.Item href={`#`} onClick={handleEdit}>Edit List</Dropdown.Item>
                <Dropdown.Item href="#" onClick={handleDelete}>Delete List</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            {/* {showDropdown && <div className={`${showDropdown ? 'd-block' : ''}`} id="dropdown-content" style={{ position: "absolute", top: "80%", left: "80%", textAlign: "right" }}>
                <ul>
                    <p className='m-2' onClick={handleEdit}>Edit List</p>
                    <p className='m-1' onClick={handleDelete}>Delete List</p>
                </ul>
            </div>} */}
            {edit && <EditList list={list} edit={edit} setEdit={setEdit} setList={setList}/> }
        </div>
        <Link to={`./list?listId=${list._id}`} state={{ name: list.name, _id: list._id}} className="btns white-btn btn-small mt-3 w-100">View List</Link>
    </div>
  )
}

const EditListToggle = React.forwardRef(({ children, onClick }, ref) => (
  <div style={{cursor: "pointer"}} onClick={onClick}>
    <FontAwesomeIcon className='options' icon={faEllipsisVertical} style={{width: "25px"}}/>
    {children}
  </div>
));

export default ListItem