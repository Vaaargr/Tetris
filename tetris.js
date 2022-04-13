const canvas = document.getElementById("tetris");
const ctx = canvas.getContext("2d");
const startButton = document.getElementById("start");
const resetButton = document.getElementById("reset");
const modal = document.getElementById("myModal");
const instructionsButton = document.getElementById("instructions");
const span = document.getElementsByClassName("close")[0];
const set = document.getElementById("set");
const scoreField = document.getElementById('score');
let field;
let w;
let h;
let size;
let playerOnField = false;
let player;
let dropInterval = 500;
let score = 0;

startButton.addEventListener("click", () => {
    set.style.display = 'none';
    canvas.style.display = "inline-block";
    create();
    game();
    startButton.style.display = "none";
    resetButton.style.display = "inline-block";
});
resetButton.addEventListener("click", () => {
    location.reload();
});
instructionsButton.addEventListener("click", () => {
    modal.style.display = "block";
});
span.addEventListener("click", () => {
    modal.style.display = "none";
});
window.onclick = function (event) {
    if (event.target === modal) {
        modal.style.display = "none";
    }
};

const piece0 = [
    [0, 1, 0, 0],
    [0, 1, 0, 0],
    [0, 1, 0, 0],
    [0, 1, 0, 0]
];
const piece1 = [
    [0, 0, 0],
    [0, 1, 0],
    [1, 1, 1]
];
const piece2 = [
    [0, 0, 0],
    [1, 1, 0],
    [0, 1, 1]
];
const piece3 = [
    [0, 0, 0],
    [0, 1, 1],
    [1, 1, 0]
];
const piece4 = [
    [0, 1, 0],
    [0, 1, 0],
    [1, 1, 0]
];
const piece5 = [
    [0, 1, 0],
    [0, 1, 0],
    [0, 1, 1]
];
const piece6 = [
    [0, 0, 0],
    [0, 1, 1],
    [0, 1, 1]
];
const arrayOfPieces = [piece0, piece1, piece2, piece3, piece4, piece5, piece6]
const arrayOfColors = ['black', 'blue', 'green', 'violet', 'yellow', 'orange', 'pink', 'red']

function create() {
    w = document.getElementById('width').value;
    h = document.getElementById('height').value;
    size = document.getElementById('size').value;
    canvas.width = w * size;
    canvas.height = h * size;
    field = createMatrix(Number(w), h);
    ctx.scale(size, size);
    console.log(field);
}

function createMatrix(w, h) {
    const matrix = [];
    while (h--) {
        matrix.push(new Array(w).fill(0));
    }
    return matrix;
}

function Player() {
    this.num = Math.floor(Math.random() * 7) + 1;
    this.piece = arrayOfPieces[this.num - 1];
    this.color = arrayOfColors[this.num];
    this.pos = {x: Math.round(w / 2 - 1), y: 0 - this.piece.length};
}

function game() {
    if (!playerOnField) {
        player = new Player();
        playerOnField = true;
    }
    putPlayer(-1);
    if (canFall()) {
        player.pos.y += 1;
        putPlayer(1);
        draw();
    } else {
        if (player.pos.y < 0) {
            location.reload();
            alert(`Вы проиграли.\nВы набрали:${score}`)
        }
        putPlayer(1);
        playerOnField = false;
        checkField();
        draw();
    }
    setTimeout(game,dropInterval);
}

function canFall() {
    for (let y = player.piece.length - 1; y >= 0; y--) {
        for (let x = 0; x < player.piece[y].length; x++) {
            if (player.piece[y][x] === 1) {
                let yPos = y + player.pos.y;
                let xPos = x + player.pos.x;
                if (yPos + 1 < field.length) {
                    if (y === player.piece.length - 1) {
                        if (yPos + 1 >= 0 && field[yPos + 1][xPos] > 0) return false;
                    } else {
                        if (player.piece[y + 1][x] === 0) {
                            if (yPos + 1 >= 0 && field[yPos + 1][xPos] > 0) return false;
                        }
                    }
                } else return false;
            }
        }
    }
    return true;
}

function canMoveLeft() {
    for (let x = 0; x < player.piece[0].length; x++) {
        for (let y = player.piece.length - 1; y >= 0; y--) {
            if (player.piece[y][x] === 1) {
                let xPos = player.pos.x + x;
                let yPos = player.pos.y + y;
                if (xPos > 0) {
                    if (x > 0) {
                        if (player.piece[y][x - 1] === 0) {
                            if (yPos > 0 && field[yPos][xPos - 1] > 0) return false;
                        }
                    } else {
                        if (xPos > 0) {
                            if (yPos > 0 && field[yPos][xPos - 1] > 0) return false;
                        }
                    }
                } else return false;
            }
        }
    }
    return true;
}

