/**
 * Created by thr0m on 05/10/2016.
 */

var TEGame = function () {
    var loadingScene,mainScene, listener;

    var jsonLoader, audioLoader, textureLoader, loaderManager;

    var cubeLoading, cubeScaling = 0;

    var movingGroup;

    var mainLight;

    var loadingLight;

    var cam;
    var colorCount = 0;

    var assets = {
        px1: {
            type: 'model',
            file: "assets/pasillos/p1.js",
            mesh: null
        },
        px2: {
            type: 'model',
            file: "assets/pasillos/p2.js",
            mesh: null
        },
        neon: {
            type: 'model',
            file: "assets/pasillos/neon.js",
            mesh: null
        },
        bgMusic: {
            type: 'sound',
            file: "assets/sonidos/bg_game.ogg",
            audio: null
        },
        neonMapE: {
            type: 'texture',
            file: "assets/pasillos/map_light.jpg",
            texture: null
        },
        neonMapD: {
            type: 'texture',
            file: "assets/pasillos/map_diff.jpg",
            texture: null
        }
    };

    var playList = {
        bgGame: {
            file: "assets/sonidos/bg_game.ogg",
            aud: null
        }
    };

    var neonLightsMat;

    var meshes = {};
    var sounds = {};

    function init() {
        loadingScene = TEMain.getLoadingScene();
        mainScene = TEMain.getMainScene();
        listener = TEMain.getAudioListener();
        cam = TEMain.getCamera();

        cam.far = 1000;
        cam.updateProjectionMatrix();

        movingGroup = new THREE.Object3D();

        loadingCreate();

        loaderManager = new THREE.LoadingManager();
        jsonLoader = new THREE.JSONLoader(loaderManager);
        audioLoader = new THREE.AudioLoader(loaderManager);
        textureLoader = new THREE.TextureLoader(loaderManager);

        console.log("Iniciando Juego");

        neonLightsMat = new THREE.MeshPhongMaterial({
            color: 0xffffff,
            emissive: 0xffffff,
            emissiveIntensity: 1
        });
        neonLightsMat.name = "NeonMat";

        loaderManager.onProgress = function (item, loaded, total) {
            console.log(item,loaded,total);

            $("#loading").empty();
            $("#loading").append('Cargando ' + (loaded / total * 100).toFixed(2) + '%' );
            //console.log( (loaded / total * 100) + '% loaded' );
        };

        loaderManager.onLoad = function () {
            console.log("Se Cargaron todos los assets!");
            loadComplete();
        };

        // Carga todos los assets en mi arreglo
        for(var _key in assets){
            (function (key) {
                switch (assets[key].type) {
                    case 'model':
                        jsonLoader.load(
                            assets[key].file,
                            function (geometry, materials) {
                                var material = new THREE.MeshFaceMaterial(materials);
                                var mesh = new THREE.Mesh(geometry, material);

                                mesh.traverse(function (node) {
                                    if(node instanceof THREE.Mesh){
                                        node.castShadow = true;
                                        node.receiveShadow = true;
                                    }
                                });
                                assets[key].mesh = mesh;
                            }
                        );
                        break;
                    case 'sound':
                        audioLoader.load(
                            assets[key].file,
                            function (buffer) {
                                var sound = new THREE.Audio(listener);
                                sound.autoplay = true;
                                sound.setBuffer(buffer);
                                sound.setVolume(0.5);

                                assets[key].aud = sound;
                            }
                        );
                        break;
                    case 'texture':
                        textureLoader.load(
                            assets[key].file,
                            function (texture) {
                                assets[key].texture = texture;
                            }
                        );
                        break;
                }
            })(_key);
        }

    }

    function loadingCreate() {
        cubeLoading = new THREE.Mesh(
            new THREE.BoxGeometry(1,1,1),
            new THREE.MeshPhongMaterial({color: 0xff4444, wireframe: false})
        );

        loadingLight= new THREE.AmbientLight(0xffffff, 0.2);
        loadingScene.add(loadingLight);

        loadingLight = new THREE.PointLight(0xffffff, 0.8, 18);
        loadingLight.position.set(-3,6,-3);
        loadingScene.add(loadingLight);

        cubeLoading.position.z = 5;
        cubeLoading.position.y = 10;

        loadingScene.add(cubeLoading);
    }

    function loadinAnimate(delta) {
        cubeLoading.rotation.x += delta * 0.5;
        cubeLoading.rotation.y += delta * 0.5;
        cubeLoading.rotation.z += delta * 0.5;

        cubeScaling = Math.sin(cubeLoading.rotation.x)*5;

        cubeLoading.material.color.r = (Math.sin(0.001 * colorCount) * 127 + 128) / 255;
        cubeLoading.material.color.g = (Math.sin(0.002 * colorCount) * 127 + 128) / 255;
        cubeLoading.material.color.b = (Math.sin(0.003 * colorCount) * 127 + 128) / 255;

        colorCount++;

        cubeLoading.scale.set(cubeScaling,cubeScaling,cubeScaling)

    }

    // No muestra la Escena principal hasta terminar de construir todo el nivel
    function loadComplete() {

        neonLightsMat.emissiveMap = assets.neonMapE.texture;
        neonLightsMat.map = assets.neonMapD.texture;
        neonLightsMat.needsUpdate = true;

        for (var i = 0; i < 15; i++){
            meshes["p1"+i] = assets.px1.mesh.clone();
            meshes["p1"+i].name = "Px1-"+i;
            meshes["p1"+i].scale.set(5,5,5);
            meshes["p1"+i].rotation.set(0,Math.PI/2,0);
            meshes["p1"+i].position.z = 40*i;
            movingGroup.add(meshes["p1"+i]);
        }

        for (var i = 0; i < 15; i++){
            meshes["p2"+i] = assets.px2.mesh.clone();
            meshes["p2"+i].name = "Px2-"+i;
            meshes["p2"+i].scale.set(5,5,5);
            meshes["p2"+i].rotation.set(0,Math.PI/2,0);
            meshes["p2"+i].position.z = (40 * i) + 20;
            movingGroup.add(meshes["p2"+i]);
        }

        for(var i = 0; i < 15; i++) {
            meshes["neon"+i] = assets.neon.mesh.clone();
            meshes["neon"+i].name = "Neon-"+i;
            meshes["neon"+i].scale.set(5,5,5);
            meshes["neon"+i].rotation.set(0,Math.PI/2,0);
            meshes["neon"+i].position.x = 0.08;
            meshes["neon"+i].position.y = 0.14;
            meshes["neon"+i].position.z = 40*i;
            meshes["neon"+i].material.materials[0] = neonLightsMat;
            movingGroup.add(meshes["neon"+i]);
        }

        mainScene.add(movingGroup);


        TEConfig.mode = TEConfig.modes.game;

        $("#loading").hide();
        $("#loading").removeClass();
    }

    function mainAnimate(delta) {

    }

    return{
        init: init,
        loadinAnimate: loadinAnimate,
        getAudio: function () {
            return assets['bgMusic'].aud;
        },
        mainAnimate: mainAnimate
    }
}();