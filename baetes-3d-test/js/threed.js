window.THREE = THREE;
window.render = render;

// Settings
const CLEAR_COLOR = 0x7a6c5b;
const BGD_OPACITY = 1;
const CAMERA_Z = 150;
const CONTROLS_ZOOM = true;
const CONTROLS_PAN = false;
const ZOOM_MIN = 130;
const ZOOM_MAX = 800;
const SHADOW_DIST = 100;
const MATERIAL_SHININESS = 200;
const SPINNER_OPTIONS = {
  color: '#6CA9C6'
};
const SCALE = 100;

// Global vars
let spinner;
let scene, camera, renderer, shoe, canvasElement;
let controls, rotating;
let raycaster, mouse, clicking;
let ambientLight, directionalLight;
let mtlLoader, loader;
let reflectionCube, reflectingMaterial, reflectButton;

// Model and textures
let shoeObject = 'assets/shoe.dae';
let shoeMap = 'assets/DefaultMaterial_albedo.jpg';
let shoeMetalnessMap = 'assets/DefaultMaterial_metallic.jpg';
let shoeNormalMap = 'assets/DefaultMaterial_normal.png';
let shoeRoughnessMap = 'assets/DefaultMaterial_roughness.jpg';

// Run this baby
init();
animate();

function init() {
  initSpinner();
  setScene();
  setCamera();
  setRenderer();
  setControls();
  setRaycasting();
  setLighting();
  initReflection();
  loadModel();
  setListeners();
}

function initSpinner() {
  spinner = new Spinner(SPINNER_OPTIONS);
  window.spinner = spinner;
  return spinner;
}

function setScene() {
  scene = new THREE.Scene();
  window.scene = scene;
}

function setCamera() {
  camera = new THREE.PerspectiveCamera(
    45, window.innerWidth / window.innerHeight, 0.1, 1000
  );
  camera.position.set( 150, 230, 150 );
  // camera.lookAt( new THREE.Vector3( 0, 150, 0 ) );
  camera.position.z = CAMERA_Z;
  scene.add(camera);
}

function setRenderer() {
  renderer = new THREE.WebGLRenderer({ antialias: true });
  canvasElement = renderer.domElement;

  window.renderer = renderer;

  renderer.vr.enabled = true;
  // renderer.animate(update);
  document.body.appendChild(WEBVR.createButton(renderer));

  renderer.setClearColor(CLEAR_COLOR, BGD_OPACITY);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  document.body.appendChild(renderer.domElement);
}

function setControls() {
  controls = new THREE.OrbitControls(camera, renderer.domElement);
  window.controls = controls;
  controls.enableZoom = CONTROLS_ZOOM;
  controls.enablePan = CONTROLS_PAN;
  controls.minDistance = ZOOM_MIN;
  controls.maxDistance = ZOOM_MAX;
  controls.addEventListener('change', render);
}

function setRaycasting() {
  raycaster = new THREE.Raycaster();
  mouse = new THREE.Vector2(); 
  clicking = false;
}

function setLighting() {
  ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);

  directionalLight = new THREE.DirectionalLight(0xffffff);
  directionalLight.position.set(-5, 100, 40);
  directionalLight.castShadow = true;

  directionalLight.shadow.mapSize.width = 2048;
  directionalLight.shadow.mapSize.height = 2048;

  directionalLight.shadow.radius = 4;

  directionalLight.shadow.camera.left = -SHADOW_DIST;
  directionalLight.shadow.camera.right = SHADOW_DIST;
  directionalLight.shadow.camera.bottom = -SHADOW_DIST;
  directionalLight.shadow.camera.top = SHADOW_DIST;
  directionalLight.shadow.camera.near = 0.5;
  directionalLight.shadow.camera.far = 1000;

  scene.add(directionalLight);
  window.light = directionalLight;
}

