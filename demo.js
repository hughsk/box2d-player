/**
 * Setup (mostly box2d)
 */
var Box2D = require('box2dweb-commonjs').Box2D
var vkey = require('vkey')
var raf = require('raf')

var b2BodyDef = Box2D.Dynamics.b2BodyDef
var b2Body = Box2D.Dynamics.b2Body
var b2FixtureDef = Box2D.Dynamics.b2FixtureDef
var b2World = Box2D.Dynamics.b2World
var b2CircleShape = Box2D.Collision.Shapes.b2CircleShape
var b2DebugDraw = Box2D.Dynamics.b2DebugDraw

var canvas = document.createElement('canvas')
var ctx = canvas.getContext('2d')

canvas.width = 500
canvas.height = 300

ctx.fillStyle = '#f00'
ctx.fillRect(0, 0, 500, 300)

document.body.appendChild(canvas)

var jumping = false
var debugDraw = new b2DebugDraw
var gravity = { x: 0, y: 9.8 }
var world = new b2World(gravity, true)

debugDraw.SetDrawScale(18)
debugDraw.SetSprite(ctx)
debugDraw.SetFlags(
    b2DebugDraw.e_shapeBit
  | b2DebugDraw.e_jointBit
  | b2DebugDraw.e_centerOfMassBit
  | b2DebugDraw.e_controllerBit
  | b2DebugDraw.e_pairBit
)
world.SetDebugDraw(debugDraw)

/**
 * Player Setup
 */
var player = require('./')(Box2D)(world, {
  position: { x: 10, y: 0 }
})

/**
 * Loop
 */
raf(canvas).on('data', function(dt) {
  player.body.m_linearVelocity.x = moving.x
  if (jumping) player.jump()

  world.Step(dt / 1000, 8, 3)
  world.DrawDebugData()
})

/**
 * "terrain"
 */
for (var i = 0; i < 5; i += 1) {
  var def = new b2BodyDef
  def.position = { x: i * 5 + 5, y: 15 }
  def.type = b2Body.b2_staticBody
  var shape = new b2CircleShape(i === 2 ? 4 : i % 2 ? 2 : 1)
  var fixturedef = new b2FixtureDef
  fixturedef.shape = shape
  world.CreateBody(def).CreateFixture(fixturedef)
}

/**
 * Input
 */
var moving = { x: 0, y: 0 }
function keydown(key) {
  switch (key) {
    case 'A': case '<left>':  moving.x = -5; break
    case 'D': case '<right>': moving.x = +5; break
    case 'W': case '<up>':   jumping = true; break
  }
}
function keyup(key) {
  switch (key) {
    case 'A': case '<left>':  moving.x = 0; break
    case 'D': case '<right>': moving.x = 0; break
    case 'W': case '<up>': jumping = false; break
  }
}

document.body.addEventListener('keydown', function(e) {
  keydown(vkey[e.keyCode])
}, false)
document.body.addEventListener('keyup', function(e) {
  keyup(vkey[e.keyCode])
}, false)
