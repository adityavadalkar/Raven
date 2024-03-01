import './styles/App.css';
import React, { useState, useEffect, useContext } from 'react';
import { Route, Routes, Link, useLocation, useNavigate } from 'react-router-dom';
import { Dropdown, Modal, Button } from 'react-bootstrap';
import { useAuth0 } from "@auth0/auth0-react";
import { createUser, getUser, getLists } from './api';
import Outfits from './components/Outfits';
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import Lists from './components/Lists/Lists';
import ListPage from './components/Lists/ListPage';
import UserProfile from './components/Profile/UserProfile';
import {AuthenticationGuard} from './components/Utils/custom_components/AuthRoutes';
import Tutorial from './components/Utils/Tutorial';
import { Navbar } from './components/Utils/Navbar';
import { AppProvider } from './components/Utils/tour/context';
import MultiRouteWrapper from './components/Utils/tour/wrapper.tsx';
import Footer from './components/Utils/Footer';
import { get } from './redux/items';

export const UserContext = React.createContext();
export const ListContext = React.createContext();

function App() {
  const [showModal, setShowModal] = useState(false);
  const [ userInfo, setUserInfo ] = useState({});
  const [lists, setLists] = useState([]);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const { user, isLoading, isAuthenticated, getAccessTokenSilently, getIdTokenClaims } = useAuth0();
  const navigate = useNavigate();

  const handleShowModal = () => {
    setShowModal(!showModal);    
    if(!showModal){
      document.title = "Post Test Survey" 
    }
    else {
      document.title = "Raven | AI Outfit Generator" 
    }
  }

  const getListsData = async (accessToken, userId) => {
    const data = await getLists(accessToken, userId);
    setLists(data);
  }

  useEffect(() => {
    (async () => {
      if(isAuthenticated){
        const accessToken = await getAccessTokenSilently({
          authorizationParams: {
            audience: process.env.REACT_APP_AUTH0_AUDIENCE,
          },
        })
        const idToken = await getIdTokenClaims();
        const isRegistered = localStorage.getItem('userExists')===null ? false : true;
        if(!isRegistered){
          const query = {
            userName: user.nickname,
          }
          var response = await createUser(accessToken, query);
          localStorage.setItem('userExists', true);
        }else{
          try{
            var response = await getUser(accessToken, user.sub);
          }catch(err){
            const query = {
              userName: user.nickname,
            }
            var response = await createUser(accessToken, query);
            localStorage.setItem('userExists', true);
            navigate('/')
          }          
        }
        getListsData(accessToken, idToken.sub);
        setUserInfo({data: response, accessToken: accessToken, idToken: idToken});
      }
    })()
  }, [isAuthenticated])


  useEffect(() => {
    // Update window width when the component mounts
    setWindowWidth(window.innerWidth);

    // Add event listener to update window width on resize
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  if(isLoading) return <h3 className="text-center">Loading...</h3>;

  return (
    <div>
      <UserContext.Provider value={[userInfo, setUserInfo, showModal, handleShowModal, windowWidth]}>
          <AppNavbar />
          <AppProvider>
            <MultiRouteWrapper />
            <ListContext.Provider value={[lists, setLists]}>
            <Routes>
              <Route path='/login' element={<Login />} />
              <Route path='/signup' element={<Signup />} />
              <Route path="/" element={<Home />}  />
              <Route path="/outfits" element={<Outfits />} />
              <Route path="/lists" element={<AuthenticationGuard component={Lists} />} />
              <Route path="/lists/list" element={<AuthenticationGuard component={ListPage} />} />
              <Route path="/profile/:userId" element={<AuthenticationGuard component={UserProfile} />} />
            </Routes>
            </ListContext.Provider>
          </AppProvider>
      </UserContext.Provider>
    </div>
  );
}

function AppNavbar() {
  const location = useLocation();
  const [showModal, handleShowModal] = useContext(UserContext);
  const [timer, setTimer] = useState(0);
  const [showSurveyPopUp, setShowSurveyPopUp] = useState(localStorage.getItem('showSurveyPopUp') === 'true' ? true : false);
    
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(prevTimer => prevTimer + 1);
    }, 1000);

    if(timer > 190){
      clearInterval(interval);
    }

    return () => {
      clearInterval(interval);
    };
  }, [timer]);

  const handleSurveyPopUp = () => {
    localStorage.setItem('showSurveyPopUp', !showSurveyPopUp);
    setShowSurveyPopUp(!showSurveyPopUp);
  }
  return (
    <div>
      <Navbar />
      {timer > 180 && <Tutorial showSurveyPopUp={showSurveyPopUp} handleSurveyPopUp={handleSurveyPopUp}/>}
    </div>
  );
}

export default App;