function initReflection() {
  var cubeTextureLoader = new THREE.CubeTextureLoader();
  var locations = [
    'assets/px.jpg',
    'assets/nx.jpg',
    'assets/py.jpg',
    'assets/ny.jpg',
    'assets/pz.jpg',
    'assets/nz.jpg',
  ];

  // reflectButton = document.getElementById('reflectButton');      
  reflectionCube = cubeTextureLoader.load(locations);
  reflectionCube.format = THREE.RGBFormat;
  window.reflectionCube = reflectionCube;
}

function loadModel() {
  spinner.spin(document.body);
  mtlLoader = new THREE.MTLLoader();
  // mtlLoader.load('assets/vans-shoes-new1.mtl', function (creator) {
    // creator.preload();
    // const materials = creator.materials;

    // for (let material in materials) {
    //   const thisMaterial = materials[material];
    //   thisMaterial.shininess = MATERIAL_SHININESS;
    //   if (thisMaterial.name === 'None') {
    //     reflectingMaterial = thisMaterial;
    //   }
    // }

    // loadObject(creator);
  // });
  loadObject();  
}

function loadObject(creator = null) {
  // loader = shoeObject.match('\.obj$') ? new THREE.OBJLoader() : new THREE.ColladaLoader();
  loader = new THREE.ColladaLoader();

  // Uncomment to use materials (loaded via loadMaterials())
  // loader.setMaterials(creator);

  loader.load(shoeObject, function (object) {
    // shoe = shoeObject.match('\.obj$') ? object.children[0] : object.scene.children[0];
    shoe = object.scene.children[0];
    shoe.scale.set(SCALE, SCALE, SCALE);
    window.shoe = shoe;

    shoe.castShadow = true;
    shoe.receiveShadow = true;

    loadTextures(shoe);

    shoe.needsUpdate = true;

    rotating = true;

    scene.add(shoe);
    window.setTimeout(function () { spinner.stop() }, 1000);
  });
}

function loadTextures(object) {
  const textureLoader = new THREE.TextureLoader();
  textureLoader.load(shoeMap, function (mapTexture) {
    textureLoader.load(shoeNormalMap, function (normalMap) {
      textureLoader.load(shoeRoughnessMap, function (roughnessMap) {
        textureLoader.load(shoeMetalnessMap, function (metalnessMap) {
          const material = new THREE.MeshStandardMaterial({
            map: mapTexture,
            normalMap: normalMap,
            roughnessMap: roughnessMap,
            metalnessMap: metalnessMap,
            envMap: reflectionCube,
            roughness: 1,
            metalness: 0.75
          });

          material.needsUpdate = true;
          object.material = material;
        });
      });
    });
  });
}

function toggleReflection() {
  // if (reflectingMaterial.envMap) {
  //   reflectingMaterial.envMap = undefined;
  // } else {
  //   reflectingMaterial.envMap = reflectionCube;
  // }
  // reflectingMaterial.needsUpdate = true;
  // render();
}

function checkForIntersection() {
  if (!mouse.x || !mouse.y || !shoe) { return }

  raycaster.setFromCamera(mouse, camera);
  const intersect = raycaster.intersectObject(shoe)[0];

  if (intersect) {
    showOverlayHeader();
    showSidebar();
  }
}

function setListeners() {
  window.addEventListener('resize', onResize);
  canvasElement.addEventListener('click', onCanvasMouseDown);

  // reflectButton.addEventListener('click', function (event) {
  //   event.preventDefault();
  //   toggleReflection();
  // });
}

function onResize(event) {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function onCanvasMouseDown(event) {
  mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
  mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
  clicking = true;
}

function animate() {
  requestAnimationFrame(animate);
  render();
}

function render() {
  if (rotating) { 
    shoe.rotation.y += 0.01;
  }

  if (clicking) {
    requestAnimationFrame(checkForIntersection);
    clicking = false;
  }

  camera.lookAt(scene.position);
  renderer.render(scene, camera);
}