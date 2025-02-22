function init() {
  //  add cubemap to the scene
  var scene = new THREE.Scene();
  var gui = new dat.GUI();
  gui.close(); // Close the entire control panel

  // initialize objects
  var sphereMaterial = getMaterial("standard", "rgb(255, 255, 255)");
  var sphere = getSphere(sphereMaterial, 1, 24);
  sphere.name = "rock";
  var lightLeft = getSpotLight(1, "rgb(255, 220, 180)");
  var lightRight = getSpotLight(1, "rgb(255, 220, 180)");

  lightLeft.position.x = -2.6;
  lightLeft.position.y = 0.7;
  lightLeft.position.z = -1;
  lightLeft.intensity = 0.8;

  lightRight.position.x = 3.7;
  lightRight.position.y = 6;
  lightRight.position.z = -2;
  lightRight.intensity = 1;

  // manipulate materials
  // load the cube map
  var currentCubemapNumber = 8; // Start with cmap-8
  var reflectionCube = loadCubemap(currentCubemapNumber);
  scene.background = reflectionCube;
  sphereMaterial.envMap = reflectionCube;

  var loader = new THREE.TextureLoader();
  sphereMaterial.map = loader.load(
    "/assets/textures/giants-causeway/giants_causeway_basecolor.jpg"
  );
  sphereMaterial.bumpMap = loader.load(
    "/assets/textures/giants-causeway/giants_causeway_normal.jpg"
  );
  sphereMaterial.normalMap = sphereMaterial.bumpMap;
  sphereMaterial.roughnessMap = loader.load(
    "/assets/textures/giants-causeway/giants_causeway_roughness.jpg"
  );
  sphereMaterial.displacementMap = loader.load(
    "/assets/textures/giants-causeway/giants_causeway_height.jpg"
  );
  sphereMaterial.metalnessMap = loader.load(
    "/assets/textures/giants-causeway/giants_causeway_metallic.jpg"
  );
  sphereMaterial.aoMap = loader.load(
    "/assets/textures/giants-causeway/giants_causeway_ambientocclusion.jpg"
  );
  // Three.js default : 1
  sphereMaterial.bumpScale = 1;
  // Three.js default : (1, 1)
  sphereMaterial.normalScale.set(1, 1);
  // Three.js default : 0
  sphereMaterial.displacementBias = -0.01;
  // Three.js default : 1
  sphereMaterial.displacementScale = 0;
  // Three.js default : 1
  sphereMaterial.aoMapIntensity = 0.5;
  // Three.js default : 0.5
  sphereMaterial.roughness = 0.92;
  // Three.js default : 0.5
  sphereMaterial.metalness = 0.01;

  // Change the variables to objects with value property
  // Three.js default : 1
  var repeatX = { value: 3 };
  // default : 1
  var repeatY = { value: 2 };

  var maps = [
    "map",
    "bumpMap",
    "roughnessMap",
    "displacementMap",
    "aoMap",
    "metalnessMap",
  ];
  maps.forEach(function (mapName) {
    var texture = sphereMaterial[mapName];
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(repeatX.value, repeatY.value);
  });

  // Move camera creation before the GUI controls
  // camera
  var camera = new THREE.PerspectiveCamera(
    45, // field of view
    window.innerWidth / window.innerHeight, // aspect ratio
    1, // near clipping plane
    1000 // far clipping plane
  );
  camera.position.z = -2;
  camera.position.x = -4;
  camera.position.y = 0;
  camera.lookAt(new THREE.Vector3(0, 0, 0));

  // Add objects to scene
  scene.add(sphere);
  scene.add(lightLeft);
  scene.add(lightRight);

  // dat.gui
  var folder1 = gui.addFolder("light 1");
  folder1.add(lightLeft, "intensity", 0, 10);
  folder1.add(lightLeft.position, "x", -15, 15);
  folder1.add(lightLeft.position, "y", -15, 15);
  folder1.add(lightLeft.position, "z", -15, 15);
  folder1.close();

  var folder2 = gui.addFolder("light 2");
  folder2.add(lightRight, "intensity", 0, 10);
  folder2.add(lightRight.position, "x", -15, 15);
  folder2.add(lightRight.position, "y", -15, 15);
  folder2.add(lightRight.position, "z", -15, 15);
  folder2.close();

  var folder3 = gui.addFolder("texture");
  // add sphere rotation
  folder3
    .add({ value: 0 }, "value", 0, 2 * Math.PI)
    .name("sphere rotation")
    .onChange(function (value) {
      scene.rotation.y = value;
    });
  folder3
    .add(repeatX, "value", 0, 10)
    .name("repeat X")
    .onChange(function (value) {
      maps.forEach(function (mapName) {
        var texture = sphereMaterial[mapName];
        texture.repeat.x = value;
      });
    });

  folder3
    .add(repeatY, "value", 0, 10)
    .name("repeat Y")
    .onChange(function (value) {
      maps.forEach(function (mapName) {
        var texture = sphereMaterial[mapName];
        texture.repeat.y = value;
      });
    });
  folder3.add(sphereMaterial, "bumpScale", 0, 1);
  folder3.add(sphereMaterial, "roughness", 0, 1);
  folder3.add(sphereMaterial, "metalness", 0, 1);
  folder3.add(sphereMaterial, "aoMapIntensity", 0, 1);
  folder3.add(sphereMaterial, "displacementBias", -0.1, 0.1);
  folder3.add(sphereMaterial, "displacementScale", 0, 0.1);

  // Add normal scale controls
  var normalScaleFolder = folder3.addFolder("normal scale");
  normalScaleFolder.add(sphereMaterial.normalScale, "x", 0, 1).name("x");
  normalScaleFolder.add(sphereMaterial.normalScale, "y", 0, 1).name("y");
  folder3.close();

  var folder4 = gui.addFolder("env map");
  // Add cubemap selector
  folder4
    .add({ cubemap: currentCubemapNumber }, "cubemap", {
      "Cubemap 1": 1,
      "Cubemap 2": 2,
      "Cubemap 3": 3,
      "Cubemap 4": 4,
      "Cubemap 5": 5,
      "Cubemap 6": 6,
      "Cubemap 7": 7,
      "Cubemap 8": 8,
      "Cubemap 9": 9,
      "Cubemap 10": 10,
    })
    .name("select cubemap")
    .onChange(function (value) {
      currentCubemapNumber = value;
      reflectionCube = loadCubemap(value);
      scene.background = reflectionCube;
      sphereMaterial.envMap = reflectionCube;
      sphereMaterial.needsUpdate = true;
    });
  folder4.add(sphereMaterial, "envMapIntensity", 0, 10);
  folder4
    .add({ visible: true }, "visible")
    .name("show")
    .onChange(function (value) {
      scene.background = value ? reflectionCube : null;
      sphereMaterial.envMap = value ? reflectionCube : null;
      sphereMaterial.needsUpdate = true;
    });
  folder4.close();

  // Camera controls (now after camera is created)
  var folder5 = gui.addFolder("camera");
  folder5.add(camera.position, "x", -20, 20).name("position x");
  folder5.add(camera.position, "y", -20, 20).name("position y");
  folder5.add(camera.position, "z", -20, 20).name("position z");

  folder5
    .add(
      {
        reset: function () {
          camera.position.set(-2, 7, 7);
          camera.lookAt(new THREE.Vector3(0, 0, 0));
        },
      },
      "reset"
    )
    .name("reset camera");
  folder5.close();

  // renderer
  var renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  document.getElementById("webgl").appendChild(renderer.domElement);

  var controls = new THREE.OrbitControls(camera, renderer.domElement);

  // Add distance limits
  controls.minDistance = 2.05; // Prevents getting too close to the sphere
  controls.maxDistance = 20; // Prevents getting too far from the sphere

  update(renderer, scene, camera, controls);

  return scene;
}

