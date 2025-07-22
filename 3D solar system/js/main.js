import * as THREE from "https://cdn.skypack.dev/three@0.129.0";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";

let scene, camera, renderer, controls, skybox;
let planet_sun, planet_mercury, planet_venus, planet_earth, planet_mars, planet_jupiter, planet_saturn, planet_uranus, planet_neptune;
let planet_sun_label;


let mercury_orbit_radius = 50
let venus_orbit_radius = 60
let earth_orbit_radius = 70
let mars_orbit_radius = 80
let jupiter_orbit_radius = 100
let saturn_orbit_radius = 120
let uranus_orbit_radius = 140
let neptune_orbit_radius = 160

let mercury_revolution_speed = 2
let venus_revolution_speed = 1.5
let earth_revolution_speed = 1
let mars_revolution_speed = 0.8
let jupiter_revolution_speed = 0.7
let saturn_revolution_speed = 0.6
let uranus_revolution_speed = 0.5
let neptune_revolution_speed = 0.4

const planetSpeeds = {
    mercury: { base: 2, multiplier: 1 },
    venus: { base: 1.5, multiplier: 1 },
    earth: { base: 1, multiplier: 1 },
    mars: { base: 0.8, multiplier: 1 },
    jupiter: { base: 0.7, multiplier: 1 },
    saturn: { base: 0.6, multiplier: 1 },
    uranus: { base: 0.5, multiplier: 1 },
    neptune: { base: 0.4, multiplier: 1 },
};


// Time variables
let timeScale = 1; // 1 second in simulation = 1 second in real life
let simulationTime = new Date(); // Start at the current date and time
let lastTime = 0;

// UI Elements
const speedSlider = document.getElementById('speed-slider');
const liveBtn = document.getElementById('live-btn');
const dateDisplay = document.getElementById('date-display');
const timeDisplay = document.getElementById('time-display');
const rateLabel = document.getElementById('rate-label');
const toggleControlsBtn = document.getElementById('toggle-controls-btn');
const timeControlContainer = document.getElementById('time-control-container');
const toggleIconChevron = document.getElementById('toggle-icon-chevron');

// Planet Speed Sliders
const togglePlanetControlsBtn = document.getElementById('toggle-planet-controls-btn');
const planetControlsContainer = document.getElementById('planet-controls-container');
const planetLabel = document.getElementById('planet-label');

const loadingScreen = document.getElementById('loading-screen');
const lottieContainer = document.getElementById('lottie-container');
const loadingText = document.getElementById('loading-text');

let isPaused = false;
const pauseResumeBtn = document.getElementById('pause-resume-btn');
const resetCameraBtn = document.getElementById('reset-camera-btn');
const themeToggle = document.getElementById('theme-toggle');

const initialCameraPosition = new THREE.Vector3(0, 150, 250);

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const planets = [];

const loadingManager = new THREE.LoadingManager();

loadingManager.onStart = (url, itemsLoaded, itemsTotal) => {
    loadingText.textContent = `Loading... 0%`;
    const player = document.createElement('lottie-player');
    player.src = 'https://assets1.lottiefiles.com/packages/lf20_p8bfn5to.json';
    player.background = 'transparent';
    player.speed = '1';
    player.loop = true;
    player.autoplay = true;
    lottieContainer.appendChild(player);
};

loadingManager.onProgress = (url, itemsLoaded, itemsTotal) => {
    const progress = (itemsLoaded / itemsTotal) * 100;
    loadingText.textContent = `Loading... ${Math.round(progress)}%`;
};

loadingManager.onLoad = () => {
    loadingScreen.style.opacity = '0';
    setTimeout(() => {
        loadingScreen.style.display = 'none';
    }, 1000); // Wait for the fade out transition to finish
};

loadingManager.onError = (url) => {
    loadingText.textContent = `Error loading: ${url}`;
};

function createMaterialArray() {
  const skyboxImagepaths = ['../img/skybox/space_ft.png', '../img/skybox/space_bk.png', '../img/skybox/space_up.png', '../img/skybox/space_dn.png', '../img/skybox/space_rt.png', '../img/skybox/space_lf.png']
  const materialArray = skyboxImagepaths.map((image) => {
    let texture = new THREE.TextureLoader(loadingManager).load(image);
    return new THREE.MeshBasicMaterial({ map: texture, side: THREE.BackSide });
  });
  return materialArray;
}

