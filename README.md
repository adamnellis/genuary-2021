# Genuary 2021

https://genuary2021.github.io/


## Prompts completed

* 1st Jan - Triple nested loop

"Triple nested loop" makes me think of escape time fractals such as the Mandelbrot fractal, 
as they loop over the x coordinates, the y coordinates, then the iterations of the equation.

I didn't have time to implement an interface for zooming / panning / etc, 
so I added a dropdown select box with a few pre-set values for interesting Mandelbrot and Julia fractals.

* 2nd Jan - Rule 30 (elementary cellular automaton)

A straightforward implementation of a cellular automaton, using rule 30.


## Extras (not prompts, but extensions to previous prompts)

* 1st Jan - Extra fractal

Extended the Mandelbrot / Julia fractal from 1st Jan by adding animations.

The whole space of Mandelbrot and Julia fractals is 4-dimensional, 
and we render a 2-dimensional rectangle within this space.
So lots of different animations are possible, corresponding to all the 
different ways of moving a 2d rectangle through a 4d area.
I've hardcoded a small number of different animations.

* Buddhabrot

An implementation of the famous Buddhabrot fractal, 
which is a different method of using the Mandelbrot equation to generate a fractal.
