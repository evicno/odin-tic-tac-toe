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

    function getCell(index) {
        let i = Math.floor(index / 3);
        let j = index % 3;
        return board[i][j];
    }

    function getBoard() {
        for (let i = 0; i < rows; i++) {
                let cell1 = getCell(i * 3).getValue();
                let cell2 = getCell(i * 3 + 1).getValue();
                let cell3 = getCell(i * 3 + 2).getValue();
                console.log(cell1, cell2, cell3);
        };
    }

    return {board, cell, getCell, getBoard};

})();


function player(name, marker) {
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

    return {getName, setName, marker, getMoves, addMove};
}

const gameController = (function() {
    const playerOne = player("playerOne", "O");
    const playerTwo = player("playerTwo", "X");
    let currentPlayer = playerOne;
    let turns = 0;

    const getCurrentPlayer = () => {
        return currentPlayer;
    }

    // Check if the move played has not been played yet.
    // If not, add move index to player moves and change cell's value.
    function playRound(player, move) {
        currentPlayer.addMove(move);
        gameboard.getBoard();
        turns += 1;
        checkWin();
        switchPlayer();
    }

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
                console.log(currentPlayer.getName() + " wins!");
                return;
            }
        }
        if (turns === 9) {
        console.log("Tie game!");
        return;
        }
    };

    gameboard.getBoard();
    return {playerOne, playerTwo, getCurrentPlayer, playRound};
    
})();


function displayController() {
    const squares = document.getElementsByClassName("square");
    const playerOneName = document.querySelector(".one .name");
    const playerTwoName = document.querySelector(".two .name");

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

    function renderGameboard() {
        for (let i = 0; i < squares.length; i++) {
            let button = document.createElement("button");
            button.classList.add("square-button");
            button.dataset.id = i;
            squares[i].appendChild(button);
        }
        const squareButtons = document.querySelectorAll(".square-button");
        squareButtons.forEach((button) => {
            button.addEventListener("click", () => {
                button.textContent = gameController.getCurrentPlayer().marker;
                button.disabled = true;
                gameController.playRound(gameController.getCurrentPlayer(), button.dataset.id);
            });
        });
        const changeButtons = document.querySelectorAll(".name-button");
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
    }
    

   


    
    renderGameboard();
}
displayController();