import React, { useState } from 'react';
import { Toast, ToastContainer } from 'react-bootstrap';

const Tutorial = ({ showSurveyPopUp, handleSurveyPopUp }) => {
  
    return (
      <div>
        {/* Your website content */}
        <div className={!showSurveyPopUp ? "tutorial-overlay" : ""}></div>
        {/* <Line id1={'post-test'} id2={'tutorial'} /> */}
        <ToastContainer
          className="p-3"
          id={'tutorial'}
          position={'middle-center'}
          style={{ zIndex: 10000, borderRadius: "5px solid #fff" }}
        >
          <Toast show={!showSurveyPopUp} onClose={handleSurveyPopUp}>
            <Toast.Header closeButton={true}>
              <strong className="me-auto">Reminder!</strong>
            </Toast.Header>
            <Toast.Body>
                Please take our survey to help us improve our website!
            </Toast.Body>
          </Toast>
        </ToastContainer>
      </div>
    );
  };
  
  export default Tutorial;
  