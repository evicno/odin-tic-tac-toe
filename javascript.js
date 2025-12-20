const gameboard = (function() {
    const rows = 3;
    const columns = 3;
    const board = [];

    // Access to cell index and value
    function cell(index) {
        let value = "";
        
        const setValue = (newValue) => {
            value = newValue;
        }

        return {index, value, setValue};
    }
 
    // Create board by adding a board inside each row. 
    // Add cells with unique index inside.
    function createBoard() {
        for (let i = 0; i < rows; i++) {
                board[i] = [];
            for (let j = 0; j < columns; j++) {
                const newCell = cell(i * 3 + j);
                newCell.setValue("");
                board[i].push(newCell);
            }
        }
    };

    createBoard();
    return {board, cell};

})();


function player(name, marker) {
    const moves = [];
    return {name, marker, moves};
}

function GameController() {
    const playerOne = player("playerOne", "O");
    const playerTwo = player("playerTwo", "X");
    let currentPlayer = playerOne;

    // Check if the move played has not been played yet.
    // If not, add move index to player moves and change cell's value.
    function playRound(player, move) {
        if (!(move in playerOne.moves) && !(move in playerTwo.moves)) {
            player.moves.push(move);
            gameboard.cell(move).setValue(player.marker);
        }
        checkWin();
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
        let win = false;
        outer:
        for (const winner of winners) {
            let count = 0;
            for (const num of winner) {
                if (!(num in currentPlayer.moves)) {
                    break;
                }
                else {
                    count += 1;
                }
            }
            if (count == 3) {
                win = true;
                break outer;
            }
    
        }
        return win;    
    };
}