import React from 'react';
import { Accordion } from 'react-bootstrap';

const Settings = (props) => {
    const { attributes, setProperties, setSelected, selected, attr_num, attr_labels, attr_field, label_values} = props;
  
    const handleClick = (e) => {
      setProperties((prev) => ({ ...prev, [e.target.name]: e.target.value }));
      const updatedSet = new Set(selected);
      updatedSet.add(e.target.name);
      setSelected(updatedSet);
    };
    return (
  
        [...Array(attr_num).keys()].map((i, key) => {
          return (
              <Accordion.Item eventKey={`${3+key}`} key={key}>
                <Accordion.Header>
                  <b>{attr_labels[i]}</b>
                </Accordion.Header>
                <Accordion.Body>
                  <div>
                    {label_values[i].map((value, key) => {
                      return (
                        <div className='form-check' key={key}>
                          <input
                            className='form-check-input'
                            type='radio'
                            name={attr_labels[i].toLowerCase()}
                            id='filter1'
                            value={value.toLowerCase()}
                            onClick={(e) => handleClick(e)}
                          />
                          <label className='form-check-label' htmlFor={value}>
                            {value}
                          </label>
                        </div>
                      );
                    })}
                  </div>
                </Accordion.Body>
              </Accordion.Item>
          );
        })
    );
  }

export default Settings;