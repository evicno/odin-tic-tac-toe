
// Create a player objects and functions to get/set data
function player(name, marker, score) {
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
    }

    const clearMoves = () => {
        moves = [];
        return moves;
    }

    const getScore = () => {
        return score;
    }

    const clearScore = () => {
        score = 0;
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
        getScore, clearScore, addPoint};
}

// Control the flow of the game
const gameController = (function() {
    const playerOne = player("Player 1", "O", 0);
    const playerTwo = player("Player 2", "X", 0);
    let currentPlayer = playerOne;
    let turns = 0;


    const getCurrentPlayer = () => {
        return currentPlayer;
    }

    // Put settings ready for a new round (after "continue")
    const resetSettingsRound = () => {
        playerOne.clearMoves();
        playerTwo.clearMoves();
        turns = 0;

        return {playerOne, playerTwo, turns, currentPlayer};
    }

    // Put settings ready for a new game (after "restart" or "start over")
    const resetSettingsGame = () => {
        resetSettingsRound();
        playerOne.clearScore();
        playerTwo.clearScore();

        return {playerOne, playerTwo, turns, currentPlayer};
    }

    // Check if the move played has not been played yet.
    // If not, add move index to player moves and change cell's value.
    function playMove(move) {
        currentPlayer.addMove(move);
        turns += 1;
        checkWin();
        switchPlayer();
    }

    // Switch player after each move or after each round
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
                currentPlayer.addPoint();
                displayController.endRound(currentPlayer);
                return;
            }
        }
        // If all squares(9) have been played, it's a tie game
        if (turns === 9) {
        displayController.endRound("tie");
        return;
        }
    };

    return {
        playerOne, playerTwo, getCurrentPlayer,
        resetSettingsRound, resetSettingsGame, 
        playMove};
})();

// Display the game, handle buttons
const displayController = (() => {
    const squareButtons = document.querySelectorAll(".square-button");

    const playerOneName = document.querySelector(".one .name");
    const playerOneMarker = document.querySelector(".one .marker");
    const changeOneButton = document.querySelector(".one button");
    const playerOneScore = document.querySelector(".one .score");

    const playerTwoName = document.querySelector(".two .name");
    const playerTwoMarker = document.querySelector(".two .marker");
    const changeTwoButton = document.querySelector(".two button");
    const playerTwoScore = document.querySelector(".two .score");
          
    const startButton = document.querySelector(".start");
    const restartButton = document.querySelector(".restart");

    function endRound(winner) {
        const dialog = document.querySelector("dialog");
        const winnerAnnouncement = document.querySelector("dialog p");
        const startOverButton = document.querySelector(".close");
        const continueButton = document.querySelector(".continue");

        if (winner == "tie") {
            winnerAnnouncement.textContent = "Tie game!"
        }
        else {
            winnerAnnouncement.textContent = winner.getName() + " wins!";
        }

        dialog.showModal();
        startOverButton.addEventListener("click", () => {
            dialog.close();
            gameController.resetSettingsGame();
            resetDisplayGame();
        })  
        continueButton.addEventListener("click", () => {
            dialog.close();
            gameController.resetSettingsRound();
            resetDisplayRound();
            showScore();
        })
        
    };

    // Set display for a new round (after continue)
    function resetDisplayRound() {
        getMarkers();

        // Clear grid
        for (let i = 0; i < squareButtons.length; i++) {
            squareButtons[i].textContent = "";
            squareButtons[i].disabled = false;
        };
        playRound();
    }

    // Set display for a new game (after restart or start over)
    function resetDisplayGame() {
        startButton.textContent = "Start";
        startButton.style.visibility = "visible";
        restartButton.textContent = "Restart";
        restartButton.style.visibility = "hidden";

        playerOneName.textContent = "Player 1";
        playerOneScore.textContent = "";
        changeOneButton.textContent = "Change name";
        changeOneButton.style.visibility = "visible";

        playerTwoName.textContent = "Player 2";
        playerTwoScore.textContent = "";
        changeTwoButton.textContent = "Change name";
        changeTwoButton.style.visibility = "visible";
    }

    // Change name of the player (after button clicked)
    function changeName(player, nameDisplay) {
        let newName = prompt("New name for " + player.getName());
        if (newName) {
            player.setName(newName);
            nameDisplay.textContent = newName;
        }
        else {
            return;
        }
    }

    function playRound() {
        // Make buttons active again
        squareButtons.forEach((button) => {
            button.style.visibility = "visible";
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

    function showScore () {
        playerOneScore.textContent = "Score: " + gameController.playerOne.getScore();
        playerTwoScore.textContent = "Score: " + gameController.playerTwo.getScore();
    }

     // Add event listener to change the name of the player
        changeOneButton.addEventListener("click", () => {
            changeName(gameController.playerOne, playerOneName);
            });
        changeTwoButton.addEventListener("click", () => {
            changeName(gameController.playerTwo, playerTwoName);
            });

    // Create event listener for grid buttons
        squareButtons.forEach((button) => {
            button.style.visibility = "hidden";
            button.addEventListener("click", () => {
                // Add marker of the current player in the square
                button.textContent = gameController.getCurrentPlayer().marker;
                // Disable button to avoid unauthorized move
                button.disabled = true;
                gameController.playMove(button.dataset.id);
                getMarkers();
            });
        });
    // Add event listener to start button: Remove change name buttons, add
        // marker and start game.
        startButton.addEventListener("click", () => {
            startButton.style.visibility = "hidden";
            changeOneButton.style.visibility = "hidden";
            changeTwoButton.style.visibility = "hidden";
            restartButton.style.visibility = "visible";
            resetDisplayRound();
            playRound();
        })
        
    // Add event listener to restart button
        restartButton.addEventListener("click", () => {
            restartButton.style.visibility = "hidden";
            startButton.style.visibility = "visible";
            resetDisplayGame();
            gameController.resetSettingsGame();
        });

    resetDisplayGame();
    return {endRound};
})();

