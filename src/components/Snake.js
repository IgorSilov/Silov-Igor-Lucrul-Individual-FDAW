// src/components/Snake.js
import React from 'react';
import './Snake.css';

const Snake = ({ snake }) => {
    return (
        <>
            {snake.map((segment, index) => (
                <div
                    key={index}
                    className="snake-segment"
                    style={{
                        gridRowStart: segment.y + 1,
                        gridColumnStart: segment.x + 1,
                    }}
                ></div>
            ))}
        </>
    );
};

export default Snake;
