# Joc Snake în React

## Cuprins

1. [Introducere](#introducere)
2. [Ce Este React?](#ce-este-react)
3. [Cerințe Prealabile](#cerințe-prealabile)
4. [Crearea Proiectului](#crearea-proiectului)
5. [Structura Proiectului](#structura-proiectului)
6. [Componentele Jocului](#componentele-jocului)
    - [GameBoard.js](#gameboardjs)
    - [Snake.js](#snakejs)
7. [Stilizarea Jocului](#stilizarea-jocului)
    - [GameBoard.css](#gameboardcss)
    - [Snake.css](#snakecss)
    - [App.css](#appcss)
    - [index.css](#indexcss)
8. [Configurarea Componentei Principale](#configurarea-componentei-principale)
    - [App.js](#appjs)
    - [index.js](#indexjs)
    - [index.html](#indexhtml)
9. [Rularea Aplicației](#rularea-aplicației)
10. [Explicații Detaliate](#explicații-detaliate)
    - [Componentele și Funcționalitățile lor](#componentele-și-funcționalitățile-lor)
    - [Gestionarea Stării](#gestionarea-stării)
    - [Utilizarea Hook-urilor](#utilizarea-hook-urilor)
11. [Îmbunătățiri Suplimentare](#îmbunătățiri-suplimentare)
12. [Concluzie](#concluzie)

---

## Introducere

Acest ghid îți va arăta cum să creezi un joc **Snake** complet utilizând **React**, incluzând structura proiectului, componentele necesare și stilizarea avansată pentru a face jocul atractiv vizual. Vei învăța cum să folosești conceptele fundamentale ale React, cum ar fi componentele, starea (state), proprietățile (props) și hook-urile (`useState`, `useEffect`).

---

## Ce Este React?

**React** este o bibliotecă JavaScript dezvoltată de Facebook pentru construirea interfețelor de utilizator (UI). React permite dezvoltatorilor să creeze aplicații web rapide și interactive prin împărțirea UI-ului în componente reutilizabile. Principalele avantaje ale React includ:

- **Component-Based Architecture**: Împarte UI-ul în componente independente și reutilizabile.
- **Declarative Views**: Ușurează crearea de interfețe de utilizator interactive prin descrierea stării UI.
- **Virtual DOM**: Optimizare a actualizărilor UI prin utilizarea unui DOM virtual pentru a minimiza manipulările reale ale DOM-ului din browser.

---

## Cerințe Prealabile

Înainte de a începe, asigură-te că ai instalat următoarele:

- **Node.js** (versiunea 14 sau superioară)
- **npm** (Node Package Manager) sau **yarn**

Poți verifica instalarea acestor instrumente folosind următoarele comenzi în terminal:

```bash
node -v
npm -v
```

---

## Crearea Proiectului

Vom folosi **Create React App** pentru a iniția proiectul nostru React. Aceasta este o unealtă oficială care configurează automat mediul de dezvoltare pentru aplicațiile React.

1. **Crearea Aplicației React**

   Deschide terminalul și execută următoarele comenzi:

   ```bash
   npx create-react-app snake-game
   cd snake-game
   ```

   Aceasta va crea un folder numit `snake-game` cu toate fișierele necesare pentru a începe dezvoltarea aplicației.

2. **Instalarea Dependențelor Necesare**

   Pentru acest proiect, nu avem dependențe suplimentare, dar poți instala eventuale biblioteci adiționale în funcție de nevoile tale.

---

## Structura Proiectului

Structura proiectului nostru va fi organizată în felul următor:

```
snake-game/
├── node_modules/
├── public/
│   ├── index.html
│   └── ...
├── src/
│   ├── components/
│   │   ├── GameBoard.js
│   │   └── Snake.js
│   ├── App.js
│   ├── App.css
│   ├── index.js
│   └── index.css
├── package.json
├── README.md
└── ...
```

- **public/**: Conține fișierele statice precum `index.html`.
- **src/**: Conține codul sursă al aplicației.
    - **components/**: Folder pentru componentele React reutilizabile.
        - **GameBoard.js**: Componenta principală a jocului.
        - **Snake.js**: Componenta pentru reprezentarea șarpelui.
    - **App.js**: Componenta principală a aplicației.
    - **App.css**: Stilurile pentru componenta App.
    - **index.js**: Punctul de intrare al aplicației.
    - **index.css**: Stiluri globale.

---

## Componentele Jocului

Vom crea două componente principale:

1. **GameBoard**: Gestionază logica jocului și afișează tabloul de joc.
2. **Snake**: Reprezintă șarpele pe tablă.

### GameBoard.js

Aceasta este componenta principală care gestionează starea jocului, mișcarea șarpelui, generarea mâncării și verificarea coliziunilor.

```javascript
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
```

### Snake.js

Această componentă reprezintă șarpele pe tablă, afișând fiecare segment al șarpelui.

```javascript
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
```

---

## Stilizarea Jocului

Pentru a face jocul mai atrăgător vizual, vom actualiza fișierele CSS pentru componentele noastre.

### GameBoard.css

```css
/* src/components/GameBoard.css */
.game-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 50px;
  font-family: 'Roboto', sans-serif;
}

h1 {
  font-size: 48px;
  color: #4caf50;
  text-shadow: 2px 2px #2e7d32;
  margin-bottom: 10px;
}

.score {
  margin-bottom: 20px;
  font-size: 24px;
  color: #ffffff;
  background-color: #388e3c;
  padding: 10px 20px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
}

.game-board {
  display: grid;
  background-color: #263238;
  border: 4px solid #4caf50;
  border-radius: 10px;
  position: relative;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
}

.food {
  background-color: #ff5252;
  width: 100%;
  height: 100%;
  grid-row-end: span 1;
  grid-column-end: span 1;
  border-radius: 50%;
  animation: pulse 1s infinite;
}

.game-over {
  position: absolute;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(0, 0, 0, 0.8);
  padding: 30px;
  border: 2px solid #4caf50;
  border-radius: 10px;
  text-align: center;
  color: #ffffff;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.5);
}

.game-over h2 {
  font-size: 36px;
  margin-bottom: 20px;
}

.game-over button {
  padding: 10px 30px;
  font-size: 18px;
  background-color: #4caf50;
  color: #ffffff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.game-over button:hover {
  background-color: #66bb6a;
}

@keyframes pulse {
  0% {
    transform: scale(1);
    box-shadow: 0 0 10px rgba(255, 82, 82, 0.7);
  }
  50% {
    transform: scale(1.2);
    box-shadow: 0 0 20px rgba(255, 82, 82, 1);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 10px rgba(255, 82, 82, 0.7);
  }
}
```

### Snake.css

```css
/* src/components/Snake.css */
.snake-segment {
  background-color: #81c784;
  width: 100%;
  height: 100%;
  grid-row-end: span 1;
  grid-column-end: span 1;
  border-radius: 5px;
  animation: move 0.2s linear infinite;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.snake-segment:nth-child(1) {
  background-color: #aed581;
  box-shadow: inset -2px -2px 5px rgba(0, 0, 0, 0.2);
}

@keyframes move {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}
```

### App.css

```css
/* src/App.css */
.App {
  text-align: center;
}

body {
  margin: 0;
  padding: 0;
  font-family: 'Roboto', sans-serif;
  background-color: #1c313a;
  color: white;
}
```

### index.css

```css
/* src/index.css */
body {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  background: linear-gradient(135deg, #1c313a 0%, #0f2027 100%);
}
```

---

## Configurarea Componentei Principale

### App.js

Componenta principală a aplicației care încorporează componenta `GameBoard`.

```javascript
// src/App.js
import React from 'react';
import GameBoard from './components/GameBoard';
import './App.css';

function App() {
  return (
    <div className="App">
      <GameBoard />
    </div>
  );
}

export default App;
```

### index.js

Punctul de intrare al aplicației React.

```javascript
// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

### index.html

Fișierul HTML principal al aplicației. Vom adăuga și fontul `Roboto` din Google Fonts pentru o estetică mai bună.

```html
<!-- public/index.html -->
<!DOCTYPE html>
<html lang="ro">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#000000" />
    <meta
      name="description"
      content="Jocul Snake realizat în React"
    />
    <link rel="apple-touch-icon" href="%PUBLIC_URL%/logo192.png" />
    <!-- Adăugăm fontul Roboto -->
    <link
      href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap"
      rel="stylesheet"
    />
    <title>Snake Game</title>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
  </body>
</html>
```

---

## Rularea Aplicației

După ce ai configurat toate fișierele și componentele, este timpul să rulezi aplicația pentru a vedea rezultatul.

1. **Pornește Serverul de Dezvoltare**

   În terminal, în directorul proiectului, rulează:

   ```bash
   npm start
   ```

   Aceasta va porni serverul de dezvoltare și va deschide automat aplicația în browser la adresa [http://localhost:3000](http://localhost:3000). Dacă nu se deschide automat, poți naviga manual la această adresă.

2. **Verifică Funcționalitatea Jocului**

    - **Mișcarea Șarpelui**: Folosește tastele săgeți (sus, jos, stânga, dreapta) pentru a direcționa șarpele.
    - **Consumarea Mâncării**: Când șarpele mănâncă mâncarea (punctul roșu), scorul crește și mâncarea se regenerează într-o poziție aleatoare.
    - **Coliziuni**: Dacă șarpele lovește pereții sau propriul corp, jocul se încheie și apare mesajul "Game Over". Poți reîncepe jocul apăsând butonul "Reîncepe".

---

## Explicații Detaliate

### Componentele și Funcționalitățile lor

1. **GameBoard**

    - **Starea Jocului**: Utilizează hook-urile `useState` pentru a gestiona starea șarpelui (`snake`), direcția mișcării (`direction`), poziția mâncării (`food`), scorul (`score`) și starea de finalizare a jocului (`gameOver`).
    - **Generarea Mâncării**: Funcția `generateFood` generează o poziție aleatorie pentru mâncare, asigurându-se că nu se suprapune cu șarpele.
    - **Logica de Mișcare**: În `useEffect`, se adaugă un `setInterval` care actualizează poziția șarpelui la fiecare 200ms, în funcție de direcția curentă.
    - **Gestionarea Evenimentelor de Tastă**: Se ascultă evenimentele de tastă pentru a schimba direcția mișcării șarpelui.
    - **Verificarea Coliziunilor**: Se verifică dacă șarpele lovește pereții sau propriul corp, ceea ce duce la încheierea jocului.

2. **Snake**

    - **Afișarea Șarpelui**: Reprezintă fiecare segment al șarpelui prin intermediul div-urilor plasate într-un grid.
    - **Stilizare**: Fiecare segment are stiluri proprii pentru a crea un aspect uniform și atrăgător.

### Gestionarea Stării

- **useState**: Permite gestionarea stării interne a componentelor funcționale. În acest proiect, este folosit pentru a stoca poziția șarpelui, direcția mișcării, poziția mâncării, scorul și starea de finalizare a jocului.

  ```javascript
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [direction, setDirection] = useState('UP');
  const [food, setFood] = useState(generateFood(INITIAL_SNAKE));
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  ```

### Utilizarea Hook-urilor

- **useEffect**: Este utilizat pentru a efectua efecte secundare în componentele funcționale. În acest caz, este folosit pentru a gestiona mișcarea șarpelui la intervale regulate și pentru a asculta evenimentele de tastă.

  ```javascript
  useEffect(() => {
    // Logică de mișcare a șarpelui și ascultare evenimente de tastă
  }, [snake, direction, food]);
  ```

- **useState**: Permite adăugarea stării locale în componentele funcționale.

# Video Proiect
https://we.tl/t-XLF2yqCrjE

---
## Autor: Igor Silov
Grupa: IAFR2101(RO)

---
