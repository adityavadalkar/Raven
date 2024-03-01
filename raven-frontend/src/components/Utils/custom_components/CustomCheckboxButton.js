import React, { useState } from 'react';
import { Form } from 'react-bootstrap';
import '../../../styles/CustomCheckbox.css'; // Custom CSS file for styling

function CustomCheckboxButton({ brand, selectedBrands, setSelectedBrands }) {
  const [checked, setChecked] = useState(false);

  const handleChange = (e) => {
    setChecked(!checked);
    if(!e.target.checked){
        const temp = selectedBrands.filter(brand => brand !== e.target.value)
        setSelectedBrands(temp)
    }
    else{
        setSelectedBrands([...selectedBrands, e.target.value])
    }
  };

  return (
    <div className={`custom-checkbox border ${checked ? 'border-dark' : 'border-0'}`} value={brand.name} name="brands" id={brand._id} onClick={handleChange}>
    <img src={brand.image} className="" alt="brand logo" style={{height: "50px", aspectRatio: "3/2", objectFit: "contain", mixBlendMode: "color-burn"}}/>
    <label>{brand.name}</label>
  </div>
  );
}

export default CustomCheckboxButton;