function setSkyBox() {
  const materialArray = createMaterialArray();
  let skyboxGeo = new THREE.BoxGeometry(1000, 1000, 1000);
  skybox = new THREE.Mesh(skyboxGeo, materialArray);
  scene.add(skybox);
}

function loadPlanetTexture(texture, radius, widthSegments, heightSegments, meshType) {
  const geometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments);
  const loader = new THREE.TextureLoader(loadingManager);
  const planetTexture = loader.load(texture);
  const material = meshType == 'standard' ? new THREE.MeshStandardMaterial({ map: planetTexture }) : new THREE.MeshBasicMaterial({ map: planetTexture });

  const planet = new THREE.Mesh(geometry, material);

  return planet
}

function createSaturnRing() {
  const textureLoader = new THREE.TextureLoader(loadingManager);
  const ringTexture = textureLoader.load('../img/saturn_ring.jpg');
  const ringGeometry = new THREE.RingGeometry(10, 12, 64);
  const ringMaterial = new THREE.MeshBasicMaterial({
    map: ringTexture,
    side: THREE.DoubleSide,
    transparent: true
  });
  const ring = new THREE.Mesh(ringGeometry, ringMaterial);
  ring.rotation.x = Math.PI / 2;
  return ring;
}


function createRing(innerRadius) {
  let outerRadius = innerRadius - 0.1
  let thetaSegments = 100
  const geometry = new THREE.RingGeometry(innerRadius, outerRadius, thetaSegments);
  const material = new THREE.MeshBasicMaterial({ color: '#ffffff', side: THREE.DoubleSide });
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh)
  mesh.rotation.x = Math.PI / 2
  return mesh;

}


function init() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(
    85,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  setSkyBox();
  planet_earth = loadPlanetTexture("../img/earth_hd.jpg", 4, 100, 100, 'standard');
  planet_sun = loadPlanetTexture("../img/sun_hd.jpg", 20, 100, 100, 'basic');
  planet_mercury = loadPlanetTexture("../img/mercury_hd.jpg", 2, 100, 100, 'standard');
  planet_venus = loadPlanetTexture("../img/venus_hd.jpg", 3, 100, 100, 'standard');
  planet_mars = loadPlanetTexture("../img/mars_hd.jpg", 3.5, 100, 100, 'standard');
  planet_jupiter = loadPlanetTexture("../img/jupiter_hd.jpg", 10, 100, 100, 'standard');
  planet_saturn = loadPlanetTexture("../img/saturn_hd.jpg", 8, 100, 100, 'standard');
  const saturn_ring = createSaturnRing();
  planet_saturn.add(saturn_ring);
  planet_saturn.rotation.x = 0.5; // Tilt Saturn

  planet_uranus = loadPlanetTexture("../img/uranus_hd.jpg", 6, 100, 100, 'standard');
  planet_neptune = loadPlanetTexture("../img/neptune_hd.jpg", 5, 100, 100, 'standard');

  planet_sun.name = "Sun";
  planet_mercury.name = "Mercury";
  planet_venus.name = "Venus";
  planet_earth.name = "Earth";
  planet_mars.name = "Mars";
  planet_jupiter.name = "Jupiter";
  planet_saturn.name = "Saturn";
  planet_uranus.name = "Uranus";
  planet_neptune.name = "Neptune";

  planets.push(
    planet_sun,
    planet_mercury,
    planet_venus,
    planet_earth,
    planet_mars,
    planet_jupiter,
    planet_saturn,
    planet_uranus,
    planet_neptune
  );

  // ADD PLANETS TO THE SCENE
  scene.add(planet_earth);
  scene.add(planet_sun);
  scene.add(planet_mercury);
  scene.add(planet_venus);
  scene.add(planet_mars);
  scene.add(planet_jupiter);
  scene.add(planet_saturn);
  scene.add(planet_uranus);
  scene.add(planet_neptune);

  const sunLight = new THREE.PointLight(0xffffff, 2, 0); // White light, intensity 1, no distance attenuation
  sunLight.position.copy(planet_sun.position); // Position the light at the Sun's position
  scene.add(sunLight);

  // Rotation orbit
  createRing(mercury_orbit_radius)
  createRing(venus_orbit_radius)
  createRing(earth_orbit_radius)
  createRing(mars_orbit_radius)
  createRing(jupiter_orbit_radius)
  createRing(saturn_orbit_radius)
  createRing(uranus_orbit_radius)
  createRing(neptune_orbit_radius)




  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
  renderer.domElement.id = "c";
  controls = new OrbitControls(camera, renderer.domElement);
  controls.minDistance = 12;
  controls.maxDistance = 1000;
  controls.zoomSpeed = 0.10;

  camera.position.copy(initialCameraPosition);
  controls.target.set(0, 0, 0);
}


