// Determine the WebSocket URL based on the current location
const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
const wsHost = window.location.host;
const ws = new WebSocket(`${wsProtocol}//${wsHost}`);

// DOM elements
const gameBoard = document.getElementById('game-board');
const playerAMoveInput = document.getElementById('player-a-move');
const playerBMoveInput = document.getElementById('player-b-move');
const playerASubmitButton = document.getElementById('player-a-submit');
const playerBSubmitButton = document.getElementById('player-b-submit');
const playerAControls = document.getElementById('player-a-controls');
const playerBControls = document.getElementById('player-b-controls');
const gameStatus = document.getElementById('game-status');
const winnerElement = document.getElementById('winner');
const historyDiv = document.getElementById('move-history');
const endGameButton = document.getElementById('end-game');
const timerElement = document.getElementById('timer');

let moves = [];
let timerInterval;
let timeLeft = 300; // 5 minutes in seconds

// Initialize the game board
const initializeBoard = (state) => {
    gameBoard.innerHTML = '';
    for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 5; j++) {
            const cell = document.createElement('div');
            cell.className = 'grid-cell';
            if (state.grid[i][j]) {
                cell.textContent = state.grid[i][j];
                const player = state.grid[i][j].split('-')[0];
                cell.classList.add(player === 'A' ? 'player-a' : 'player-b');
            }
            gameBoard.appendChild(cell);
        }
    }
    updateGameStatus(state);
};

// Timer functions
const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
};

const startTimer = () => {
    clearInterval(timerInterval);
    timeLeft = 300;
    timerElement.textContent = formatTime(timeLeft);
    timerInterval = setInterval(() => {
        timeLeft--;
        timerElement.textContent = formatTime(timeLeft);
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            alert('Time is up! The game will reset.');
            ws.send(JSON.stringify({ type: 'endGame' }));
        }
    }, 1000);
};

const stopTimer = () => {
    clearInterval(timerInterval);
};

// Update game status display
const updateGameStatus = (state) => {
    let statusText = `Current Turn: Player ${state.turn}`;
    if (state.winner) {
        statusText = `Game Over! Player ${state.winner} wins!`;
    }
    gameStatus.textContent = statusText;
};

// Toggle player controls
const togglePlayerControls = (currentTurn) => {
    if (currentTurn === 'A') {
        playerAControls.style.display = 'block';
        playerBControls.style.display = 'none';
    } else {
        playerAControls.style.display = 'none';
        playerBControls.style.display = 'block';
    }
};

// Display error messages
const displayError = (message) => {
    gameStatus.textContent = `Error: ${message}`;
};

// Display the winner
const displayWinner = (winner) => {
    winnerElement.style.display = "block";
    winnerElement.innerHTML = `Game Over! Player ${winner} wins!`;
    gameStatus.textContent = `Game Over! Player ${winner} wins!`;
};

// Handle incoming messages from the server
ws.onmessage = (event) => {
    const message = JSON.parse(event.data);
    switch (message.type) {
        case 'reset':
            displayWinner(message.winner);
            setTimeout(() => {
                ws.send(JSON.stringify({ type: 'restart' }));
            }, 10000); // 10 seconds delay before restarting
            stopTimer();
            break;
        case 'clearMoveHistory':
            historyDiv.innerHTML = "";
            localStorage.removeItem('moveHistory');
            break;
        case 'state':
            initializeBoard(message.state);
            togglePlayerControls(message.state.turn);
            break;
        case 'error':
            displayError(message.message);
            break;
        case 'resetTimer':
            startTimer();
            break;
    }
};

// Send the move command to the server
const sendMove = (command) => {
    const player = playerAControls.style.display === 'block' ? 'A' : 'B';
    const [character, direction] = command.split(':');
    ws.send(JSON.stringify({ type: 'move', player, character, direction }));
};

