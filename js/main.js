const   canvas     = document.getElementById('canvas'),
        ctx      = canvas.getContext("2d");

ctx.fillStyle = 'black';
ctx.fillRect(0, 0, canvas.width, canvas.height);

let box,
    speed;

box = 20;
speed = 100;

let gameOver = document.getElementById('game-over-wrap'),
    inputScore = document.querySelector('.game-over__score'),
    inputBestScore = document.querySelector('.game-over__best-score');

let score = 0,
    bestScore = 0;

let snake = {
    direction: '',
    size: [],
    newHead: {},
    move() {
        let snakeX = snake.size[0].x,
            snakeY = snake.size[0].y;

        if (snake.direction === "ArrowLeft" && snake.direction !== "ArrowRight") {
            snakeX -= box;
        }
        if (snake.direction === "ArrowRight" && snake.direction !== "ArrowLeft") {
            snakeX += box;
        }
        if (snake.direction === "ArrowUp" && snake.direction !== "ArrowDown") {
            snakeY -= box;
        }
        if (snake.direction === "ArrowDown" && snake.direction !== "ArrowUp") {
            snakeY += box;
        }
        return this.newHead = {
            x: snakeX,
            y: snakeY
        };
    },
    startSize () {
        for (i = 0; i < 3; i++) {
            let newElem = {
                x: canvas.width / 2 - ((canvas.width / 2) % box),
                y: canvas.height / 2 - ((canvas.height / 2) % box),
            };

            snake.size.push(newElem);
        }
    },
    snakeTransition(e) {
        if (e.x === -box) {
            e.x = canvas.width;
            snake.direction = 'ArrowLeft';
        } else if (e.x === canvas.width) {
            e.x = 0;
            snake.direction = 'ArrowRight';
        }

        if (e.y === -box) {
            e.y = canvas.height;
            snake.direction = 'ArrowUp';
        } else if (e.y === canvas.height) {
            e.y = 0;
            snake.direction = 'ArrowDown';
        }
    },
    eatTail() {
        for (i = 3; i < snake.size.length; i++) {
            if (snake.size[0].x === snake.size[i].x && snake.size[0].y === snake.size[i].y) {
                //gameOver.style.display = 'none';
                clearInterval(snakeMovement);
                if (score > bestScore) bestScore = score;
                inputScore.value = score;
                inputBestScore.value = bestScore;
                console.log('yes')
            }
            else {
                console.log('no')
            }
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
                x: x - (x % box),
                y: y - (y % box)
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
            x: x - (x % box),
            y: y - (y % box),
        };
    }
};

food.generateFood(3);
snake.startSize();

document.addEventListener("keydown", directionCode);

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
        eaten = false;
    } else {
        snake.size.unshift(snake.move());
        snake.size.pop();
    }
    snake.snakeTransition(snake.newHead);
};
setInterval(snakeMovement, speed);
setInterval(snake.eatTail, 90);


function drawGame() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    for (i = 0; i < food.amount.length; i++) {
        ctx.fillStyle = "#ff0000";
        ctx.fillRect(food.amount[i].x, food.amount[i].y, box, box);
    }

    for(i = 0; i < snake.size.length; i++) {
        ctx.fillStyle = "#009000";
        ctx.fillRect(snake.size[i].x, snake.size[i].y, box, box);
    }

}
let game = setInterval(drawGame, 50);