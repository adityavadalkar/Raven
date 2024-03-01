import React, {useEffect, useState, useContext} from 'react'
import { Link, useLocation } from 'react-router-dom';
import { Dropdown, Offcanvas, Button, ListGroup, Accordion } from 'react-bootstrap';
import { getUser } from '../../api';
import { UserContext } from '../../App';
import { useAuth0 } from "@auth0/auth0-react";

export function Navbar() {
    const location = useLocation();
    const { loginWithRedirect, isAuthenticated, user, logout } = useAuth0();
    return (
    <nav className='navbar navbar-expand-lg navbar-light sticky-bottom'>
        <div className='container-fluid content p-0'>
            <a className='navbar-brand' href='/'>
                <h4>RAVEN</h4>
            </a>
            {isAuthenticated && !location.pathname.includes('login') && <HomeNavbar sub={user.sub} logout={logout}/>}
            {!isAuthenticated && !location.pathname.includes('login') && <ul>
                <li className='clickable' onClick={loginWithRedirect}>
                    Login        
                </li>
            </ul>
            }
        </div>
    </nav>
    )
}

export function HomeNavbar({sub, logout}) {
    const [ , , , , windowWidth ] = useContext(UserContext);
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    if(windowWidth > 768){
        return (
            <ul>
            <li className="nav-item">
                <Link to="/" className='d-flex align-items-center'><img src="/icons/idea-album.svg" alt="favorites" style={{ height: "1rem", width: "2rem"}} />Idea Album</Link>
            </li>
            <li className="nav-item">
                <Link to="/lists" className='d-flex align-items-center'><img src="/icons/favorites.svg" alt="favorites" style={{ height: "1rem", width: "2rem"}} />Likes</Link>
            </li>
            <li className="nav-item profile-dropdown">
                <Dropdown>
                <Dropdown.Toggle as={UserProfileToggle}>
                    My account
                </Dropdown.Toggle>
                <Dropdown.Menu>
                    <Dropdown.Item href={`/profile/${sub}`} as={ProfileDropdownItems}>My Profile</Dropdown.Item>
                    <Dropdown.Item href="#" onClick={logout}>Log out</Dropdown.Item>
                </Dropdown.Menu>
                </Dropdown>
            </li>    
            </ul>
        )
    }else{
        return (
        <div>
            <Button onClick={handleShow} as={NavbarToggle}></Button>
            <Offcanvas show={show} onHide={handleClose} backdrop={true} placement='bottom'>
            <Accordion>
                <Accordion.Item eventKey="0">
                    <Accordion.Header>My account</Accordion.Header>
                    <Accordion.Body className='d-grid'>
                        <Link to={`/profile/${sub}`} as={ProfileDropdownItems}>My Profile</Link>
                        <Link to="#" onClick={logout}>Log out</Link>
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
                <ListGroup>
                    <ListGroup.Item style={{backgroundColor: "#fff"}}>
                        <Link to="/" className='d-flex align-items-center'><img src="/icons/idea-album.svg" alt="favorites" style={{ height: "1rem", width: "2rem"}} />Idea Album</Link>
                    </ListGroup.Item>
                    <ListGroup.Item style={{backgroundColor: "#fff"}}>
                        <Link to="/lists" className='d-flex align-items-center'><img src="/icons/favorites.svg" alt="favorites" style={{ height: "1rem", width: "2rem"}} />Likes</Link>
                    </ListGroup.Item>
                </ListGroup>
            </Offcanvas>
        </div>
        )
    }
}

const ProfileDropdownItems = React.forwardRef(({children, href}, ref) => (
    <div className='dropdown-item' ref={ref}>
      <Link to={href} ref={ref} style={{color: "black"}}>{children}</Link>
    </div>
  ));
  
const UserProfileToggle = React.forwardRef(({ children, onClick }, ref) => (
    <div className="profile-icon" style={{cursor: "pointer", display: "flex", alignItems: "center"}} onClick={onClick}>
        <img src="/icons/profile-icon.svg" alt="profile" style={{backgroundColor: "white", height: "1rem"}}></img>
        {children}
    </div>
));

const NavbarToggle = React.forwardRef(({ children, onClick }, ref) => (
    <div className="profile-icon" style={{cursor: "pointer", display: "flex", alignItems: "center"}} onClick={onClick}>
        <img src="/icons/navbar-toggle.svg" alt="profile" style={{backgroundColor: "white", height: "1rem"}}></img>
        {children}
    </div>
));
