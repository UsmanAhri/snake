const   canvas     = document.getElementById('canvas'),
        ctx        = canvas.getContext("2d");

let score          = 0,
    bestScore      = 0;

let settings = {
    box: 10,
    speed: 100,
    width: 600,
    height: 540,
    startButton: document.getElementById('settings__start')
};

let gameOverBlock = document.querySelector('.game-over-wrap'),
    inputScore = document.querySelector('.game-over__score'),
    inputBestScore = document.querySelector('.game-over__best-score');

let intervalId;

let snake = {
    direction: 'ArrowRight',
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
        for (let i = 0; i < 3; i++) {
            let halfWidth = canvas.width / 2;
            let halfHeight = canvas.height / 2;
            let newElem = {
                x: halfWidth - (halfWidth % settings.box),
                y: halfHeight - (halfHeight % settings.box),
            };

            snake.size.push(newElem);
        }
    },
    snakeTransition(newHead) {
        if (newHead.x === -settings.box) {
            newHead.x = canvas.width;
            snake.direction = 'ArrowLeft';
        } else if (newHead.x === canvas.width) {
            newHead.x = 0;
            snake.direction = 'ArrowRight';
        }

        if (newHead.y === -settings.box) {
            newHead.y = canvas.height;
            snake.direction = 'ArrowUp';
        } else if (newHead.y === canvas.height) {
            newHead.y = 0;
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
                x: x - (x % settings.box), //
                y: y - (y % settings.box)
            };
            let itemExists = false;
            for (let i = 0; i < this.amount.length; i++) {
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

settings.startButton.addEventListener("click", function () {
    startGame();
});

function validationCheck(obj) {
    let minBoxSize      = 1,
        maxBoxSize      = 3,
        minSpeed        = 5,
        maxSpeed        = 1;

    // Box size validation

    if (obj.box >= minBoxSize && obj.box <= maxBoxSize) {
        obj.box = Math.round(obj.box) * 10;
    } else if (obj.box < minBoxSize) {
        document.getElementById('box').value = minBoxSize;
    } else if (obj.box > maxBoxSize) {
        obj.box = maxBoxSize * 10;
        document.getElementById('box').value = maxBoxSize;
    }

    // Speed validation

    if (obj.speed <= minSpeed && obj.speed >= maxSpeed) {
        obj.speed = Math.round(obj.speed) * 100;
    }
    else if (obj.speed > minSpeed) {
        obj.speed = minSpeed * 100;
    }
    else {
        obj.speed = maxSpeed * 100;
    }
}

function startGame() {
    let personalSettings = {
        box: document.getElementById('box').value,
        speed: document.getElementById('speed').value,
    };

    validationCheck(personalSettings);
    settings.box = personalSettings.box;
    settings.speed = personalSettings.speed;

    console.log(personalSettings.speed);
    console.log(settings.speed);

    gameOverBlock.style.display = 'none';
    food.generateFood(3);
    snake.startSize();

    document.addEventListener("keydown", directionCode);
    snake.direction = "ArrowRight";

    intervalId = setInterval(snakeMovement, settings.speed);
    setInterval(drawGame, 50);

    document.getElementById('settings-score').value = score;
    document.getElementById('box').setAttribute('disabled', 'disabled');
    document.getElementById('speed').setAttribute('disabled', 'disabled');
    document.getElementById('settings__start').setAttribute('disabled', 'disabled');
}

function gameOver() {
    gameOverBlock.style.display = 'flex';
    snake.direction = '';
    clearInterval(intervalId);
    document.removeEventListener("keydown", directionCode);

    snake.size = [];
    snake.direction = '';

    settings.speed = 100;

    if (score > bestScore) bestScore = score;
    inputScore.value = score;
    inputBestScore.value = bestScore;
    score = 0;
    document.getElementById('settings-best-score').value = bestScore;

    document.getElementById('box').removeAttribute('disabled', 'disabled');
    document.getElementById('speed').removeAttribute('disabled', 'disabled');
    document.getElementById('settings__start').removeAttribute('disabled', 'disabled');
}

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
        score++;
        document.getElementById('settings-score').value = score;
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
