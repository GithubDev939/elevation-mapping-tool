// Create scene, camera, renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 55, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

// Create ground (network of points with 3D-sin wave)
// Points are (x, y, z)
// Add new point: dotGeometry.vertices.push(new THREE.Vector3( 0, 0, 0))

var dotGeometry = new THREE.BufferGeometry();
const positions = [];
const colors = [];
const color = new THREE.Color();
for (var i = 0 ; i < data.length ; i++) {
    positions.push(data[i][0], data[i][2], data[i][1]);
    color.setRGB(0.5, 0.0, 0.5);
    colors.push(color.r, color.g, color.b);
}
dotGeometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
dotGeometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
var dotMaterial = new THREE.PointsMaterial( { size: 2, sizeAttenuation: false, vertexColors: true } );
var dotmesh = new THREE.Points( dotGeometry, dotMaterial );
scene.add( dotmesh );

// Create object (will translate)

// Set camera + animate
camera.position.z = 0;
camera.position.y = 70;
let controls = new THREE.OrbitControls(camera, renderer.domElement);
/*
controls.enableDamping = true;
controls.dampingFactor = 0.25;
controls.enableZoom = false;
*/
function animationLoop() {
    renderer.render(scene, camera);
    requestAnimationFrame(animationLoop);
};

animationLoop();