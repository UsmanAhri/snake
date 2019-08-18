const   canvas     = document.getElementById('canvas'),
        ctx      = canvas.getContext("2d");

ctx.fillStyle = 'black';
ctx.fillRect(0, 0, canvas.width, canvas.height);

let box;
box = 20;

let score = 0;

let snake = {
    direction: '',
    size: [],
    newHead: {},
    move() {
        let snakeX = snake.size[0].x,
            snakeY = snake.size[0].y;
        if (snake.direction === "left" && snake.direction !== "right") {
            snakeX -= box;
        }
        if (snake.direction === "right" && snake.direction !== "left") {
            snakeX += box;
        }
        if (snake.direction === "up" && snake.direction !== "down") {
            snakeY -= box;
        }
        if (snake.direction === "down" && snake.direction !== "up") {
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
            snake.direction = 'left';
        } else if (e.x === canvas.width) {
            e.x = 0;
            snake.direction = 'right';
        }

        if (e.y === -box) {
            e.y = canvas.height;
            snake.direction = 'up';
        } else if (e.y === canvas.height) {
            e.y = 0;
            snake.direction = 'down';
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

document.addEventListener("keydown", direction);

function direction(e) {
    if(e.code === "ArrowLeft" && snake.direction !== "right")
        snake.direction = "left";
    else if(e.code === "ArrowUp" && snake.direction !== "down")
        snake.direction = "up";
    else if(e.code === "ArrowRight" && snake.direction !== "left")
        snake.direction = "right";
    else if(e.code === "ArrowDown" && snake.direction !== "up")
        snake.direction = "down";
}
let eaten = false;


function snakeMovement() {
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

}
setInterval(snakeMovement, 100);


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