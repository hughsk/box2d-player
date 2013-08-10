# box2d-player #

A small module that handles creating a player that can jump with Box2dweb.
Handy for prototyping other parts of a physics-based game - if you're
developing your own thing, you'll have better results writing something from
scratch!

## Installation ##

``` bash
npm install box2d-player box2dweb-commonjs
```

## Usage ##

### `b2Player = require('box2d-player)(Box2D)` ###

Pass `box2d-player` your `Box2D` object and get back a player class in return.

``` javascript
var b2Player = require('box2d-player')(require('box2dweb-commonjs').Box2D)
```

### `player = b2Player(world[, options])` ###

Creates a player instance, with its body attached to the `world`. Takes the
following options:

* `data`: the user data to attach to the body. Defaults to `null`
* `position`: the position to create the player at. Defaults to `{x:0,y:0}`.
* `jumpHeight`: the impulse to apply upwards when jumping. Defaults to `10`.
* `body`: a body you can use for the player - a default body will be created
   if not supplied.
* `fixture`: a fixture you can use for the player - otherwise, a circle will be
  created for you.

### `player.jump()` ###

Triggers a jump provided there's a physical body below the player and it's not
moving upwards. Returns `true` if successful.

Right now you'll still need to control horizontal motion manually - you can do
this by changing the value of the `player.body.m_linearVelocity.x` property.