function getSphere(material, size, segments) {
  var geometry = new THREE.SphereGeometry(size, segments, segments);
  var obj = new THREE.Mesh(geometry, material);
  obj.castShadow = true;

  return obj;
}

function getMaterial(type, color) {
  var selectedMaterial;
  var materialOptions = {
    color: color === undefined ? "rgb(255, 255, 255)" : color,
  };

  switch (type) {
    case "basic":
      selectedMaterial = new THREE.MeshBasicMaterial(materialOptions);
      break;
    case "lambert":
      selectedMaterial = new THREE.MeshLambertMaterial(materialOptions);
      break;
    case "phong":
      selectedMaterial = new THREE.MeshPhongMaterial(materialOptions);
      break;
    case "standard":
      selectedMaterial = new THREE.MeshStandardMaterial(materialOptions);
      break;
    default:
      selectedMaterial = new THREE.MeshBasicMaterial(materialOptions);
      break;
  }

  return selectedMaterial;
}

function getSpotLight(intensity, color) {
  color = color === undefined ? "rgb(194, 136, 19)" : color;
  var light = new THREE.SpotLight(color, intensity);
  light.castShadow = true;
  light.penumbra = 0.7;

  //Set up shadow properties for the light
  light.shadow.mapSize.width = 2048; // default: 512
  light.shadow.mapSize.height = 2048; // default: 512
  light.shadow.bias = 0.001;

  return light;
}

function getPlane(material, size) {
  var geometry = new THREE.PlaneGeometry(size, size);
  material.side = THREE.DoubleSide;
  var obj = new THREE.Mesh(geometry, material);
  obj.receiveShadow = true;

  return obj;
}

function update(renderer, scene, camera, controls) {
  controls.update();
  renderer.render(scene, camera);

  // rotate the rock
  var rock = scene.getObjectByName("rock");
  rock.rotation.y += 0.0015;
  // rock.rotation.x += 0.001;
  requestAnimationFrame(function () {
    update(renderer, scene, camera, controls);
  });
}

function loadCubemap(number) {
  var path = "/assets/cubemap/cmap-" + number + "/";
  var format = ".png";
  var urls = [
    path + "px" + format,
    path + "nx" + format,
    path + "py" + format,
    path + "ny" + format,
    path + "pz" + format,
    path + "nz" + format,
  ];
  var reflectionCube = new THREE.CubeTextureLoader().load(urls);
  reflectionCube.format = THREE.RGBFormat;
  return reflectionCube;
}

var scene = init();