function planetRevolver(time, speed, planet, orbitRadius, planetName) {

  let orbitSpeedMultiplier = 0.0001 * timeScale;
  const planetAngle = time * orbitSpeedMultiplier * speed;
  planet.position.x = planet_sun.position.x + orbitRadius * Math.cos(planetAngle);
  planet.position.z = planet_sun.position.z + orbitRadius * Math.sin(planetAngle);
}



function animate(time) {
  requestAnimationFrame(animate);

  if (isPaused) {
    return;
  }

  const deltaTime = (time - lastTime) * 0.001; // Time in seconds
  lastTime = time;

  // Update simulation time
  if (deltaTime > 0) {
    simulationTime.setMilliseconds(simulationTime.getMilliseconds() + (deltaTime * timeScale * 1000));
  }


  // Update UI
  dateDisplay.textContent = simulationTime.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  timeDisplay.textContent = simulationTime.toLocaleTimeString();


  // Rotate the planets
  const rotationSpeed = 0.005;
  planet_earth.rotation.y += rotationSpeed;
  planet_sun.rotation.y += rotationSpeed;
  planet_mercury.rotation.y += rotationSpeed;
  planet_venus.rotation.y += rotationSpeed;
  planet_mars.rotation.y += rotationSpeed;
  planet_jupiter.rotation.y += rotationSpeed;
  planet_saturn.rotation.y += rotationSpeed;
  planet_uranus.rotation.y += rotationSpeed;
  planet_neptune.rotation.y += rotationSpeed * (1 / planetSpeeds.neptune.multiplier);

  // Revolve planets around the sun
  const simulationTimestamp = simulationTime.getTime();
  planetRevolver(simulationTimestamp, planetSpeeds.mercury.base * planetSpeeds.mercury.multiplier, planet_mercury, mercury_orbit_radius, 'mercury')
  planetRevolver(simulationTimestamp, planetSpeeds.venus.base * planetSpeeds.venus.multiplier, planet_venus, venus_orbit_radius, 'venus')
  planetRevolver(simulationTimestamp, planetSpeeds.earth.base * planetSpeeds.earth.multiplier, planet_earth, earth_orbit_radius, 'earth')
  planetRevolver(simulationTimestamp, planetSpeeds.mars.base * planetSpeeds.mars.multiplier, planet_mars, mars_orbit_radius, 'mars')
  planetRevolver(simulationTimestamp, planetSpeeds.jupiter.base * planetSpeeds.jupiter.multiplier, planet_jupiter, jupiter_orbit_radius, 'jupiter')
  planetRevolver(simulationTimestamp, planetSpeeds.saturn.base * planetSpeeds.saturn.multiplier, planet_saturn, saturn_orbit_radius, 'saturn')
  planetRevolver(simulationTimestamp, planetSpeeds.uranus.base * planetSpeeds.uranus.multiplier, planet_uranus, uranus_orbit_radius, 'uranus')
  planetRevolver(simulationTimestamp, planetSpeeds.neptune.base * planetSpeeds.neptune.multiplier, planet_neptune, neptune_orbit_radius, 'neptune')

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(planets);

  if (intersects.length > 0) {
    const planet = intersects[0].object;
    planetLabel.textContent = planet.name;
    planetLabel.style.display = 'block';
  } else {
    planetLabel.style.display = 'none';
  }

  TWEEN.update(time);


  controls.update();
  renderer.render(scene, camera);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener("resize", onWindowResize, false);
window.addEventListener('mousemove', onMouseMove, false);
window.addEventListener('click', onPlanetClick, false);

function onPlanetClick() {
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(planets);

    if (intersects.length > 0) {
        const planet = intersects[0].object;
        const targetPosition = new THREE.Vector3();
        planet.getWorldPosition(targetPosition);

        const cameraOffset = new THREE.Vector3(0, 0, planet.geometry.parameters.radius * 5);
        const targetCameraPosition = targetPosition.clone().add(cameraOffset);

        new TWEEN.Tween(camera.position)
            .to(targetCameraPosition, 1000)
            .easing(TWEEN.Easing.Quadratic.InOut)
            .start();

        new TWEEN.Tween(controls.target)
            .to(targetPosition, 1000)
            .easing(TWEEN.Easing.Quadratic.InOut)
            .start();
    }
}

resetCameraBtn.addEventListener('click', () => {
    new TWEEN.Tween(camera.position)
        .to(initialCameraPosition, 1000)
        .easing(TWEEN.Easing.Quadratic.InOut)
        .start();

    new TWEEN.Tween(controls.target)
        .to(new THREE.Vector3(0, 0, 0), 1000)
        .easing(TWEEN.Easing.Quadratic.InOut)
        .start();
});

pauseResumeBtn.addEventListener('click', () => {
    isPaused = !isPaused;
    pauseResumeBtn.textContent = isPaused ? 'Resume' : 'Pause';
});

function onMouseMove(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
    planetLabel.style.left = `${event.clientX + 10}px`;
    planetLabel.style.top = `${event.clientY + 10}px`;
}

themeToggle.addEventListener('change', () => {
    document.body.classList.toggle('light-theme');
    const isLight = document.body.classList.contains('light-theme');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
    skybox.visible = !isLight;
});

document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.body.classList.add('light-theme');
        themeToggle.checked = true;
        skybox.visible = false;
    }
});

