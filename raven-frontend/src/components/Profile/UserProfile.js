import React, {useEffect, useState, useContext} from 'react';
import Avatar from './Avatar';
import AccountSettings from './AccountSettings';
import Preferences from './Preferences';
import { Container, Row, Col, Image, ListGroup, Button, Tab, Tabs } from 'react-bootstrap';
import { UserContext } from '../../App';
import { useAuth0 } from '@auth0/auth0-react';
import { getUser } from '../../api';
import { set } from '../../redux/items';

const UserProfile = () => {
  // const [, , userData, setUserData] = useContext(UserContext);
  const [activeTab, setActiveTab] = useState('account');
  const { user, getIdTokenClaims, getAccessTokenSilently } = useAuth0();
  const [userInfo, setUserInfo] = useContext(UserContext)
  const [userData, setUserData] = useState(userInfo.data)

  const handleTabSelect = (key) => {
    setActiveTab(key);
  };
  if(!userData){return <p className='text-center'>Loading...</p>}
  return (
    <Container fluid style={{backgroundColor: "white"}}>
      <Row>
        <Col sm={12} md={4} className="text-center" >
          <div className='d-flex justify-content-center align-items-center my-2'>
            <Avatar name={userData.userName} size={150} />
          </div>
          <h3>{userData.userName}</h3>
          <p>{userData.email}</p>
          {/* <Button variant="primary">Edit Profile</Button> */}
        </Col>
        <Col sm={12} md={5}>
          <div className='text-center'>
            <h2>Profile Information</h2>
          </div>
          <Tabs activeKey={activeTab} onSelect={handleTabSelect} className='profile d-flex justify-content-center' style={{border: 'none'}}>
            <Tab eventKey="account" title="Account" className=''>
              <AccountSettings user={userData} setUser={setUserData}/>
            </Tab>
            <Tab eventKey="shopping-preferences" title="Shopping Preferences" className=''>
              <Preferences brands={userData.brands}/>
            </Tab>
          </Tabs>
        </Col>
      </Row>
    </Container>
  );
};

export default UserProfile;
