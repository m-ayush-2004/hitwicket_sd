
# 5x5 Board Game - Run locally 

This turn-based 5x5 board game was developed as part of the HitWicket Software Engineer assignment. Two players compete using 5 pieces each: 3 pawns (P1, P2, P3), 1 Hero1 (H1), and 1 Hero2 (H2).

## Game Rules 📜

### 1. Piece Movement:
- **Pawn (P1, P2, P3):** Moves one block in any direction (L, R, F, B).
- **Hero1 (H1):** Moves exactly two blocks in any straight direction (L, R, F, B) and captures opponent pieces.
- **Hero2 (H2):** Moves exactly two blocks diagonally (FL, FR, BL, BR) and captures opponent pieces.

### 2. Player Interaction:
- Players take turns selecting a piece and moving it using the following commands:
  - **F** (Forward)
  - **L** (Left)
  - **B** (Backward)
  - **R** (Right)
  - **FL** (Forward-Left)
  - **FR** (Forward-Right)
  - **BL** (Backward-Left)
  - **BR** (Backward-Right)
- Each move will be executed, and the board will be updated accordingly.

### 3. Turn Exchange:
- Players alternate turns, with one turn per player.

### 4. Board Updates and Captures:
- The board is updated after each valid move.
- Captures are handled if an opponent's piece is in the path of a Hero piece's movement.

### 5. Move History:
- A move history is maintained and displayed during the game (e.g., "Player A moved P1 Forward").

## Technologies Used

- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Node.js with Express
- **Communication:** WebSockets

## Screenshots 📸

### Game Board
![Game Board](p2.png)

### Player's Move
![Player's Move](p1.png)


## Setup and Run Instructions

### Server Setup 🚀

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/Aarush1137/AarushJain_21BPS1137
2. **Navigate to the Project Directory:**
   ```bash
   cd chess-game
   
3. **Install Dependencies:**
   ```bash
   npm run build
4. **Start the Server:**
   ```bash
   npm start

The server will start and listen on port 8080 by default. You can access it at [http://localhost:8081](http://localhost:8081).

### Client Setup 🖥️

The frontend files (HTML, CSS, JavaScript) are located in the `Client` directory.

To access the game:

1. Open a web browser and navigate to [http://localhost:8081](http://localhost:8081) to start the game.
