import { red } from '@mui/material/colors';
import React, { useState } from 'react';

function ColorSelect(props) {
    const [color, setColor] = useState('');

    const colors = [
        { name: 'Yellow', value: '#f9d23e'},
        { name: 'Blue', value: '#4ca6d8' },
        { name: 'Green', value: '#3aa15e' },
        { name: 'Red', value: '#d84d42' },
        { name: 'Purple', value: '#8b5e9e' },
        { name: 'Gray', value: '#eee' }
    ];

    const handleColorChange = (event) => {
        setColor(event.target.value);
        props.onColorChange(event.target.value); // Call the onColorChange prop with the updated color value
    };

    return (
        <div>
            <select className='color-select mb-3' value={color} onChange={handleColorChange} style={{backgroundColor: color}}>
                <option value="">Select note color</option>
                {colors.map((color) => (
                    <option key={color.value} value={color.value.toLowerCase()} style={{ backgroundColor: color.value.toLowerCase() }}>
                        {color.name}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default ColorSelect;
