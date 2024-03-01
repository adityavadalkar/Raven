import React, {useState} from 'react'
import {Row, Container, Col, Form} from 'react-bootstrap'

const minRange = [ 
{label: '$0', value: 0}, 
{label: '$50', value: 50}, 
{label: '$100', value: 100}, 
{label: '$200', value: 200}, 
{label: '$500', value: 500}
]

const maxRange = [{label: '$100', value: 100}, 
{label: '$250', value: 250}, 
{label: '$500', value: 500}, 
{label: '$1000', value: 1000}, 
{label: '$10000', value: 10000}
]

function PriceRange({label1=false, label2=false, name1, name2, handleChange, defaultValue1, defaultValue2, filter=false}) {
    const [selectedValue, setSelectedValue] = useState('');
  return (
    <div>
        <Container className='mb-3'>
            <Row>
                <Col className={filter ? `d-flex` : ``}>
                    {label1 && <Form.Label>{label1}</Form.Label>}
                    <Form.Select className='rounded-0' name={name1} onChange={handleChange} defaultValue={defaultValue1}>
                        {minRange.map((price, idx) => {
                            return <option key={idx} value={price.label}>{price.label}</option>
                        })}
                    </Form.Select>
                </Col>
                {filter && <Col>
                    <p className='text-center'><strong>to</strong></p>
                </Col>}
                <Col className={filter ? `d-flex` : ``}>
                    {label2 && <Form.Label>{label2}</Form.Label>}
                    <Form.Select className='rounded-0' name={name2} onChange={handleChange} defaultValue={defaultValue2}>
                        {maxRange.map((price, idx) => {
                            return <option key={idx} value={price.label}>{price.label}</option>
                        })}
                    </Form.Select>
                </Col>
            </Row>
        </Container>
    </div>
  )
}

export default PriceRange