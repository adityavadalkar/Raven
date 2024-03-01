import React from 'react'
import {Form} from 'react-bootstrap';

function Dropdown({ label, options }) {
  return (
    <div>
        <Form.Label>{label}</Form.Label>
            <Form.Select aria-label="Default select example">
                {options.map((option, key) => {
                    return(
                        <option key={key} value={option}>{option}</option>
                    )
                })}
            </Form.Select>
    </div>
  )
}

export default Dropdown