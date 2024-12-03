// src/components/GameBoard.js
import React, { useState, useEffect } from 'react';
import Snake from './Snake';
import './GameBoard.css';

const BOARD_SIZE = 20;
const INITIAL_SNAKE = [
    { x: 10, y: 10 },
    { x: 10, y: 11 },
    { x: 10, y: 12 },
];

// Funcție externă pentru verificarea dacă o poziție este ocupată
const isOccupied = (position, snakeBody) => {
    return snakeBody.some(segment => segment.x === position.x && segment.y === position.y);
};

// Definim funcția generateFood înainte de utilizare
const generateFood = (snakeBody) => {
    let newFood;
    while (true) {
        newFood = {
            x: Math.floor(Math.random() * BOARD_SIZE),
            y: Math.floor(Math.random() * BOARD_SIZE),
        };
        if (!isOccupied(newFood, snakeBody)) {
            break;
        }
    }
    return newFood;
};

const GameBoard = () => {
    const [snake, setSnake] = useState(INITIAL_SNAKE);
    const [direction, setDirection] = useState('UP');
    const [food, setFood] = useState(generateFood(INITIAL_SNAKE));
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);

    useEffect(() => {
        const handleKeyDown = (e) => {
            switch (e.key) {
                case 'ArrowUp':
                    if (direction !== 'DOWN') setDirection('UP');
                    break;
                case 'ArrowDown':
                    if (direction !== 'UP') setDirection('DOWN');
                    break;
                case 'ArrowLeft':
                    if (direction !== 'RIGHT') setDirection('LEFT');
                    break;
                case 'ArrowRight':
                    if (direction !== 'LEFT') setDirection('RIGHT');
                    break;
                default:
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        // Definim moveSnake în interiorul useEffect
        const moveSnake = () => {
            const head = { ...snake[0] };
            switch (direction) {
                case 'UP':
                    head.y -= 1;
                    break;
                case 'DOWN':
                    head.y += 1;
                    break;
                case 'LEFT':
                    head.x -= 1;
                    break;
                case 'RIGHT':
                    head.x += 1;
                    break;
                default:
                    break;
            }

            // Verifică coliziunile cu pereții sau cu propriul corp
            if (
                head.x < 0 ||
                head.x >= BOARD_SIZE ||
                head.y < 0 ||
                head.y >= BOARD_SIZE ||
                isOccupied(head, snake)
            ) {
                setGameOver(true);
                return;
            }

            const newSnake = [head, ...snake];

            // Verifică dacă șarpele a mâncat mâncarea
            if (head.x === food.x && head.y === food.y) {
                setScore((prevScore) => prevScore + 1);
                setFood(generateFood(newSnake));
            } else {
                newSnake.pop();
            }

            setSnake(newSnake);
        };

        const gameInterval = setInterval(moveSnake, 200);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            clearInterval(gameInterval);
        };
    }, [snake, direction, food]); // Lista de dependențe actualizată

    const resetGame = () => {
        setSnake(INITIAL_SNAKE);
        setDirection('UP');
        setFood(generateFood(INITIAL_SNAKE));
        setScore(0);
        setGameOver(false);
    };

    return (
        <div className="game-container">
            <h1>Snake Game</h1>
            <div className="score">Scor: {score}</div>
            <div
                className="game-board"
                style={{
                    gridTemplateRows: `repeat(${BOARD_SIZE}, 20px)`,
                    gridTemplateColumns: `repeat(${BOARD_SIZE}, 20px)`,
                }}
            >
                <Snake snake={snake} />
                <div
                    className="food"
                    style={{
                        gridRowStart: food.y + 1,
                        gridColumnStart: food.x + 1,
                    }}
                ></div>
            </div>
            {gameOver && (
                <div className="game-over">
                    <h2>Game Over!</h2>
                    <button onClick={resetGame}>Reîncepe</button>
                </div>
            )}
        </div>
    );
};

export default GameBoard;
