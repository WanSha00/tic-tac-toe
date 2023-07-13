let players = [];
let gameStart = false;

const Gameboard = (() => {

    //store the gameboard as an array inside of a Gameboard object
    let gameBoard = ["", "", "", "", "", "", "", "", ""];

    //render the contents of the gameboard array
    const render = () => {

        let boardHTML = "";

        gameBoard.forEach((square, index) => {

            let playerColor;

            if (square == "X") {
                playerColor = "color-one";

            } else if (square == "O") {
                playerColor = "color-two";
            }

            boardHTML += `<div class="square ${playerColor}" id="square-${index}">${square}</div>`;
        })

        document.querySelector(".gameboard").innerHTML = boardHTML;

        const squares = document.querySelectorAll(".square");
        squares.forEach((square) => {

            square.addEventListener("click", Game.handleClick);
        })
    }

    //add marks to a specific spot on the board
    const update = (index, mark) => {

        gameBoard[index] = mark;
        render();
    }

    const getGameboard = () => gameBoard;

    return {
        render,
        update,
        getGameboard
    }

})();

const displayMessage = (message) => {

    document.querySelector(".message").innerHTML = message;
}

//create Player
const Player = (name, mark) => {

    return {
        name,
        mark
    }
}

//game controller
const Game = (() => {

    let currentPlayerIndex;
    let gameOver;

    //players click on the gameboard to place their marker
    const handleClick = (event) => {

        if (gameOver || gameStart == false) {
            return;
        }

        //square-0
        let index = parseInt(event.target.id.split("-")[1]);

        //keeps players from playing in spots that are already taken
        if (Gameboard.getGameboard()[index] !== "") {
            return;
        }

        //update square with mark
        Gameboard.update(index, players[currentPlayerIndex].mark);

        if (checkForWin(Gameboard.getGameboard())) {

            gameOver = true;
            displayMessage(`${players[currentPlayerIndex].name} wins!`);

        } else if (checkForTie(Gameboard.getGameboard())) {

            gameOver = true;
            displayMessage(`It's a tie!`);
        }

        //enable name input after game ends
        if (gameOver) {

            document.getElementById("player1").disabled = false;
            document.getElementById("player2").disabled = false;
        }

        //switch player
        currentPlayerIndex = currentPlayerIndex === 0 ? 1 : 0;
        
    }

    const start = () => {

        //clear board
        for (let i = 0; i < 9; i++) {

            Gameboard.update(i, "");
        }

        currentPlayerIndex = 0;
        gameOver = false;
        document.querySelector(".message").innerHTML = "";

        Gameboard.render();

        const squares = document.querySelectorAll(".square");
        squares.forEach((square) => {

            square.addEventListener("click", handleClick);
        })

    }

    //check for 3-in-a-row 
    const checkForWin = (board) => {

        const winCombinations = [

            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ]

        for (let i = 0; i < winCombinations.length; i++) {

            const [a, b, c] = winCombinations[i];

            if (board[a] && board[a] === board[b] && board[a] === board[c]) {

                return true;

            }
        }

        return false;
    }

    //check for a tie
    const checkForTie = (board) => {

        return board.every(cell => cell != "");
    }

    return {
        start,
        handleClick
    }

})();

//initial empty board
Gameboard.render();

const restartBtn = document.querySelector(".start-btn");
restartBtn.addEventListener('click', () => {

    //disable name input after game start
    document.getElementById("player1").disabled = true;
    document.getElementById("player2").disabled = true;


    restartBtn.innerHTML = "RESTART";

    players = [

        Player(document.querySelector("#player1").value, "X"),
        Player(document.querySelector("#player2").value, "O"),
    ]

    //start game after click Start button
    Game.start();
    gameStart = true;
})

