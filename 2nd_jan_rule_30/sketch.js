
const numSteps = 100;
let currentStep = -1;
let currentTape = '';
let previousTapes = [];

const rule30 = {
    '000': '0',
    '001': '1',
    '010': '1',
    '011': '1',
    '100': '1',
    '101': '0',
    '110': '0',
    '111': '0',
}

function setup() {
    createCanvas(800, 600);
    frameRate(15);
}

function draw() {
    // Only redraw until we have finished
    if (currentStep >= numSteps) {
        return;
    }
    currentStep++;

    // Initialise tape with a single 1 in the middle
    if (currentStep === 0) {
        currentTape = '1';
        previousTapes = [];
    }
    // Iterate to next state of tape
    else {
        const oldTape = '00' + currentTape + '00';
        let newTape = '';
        for (let tapePos = 0; tapePos <= currentStep * 2; tapePos++) {
            const neighbourhood = oldTape.slice(tapePos, tapePos + 3);
            newTape += rule30[neighbourhood];
        }
        currentTape = newTape;
    }

    // Pad tape with zeros, to make all steps the same length
    const numZeros = (numSteps - currentStep);
    const paddedCurrentTape = '0'.repeat(numZeros) + currentTape + '0'.repeat(numZeros);

    // Work out size and position of squares to draw
    const availableWidth = width; // maybe width / 2
    const availableHeight = height; // maybe height * 0.8 ?
    const numSquaresAcross = paddedCurrentTape.length;
    const numSquaresDown = numSteps + 1;
    const maxSquareWidth = availableWidth / numSquaresAcross;
    const maxSquareHeight = availableHeight / numSquaresDown;
    const squareSize = min(maxSquareWidth, maxSquareHeight);

    // Draw squares for this step
    stroke(150);
    for (let i = 0; i < paddedCurrentTape.length; i++) {
        if (paddedCurrentTape[i] === '1') {
            fill(0);
        }
        else {
            fill(255);
        }
        square(i * squareSize, currentStep * squareSize, squareSize);
    }
}
