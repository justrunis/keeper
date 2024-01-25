import React, { useState } from 'react';

function ColorSelect(props) {
    const [color, setColor] = useState('FFD966'); // set to default color somehow later

    const colors = [
        { name: 'Default', value: '#ffd966'},
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
            <p>Select a color</p>
            <select className='color-select mb-3' value={color} onChange={handleColorChange} style={{backgroundColor: color}}>
                <option disabled>Select a color</option>
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
