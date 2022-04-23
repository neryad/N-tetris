const canvas = document.getElementById('tetris');
const left = document.getElementById('left');
const right = document.getElementById('right');
const down = document.getElementById('down');
const rotateLeft = document.getElementById('rotate1');
const rotateRight = document.getElementById('rotate2');
const context = canvas.getContext('2d');
context.scale(20, 20);
// canvas.window.screen.height;
// canvas.window.screen.width;
// context.fillStyle = '#2f3538';
//context.fillStyle = 'rgba(255,255,255, 0.5)';
context.fillRect(0, 0, canvas.width, canvas.height);

function collide(playZone, player) {
  // const [m, o] = [player.matrix, player.pos];
  const m = player.matrix;
  const o = player.pos;
  for (let y = 0; y < m.length; ++y) {
    for (let x = 0; x < m[y].length; ++x) {
      if (
        m[y][x] !== 0 &&
        (playZone[y + o.y] && playZone[y + o.y][x + o.x]) !== 0
      ) {
        return true;
      }
    }
  }
  return false;
}
function zoneSweep() {
  let countRow = 1;
  outer: for (let y = playZone.length - 1; y > 0; --y) {
    for (let x = 0; x < playZone[y].length; ++x) {
      if (playZone[y][x] === 0) {
        continue outer;
      }
    }
    const row = playZone.splice(y, 1)[0].fill(0);
    playZone.unshift(row);
    ++y;
    player.score += countRow * 10;
    countRow *= 2;
  }
}

function createMatrix(w, h) {
  const matrix = [];
  while (h--) {
    matrix.push(new Array(w).fill(0));
  }
  return matrix;
}

function generatePieces(type) {
  if (type === 'T') {
    return [
      [0, 0, 0],
      [1, 1, 1],
      [0, 1, 0],
    ];
  } else if (type === 'O') {
    return [
      [2, 2],
      [2, 2],
    ];
  } else if (type === 'L') {
    return [
      [3, 0, 0],
      [3, 0, 0],
      [3, 3, 0],
    ];
  } else if (type === 'Z') {
    return [
      [4, 4, 0],
      [0, 4, 4],
      [0, 0, 0],
    ];
  } else if (type === 'S') {
    return [
      [0, 5, 5],
      [5, 5, 0],
      [0, 0, 0],
    ];
  } else if (type === 'I') {
    return [
      [0, 6, 0, 0],
      [0, 6, 0, 0],
      [0, 6, 0, 0],
    ];
  } else if (type === 'J') {
    return [
      [0, 7, 0],
      [0, 7, 0],
      [7, 7, 0],
    ];
  }
}

function draw() {
  context.fillStyle = '#2f3538';
  context.fillRect(0, 0, canvas.width, canvas.height);
  drawMatrix(playZone, { x: 0, y: 0 });
  drawMatrix(player.matrix, player.pos);
}
function shuffle(array) {
  var currentIndex = array.length,
    temporaryValue,
    randomIndex;

  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

function drawMatrix(matrix, offset) {
  matrix.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value !== 0) {
        context.fillStyle = colors[value];
        context.fillRect(x + offset.x, y + offset.y, 1, 1);
      }
    });
  });
}

function merge(playZone, player) {
  player.matrix.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value !== 0) {
        playZone[y + player.pos.y][x + player.pos.x] = value;
      }
    });
  });
}

function playerDown() {
  player.pos.y++;
  if (collide(playZone, player)) {
    player.pos.y--;
    merge(playZone, player);
    resetPlayer();
    zoneSweep();
    updateScore();
    player.pos.y = 0;
  }
  dropCounter = 0;
}

function playerMove(dir) {
  player.pos.x += dir;
  if (collide(playZone, player)) {
    player.pos.x -= dir;
  }
}

function resetPlayer() {
  let pieces = 'ILJOTSZ';

  player.matrix = generatePieces(pieces[(pieces.length * Math.random()) | 0]);
  player.pos.y = 0;
  player.pos.x =
    ((playZone[0].length / 2) | 0) - ((player.matrix[0].length / 2) | 0);

  if (collide(playZone, player)) {
    playZone.forEach((row) => row.fill(0));
    player.score = 0;
    updateScore();
  }
}

function playerRotation(dir) {
  const pos = player.pos.x;
  let offset = 1;
  rotate(player.matrix, dir);
  while (collide(playZone, player)) {
    player.pos.x += offset;
    offset = -(offset + (offset > 0 ? 1 : -1));
    if (offset > player.matrix[0].length) {
      rotate(player.matrix, -dir);
      player.pos.x = pos;
      return;
    }
  }
}
function rotate(matrix, dir) {
  for (let y = 0; y < matrix.length; ++y) {
    for (let x = 0; x < y; ++x) {
      [matrix[x][y], matrix[y][x]] = [matrix[y][x], matrix[x][y]];
    }
  }

  if (dir > 0) {
    matrix.forEach((row) => row.reverse());
  } else {
    matrix.reverse();
  }
}

let dropCounter = 0;
let dropInterval = 1000;
let lastTime = 0;

function update(time = 0) {
  const deltaTime = time - lastTime;
  lastTime = time;
  dropCounter += deltaTime;
  if (dropCounter > dropInterval) {
    playerDown();
  }
  draw();
  requestAnimationFrame(update);
}

function updateScore() {
  document.getElementById('score').innerText = player.score;
}
const colors = [
  'b9605c',
  '#ec5565',
  '#f26e53',
  '#6798d0',
  '#ffc355',
  '#5bc1a6',
  '#e788b8',
  '#f5cdaa',
];

const playZone = createMatrix(12, 20);

const player = {
  pos: { x: 0, y: 0 },
  matrix: null,
  score: 0,
};

document.addEventListener('keydown', (event) => {
  if (event.keyCode === 37) {
    // player.pos.x--;
    playerMove(-1);
  } else if (event.keyCode === 39) {
    playerMove(1);
    // player.pos.x++;
  } else if (event.keyCode === 40) {
    playerDown();
  } else if (event.keyCode === 90) {
    playerRotation(-1);
  } else if (event.keyCode === 88) {
    playerRotation(1);
  }
});
left.addEventListener('click', () => {
  playerMove(-1);
});
right.addEventListener('click', () => {
  playerMove(1);
});
down.addEventListener('click', () => {
  playerDown();
});
rotateLeft.addEventListener('click', () => {
  playerRotation(-1);
});
rotateRight.addEventListener('click', () => {
  playerRotation(1);
});

resetPlayer();
update();