speedSlider.addEventListener('input', (e) => {
  const value = parseFloat(e.target.value);
  timeScale = Math.pow(10, value); // Exponential scale for finer control
  rateLabel.textContent = `${timeScale.toFixed(1)}x`;
});

liveBtn.addEventListener('click', () => {
  simulationTime = new Date();
  timeScale = 1;
  speedSlider.value = 0;
  rateLabel.textContent = 'REAL RATE';
});

toggleControlsBtn.addEventListener('click', () => {
  const isHidden = timeControlContainer.style.display === 'none';
  timeControlContainer.style.display = isHidden ? 'flex' : 'none';
  toggleControlsBtn.title = isHidden ? 'Hide controls' : 'Show controls';
  toggleIconChevron.setAttribute('d', isHidden ? 'M6 9l6 6 6-6' : 'M6 15l6-6 6 6');
});

togglePlanetControlsBtn.addEventListener('click', () => {
    const isHidden = planetControlsContainer.style.display === 'none';
    planetControlsContainer.style.display = isHidden ? 'flex' : 'none';
});

document.querySelectorAll('.planet-speed-slider').forEach(slider => {
    slider.addEventListener('input', (e) => {
        const planet = e.target.id.split('-')[0];
        const value = parseFloat(e.target.value);
        planetSpeeds[planet].multiplier = Math.pow(10, value);
        const rateDisplay = document.getElementById(`${planet}-rate`);
        rateDisplay.textContent = `${planetSpeeds[planet].multiplier.toFixed(2)}x`;
    });
});

document.querySelectorAll('.live-planet-btn').forEach(button => {
    button.addEventListener('click', (e) => {
        const planet = e.target.dataset.planet;
        planetSpeeds[planet].multiplier = 1;
        const slider = document.getElementById(`${planet}-speed`);
        slider.value = 0;
        const rateDisplay = document.getElementById(`${planet}-rate`);
        rateDisplay.textContent = 'REAL RATE';
    });
});


init();
animate(0); // Initialize with time 0
