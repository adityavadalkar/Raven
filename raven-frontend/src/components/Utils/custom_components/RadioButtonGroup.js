import { useState } from 'react';
import { ButtonGroup, ToggleButton } from 'react-bootstrap';

export default function RadioButtonGroup(props) {
  const [selectedValue, setSelectedValue] = useState(props.defaultValue);

  const handleRadioChange = (e) => {
    console.log(e.target.value)
    setSelectedValue(e.target.value);
    props.onRadioChange(e.target.value);
  };

  return (
    <>
      {props.options.map((option) => (
        <ToggleButton
          key={option.value}
          type="radio"
          variant="secondary"
          name={props.name}
          value={option.value}
          checked={selectedValue === option.value}
          onClick={(e) => handleRadioChange(e)}
        >
          {console.log(selectedValue)}
          {option.label}
        </ToggleButton>
      ))}
    </>
  );
}
