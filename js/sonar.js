// Three JS

window.addEventListener('load', init, false)

function init() {
  createWorld()
  createPrimitive()
  animation()
}

//--------------------------------------------------------------------

var scene, camera, renderer, container;
var start = Date.now();
var _width, _height;
function createWorld() {
_width = window.innerWidth;
_height= window.innerHeight;
//---
scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);
//---
camera = new THREE.PerspectiveCamera(55, _width/_height, 1, 1000);
camera.position.z = 12;
//---
renderer = new THREE.WebGLRenderer({antialias:true, alpha:false});
renderer.setSize(_width, _height);
//---
container = document.getElementById("container");
container.appendChild(renderer.domElement);
//---
window.addEventListener('resize', onWindowResize, false);
}

function onWindowResize() {
_width = window.innerWidth;
_height = window.innerHeight;
renderer.setSize(_width, _height);
camera.aspect = _width / _height;
camera.updateProjectionMatrix();
console.log('- resize -');
}

//--------------------------------------------------------------------

var mat;
var primitiveElement = function() {
this.mesh = new THREE.Object3D();
mat = new THREE.ShaderMaterial( {
  uniforms: {
    time: {
      type: "f",
      value: 0.0
    },
    decay: {
      type: "f",
      value: 0.0
    },
    complex: {
      type: "f",
      value: 0.0
    },
    waves: {
      type: "f",
      value: 0.0
    }
  },
  vertexShader: document.getElementById( 'vertexShader' ).textContent,
  fragmentShader: document.getElementById( 'fragmentShader' ).textContent
});
var geo = new THREE.IcosahedronBufferGeometry(3, 7);
var mesh = new THREE.Points(geo, mat);

//---
this.mesh.add(mesh);
}

var _primitive;
function createPrimitive() {
_primitive = new primitiveElement();
scene.add(_primitive.mesh);
}

//--------------------------------------------------------------------

var options = {
perlin: {
  vel: 0.002,
  speed: 0.0003,
  perlins: 1,
  decay: 0.10,
  complex: 0.30,
  waves: 20.0
},
spin: {
  sinVel: 0.0,
  ampVel: 80.0,
}
}

//--------------------------------------------------------------------

function animation() {
requestAnimationFrame(animation);
var performance = Date.now() * 0.003;

_primitive.mesh.rotation.y += options.perlin.vel;
_primitive.mesh.rotation.x = (Math.sin(performance * options.spin.sinVel) * options.spin.ampVel )* Math.PI / 180;
//---
mat.uniforms['time'].value = options.perlin.speed * (Date.now() - start);
mat.uniforms['decay'].value = options.perlin.decay;
mat.uniforms['complex'].value = options.perlin.complex;
mat.uniforms['waves'].value = options.perlin.waves;
//---
camera.lookAt(scene.position);
renderer.render(scene, camera);
}
