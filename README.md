# Line Timer
A stylish web countdown timer based on svg digits & [vivus](https://maxwellito.github.io/vivus/). Can be used during twitch stream breaks or as a landing page for various events, to generate pre-release hype or for any other purpose you can think of. [Live demo](https://ryan-ash.github.io/line-timer/).

## OBS Setup
The easiest way to get started is to just use the [live demo](https://ryan-ash.github.io/line-timer/) page in a URL field of a browser source layer in OBS.
- Make a separate scene for "idle"
- Make a browser source layer, put it on top, leave it enabled in the "idle" scene only while disabling the other sources in that scene
- Set URL to `https://ryan-ash.github.io/line-timer/`
- Use your screen resolution as width & height parameters
- Custom CSS: `body { background-color: rgba(0, 0, 0, 1); margin: 0px auto; overflow: hidden; }`
- Check both "shutdown source when not visible" and "refresh browser when scene becomes active"

Now every time you need to take a break during stream just open the "idle" scene.

## Install Guide
To get the most out of Line Timer you need to clone this repo, replace the background images and edit a config file. The images are stored in `img/slider`, for now there should be exactly 5 of them (that will probably change in the future). All the settings can be found in `config.js`. You can change the links around the timer, set timer to be relative or to use a fixed date, setup a redirect on timer reaching zero and do other neat things, feel free to experiment both with the config and with the timer code itself.