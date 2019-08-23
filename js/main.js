const   canvas = document.getElementById('canvas'),
        ctx = canvas.getContext("2d");

let score = 0,
    bestScore = 0;

let startButton = document.getElementById('settings__start');

let settings = {
    box: 10,
    speed: 100,
    width: 600,
    height: 540
};

let gameOverBlock = document.querySelector('.game-over-wrap'),
    inputScore = document.querySelector('.game-over__score'),
    inputBestScore = document.querySelector('.game-over__best-score');

let intervalId;

let snake = {
    direction: "right",
    body: [],
    newHead: {},
    move() {
        let snakeX = snake.body[0].x,
            snakeY = snake.body[0].y;

        switch (snake.direction) {
            case "left":
                snakeX -= settings.box;
                break;
            case "right":
                snakeX += settings.box;
                break;
            case "up":
                snakeY -= settings.box;
                break;
            case "down":
                snakeY += settings.box;
                break;
        }

        return this.newHead = {
            x: snakeX,
            y: snakeY
        };
    },
    startBody () {
        for (let i = 0; i < 3; i++) {
            let halfWidth = canvas.width / 2;
            let halfHeight = canvas.height / 2;
            let newElem = {
                x: halfWidth - (halfWidth % settings.box),
                y: halfHeight - (halfHeight % settings.box),
            };

            snake.body.push(newElem);
        }
    },
    snakeTransition(newHead) {
        if (newHead.x === -settings.box) {
            newHead.x = canvas.width;
            snake.direction = "left";
        } else if (newHead.x === canvas.width) {
            newHead.x = 0;
            snake.direction = "right";
        }

        if (newHead.y === -settings.box) {
            newHead.y = canvas.height;
            snake.direction = "up";
        } else if (newHead.y === canvas.height) {
            newHead.y = 0;
            snake.direction = "down";
        }
    }
};
let food = {
    items: [],
    generateFood (count) {
        while (this.items.length < count) {
            let x = Math.random() * canvas.width,
                y = Math.random() * canvas.height;
            let newItem = {
                x: x - (x % settings.box), //
                y: y - (y % settings.box)
            };
            let itemExists = false;
            for (let i = 0; i < this.items.length; i++) {
                if (this.items[i] === newItem) {
                    itemExists = true;
                }
            }
            if (!itemExists) {
                this.items.push(newItem);
            }
        }
        return this.items;
    },
    generateNewFood () {
        let x = Math.random() * canvas.width,
            y = Math.random() * canvas.height;
        return {
            x: x - (x % settings.box),
            y: y - (y % settings.box),
        };
    }
};

startButton.addEventListener("click", function () {
    startGame();
});

function validationCheck(obj) {
    let minBoxSize = 1,
        maxBoxSize = 3,
        minSpeed = 1,
        maxSpeed = 10;

    // Box body validation

    if (obj.box >= minBoxSize && obj.box <= maxBoxSize) {
        obj.box = Math.round(obj.box) * 10;
    } else if (obj.box < minBoxSize) {
        document.getElementById('box').value = minBoxSize;
    } else if (obj.box > maxBoxSize) {
        obj.box = maxBoxSize * 10;
        document.getElementById('box').value = maxBoxSize;
    }

    // Speed validation

    if (obj.speed >= minSpeed && obj.speed <= maxSpeed) {
        if (obj.speed === maxSpeed) {
            obj.speed = 100 * ((maxSpeed + 1) - Math.round(obj.speed));
        }
        else {
            obj.speed = 100 * (maxSpeed - Math.round(obj.speed));
        }
    }
    else if (obj.speed < minSpeed) {
        obj.speed = minSpeed * 1000;
        document.getElementById('speed').value = minSpeed;
    }
    else if (obj.speed > maxSpeed) {
        obj.speed = maxSpeed * 10;
        document.getElementById('speed').value = maxSpeed;
    }
}

function startGame() {
    let personalSettings = {
        box: Number(document.getElementById('box').value),
        speed: Number(document.getElementById('speed').value),
    };

    validationCheck(personalSettings);
    settings.box = personalSettings.box;
    settings.speed = personalSettings.speed;

    gameOverBlock.style.display = 'none';
    food.generateFood(3);
    snake.startBody();

    document.addEventListener("keydown", onKeydown);
    snake.direction = "right";

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
    document.removeEventListener("keydown", onKeydown);

    snake.body = [];
    snake.direction = '';

    settings.speed = 100;

    if (score > bestScore) bestScore = score;
    inputScore.value = score;
    inputBestScore.value = bestScore;
    score = 0;
    document.getElementById('settings-best-score').value = bestScore;

    document.getElementById('box').removeAttribute('disabled');
    document.getElementById('speed').removeAttribute('disabled');
    document.getElementById('settings__start').removeAttribute('disabled');
}

let directionArray = [];

function onKeydown(event) {
    let newDirection = event.code.substr(5).toLowerCase();

    if (
        (snake.direction === newDirection)
        || (snake.direction === 'left' && newDirection === 'right')
        || (snake.direction === 'right' && newDirection === 'left')
        || (snake.direction === 'up' && newDirection === 'down')
        || (snake.direction === 'down' && newDirection === 'up')
    ) {
        return false;
    }

    return directionArray.push(newDirection);
}

function direction() {
    if (directionArray.length) {
        snake.direction = directionArray[0];
        directionArray.shift();
    }
}

let eaten = false;
let eatenFoodIndex;

let snakeMovement = function () {
    direction();
    for (let i = 0; i < food.items.length; i++) {
        if (snake.body[0].x === food.items[i].x && snake.body[0].y === food.items[i].y) {
            eaten = true;
            eatenFoodIndex = i;
            break;
        }
    }
    if (eaten) {
        snake.body.unshift(snake.move());
        food.items[eatenFoodIndex] = food.generateNewFood ();
        score++;
        document.getElementById('settings-score').value = score;
        eaten = false;
    } else {
        snake.body.unshift(snake.move());
        snake.body.pop();
    }
    for (let i = 3; i < snake.body.length; i++) {
        if (snake.body[0].x === snake.body[i].x && snake.body[0].y === snake.body[i].y) {
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
    for (let i = 0; i < food.items.length; i++) {
        ctx.fillStyle = "#ff0000";
        ctx.fillRect(food.items[i].x, food.items[i].y, settings.box, settings.box);
    }

    for(let i = 0; i < snake.body.length; i++) {
        ctx.fillStyle = "#009000";
        ctx.fillRect(snake.body[i].x, snake.body[i].y, settings.box, settings.box);
    }
}
