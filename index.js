const gameGrid = document.getElementsByClassName('gameGrid')[0];

//I will make a 20*20 square grid
const width = 20;
const height = 20;
for(let i=0; i<width*height; i++) {
    const cell = document.createElement('div');
    gameGrid.appendChild(cell);
}

let enemyLocations = [
    21, 22, 23, 24, 25, 26, 27, 28, 29, 30,
    41, 42, 43, 44, 45, 46, 47, 48, 49, 50,
    61, 62, 63, 64, 65, 66, 67, 68, 69, 70,
    81, 82, 83, 84, 85, 86, 87, 88, 89, 90,
]

const cells = document.querySelectorAll('.gameGrid div')

const drawEnemies = function() {
    for(let j=0; j<enemyLocations.length; j++) {
        cells[enemyLocations[j]].classList.add('enemy');
    }
}
drawEnemies()

const undrawEnemies = function() {
    for(let j=0; j<enemyLocations.length; j++) {
        cells[enemyLocations[j]].classList.remove('enemy');
    }
}


let direction = 1; //right
const moveEnemies = function() {
    undrawEnemies()

    let atEdge = false;
    for(let k=0; k<enemyLocations.length; k++) {
        if(enemyLocations[k] % width === 0 || enemyLocations[k] % width === width-1) {
            atEdge = true;
            break;
        } 
    }

    if(atEdge) {
        direction *= -1;
        for(let k=0; k<enemyLocations.length; k++) {
            enemyLocations[k] += width;
            if(enemyLocations[k] >= 380) {
                drawEnemies()
                console.log("You lost!")
                clearInterval(enemiesMovementInterval)
            }
        }
    }
    
    
    for(let k=0; k<enemyLocations.length; k++) {
        enemyLocations[k] += direction;
    }
    
    drawEnemies()

    checkCollision()
}

enemiesMovementInterval = setInterval(moveEnemies, 1000);

let playerCell = 369;
const drawPlayer = function() {
    cells[playerCell].classList.add('player');
}
drawPlayer();

const undrawPlayer = function() {
    cells[playerCell].classList.remove('player');
}


const handleKeyPress = function(e) {
    if(e.key === 'ArrowRight') {
        undrawPlayer()
        if(playerCell % width !== width-1) playerCell += 1;
        drawPlayer()
        checkCollision()
    }
    if(e.key === 'ArrowLeft') {
        undrawPlayer()
        if(playerCell % width !== 0) playerCell -= 1;
        drawPlayer()
        checkCollision()
    }
    if(e.key === 'ArrowUp') {
        undrawPlayer()
        if(playerCell > 19) playerCell -= width;
        drawPlayer()
        checkCollision()
    }
    if(e.key === 'ArrowDown') {
        undrawPlayer()
        if(playerCell < 380) playerCell += width;
        drawPlayer() 
        checkCollision()
    }
    if(e.key === 'w') {
        laserCells.push(playerCell);
    }
}

document.addEventListener('keydown', handleKeyPress);


const checkCollision = function() {
    for(let k=0; k<enemyLocations.length; k++) {
        if(cells[enemyLocations[k]].classList.contains('player') && cells[enemyLocations[k]].classList.contains('enemy') ) {
            clearInterval(enemiesMovementInterval)
            console.log("You lost")         
        }
    }
}

const drawLasers = function() {
    for(let k=0; k<laserCells.length; k++) {
        cells[laserCells[k]].classList.add('laser');
    }
}

const undrawLasers = function() {
    for(let k=0; k<laserCells.length; k++) {
        cells[laserCells[k]].classList.remove('laser');
    }
}

let laserCells = []; //Inititally, there are no lasers in any cell
const moveLasers = function() {
    undrawLasers()

    for(let k=0; k<laserCells.length; k++) {
        laserCells[k] -= width;

        if(laserCells[k] <= 19) {
            laserCells.splice(k, 1);
        }
    }

    drawLasers()
    for(let k =0; k<laserCells.length; k++) {
        if(cells[laserCells[k]].classList.contains('enemy')) {
            //this laser collided with enemy
            cells[laserCells[k]].classList.remove('enemy')
            cells[laserCells[k]].classList.remove('laser')
            enemyLocations.splice(enemyLocations.indexOf(laserCells[k]), 1);
            laserCells.splice(k, 1);

            if(enemyLocations.length === 0) {
                console.log("You won!");
                clearInterval(enemiesMovementInterval);
            }
        }
    }
    
}

laserMovementInterval = setInterval(moveLasers, 100);


