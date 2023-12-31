const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const gridSize = 20;
const snake = [{ x: 5, y: 5 }];
let direction = "right";
let score = 0;

function draw() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Move the snake
    moveSnake();

    // Draw the snake
    drawSnake();

    // Draw the food
    drawFood();

    // Draw the score
    drawScore();

    // Check for collisions
    checkCollisions();

    // Draw again after a delay
    setTimeout(() => {
        requestAnimationFrame(draw);
    }, 200); // Adjust the delay (in milliseconds) to control the speed
}

function drawSnake() {
    const snakeImage = new Image();
    snakeImage.src = "camo.jpg"; // Replace with the actual path to your snake image

    for (const segment of snake) {
        ctx.drawImage(snakeImage, segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);
    }
}

function moveSnake() {
    const head = Object.assign({}, snake[0]); // Copy the head of the snake

    // Move the head in the current direction
    switch (direction) {
        case "up":
            head.y -= 1;
            break;
        case "down":
            head.y += 1;
            break;
        case "left":
            head.x -= 1;
            break;
        case "right":
            head.x += 1;
            break;
    }

    // Add the new head to the front of the snake
    snake.unshift(head);

    // Remove the tail of the snake
    if (!ateFood) {
        snake.pop();
    } else {
        ateFood = false;
    }
}

function drawFood() {
    const foodImage = new Image();
    foodImage.src = "circle.jpg"; // Replace with the actual path to your food image
    ctx.drawImage(foodImage, food.x * gridSize, food.y * gridSize, gridSize, gridSize);
}

function generateFood() {
    food = {
        x: Math.floor(Math.random() * (canvas.width / gridSize)),
        y: Math.floor(Math.random() * (canvas.height / gridSize))
    };

    // Make sure the food does not appear on the snake
    for (const segment of snake) {
        if (food.x === segment.x && food.y === segment.y) {
            generateFood();
            return;
        }
    }
}

function drawScore() {
    ctx.fillStyle = "black";
    ctx.font = "20px Arial";
    ctx.fillText(`Score: ${score}`, 10, 20);
}

function checkCollisions() {
    // Check for collisions with walls
    if (
        snake[0].x < 0 ||
        snake[0].x >= canvas.width / gridSize ||
        snake[0].y < 0 ||
        snake[0].y >= canvas.height / gridSize
    ) {
        resetGame();
        return;
    }

    // Check for collisions with itself
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
            resetGame();
            return;
        }
    }

    // Check for collisions with food
    if (snake[0].x === food.x && snake[0].y === food.y) {
        ateFood = true;
        generateFood();
        score += 10; // Increase the score when the snake eats food
    }
}

function resetGame() {
    alert(`Game Over! Your Score: ${score}. Press OK to restart.`);
    snake.length = 1;
    snake[0] = { x: 5, y: 5 };
    direction = "right";
    generateFood();
    score = 0;
}

function keyDownHandler(e) {
    switch (e.key) {
        case "ArrowUp":
            direction = "up";
            break;
        case "ArrowDown":
            direction = "down";
            break;
        case "ArrowLeft":
            direction = "left";
            break;
        case "ArrowRight":
            direction = "right";
            break;
    }
}

let ateFood = false;
let food;
generateFood(); // Initialize the food position

document.addEventListener("keydown", keyDownHandler, false);

// Start the game loop
draw();