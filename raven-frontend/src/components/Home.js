import React, { useState, useEffect } from 'react';
import StyleCard from './StyleCard';
import Survey from './UserSurvey/Survey';
import { Row, Col, Form, FloatingLabel, Button, ToastContainer, Toast} from 'react-bootstrap';
import { getStyles } from '../api';
import { motion } from 'framer-motion';
import { useAuth0 } from "@auth0/auth0-react";
import { useAppState } from './Utils/tour/context';

export const SurveyContext = React.createContext();

function Home() {
  const [styles, setStyles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedStyles, setSelectedStyles] = useState([]);
  const { user, isAuthenticated } = useAuth0();
  const [showSurvey, setShowSurvey] = useState(localStorage.getItem('showSurvey') === 'false' ? false : (true && isAuthenticated));
  const [ vote, setVote ] = useState('');
  const { setState, state: { run, stepIndex, tourActive }} = useAppState();
  const [showIdeas, setShowIdeas] = useState((showSurvey && isAuthenticated) ? false : true);
  const showInstructions = localStorage.getItem('showInstructions') === 'false' ? false : true;

  // console.log(run, stepIndex, tourActive)
  const handleStyleClick = (style) => {
    if (selectedStyles.includes(style)) {
      // Style is already selected, remove it from the selectedStyles array
      setSelectedStyles(selectedStyles.filter((selectedStyle) => selectedStyle !== style));
    } else {
      // Style is not selected, add it to the selectedStyles array
      setSelectedStyles([...selectedStyles, style]);
    }
  };

  const handleVote = (e) => {
    // console.log(vote)
  }

  const handleVoteChange = (e) => {
    setVote(e.target.value);
  }

  const handleInstructions = () => {
    localStorage.setItem('showInstructions', !showModal);
    setShowModal(!showModal);
  }

  useEffect(() => {
    if(!showIdeas){
      setState({ run: false, tourActive: false });
    }
    else{
      setTimeout(() => {
        setState({ run: localStorage.getItem('showTour') === 'false' ? false : true, tourActive: localStorage.getItem('showTour') === 'false' ? false : true });
      }, 1200);
    }
  }, [showIdeas])

  useEffect(() => {
    (async () => {
      const response = await getStyles();
      setStyles(response);
    })()
  }, []);

  // useEffect(() => {
  //   // localStorage.getItem('showInstructions') === 'true' ? true : false
  //   if(!run && showInstructions){
  //     setShowModal(true)
  //   }
  //   else if(run){
  //     setShowModal(false)
  //   }
  // }, [run])  


  return (
    <div className={`content justify-content-center`} >
      <ToastContainer
        className="p-3"
        position={'middle-center'}
        style={{ zIndex: 1 }}
      >
        <Toast show={showModal} onClose={handleInstructions}>
          <Toast.Header closeButton>
            <h5 className='me-auto'>Instructions</h5>
          </Toast.Header>
          <Toast.Body>
          <p><b>We'd love your feedback!</b></p>

            <ul className='instructions' style={{marginBlockStart: "0px", paddingInlineStart: "0px"}}>
              <li>💗&nbsp;Before the test, we will ask you to answer a short survey about yourself.</li>
              <li>🧐&nbsp; We will also ask you to complete a survey about your testing experience. Look for the <u>link at the top of the webpage!</u></li>
              <li>😘&nbsp;Leave an email at the end if you would like to hear from us about our progress in the future.</li>
            </ul>


            <p>We look forward to working with you!</p>
          </Toast.Body>
        </Toast>
      </ToastContainer>
    {(showSurvey) && (
      <SurveyContext.Provider value={[setShowSurvey, setShowIdeas]}>
        <Survey />
      </SurveyContext.Provider>
    )}
    {showIdeas && <div>
      <motion.div 
        initial={{y: 100, opacity: 0}}
        animate={{y: 0, opacity: 1}}
        transition={{duration: 1}}
      >
        <h1 className="text-center my-3">First, Pick an Outfit Idea</h1>
        <p className="text-center my-3">Shopping recommendations will follow.</p>
        <Row xs={2} lg={4}>
          {styles.map((style, key) => {
            return (
              <Col className={`mb-4 rounded d-flex justify-content-center ${key==0 ? 'step-1' : ''}`} xs={6} key={key}>
                <StyleCard available={style.available} style={style} key={key}/>
              </Col>
            )
          })}
        </Row>
      </motion.div>
      <motion.div 
        initial={{y: 100, opacity: 0}}
        animate={{y: 0, opacity: 1}}
        transition={{ duration: 1, delay: 0.5}}
      >
        <hr />
        <div className='' style={{height: '50vh'}}>
          <h1 className="text-center my-3">Don't see your style above?</h1>
          <p className="text-center my-3">Tell us how we can improve our service.</p>
          <p className="text-center my-3">For example: Any occasions or desired styles you would like to see?</p>
          <div className='d-flex justify-content-center'>
            <FloatingLabel
              controlId="styleInput"
              label="I would like to see..."
              className="mb-3 w-50"
            >
              <Form.Control type="text" placeholder="I would like to see..." onChange={handleVoteChange} value={vote}/>
            </FloatingLabel>
            <button className='btn btn-dark rounded-0 mb-4 w-25' disabled={vote.length===0} onClick={handleVote}>Vote for Styles</button>
          </div>
        </div>
      </motion.div>
      </div>}
    </div>
  );
}

export default Home;
