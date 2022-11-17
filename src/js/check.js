createObjs();
createLights();



function cocoro3D()
{
    console.log('creating cocoro ');
    const shape = new THREE.Shape();
    const x = -2.5;
    const y = -5;
    shape.moveTo(x + 2.5, y + 2.5);
    shape.bezierCurveTo(x + 2.5, y + 2.5, x + 2, y, x, y);
    shape.bezierCurveTo(x - 3, y, x - 3, y + 3.5, x - 3, y + 3.5);
    shape.bezierCurveTo(x - 3, y + 5.5, x - 1.5, y + 7.7, x + 2.5, y + 9.5);
    shape.bezierCurveTo(x + 6, y + 7.7, x + 8, y + 4.5, x + 8, y + 3.5);
    shape.bezierCurveTo(x + 8, y + 3.5, x + 8, y, x + 5, y);
    shape.bezierCurveTo(x + 3.5, y, x + 2.5, y + 2.5, x + 2.5, y + 2.5);

    const extrudeSettings = {
    steps: 2,
    depth: 2,
    bevelEnabled: true,
    bevelThickness: 1,
    bevelSize: 1,
    bevelSegments: 2,
    };

    const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);

    const material = new THREE.MeshStandardMaterial({
        color: 0x0000ff,
        wireframe: false
    });

    const cocoro = new THREE.Mesh(geometry,material);
    scene.add(cocoro);
    console.log('cocoro created');
}

function torusKnot()
{
    const radius = 1;  // ui: radius
    const tubeRadius = 0.2;  // ui: tubeRadius
    const radialSegments = 20;  // ui: radialSegments
    const tubularSegments = 64;  // ui: tubularSegments
    const p = 1;  // ui: p
    const q = 3;  // ui: q
    const geometry = new THREE.TorusKnotGeometry(radius, tubeRadius, tubularSegments, radialSegments, p, q);

    const material = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        wireframe: false
    });

    const obj = new THREE.Mesh(geometry,material);
    obj.position.set(0,5,0);
    obj.castShadow = true;
    scene.add(obj);
}

function createGUI()
{
    // define parameters for GUI
    //#  must be constant and add parameters as options.param = value;
    options = {
        cubeColor: '#0e00ff',
        boxWired: false,
        speed: 0.003
    };

    // define GUI for colors
    gui.addColor(options,'cubeColor').onChange(
        function (e)
        {
            objs.box.material.color.set(e);
        }
    );

    // check box
    gui.add(options,'boxWired').onChange(
        function (e)
        {
            objs.box.material.wireframe = e;
        }
    );

    // interval GUI
    gui.add(options, 'speed', 0, 0.1);

    console.log('GUI added');
}

function createLights()
{
    /**Ambient light  THREE.AmbientLight
     * 
     * It deals with THREE.MeshStandardMaterial
     * for some reflection and shadows features.
    */
    const ambientLight = new THREE.AmbientLight(0x333333);
    scene.add(ambientLight);

    // /**Directional light THREE.DirectionalLight*/
    const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 0.8);
    directionalLight.castShadow = true;
    scene.add(directionalLight);
    directionalLight.position.set(0,30,-10);
    // directionalLight.shadow.camera.bottom = -12;
    //position ligth and shadows helpers.
    // const dLightHelper = new THREE.DirectionalLightHelper(directionalLight, 5);
    // scene.add(dLightHelper);
    // const dLightShadowHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
    // scene.add(dLightShadowHelper);
    
    // /**Spot light THREE.SpotLight*/
    // const spotLight = new THREE.SpotLight(0xFFFFFF);
    // scene.add(spotLight);
    // spotLight.position.set(-100, 100, 0);
    // spotLight.castShadow = true;
    // spotLight.angle = 0.2;
    // const sLightHelper = new THREE.SpotLightHelper(spotLight);
    // scene.add(sLightHelper);

    // //scene.fog = new THREE.Fog(0xFFFFFF, 0, 200);
    // scene.fog = new THREE.FogExp2(0xFFFFFF, 0.01);

    //renderer.setClearColor(0xFFEA00);
}