function canMoveRight() {
    for (let x = player.piece[0].length - 1; x >= 0; x--) {
        for (let y = player.piece.length - 1; y >= 0; y--) {
            if (player.piece[y][x] === 1) {
                let xPos = player.pos.x + x;
                let yPos = player.pos.y + y;
                if (xPos < w - 1) {
                    if (x < player.piece[0].length - 1) {
                        if (player.piece[y][x + 1] === 0) {
                            if (yPos > 0 && field[yPos][xPos + 1] > 0) return false;
                        }
                    } else {
                        if (yPos > 0 && field[yPos][xPos + 1] > 0) return false;
                    }
                } else return false;
            }
        }
    }
    return true;
}

function canRotate(control) {
    let figure = rotate(control);
    for (let y = 0; y < figure.length; y++) {
        for (let x = 0; x < figure[y].length; x++) {
            if (figure[y][x] === 1) {
                let yPos = y + player.pos.y;
                let xPos = x + player.pos.x;
                if (yPos >= 0 && yPos < h && xPos >= 0 && xPos < w) {
                    if (field[yPos][xPos] > 0) {
                        return false;
                    }
                } else {
                    return false;
                }
            }
        }
    }
    draw(player.color);
    return true;
}

function draw() {
    for (let y = 0; y < field.length; y++) {
        for (let x = 0; x < field[y].length; x++) {
            ctx.fillStyle = arrayOfColors[field[y][x]];
            ctx.fillRect(x, y, 1, 1);
        }
    }
}

function putPlayer(a) {
    for (let y = player.piece.length - 1; y >= 0; y--) {
        for (let x = 0; x < player.piece[y].length; x++) {
            if (player.piece[y][x] === 1) {
                let yPos = y + player.pos.y;
                let xPos = x + player.pos.x;
                if (yPos >= 0) {
                    field[yPos][xPos] = (a > 0) ? player.num : 0;
                }
            }
        }
    }
}

document.addEventListener("keydown", (e) => {
    console.log(e);
    if (playerOnField) {
        switch (e.code) {
            case 'ArrowLeft':
                if (canMoveLeft()) {
                    putPlayer(-1);
                    player.pos.x -= 1;
                    putPlayer(1);
                    draw();
                }
                break;
            case 'ArrowRight':
                if (canMoveRight()) {
                    putPlayer(-1);
                    player.pos.x += 1;
                    putPlayer(1);
                    draw();
                }
                break;
            case 'ArrowDown':
                if (canFall()) {
                    putPlayer(-1);
                    player.pos.y +=1;
                    putPlayer(1);
                    draw();
                }
                break;
            case 'KeyD':
                putPlayer(-1)
                if (canRotate(1)) {
                    player.piece = rotate(1);
                }
                putPlayer(1);
                draw();
                break
            case 'KeyA':
                putPlayer(-1)
                if (canRotate(-1)) {
                    player.piece = rotate(-1);
                }
                putPlayer(1);
                draw();
                break
        }
    }
});

function rotate(control) {
    let figure = player.piece.map(function (item) {
        return [...item]
    });
    for (let y = 0; y < figure.length; y++) {
        for (let x = 0; x < y; x++) {
            [figure[x][y], figure[y][x]] = [figure[y][x], figure[x][y]];
        }
    }
    if (control > 0) {
        figure.forEach((row) => row.reverse());
    } else {
        figure.reverse();
    }
    return figure;
}

function checkField() {
    for (let y = field.length - 1; y > 0; y--) {
        if (checkLine(y)) {
            clearLine(y);
            fieldFall();
            score++;
            scoreField.innerText = score;
            checkField();
            switch (score) {
                case 5:
                    dropInterval = 450;
                    break
                case 10:
                    dropInterval = 400;
                    break
                case 15:
                    dropInterval = 350;
                    break
                case 20:
                    dropInterval = 300;
                    break
            }
        }
    }
}

function checkLine(y) {
    for (let x = 0; x < field[y].length; x++) {
        if (field[y][x] === 0) return false;
    }
    return true;
}

function clearLine(y) {
    for (let x = 0; x < field[y].length; x++) {
        field[y][x] = 0;
    }
}

function fieldFall() {
    for (let y = field.length - 2; y > 0; y--) {
        for (let x = 0; x < field[y].length; x++) {
            if (field[y][x] > 0 && field[y + 1][x] === 0) {
                field[y+1][x] = field[y][x];
                field[y][x] = 0;
            }
        }
    }
}
