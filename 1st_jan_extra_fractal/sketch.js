
let functionSelector;
let selectionChanged = true;
let animating = false;
let a = 0;

const patterns = {
    'Mandelbrot': (x, y, width, height, scaling, a) => { return {
        z_re: 0,
        z_im: 0,
        c_re: x / (scaling / 4) - 2.5,
        c_im: (height - y) / (scaling / 4) - 1.5,
        maxIterations: 50,
        keep_animating: false,
    }},
    'c_re and z_re snapshot': (x, y, width, height, scaling, a) => {
        let c_re_start = x / (scaling / 4) - 2.5;
        c_re_start = (c_re_start * 1.5) - 1;
        a = 0.5
        return {
            z_re: c_re_start * a,
            z_im: 0,
            c_re: c_re_start * (1 - a),
            c_im: (height - y) / (scaling / 4) - 1.5,
            maxIterations: 50,
            keep_animating: false,
        }},
    'c_re and z_re animation': (x, y, width, height, scaling, a) => {
        let c_re_start = x / (scaling / 4) - 2.5;
        c_re_start = (c_re_start * 1.5) - 1;
        return {
            z_re: c_re_start * a,
            z_im: 0,
            c_re: c_re_start * (1 - a),
            c_im: (height - y) / (scaling / 4) - 1.5,
            maxIterations: 50,
            keep_animating: (a < 1),
        }},
    'c_im and z_im animation': (x, y, width, height, scaling, a) => {
        let c_im_start = (height - y) / (scaling / 4) - 1.5;
        c_im_start = (c_im_start * 1.5);
        return {
            z_re: 0,
            z_im: c_im_start * a,
            c_re: x / (scaling / 4) - 2.5,
            c_im: c_im_start * (1 - a),
            maxIterations: 50,
            keep_animating: a < 1,
        }},
    'animation Mandelbrot to Julia(0, 0)': (x, y, width, height, scaling, a) => {
        let c_re_start = x / (scaling / 4) - 2.5;
        c_re_start = (c_re_start * 1.5) - 1;
        let c_im_start = (height - y) / (scaling / 4) - 1.5;
        c_im_start = (c_im_start * 1.5);
        return {
            z_re: c_re_start * a,
            z_im: c_im_start * a,
            c_re: c_re_start * (1 - a),
            c_im: c_im_start * (1 - a),
            maxIterations: 50,
            keep_animating: a < 1,
        }},
    'animation Mandelbrot to Julia (-0.79, 0.15)': (x, y, width, height, scaling, a) => {
        let c_re_start = x / (scaling / 4) - 2.5;
        c_re_start = (c_re_start * 1.5) + 1;
        let c_im_start = (height - y) / (scaling / 4) - 1.5;
        c_im_start = (c_im_start * 1.5);
        return {
            z_re: c_re_start * a,
            z_im: c_im_start * a,
            c_re: c_re_start * (1 - a) - 0.79,
            c_im: c_im_start * (1 - a) + 0.15,
            maxIterations: 100,
            keep_animating: a < 1,
        }},
}

function setup() {
    createCanvas(800, 600);
    frameRate(15);
    pixelDensity(1);

    functionSelector = createSelect();
    functionSelector.position(10, 10);
    for (let patternName in patterns) {
        functionSelector.option(patternName);
    }
    functionSelector.changed(() => { selectionChanged = true; });
}

function draw() {
    // Only redraw when user selects a new pattern, or we are animating
    if (!(selectionChanged || animating)) {
        a = 0;
        return;
    }
    else if (animating) {
        a += 0.01;
    }
    selectionChanged = false;

    // Load the pixel array, so we can modify it
    loadPixels();
    const d = pixelDensity();

    const scaling = max(width, height);

    // Loop through all pixels in the image
    for (let yd = 0; yd < height*d; yd++) {
        for (let xd = 0; xd < width*d; xd++) {
            const x = xd / d;
            const y = yd / d;

            // Convert pixels to Mandelbrot coordinates, according to the selected pattern
            const selectedFunction = patterns[functionSelector.value()];
            let {z_re, z_im, c_re, c_im, maxIterations, keep_animating} = selectedFunction(x, y, width, height, scaling, a)
            animating = keep_animating;

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
            }

            // Smooth colouring
            // https://en.wikipedia.org/wiki/Plotting_algorithms_for_the_Mandelbrot_set#Continuous_(smooth)_coloring
            if (iterationNumber < maxIterations) {
                const log_zn = log(z_re*z_re + z_im*z_im) / 2;
                const nu = log(log_zn / log(2)) / log(2);
                iterationNumber = iterationNumber + 1 - nu;
            }

            // Choose a colour for this pixel
            const red = 255 * (iterationNumber / maxIterations);
            const green = 0;
            const blue = 255 * (iterationNumber / maxIterations);
            const alpha = 255;


            // Set this pixel to the chosen colour
            const pixelIndex = 4 * (yd * width * d + xd);
            pixels[pixelIndex] = red;
            pixels[pixelIndex + 1] = green;
            pixels[pixelIndex + 2] = blue;
            pixels[pixelIndex + 3] = alpha;
        }
    }

    // Update the pixel array on the screen
    updatePixels();
}
