document.addEventListener('DOMContentLoaded', () => {
    const WIDTH = 10;
    const GRID = document.querySelector('.grid');
    let squares = Array.from(document.querySelectorAll('.grid div'));
    const SCORE_DISPLAY = document.querySelector('#score');
    const START_BUTTON = document.getElementById('start-button');
    let timerId
    let score = 0;

    //*--------------------------------------------------------------------
    const lTet = [
        [1, WIDTH+1, WIDTH*2+1, 2],
        [WIDTH, WIDTH+1, WIDTH+2, WIDTH*2+2],
        [1, WIDTH+1, WIDTH*2+1, WIDTH*2],
        [WIDTH, WIDTH*2, WIDTH*2+1, WIDTH*2+2]
    ];

    const zTet = [
        [0, WIDTH, WIDTH+1, WIDTH*2+1],
        [WIDTH+1, WIDTH+2, WIDTH*2, WIDTH*2+1],
        [0, WIDTH, WIDTH+1, WIDTH*2+1],
        [WIDTH+1, WIDTH+2, WIDTH*2, WIDTH*2+1]
    ];

    const tTet = [
        [1, WIDTH, WIDTH+1, WIDTH+2],
        [1, WIDTH+1, WIDTH+2, WIDTH*2+1],
        [WIDTH, WIDTH+1, WIDTH+2, WIDTH*2+1],
        [1, WIDTH, WIDTH+1, WIDTH*2+1]
    ];

    const oTet = [
        [0, 1, WIDTH, WIDTH+1],
        [0, 1, WIDTH, WIDTH+1],
        [0, 1, WIDTH, WIDTH+1],
        [0, 1, WIDTH, WIDTH+1]
    ];

    const iTet = [
        [1, WIDTH+1, WIDTH*2+1, WIDTH*3+1],
        [WIDTH, WIDTH+1, WIDTH+2, WIDTH+3],
        [1, WIDTH+1, WIDTH*2+1, WIDTH*3+1],
        [WIDTH, WIDTH+1, WIDTH+2, WIDTH+3]
    ];

    const pieces = [lTet, zTet, tTet, oTet, iTet];

    let currentPosition = 4;
    let currentRotation = 0;
    //* select random piece
    let random = Math.floor(Math.random()*pieces.length);
    let current = pieces[random][currentRotation];
    let nextRandom = 0;


    //* draw the piece
    function draw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.add('tetromino');
        })
    }

    //* undraw the piece
    function undraw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.remove('tetromino');
        })
    }


    //* gravity speed
    // timerId = setInterval(gravity, 500);


    //* assign function to keyCodes
    function controls(e) {
        switch(e.keyCode) {
        case 37: {
            moveLeft();
            break;
        }
        case 38: {
            rotate();
            break;
        }
        case 39: {
            moveRight();
            break;
        }
        case 40: {
            clearInterval(timerId);
            timerId = setInterval(gravity, 0);
            break;
        }
        }
        // if(e.keyCode === 37) {
        //     moveLeft();
        // }
    }
    document.addEventListener('keyup', controls);

    //* gravity function
    function gravity() {
        undraw();
        currentPosition += WIDTH;
        draw();
        freeze();
    }

    // let random = nextRandom;s

    function freeze() {
        if(current.some(index => squares[currentPosition + index + WIDTH].classList.contains('taken'))) {
            current.forEach(index => squares[currentPosition + index].classList.add('taken'));
            random = nextRandom;
            //* new piece
            nextRandom = Math.floor(Math.random() * pieces.length);
            current = pieces[random][currentRotation];
            currentPosition = 4;
            clearInterval(timerId);
            timerId = setInterval(gravity, 500);
            draw();
            displayShape();
            addScore();
            gameOver();
        }
    }


    function moveLeft() {
        undraw();
        const isAtLeftEdge = current.some(index => (currentPosition + index) % WIDTH === 0)

        if(!isAtLeftEdge) currentPosition -= 1;

        if(current.some(index => squares[currentPosition+index].classList.contains('taken'))) {
            currentPosition += 1;
        }

        draw();
    }

    function moveRight() {
        undraw();
        const isAtRightEdge = current.some(index => (currentPosition + index) % WIDTH === WIDTH-1);
        if(!isAtRightEdge) currentPosition += 1;
        if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            currentPosition -= 1;
        }
        draw();
    }

    function rotate() {
        // console.log(random);
        undraw();
        currentRotation++;
        if(currentRotation === current.length) {
            currentRotation = 0;
        }
        current = pieces[random][currentRotation];
        draw();
    }

    //show up-next piece in mini-grid
    const displaySquares = document.querySelectorAll('.mini-grid div');
    const miniWidth = 4;
    let miniIndex = 0;

    const miniArr = [
        [1, miniWidth+1, miniWidth*2+1, 2],
        [0, miniWidth, miniWidth+1, miniWidth*2+1],
        [1, miniWidth, miniWidth+1, miniWidth+2],
        [0, 1, miniWidth, miniWidth+1],
        [1, miniWidth+1, miniWidth*2+1, miniWidth*3+1]
    ];

    function displayShape() {
        displaySquares.forEach(square => {
            square.classList.remove('tetromino');
        })
        miniArr[nextRandom].forEach( index => {
            displaySquares[miniIndex + index].classList.add('tetromino');
        })
    }

    //* add functionality to button
    START_BUTTON.addEventListener('click', () => {
        if(timerId) {
            clearInterval(timerId);
            timerId = null;
        } 
        else {
            draw();
            timerId = setInterval(gravity, 500);
            nextRandom = Math.floor(Math.random()*pieces.length);
            displayShape();
        }
    })

    function addScore() {
        for(let i = 0; i < 199; i += WIDTH) {
            const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9];

            if(row.every(index => squares[index].classList.contains('taken'))) {
                score += 10;
                SCORE_DISPLAY.innerHTML = score;
                row.forEach(index => {
                    squares[index].classList.remove('taken');
                    squares[index].classList.remove('tetromino');
                })
                const squaresRemoved = squares.splice(i, WIDTH);
                squares = squaresRemoved.concat(squares);
                squares.forEach(cell => GRID.appendChild(cell));
            }
        }
    }

    function gameOver() {
        if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            SCORE_DISPLAY.innerHTML = 'end';
            clearInterval(timerId);
        }
    }

})