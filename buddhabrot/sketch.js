
const numSamplesPerFrame = 1_000_000;
let maxIterations = 100;
const pathsVisited = []

function setup() {
    createCanvas(800, 600);
    frameRate(15);
    pixelDensity(1);

    // Set up data structures
    loadPixels();
    const d = pixelDensity();
    const scaling = max(width, height);
    for (let yd = 0; yd < scaling*d; yd++) {
        const row = []
        for (let xd = 0; xd < scaling*d; xd++) {
            row.push(0)
        }
        pathsVisited.push(row)
    }
}

function draw() {
    console.log('draw')

    const iterates = [];
    for (let i = 0; i <= maxIterations; i++) {
        iterates.push([0, 0]);
    }

    // Load the pixel array, so we can modify it
    loadPixels();
    const d = pixelDensity();

    const scaling = max(width, height);

    // Generate some random samples
    for (let sampleNum = 0; sampleNum < numSamplesPerFrame; sampleNum++) {
        // let c_re = Math.random() * 4 - 2;
        // let c_im = Math.random() * 4 - 2;
        // let z_re = 0;
        // let z_im = 0;

        let c_re = Math.random() * 4 - 2;
        let c_im = Math.random() * 4 - 2;
        let z_re = 0;
        let z_im = 0;


        // Iterate Mandelbrot function
        let iterationNumber;
        for (iterationNumber = 0;
             iterationNumber <= maxIterations && (z_re*z_re + z_im*z_im) < 4;
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
        if (iterationNumber === maxIterations) {
            for (let i = 0; i < iterationNumber-1; i++) {
                const xd = Math.floor(scaling * d * (iterates[i][0] + 2) / 4);
                const yd = Math.floor(scaling * d * (iterates[i][1] + 2) / 4);

                pathsVisited[yd][xd] += 1;
            }
        }
    }

    // Paint the visited paths onto the screen pixels
    const maxPathsPerPixel = Math.max.apply(null, pathsVisited.map(function(row){ return Math.max.apply(Math, row); }))

    // For each pixel
    for (let yd = 0; yd < scaling*d; yd++) {
        for (let xd = 0; xd < scaling * d; xd++) {

            // Choose a colour for this pixel
            const greyscale = pathsVisited[xd][yd] / maxPathsPerPixel;
            let red = 0;
            let green = 0;
            let blue = 0;
            let alpha = 255;
            if (pathsVisited[xd][yd] > 0) {
                red = 255 * greyscale;
                green = 255 * greyscale;
                blue = 255 * greyscale;
                // alpha = 255 * greyscale;
            }
            // if (pathsVisited[xd][yd] > 0) {
            //     if (pathsVisited[xd][yd] > 50) {
            //         red = 255 * greyscale;
            //     }
            //     else {
            //         red = 255 * greyscale;
            //         blue = 255 * greyscale;
            //     }
            // }

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
