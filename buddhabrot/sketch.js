
const numSamplesPerFrame = 100_000;
let maxIterations1 = 50;
let maxIterations2 = 500;
let maxIterations3 = 5000;
let pathsVisited1 = []
let pathsVisited2 = []
let pathsVisited3 = []

function setup() {
    createCanvas(800, 600);
    frameRate(15);
    pixelDensity(1);

    // Set up data structures
    loadPixels();
    const d = pixelDensity();
    const scaling = max(width, height);
    pathsVisited1 = empty2dArray(scaling*d);
    pathsVisited2 = empty2dArray(scaling*d);
    pathsVisited3 = empty2dArray(scaling*d);
}

function empty2dArray(size) {
    return new Array(size).fill(0).map(() => new Array(size).fill(0));
}

function max2dArray(arr) {
    return Math.max.apply(null, arr.map(function(row){ return Math.max.apply(Math, row); }));
}

function draw() {
    console.log('draw')

    const iterates = [];
    for (let i = 0; i <= maxIterations3; i++) {
        iterates.push([0, 0]);
    }

    // Load the pixel array, so we can modify it
    loadPixels();
    const d = pixelDensity();

    const scaling = max(width, height);

    // Generate some random samples
    for (let sampleNum = 0; sampleNum < numSamplesPerFrame; sampleNum++) {
        let c_re = Math.random() * 4 - 2;
        let c_im = Math.random() * 4 - 2;
        let z_re = 0;
        let z_im = 0;


        // Iterate Mandelbrot function
        let iterationNumber;
        for (iterationNumber = 0;
             iterationNumber <= maxIterations3 && (z_re*z_re + z_im*z_im) < 4;
             iterationNumber++) {
            // z = z^2 + c
            // z = (z_re + i*z_im)*(z_re + i*z_im) + (c_re + i*c_im)
            // z = (z_re*z_re - z_im*z_im + c_re) + i*(2*z_re*z_im + c_im)
            const z_re_new = z_re*z_re - z_im*z_im + c_re;
            const z_im_new = 2*z_re*z_im + c_im;
            z_re = z_re_new;
            z_im = z_im_new;

            iterates[iterationNumber][0] = z_re;
            iterates[iterationNumber][1] = z_im;
        }

        // If this iterate escaped, then save its path
        if (iterationNumber !== maxIterations3) {
            for (let i = 0; i < iterationNumber-1; i++) {
                const xd = Math.floor(scaling * d * (iterates[i][0] + 2) / 4);
                const yd = Math.floor(scaling * d * (iterates[i][1] + 2) / 4);

                // Save to a different channel depending on the speed of escape
                if (iterationNumber < maxIterations1) {
                    pathsVisited1[yd][xd] += 1;
                }
                else if (iterationNumber < maxIterations2) {
                    pathsVisited2[yd][xd] += 1;
                }
                else {
                    pathsVisited3[yd][xd] += 1;
                }
            }
        }
    }

    // Paint the visited paths onto the screen pixels
    const maxPathsPerPixel1 = max2dArray(pathsVisited1);
    const maxPathsPerPixel2 = max2dArray(pathsVisited2);
    const maxPathsPerPixel3 = max2dArray(pathsVisited3);

    // For each pixel
    for (let yd = 0; yd < scaling*d; yd++) {
        for (let xd = 0; xd < scaling * d; xd++) {

            // Choose a colour for this pixel
            let red = 0;
            let green = 0;
            let blue = 0;
            let alpha = 255;
            if (maxPathsPerPixel3 > 0) {
                red = 255 * pathsVisited3[xd][yd] / maxPathsPerPixel3;
            }
            if (maxPathsPerPixel2 > 0) {
                green = 255 * pathsVisited2[xd][yd] / maxPathsPerPixel2;
            }
            if (maxPathsPerPixel1 > 0) {
                blue = 255 * pathsVisited1[xd][yd] / maxPathsPerPixel1;
            }

            // Set this pixel to the chosen colour
            const pixelIndex = 4 * (yd * width * d + xd);
            pixels[pixelIndex] = red;
            pixels[pixelIndex + 1] = green;
            pixels[pixelIndex + 2] = blue;
            pixels[pixelIndex + 3] = alpha;
        }
    }

    updatePixels();
}
