// Create the structure of the gameboard
const gameboard = (function() {
    const rows = 3;
    const columns = 3;
    const board = [];

    // Access to cell index and value
    function cell(index) {
        let value = "-";

        const getValue = () => {
            return value;
        }
        
        const setValue = (newValue) => {
            value = newValue;
        }

        return {index, getValue, setValue};
    }
 
    // Create board by adding a board inside each row. 
    // Add cells with unique index inside.
    const createBoard = (function () {
        for (let i = 0; i < rows; i++) {
                board[i] = [];
            for (let j = 0; j < columns; j++) {
                const newCell = cell(i * 3 + j);
                board[i].push(newCell);
            }
        }
    })();

    // Access a cell of the board array from its index
    function getCell(index) {
        let i = Math.floor(index / 3);
        let j = index % 3;
        return board[i][j];
    }

    return {board, cell, getCell};

})();

// Create a player objects and functions to get/set data
function player(name, marker, score = 0) {
    let moves = [];

    const getName = () => {
        return name;
    }

    const setName = (newName) => {
        name = newName;
    }

    const getMoves = () => {
        return moves;
    }

    const addMove = (move) => {
            moves.push(move);
            gameboard.getCell(move).setValue(marker);
    }

    const clearMoves = () => {
        moves = [];
        return moves;
    }

    const getScore = () => {
        return score;
    }

    const addPoint = () => {
        score += 1;
        return score;
    }

    return {
        getName, setName, 
        marker, 
        getMoves, addMove, clearMoves,
        getScore, addPoint};
}

// Control the flow of the game
const gameController = (function() {
    const playerOne = player("Player 1", "O");
    const playerTwo = player("Player 2", "X");
    let currentPlayer = playerOne;
    let turns = 0;

    const getCurrentPlayer = () => {
        return currentPlayer;
    }

    const clearGame = () => {
        turns = 0;
        currentPlayer = playerOne;
        return {turns, currentPlayer}
    }

    // Check if the move played has not been played yet.
    // If not, add move index to player moves and change cell's value.
    function playRound(player, move) {
        currentPlayer.addMove(move);
        turns += 1;
        checkWin();
        switchPlayer();
    }

    // Switch player after each round
    function switchPlayer() {
        if (currentPlayer === playerOne) {
            currentPlayer = playerTwo;
        }
        else {
            currentPlayer = playerOne;
        }
    };
    
    // Check the player's moves array for a winner combination
    function checkWin() {
        const winners = [
            ["0", "1", "2"],
            ["3", "4", "5"],
            ["6", "7", "8"],
            ["0", "3", "6"],
            ["1", "4", "7"],
            ["2", "5", "8"],
            ["0", "4", "8"],
            ["2", "4", "6"]
        ]
        let count = 0;
        // Loop through the winners combinations to check if all 3 numbers are included
        // in current player's moves
        for (const winner of winners) {
            count = 0;
            for (const num of winner) {
                if (!(currentPlayer.getMoves().includes(num))) {
                    break;
                }
                else {
                    count += 1;
                }
            }
            if (count == 3) {
                endGame(currentPlayer);
                return;
            }
        }
        // If all squares(9) have been played, it's a tie game
        if (turns === 9) {
        console.log("Tie game!");
        return;
        }
    };

    return {playerOne, playerTwo, getCurrentPlayer, clearGame, playRound};
    
})();

// Display the game, handle buttons
function displayController() {
    const squares = document.getElementsByClassName("square");

    const playerOneName = document.querySelector(".one .name");
    const playerOneMarker = document.querySelector(".one .marker");
    const playerOneScore = document.querySelector(".one .score");

    const playerTwoName = document.querySelector(".two .name");
    const playerTwoMarker = document.querySelector(".two .marker");
    const playerTwoScore = document.querySelector(".two .score");

    const startButton = document.querySelector(".start");
    const changeButtons = document.querySelectorAll(".name-button");

    // Change name of the player (after button clicked)
    function changeName(playerOld, playerName) {
        let newName = prompt("New name for " + playerOld.getName());
        if (newName) {
            playerOld.setName(newName);
            playerName.textContent = newName;
        }
        else {
            return;
        }
    }

    // Start the game
    function startGame() {
        // Remove change name buttons
        changeButtons.forEach((button) => {
            button.remove();
        });
        getMarkers();
        clearGameboard();

        //Set scores to 0;
        // playerOneScore.textContent = gameController.playerOne.getScore();
        // playerTwoScore.textContent = gameController.playerTwo.getScore()

        // Create the grid buttons
        const squareButtons = document.querySelectorAll(".square-button");
        squareButtons.forEach((button) => {
            button.addEventListener("click", () => {
                // Add marker of the current player in the square
                button.textContent = gameController.getCurrentPlayer().marker;
                // Disable button to avoid unauthorized move
                button.disabled = true;
                gameController.playRound(gameController.getCurrentPlayer(), button.dataset.id);
                getMarkers();

            })
        });

        // Add a restart button
        const restartButton = document.createElement("button");
        const header = document.querySelector(".header");
        restartButton.textContent = "Restart";
        header.appendChild(restartButton); 
        restartButton.addEventListener("click", () => {
            clearGameboard();
            
        })
        
    }

    // Display marker of currentPlayer while hiding the other player's marker
    function getMarkers() {
        // player one to play
        if (gameController.getCurrentPlayer().marker == "O") { 
            playerOneMarker.textContent = "O";
            playerTwoMarker.textContent = "";
        }
        // player two to play
        else {
            playerOneMarker.textContent = "";
            playerTwoMarker.textContent = "X";
        }
    }

    function clearGameboard() {
        // Clear grid
        let squareButtons = document.querySelectorAll(".square-button");
        for (let i = 0; i < squareButtons.length; i++) {
            squareButtons[i].textContent = "";
            squareButtons[i].disabled = false;
        }
        // Clear player's moves
        gameController.playerOne.clearMoves();
        gameController.playerTwo.clearMoves();

        // Clear moves (to check ties) and set currentPlayer to player 1
        gameController.clearGame();
        getMarkers();
    }

    function renderGameboard() {
        // Render gameboard with actualised data
        for (let i = 0; i < squares.length; i++) {
            let button = document.createElement("button");
            button.classList.add("square-button");
            button.dataset.id = i;
            squares[i].appendChild(button);
        }
        
        // Change name of the player (js and DOM)
        changeButtons.forEach((button) => {
            button.addEventListener("click", () => {
                if (button.id == "change-one") {
                    changeName(gameController.playerOne, playerOneName);
                }
                else {
                    changeName(gameController.playerTwo, playerTwoName);
                }
            })
        })

        startButton.addEventListener("click", () => {
            startButton.remove();
            startGame();
        })
    }
    

   


    
    renderGameboard();
}
displayController();