// Event listeners for submitting moves
playerASubmitButton.addEventListener('click', () => {
    let command = playerAMoveInput.value.trim();
    if (command) {
        command = command.toUpperCase();
        sendMove(command);
        const moveParagraph = document.createElement('p');
        moveParagraph.textContent = `A-${command}`;
        historyDiv.appendChild(moveParagraph);
        playerAMoveInput.value = '';
        saveMoveHistory();
    }
});

playerBSubmitButton.addEventListener('click', () => {
    let command = playerBMoveInput.value.trim();
    if (command) {
        command = command.toUpperCase();
        sendMove(command);
        const moveParagraph = document.createElement('p');
        moveParagraph.textContent = `B-${command}`;
        historyDiv.appendChild(moveParagraph);
        playerBMoveInput.value = '';
        saveMoveHistory();
    }
});

// Event listeners for pressing Enter key in move inputs
playerAMoveInput.addEventListener('keydown', (event) => {
    if (event.keyCode === 13) {
        playerASubmitButton.click();
    }
});

playerBMoveInput.addEventListener('keydown', (event) => {
    if (event.keyCode === 13) {
        playerBSubmitButton.click();
    }
});

// Event listener for End Game button
endGameButton.addEventListener('click', () => {
    moves.length = 0;
    historyDiv.innerHTML = "";
    localStorage.removeItem('moveHistory');
    ws.send(JSON.stringify({ type: 'endGame' }));
    startTimer();
});

// Function to reset the game state
const resetGameState = () => {
    moves.length = 0;
    gamestate = {
        grid: [
            ['A-P1', 'A-P2', 'A-H1', 'A-H2', 'A-P3'],
            [null, null, null, null, null],
            [null, null, null, null, null],
            [null, null, null, null, null],
            ['B-P1', 'B-P2', 'B-H1', 'B-H2', 'B-P3']
        ],
        turn: 'A',
        winner: null,
        moves: []
    };
    startTimer();
};

// Call this function when a new game starts
resetGameState();

// Function to check for a tie
const checkForTie = () => {
    const playerAPieces = gamestate.grid.flat().filter(cell => cell && cell.startsWith('A')).length;
    const playerBPieces = gamestate.grid.flat().filter(cell => cell && cell.startsWith('B')).length;
    if (playerAPieces === playerBPieces) {
        gamestate.winner = 'Tie';
        return true;
    }
    return false;
};

// Modify the existing checkForWinner function to include the tie check
const checkForWinner = () => {
    const playerAHasCharacters = gamestate.grid.flat().some(cell => cell && cell.startsWith('A'));
    const playerBHasCharacters = gamestate.grid.flat().some(cell => cell && cell.startsWith('B'));
    if (!playerAHasCharacters) {
        gamestate.winner = 'B';
        moves.length = 0;
    } else if (!playerBHasCharacters) {
        gamestate.winner = 'A';
        moves.length = 0;
    } else if (checkForTie()) {
        console.log('The game is a tie!');
    }
};

// Call checkForWinner after each move

// Function to save move history to local storage
const saveMoveHistory = () => {
    historyDiv.querySelectorAll('p').forEach(p => moves.push(p.textContent));
    localStorage.setItem('moveHistory', JSON.stringify(moves));
};

// Function to load move history from local storage
const loadMoveHistory = () => {
    const moves = JSON.parse(localStorage.getItem('moveHistory')) || [];
    if (moves.length === 0) return;
    moves.forEach(move => {
        const moveParagraph = document.createElement('p');
        moveParagraph.textContent = move;
        historyDiv.appendChild(moveParagraph);
    });
};

// Call loadMoveHistory when the page loads
window.addEventListener('load', loadMoveHistory);

// Convert direction codes to descriptive text
const getMoveDescription = (direction) => {
    switch (direction) {
        case 'FW': return ' :FW';
        case 'B': return ' :B';
        case 'L': return ' :L';
        case 'R': return ' :R';
        case 'FL': return ' :FL';
        case 'FR': return ' :FR';
        case 'BL': return ' :BL';
        case 'BR': return ' :BR';
        default: return 'unknown direction';
    }
};
