import React, { useState } from 'react';
import { variables } from '../Variables';

function ColorSelect(props) {
    const [color, setColor] = useState(variables.MAIN_COLOR);
    if (props.noteColor && props.noteColor !== color) {
        setColor(props.noteColor);
    }

    const handleColorChange = (event) => {
        setColor(event.target.value);
        props.onColorChange(event.target.value);
    };

    return (
        <div>
            <p>Select a color</p>
            <select className='color-select mb-3' value={color} onChange={handleColorChange} style={{backgroundColor: color}}>
                <option disabled>Select a color</option>
                {variables.COLORS.map((color) => (
                    <option key={color.value} value={color.value.toLowerCase()} style={{ backgroundColor: color.value.toLowerCase() }}>
                        {color.name}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default ColorSelect;
