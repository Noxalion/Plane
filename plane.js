var world;

let plane;

const   b2Vec2 = Box2D.Common.Math.b2Vec2
    	,	b2BodyDef = Box2D.Dynamics.b2BodyDef
    	,	b2Body = Box2D.Dynamics.b2Body
    	,	b2FixtureDef = Box2D.Dynamics.b2FixtureDef
    	,	b2Fixture = Box2D.Dynamics.b2Fixture
    	,	b2World = Box2D.Dynamics.b2World
    	,	b2MassData = Box2D.Collision.Shapes.b2MassData
    	,	b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape
    	,	b2CircleShape = Box2D.Collision.Shapes.b2CircleShape
    	,	b2DebugDraw = Box2D.Dynamics.b2DebugDraw;
    
world = new b2World(
    new b2Vec2(0, 10),    //gravity
    true                 //allow sleep
);

var fixDef = new b2FixtureDef;
fixDef.density = 1.0;
fixDef.friction = 0.9;
fixDef.restitution = 0.2;

var bodyDef = new b2BodyDef;
//create ground
bodyDef.type = b2Body.b2_staticBody;
bodyDef.position.x = 0;
bodyDef.position.y = 35;
fixDef.shape = new b2PolygonShape;
fixDef.shape.SetAsBox(200, 0.5);
world.CreateBody(bodyDef).CreateFixture(fixDef);

//create some objects
bodyDef.type = b2Body.b2_dynamicBody;
fixDef.shape = new b2PolygonShape;
fixDef.shape.SetAsBox(0.5, 0.5);
bodyDef.position.x = 5;
bodyDef.position.y = 34;
plane = world.CreateBody(bodyDef);
plane.CreateFixture(fixDef);

//setup debug draw
var debugDraw = new b2DebugDraw();		
debugDraw.SetSprite(document.getElementById("canvas").getContext("2d"));		
debugDraw.SetDrawScale(30.0);		
debugDraw.SetFillAlpha(0.3);		
debugDraw.SetLineThickness(1.0);		
debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);		
world.SetDebugDraw(debugDraw);

//window.setInterval(update, 1000 / 60);
window.requestAnimationFrame(update);


document.addEventListener('keydown', function(event) {
    const key = event.key; // "ArrowRight", "ArrowLeft", "ArrowUp", or "ArrowDown"

    switch (key) {
        case "ArrowLeft":
            plane.ApplyForce(new b2Vec2(-100, 0), new b2Vec2(plane.GetPosition().x, plane.GetPosition().y));
            // Left pressed
            break;
        case "ArrowRight":
            plane.ApplyForce(new b2Vec2(100, 0), new b2Vec2(plane.GetPosition().x, plane.GetPosition().y));
            // Right pressed
            break;
        case "ArrowUp":
            // Up pressed
            break;
        case "ArrowDown":
            // Down pressed
            break;
    }
});

function update() {
    //let speed = Math.sqrt(Math.pow(plane.GetLinearVelocity().x, 2) + Math.pow(plane.GetLinearVelocity().y, 2));
    let velocityX = plane.GetLinearVelocity().x;
    //console.log(plane.GetLinearVelocity().x);
    if (velocityX > 10 || velocityX < -10) {
        plane.ApplyImpulse(new b2Vec2(0, -2), new b2Vec2(plane.GetPosition().x, plane.GetPosition().y));
    }
    
    world.Step(
        1 / 60,   //frame-rate
        10,       //velocity iterations
        10        //position iterations
    );
    world.DrawDebugData();
    world.ClearForces();
    window.requestAnimationFrame(update);
};