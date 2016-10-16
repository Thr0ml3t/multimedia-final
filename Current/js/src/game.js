/**
 * Created by thr0m on 05/10/2016.
 */

var TEGame = function () {
    var loadingScene,mainScene, listener;

    var jsonLoader, audioLoader, loaderManager;

    var cubeLoading, cubeScaling = 0;

    var movingGroup;

    var mainLight;

    var cam;

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
        }
    };

    var playList = {
        bgGame: {
            file: "assets/sonidos/bg_game.ogg",
            aud: null
        }
    };

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

        console.log("Iniciando Juego");

        loaderManager.onProgress = function (item, loaded, total) {
            console.log(item,loaded,total);

            $("#loading").empty();
            $("#loading").append('Cargando ' + (loaded / total * 100) + '%' );
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
                }
            })(_key);
        }

    }

    function loadingCreate() {
        cubeLoading = new THREE.Mesh(
            new THREE.BoxGeometry(1,1,1),
            new THREE.MeshBasicMaterial({color: 0xff4444, wireframe: false})
        );

        cubeLoading.position.z = 5;
        cubeLoading.position.y = 10;

        loadingScene.add(cubeLoading);
    }

    function loadinAnimate() {
        cubeLoading.rotation.x += 0.01;
        cubeLoading.rotation.y += 0.01;
        cubeLoading.rotation.z += 0.01;

        cubeScaling = Math.sin(cubeLoading.rotation.x)*5;

        cubeLoading.scale.set(cubeScaling,cubeScaling,cubeScaling)

    }

    // No muestra la Escena principal hasta terminar de construir todo el nivel
    function loadComplete() {
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

        mainScene.add(movingGroup);


        TEConfig.mode = TEConfig.modes.game;

        $("#loading").empty();
        $("#loading").removeClass();
    }

    return{
        init: init,
        loadinAnimate: loadinAnimate,
        getAudio: function () {
            return assets['bgMusic'].aud;
        }
    }
}();