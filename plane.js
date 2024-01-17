let world;

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

let groundBody = new b2BodyDef;
let groundFix = new b2FixtureDef;

function createGround(){
    groundFix.friction = 0.5;

    groundBody.type = b2Body.b2_staticBody;
    groundBody.position.x = 0;
    groundBody.position.y = 40;
    groundFix.shape = new b2PolygonShape;
    groundFix.shape.SetAsBox(200, 3);
    world.CreateBody(groundBody).CreateFixture(groundFix);
}

let planeBody = new b2BodyDef;
let planeFix = new b2FixtureDef;
let plane;

function createPlane(){
    planeFix.density = 120.0 / 10; //densité réel = 120.0 pcq 1800 kg
    planeFix.friction = groundFix.friction;
    planeFix.restitution = 0.2;

    planeBody.type = b2Body.b2_dynamicBody;
    planeFix.shape = new b2PolygonShape;
    planeFix.shape.SetAsBox(7.5 / 10, 2 / 10); //taille réelle: L = 7.5 et l = 2
    planeBody.position.x = 2;
    planeBody.position.y = 37;
    plane = world.CreateBody(planeBody);
    plane.CreateFixture(planeFix);
}

//setup debug draw
var debugDraw = new b2DebugDraw();		
debugDraw.SetSprite(document.getElementById("canvas").getContext("2d"));		
debugDraw.SetDrawScale(30.0);
debugDraw.SetFillAlpha(0.3);		
debugDraw.SetLineThickness(1.0);		
debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);		
world.SetDebugDraw(debugDraw);

createGround();
createPlane();
window.requestAnimationFrame(update);



let key = "none";
let liftForce = 0;
let enginePower = 0;
let fps = 60;
let velocityX = plane.GetLinearVelocity().x;
let planeAngle = 0;
let motorPosition;
let wingsPosition;
let enginePowerHUD = document.querySelector(".power");
let altituderHUD = document.querySelector(".alt");


document.addEventListener('keydown', function(event) {
    key = event.key;
});

document.addEventListener('keyup', function() {
    key = "none";
});

function move(enginePower, where){
    plane.ApplyForce(new b2Vec2(enginePower * 80, 0), where);
}

function flight(where){
    plane.ApplyForce(new b2Vec2(0, -liftForce), where);
}


function update() {
    planeAngle = plane.GetAngle();
    velocityX = plane.GetLinearVelocity().x;
    liftForce = ((1.293 * Math.pow(velocityX, 2)) / 2) * (22 / 10) * (0.3 * Math.cos(planeAngle));
    motorPosition = new b2Vec2(plane.GetPosition().x + (7.5 / 10), plane.GetPosition().y);
    wingsPosition = new b2Vec2(plane.GetPosition().x, plane.GetPosition().y);
    enginePowerHUD.innerText = Math.round(enginePower * 80);
    altituderHUD.innerText = -Math.round(plane.GetLinearVelocity().y);

    /*adjusted_force_vector = Math2D.rotate_point(force_vector, plane_angle, {x: 0, y: 0})
    plane.ApplyForce(adjusted_force_vector, plane.GetWorldCenter())*/

    if (key == "ArrowLeft") {
        enginePower -= 1/fps;
    }
    if (key == "ArrowRight") {
        enginePower += 1/fps;
    }

    move(enginePower, motorPosition);
    flight(wingsPosition);

    console.log("power: " + enginePower * 80);
    console.log("velocityX: " + velocityX);
    console.log("liftForce: " + liftForce);
    console.log("gravity: " + 10 * planeFix.density);

    world.Step(
        1 / fps,   //frame-rate
        10,       //velocity iterations
        10        //position iterations
    );
    world.DrawDebugData();
    world.ClearForces();
    window.requestAnimationFrame(update);
};