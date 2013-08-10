var EventEmitter = require('events').EventEmitter
  , inherits = require('inherits')

module.exports = wrapper

function wrapper(Box2D) {
  var b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape
  var b2CircleShape = Box2D.Collision.Shapes.b2CircleShape
  var b2FixtureDef = Box2D.Dynamics.b2FixtureDef
  var b2BodyDef = Box2D.Dynamics.b2BodyDef
  var b2Vec2 = Box2D.Common.Math.b2Vec2
  var b2Body = Box2D.Dynamics.b2Body

  function b2Player(world, options) {
    if (!(this instanceof b2Player)) return new b2Player(world, options)
    require('box2d-events')(Box2D, world)
    options = options || {}

    var self = this
    EventEmitter.call(this)

    this.world = world
    this.data = options.data || null
    this.position = options.position || new b2Vec2(0, 0)
    this.jumpHeight = options.jumpHeight || 10

    this.body = options.body || this.defaultBody()
    this.fixture = options.fixture || this.defaultFixture()

    this.canjump = 0
    this.sensors = options.sensors || {}
    this.sensors.jump = this.sensors.jump || this.createSensor([
        [-0.5, 0.2]
      , [+0.5, 0.2]
      , [+0.5, 0.8]
      , [-0.5, 0.8]
    ])
    this.sensors.jump.on('begin', function() {
      self.canjump += 1
    })
    this.sensors.jump.on('end', function() {
      self.canjump -= 1
    })
  }
  inherits(b2Player, EventEmitter)

  b2Player.prototype.defaultBody = function() {
    var def = new b2BodyDef
    def.position = this.position
    def.type = b2Body.b2_dynamicBody
    def.userData = this.data
    def.fixedRotation = true

    return this.world.CreateBody(def)
  }

  b2Player.prototype.defaultFixture = function() {
    var fixdef = new b2FixtureDef
    fixdef.shape = new b2CircleShape(0.5)
    return this.body.CreateFixture(fixdef)
  }

  var tempvec = new b2Vec2
  b2Player.prototype.jump = function() {
    var jumping = this.canjump && this.body.m_linearVelocity.y >= 0
    if (jumping) {
      tempvec.x = 0
      tempvec.y = -this.jumpHeight
      this.body.ApplyImpulse(tempvec, this.body.GetWorldCenter())
    }
    return jumping
  }

  b2Player.prototype.createSensor = function(verts) {
    var shape = new b2PolygonShape
    var fixturedef = new b2FixtureDef

    for (var i = 0; i < verts.length; i += 1) {
      verts[i] = new b2Vec2(verts[i][0], verts[i][1])
    }
    fixturedef.isSensor = true
    fixturedef.shape = shape
    fixturedef.shape.SetAsArray(verts)

    // using box2d-events here to avoid
    // interfering with other modules (mostly)
    return (this.world.__events).fixture(
      this.body.CreateFixture(fixturedef)
    )
  }

  return b2Player
}
