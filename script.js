const debug = false;
let tempMatrix = new THREE.Matrix4();
let tempVector = new THREE.Vector3();
let camera, scene, renderer, container;
let conLeft, conRight, xrConLeft, xrConRight;
let light, testCube;

/* For reference -
** left and right refer to the chicken's left and the chicken's right, not your left and right
*/

const Colours = {
  black: 0x000000,
  blue: 0xedf7fc,
  green: 0x08BA0B,
  grey: 0xd3d3d3,
  orange: 0xdd7536,
  red: 0xb33938,
  white: 0xd8d3cf,
};

let body, chicken, legs, wrap, ChickenBody;

init();
requestSession();

window.addEventListener("unload", closeSession);

function init() {
  container = document.createElement('div');
  document.body.appendChild(container);

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 5;

  light = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
  scene.add(light);

  // conLeft = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.1, 0.1), new THREE.MeshLambertMaterial({ color: 0xff0000 }));
  // conRight = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.1, 0.1), new THREE.MeshLambertMaterial({ color: 0x0000ff }));
  // scene.add(conLeft, conRight);

  // testCube = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.3, 0.3), new THREE.MeshLambertMaterial({ color: 0xff0000 }));
  // testCube.position.z -= 1;
  // testCube.position.y += 0.5;
  // scene.add(testCube);

  renderer = new THREE.WebGLRenderer({ alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
  renderer.xr.enabled = true;

  ChickenBody = function() {
    /*
    ** Define Groups
    ** Allows collections of meshes to be transformed independently
    */
    this.wrap = new THREE.Group();
    this.wrap.name = "wrap";
    this.chicken = new THREE.Group();
    this.chicken.name = "chicken";
    this.legs = new THREE.Group();

    //create body
    var bodyGeometry = new THREE.BoxBufferGeometry(60, 100, 60);
    var bodyMaterial = new THREE.MeshToonMaterial({ color: Colours.white });
    var chickenBody = new THREE.Mesh(bodyGeometry, bodyMaterial);
    chickenBody.castShadow = true;
    this.chicken.add(chickenBody);

    //create wings
    var wingGeometry = new THREE.BoxBufferGeometry(20,30,60);
    var leftWing = new THREE.Mesh(wingGeometry, bodyMaterial);
    leftWing.position.set(40, -30, -20);
    leftWing.castShadow = true;
    this.chicken.add(leftWing);

    var rightWing = new THREE.Mesh(wingGeometry, bodyMaterial);
    rightWing.position.set(-40, -30, -20);
    rightWing.castShadow = true;
    this.chicken.add(rightWing);

    //create tail
    var tailGeometry = new THREE.BoxBufferGeometry(60,40,45);
    var tail = new THREE.Mesh(tailGeometry, bodyMaterial);
    tail.position.set(0, -30, -45);
    tail.castShadow = true;
    this.chicken.add(tail);

    var tailFluffGeom = new THREE.BoxBufferGeometry(40,16,15);
    var tailFluff = new THREE.Mesh(tailFluffGeom, bodyMaterial);
    tailFluff.position.set(0, -20, -70);
    tailFluff.castShadow = true;
    this.chicken.add(tailFluff);

    //create eyes
    var eyeGeometry = new THREE.BoxBufferGeometry(7,10,8);
    var eyeMaterial = new THREE.MeshPhongMaterial({ color: Colours. black, shininess:40, specular: 0xffffff });

    var leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    leftEye.position.set(27,30,10);
    this.chicken.add(leftEye);

    var rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    rightEye.position.set(-27,30,10);
    this.chicken.add(rightEye);

    //create legs
    var legGeometry = new THREE.BoxBufferGeometry(10,40,10);
    var legMaterial = new THREE.MeshToonMaterial({ color: Colours. orange });
    var leftLeg = new THREE.Mesh(legGeometry, legMaterial);
    leftLeg.position.set(36, -60, -10);
    leftLeg.castShadow = true;
    this.legs.add(leftLeg);

    var rightLeg = new THREE.Mesh(legGeometry, legMaterial);
    rightLeg.position.set(-36, -60, -10);
    rightLeg.castShadow = true;
    this.legs.add(rightLeg);

    var footGeometry = new THREE.BoxBufferGeometry(28, 8, 28);
    var leftFoot = new THREE.Mesh(footGeometry, legMaterial);
    leftFoot.position.set(36,-78,-12);
    leftFoot.castShadow = true;
    leftFoot.receiveShadow = true;
    this.legs.add(leftFoot);

    var rightFoot = new THREE.Mesh(footGeometry, legMaterial)
    rightFoot.position.set(-36,-78,-12);
    rightFoot.castShadow = true;
    rightFoot.receiveShadow = true;
    this.legs.add(rightFoot);

    var toeGeometry = new THREE.BoxBufferGeometry(9, 8, 14);
    //left foot, left toe
    var lFlT = new THREE.Mesh(toeGeometry, legMaterial);
    lFlT.position.set(45.5, -78, 8);
    lFlT.castShadow = true;
    lFlT.receiveShadow = true;
    this.legs.add(lFlT);

    //left foot, right toe
    var lFrT = new THREE.Mesh(toeGeometry, legMaterial);
    lFrT.position.set(26.5, -78, 8);
    lFrT.castShadow = true;
    lFrT.receiveShadow = true;
    this.legs.add(lFrT);

      //left foot, right toe
    var rFlT = new THREE.Mesh(toeGeometry, legMaterial);
    rFlT.position.set(-26.5, -78, 8);
    rFlT.castShadow = true;
    rFlT.receiveShadow = true;
    this.legs.add(rFlT);

    //right foot, right toe
    var rFrT = new THREE.Mesh(toeGeometry, legMaterial);
    rFrT.position.set(-45.5, -78, 8);
    rFrT.castShadow = true;
    rFrT.receiveShadow = true;
    this.legs.add(rFrT);

    //create beak
    var beakGeometry = new THREE.BoxBufferGeometry(16,16,40);
    var beak = new THREE.Mesh(beakGeometry, legMaterial);
    beak.position.set(0,30,38);
    beak.castShadow = true;
    this.chicken.add(beak);

    //create wattle
    var wattleMaterial = new THREE.MeshToonMaterial({ color: Colours.red});
    var wattleGeometry = new THREE.BoxBufferGeometry(16, 18, 32);
    var wattle = new THREE.Mesh(wattleGeometry, wattleMaterial);
    wattle.position.set(0,13,30);
    wattle.castShadow = true;
    this.chicken.add(wattle);

    //create comb
    var combGeometry = new THREE.BoxBufferGeometry(16, 18, 35);
    var comb = new THREE.Mesh(combGeometry, wattleMaterial);
    comb.position.set(0,55,2);
    comb.castShadow = true;
    this.chicken.add(comb);

    this.wrap.add(this.chicken);
    this.wrap.add(this.legs);

    this.wrap.position.z = -2;
    this.wrap.rotation.y = -110/180;
    this.wrap.scale.set(0.01, 0.01, 0.01);
  }

  createBody();
}

function requestSession() {
  navigator.xr.isSessionSupported('immersive-vr').then(function (supported) {
    let options = { optionalFeatures: ['local-floor', 'bounded-floor'] };
    navigator.xr.requestSession('immersive-vr', options).then(onSessionStarted);
  });
}

function onSessionStarted(session) {
  renderer.xr.setSession(session);
  // xrConLeft = renderer.xr.getController(0);
  // xrConRight = renderer.xr.getController(1);
  animate();
}

async function closeSession(session) {
  await renderer.xr.getSession().end();
}

function animate() {
  renderer.setAnimationLoop(render);
}

function render() {
  // conLeft.position.x = xrConLeft.position.x;
  // conLeft.position.y = xrConLeft.position.y;
  // conLeft.position.z = xrConLeft.position.z;
  // conLeft.rotation.x = xrConLeft.rotation.x;
  // conLeft.rotation.y = xrConLeft.rotation.y;
  // conLeft.rotation.z = xrConLeft.rotation.z;

  // conRight.position.x = xrConRight.position.x;
  // conRight.position.y = xrConRight.position.y;
  // conRight.position.z = xrConRight.position.z;
  // conRight.rotation.x = xrConRight.rotation.x;
  // conRight.rotation.y = xrConRight.rotation.y;
  // conRight.rotation.z = xrConRight.rotation.z;

  chickenPeck();

  renderer.render(scene, camera);
}

function createBody() {
  let chickenBody = new ChickenBody();
  scene.add(chickenBody.wrap);
}

function chickenPeck() {
  //get the chicken group as a variable
  let chick =  scene.getObjectByName('chicken');

  //move the chicken's body slightly whilst rotating it
  if (chick.rotation.x === 0) {
    gsap.to(chick.position, {z: 2 });
    gsap.to(chick.rotation, {x: .3, duration: 1});
  }
  else if (chick.rotation.x === .3) {
    gsap.to(chick.position, {z:0 });
    gsap.to(chick.rotation, {x: 0, duration: 1});
  }
}

