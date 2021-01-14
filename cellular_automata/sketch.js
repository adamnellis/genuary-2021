
let iterate = true;

// let iterationFunction = gameOfLifeBinary;
let iterationFunction = gameOfLifeSmooth;

let currentState;
let nextState;
let numCells;

function setup() {
    createCanvas(800, 600);
    frameRate(15);
    pixelDensity(0.25);

    // Set up data structures
    loadPixels();
    const d = pixelDensity();
    const scaling = min(width, height);
    numCells = scaling * d;
    currentState = empty2dArray(numCells);
    nextState = empty2dArray(numCells);
    randomiseArray(currentState, randomZeroOrOne)
}

function empty2dArray(size) {
    return new Array(size).fill(0).map(() => new Array(size).fill(0));
}

function randomiseArray(array, randomFunction) {
    for (let y = 0; y < numCells; y++) {
        for (let x = 0; x < numCells; x++) {
            array[x][y] = randomFunction();
        }
    }
}

function randomZeroOrOne() {
    if (Math.random() < 0.5) {
        return 0;
    } else {
        return 1;
    }
}

// Conway's game of life rules
function gameOfLifeBinary(selfValue, neighbourSum) {
    if (selfValue === 1) {
        if (neighbourSum >= 2 && neighbourSum < 4) {
            return 1;
        }
        else {
            return 0;
        }
    }
    else {
        if (neighbourSum === 3) {
            return 1;
        }
        else {
            return 0;
        }
    }
}

// My attempt at a continuous-state version of Conway's game of life rules
function gameOfLifeSmooth(selfValue, neighbourSum) {
    let newValue;
    if (selfValue >= 0.5) {
        if (neighbourSum >= 2 && neighbourSum <= 3) {
            newValue = selfValue + neighbourSum / 8;
        }
        else {
            newValue = selfValue - neighbourSum / 8;
        }
    }
    else {
        if (neighbourSum > 2.5 && neighbourSum < 3.5) {
            newValue = selfValue + neighbourSum / 8;
        }
        else {
            newValue = selfValue - neighbourSum / 8;
        }
    }
    newValue = min(newValue, 1);
    newValue = max(newValue, 0);
    return newValue;
}

// Mod fucntion that works for negative numbers
function mod(x, n) {
    return ((x%n)+n)%n;
}

function keyPressed() {
    if (key === 'i') {
        iterate = !iterate;
    }
    else if(key === 'r') {
        randomiseArray(currentState, randomZeroOrOne)
    }
}

function draw() {
    if (!iterate) {
        return
    }
    console.log('iterate')

    // Iterate one step of the cellular automaton
    for (let y = 0; y < numCells; y++) {
        for (let x = 0; x < numCells; x++) {
            // Sum of 8 neighbours
            const neighbourSum = currentState[mod(x - 1, numCells)][y] + currentState[mod(x + 1, numCells)][y] +
                currentState[mod(x - 1, numCells)][mod(y - 1, numCells)] + currentState[x][mod(y - 1, numCells)] + currentState[mod(x + 1, numCells)][mod(y - 1, numCells)] +
                currentState[mod(x - 1, numCells)][mod(y + 1, numCells)] + currentState[x][mod(y + 1, numCells)] + currentState[mod(x + 1, numCells)][mod(y + 1, numCells)];
            nextState[x][y] = iterationFunction(currentState[x][y], neighbourSum)
        }
    }

    // Swap states
    const tempState = currentState;
    currentState = nextState;
    nextState = tempState;

    // Draw the current state to the screen
    loadPixels();
    const d = pixelDensity();

    // For each pixel
    for (let y = 0; y < numCells; y++) {
        for (let x = 0; x < numCells; x++) {

            // Choose a colour for this pixel
            const greyscale = 255 * currentState[x][y];
            let red = greyscale;
            let green = greyscale;
            let blue = greyscale;
            let alpha = 255;

            // Set this pixel to the chosen colour
            const pixelIndex = 4 * (y * width * d + x);
            pixels[pixelIndex] = red;
            pixels[pixelIndex + 1] = green;
            pixels[pixelIndex + 2] = blue;
            pixels[pixelIndex + 3] = alpha;
        }
    }

    updatePixels();
}
