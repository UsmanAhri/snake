const   canvas     = document.getElementById('canvas'),
        ctx      = canvas.getContext("2d");

let settings = {
    score: document.getElementById('settings-score').value,
    bestScore: document.getElementById('settings-best-score').value,
    box: 10,
    speed: 100,
    width: 600,
    height: 540,
    startButton: document.getElementById('settings__start')
};

let snake = {
    direction: '',
    size: [],
    newHead: {},
    move() {
        let snakeX = snake.size[0].x,
            snakeY = snake.size[0].y;

        if (snake.direction === "ArrowLeft" && snake.direction !== "ArrowRight") {
            snakeX -= settings.box;
        }
        if (snake.direction === "ArrowRight" && snake.direction !== "ArrowLeft") {
            snakeX += settings.box;
        }
        if (snake.direction === "ArrowUp" && snake.direction !== "ArrowDown") {
            snakeY -= settings.box;
        }
        if (snake.direction === "ArrowDown" && snake.direction !== "ArrowUp") {
            snakeY += settings.box;
        }
        return this.newHead = {
            x: snakeX,
            y: snakeY
        };
    },
    startSize () {
        for (i = 0; i < 3; i++) {
            let newElem = {
                x: canvas.width / 2 - ((canvas.width / 2) % settings.box),
                y: canvas.height / 2 - ((canvas.height / 2) % settings.box),
            };

            snake.size.push(newElem);
        }
    },
    snakeTransition(e) {
        if (e.x === -settings.box) {
            e.x = canvas.width;
            snake.direction = 'ArrowLeft';
        } else if (e.x === canvas.width) {
            e.x = 0;
            snake.direction = 'ArrowRight';
        }

        if (e.y === -settings.box) {
            e.y = canvas.height;
            snake.direction = 'ArrowUp';
        } else if (e.y === canvas.height) {
            e.y = 0;
            snake.direction = 'ArrowDown';
        }
    }
};
let food = {
    amount: [],
    generateFood (count) {
        while (this.amount.length < count) {
            let x = Math.random() * canvas.width,
                y = Math.random() * canvas.height;
            let newItem = {
                x: x - (x % settings.box),
                y: y - (y % settings.box)
            };
            let itemExists = false;
            for (i = 0; i < this.amount.length; i++) {
                if (this.amount[i] === newItem) {
                    itemExists = true;
                }
            }
            if (!itemExists) {
                this.amount.push(newItem);
            }
        }
        return this.amount;
    },
    generateNewFood () {
        let x = Math.random() * canvas.width,
            y = Math.random() * canvas.height;
        return newItem = {
            x: x - (x % settings.box),
            y: y - (y % settings.box),
        };
    }
};

function startGame() {
    settings.height = 540;
    settings.width = 600;
    let personalSettings = {
        box: document.getElementById('box').value,
        speed: document.getElementById('speed').value,
        width: document.getElementById('playing-field-width').value,
        height: document.getElementById('playing-field-height').value,
        startButton: document.getElementById('settings__start')
    };

    if (personalSettings.box >= 1 && personalSettings.box <= 3) {
        settings.box = Math.round(personalSettings.box) * 10;
    }

    if (personalSettings.speed >= 1 && personalSettings.speed <= 100) {
        settings.speed = Math.round(personalSettings.speed) * 10;
    }


    food.generateFood(3);
    snake.startSize();
    document.addEventListener("keydown", directionCode);
    //settings.box = document.getElementById('box').value * 10;
    console.log(personalSettings.box);
    setInterval(snakeMovement, settings.speed);
    setInterval(drawGame, 50);
}

settings.startButton.addEventListener("click", function () {
    startGame();
});

let gameOverBlock = document.querySelector('.game-over-wrap'),
    inputScore = document.querySelector('.game-over__score'),
    inputBestScore = document.querySelector('.game-over__best-score');



let directionArray = [];
function directionCode(e) {
    if (e.code !== directionArray[directionArray.length - 1]) {

        directionArray.push(e.code);

        if (snake.direction === 'ArrowLeft' && directionArray[0] === 'ArrowRight' ||
            snake.direction === 'ArrowRight' && directionArray[0] === 'ArrowLeft') {
            directionArray.unshift('ArrowUp');
        }
        else if (snake.direction === 'ArrowUp' && directionArray[0] === 'ArrowDown' ||
                 snake.direction === 'ArrowDown' && directionArray[0] === 'ArrowUp') {
            directionArray.unshift('ArrowRight');
        }
    }
}

function direction() {
    if (directionArray.length) {
        snake.direction = directionArray[0];
        directionArray.shift();
    }
}

let eaten = false;

let snakeMovement = function () {
    direction();
    for (i = 0; i < food.amount.length; i++) {
        if (snake.size[0].x === food.amount[i].x && snake.size[0].y === food.amount[i].y) {
            eaten = true;
            break;
        }
    }
    if (eaten) {
        snake.size.unshift(snake.move());
        food.amount[i] = food.generateNewFood ();
        settings.score += 1;
        eaten = false;
    } else {
        snake.size.unshift(snake.move());
        snake.size.pop();
    }
    for (i = 3; i < snake.size.length; i++) {
        if (snake.size[0].x === snake.size[i].x && snake.size[0].y === snake.size[i].y) {
            gameOver();
        }
    }
    snake.snakeTransition(snake.newHead);
};

function gameOver() {
    gameOverBlock.style.display = 'flex';
    snake.direction = '';
    clearInterval(snakeMovement);
    document.removeEventListener("keydown", directionCode);
    snake.size = [];
    snake.startSize();
    if (settings.score > settings.bestScore) settings.bestScore = settings.score;
    inputScore.value = settings.score;
    inputBestScore.value = settings.bestScore;
    settings.score = 0;
}

function drawGame() {
    canvas.width = settings.width;
    canvas.height = settings.height;

    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    for (i = 0; i < food.amount.length; i++) {
        ctx.fillStyle = "#ff0000";
        ctx.fillRect(food.amount[i].x, food.amount[i].y, settings.box, settings.box);
    }

    for(i = 0; i < snake.size.length; i++) {
        ctx.fillStyle = "#009000";
        ctx.fillRect(snake.size[i].x, snake.size[i].y, settings.box, settings.box);
    }
}
