import React from 'react'
import { Toast } from 'react-bootstrap'

function ErrorToast({show, setShow, errorMessage, autoHide, delay}) {
  return (
    <div>
        <Toast
          className="d-inline-block m-1"
          bg={'dark'}
          autohide={autoHide}
          show={show}
          onClose={() => setShow(false)}
          style={{zIndex: 9999,  position: 'fixed', top: "20%"}}
          position={'top-middle'}
          delay={2000}
        >
            {/* {console.log(errorMessage, show)} */}
          <Toast.Header>
            <strong className="me-auto">Message:</strong>
          </Toast.Header>
          <Toast.Body className={'text-white'}>
            {errorMessage}
          </Toast.Body>
        </Toast>
    </div>
  )
}

export default ErrorToast