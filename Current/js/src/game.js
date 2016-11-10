/**
 * Created by thr0m on 05/10/2016.
 */

var TEGame = function () {
    var listener, renderer, renderer2, renderer3, analyzer1;

    var neonComp = {};

    var mainComp = {};

    var loadingMap = {};

    var jsonLoader, audioLoader, textureLoader, loaderManager;

    var cubeLoading;

    var dirLight;

    var movingGroup,movingGroup2;

    var mainLight;

    var loadingLight;

    var cam,cam2;
    var colorCount = 0;

    var timerL, timerM;

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
        },
        puerta1: {
            type: 'model',
            file: "assets/puertas/pIzq.js",
            mesh: null
        },
        puerta2: {
            type: 'model',
            file: "assets/puertas/pDer.js",
            mesh: null
        }
    };

    var player = {
        height: 5.0,
        minHeight: 1.0,
        maxHeight: 12.0,
        speed: 0,
        maxSpeed: 40,
        acceleration: 0.1,
        slideSpeed: 0,
        slideAcceleration: 5.0,
        maxSideSpeed: 20,
        pitchSpeed: 0,
        pitchAcceleration: 3.0,
        pitchMaxSpeed: 20
    };

    var neonLightsMat;

    var meshes = {};

    function init() {
        loadingMap.scene = new THREE.Scene();
        neonComp.scene = new THREE.Scene();
        mainComp.scene = new THREE.Scene();
        renderer = TEMain.getRenderer();
        listener = TEMain.getAudioListener();
        cam = TEMain.getCamera();
        cam.position.set(0,player.height,-5);
        cam.lookAt(new THREE.Vector3(0, player.height, 0));

        cam2 = new THREE.PerspectiveCamera( 103, window.innerWidth/window.innerHeight , 0.1, 100 );
        cam2.position.set(0,player.height,-5);
        cam2.lookAt(new THREE.Vector3(0, player.height, 0));

        var renderTargetParameters = { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBAFormat, stencilBufer: false };

        renderer2 = new THREE.WebGLRenderTarget( window.innerWidth/4, window.innerHeight/4, renderTargetParameters );
        renderer3 = new THREE.WebGLRenderTarget( window.innerWidth, window.innerHeight, renderTargetParameters );


        timerL = new THREE.Clock();
        timerM = new THREE.Clock();

        mainLight = new THREE.PointLight(0xffffff,0,0);

        mainLight.position.set(0, 10, -5);

        dirLight = new THREE.DirectionalLight(0xffffff,0.0);
        dirLight.position.set(0,500,500);

        cam.far = 400;
        cam.updateProjectionMatrix();

        movingGroup = new THREE.Object3D();
        movingGroup2 = new THREE.Object3D();

        loadingCreate();

        loaderManager = new THREE.LoadingManager();
        jsonLoader = new THREE.JSONLoader(loaderManager);
        audioLoader = new THREE.AudioLoader(loaderManager);
        textureLoader = new THREE.TextureLoader(loaderManager);

        console.log("Iniciando Juego");

        neonLightsMat = new THREE.MeshLambertMaterial({
            color: 0xffffff,
            emissive: 0xffffff,
            emissiveIntensity: 0
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

                                analyzer1 = new THREE.AudioAnalyser(assets[key].aud,32);
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
            new THREE.BoxGeometry(10,10,10),
            new THREE.MeshPhongMaterial({color: 0xff4444})
        );

        console.log(cubeLoading.material.opacity);

        loadingLight= new THREE.AmbientLight(0xffffff, 0.2);
        loadingMap.scene.add(loadingLight);

        loadingLight = new THREE.DirectionalLight(0xffffff, 0.8);
        loadingLight.position.set(0,1,-30);
        loadingLight.lookAt(new THREE.Vector3(0,5,10));
        loadingMap.scene.add(loadingLight);

        cubeLoading.position.z = 15;

        cubeLoading.tl = new TimelineMax({repeat:-1, repeatDelay: 1});
        //I add a few animations in my timeline
        //The cube turn on itself
        cubeLoading.tl.to(cubeLoading.rotation, 3, {y:-Math.PI*1.25, x : -Math.PI*1.25, z:-Math.PI*1.25, ease:Back.easeInOut});

        //Then it will move to the left and fade out
        cubeLoading.tl.to(cubeLoading.position, 1, {x : 150, ease:Power3.easeOut});
        cubeLoading.tl.to(cubeLoading.material, 1, {opacity : 0, ease:Power3.easeOut}, "-=1");

        //Move the cube without transition
        cubeLoading.tl.set(cubeLoading.position,{x:100, y: -100});

        //Fade In the cube
        cubeLoading.tl.to(cubeLoading.material, 1, {opacity : 1, ease:Power3.easeOut});

        //It goes back to its initial position
        cubeLoading.tl.to(cubeLoading.position, 3, {x:0,y:0, ease: Back.easeInOut.config(2)});
        cubeLoading.tl.to(cubeLoading.rotation, 3, {x:0,y:0,z:0, ease: Back.easeInOut.config(2)},"-=3");

        loadingMap.scene.add(cubeLoading);

        loadingMap.renderPass = new THREE.RenderPass(loadingMap.scene,cam);
        loadingMap.rgbPass = new THREE.ShaderPass(THREE.RGBShiftShader);
        loadingMap.rgbPass.uniforms.amount.value = 0.1;
        loadingMap.copyPass = new THREE.ShaderPass(THREE.CopyShader);

        loadingMap.composer = new THREE.EffectComposer(renderer);
        loadingMap.composer.addPass(loadingMap.renderPass);
        loadingMap.composer.addPass(loadingMap.rgbPass);
        loadingMap.composer.addPass(loadingMap.copyPass);
        loadingMap.copyPass.renderToScreen = true;

        timerL.start();

    }

    function loadinAnimate() {
        var delta = timerL.getDelta();

        loadingMap.composer.render(delta);

    }

    // No muestra la Escena principal hasta terminar de construir todo el nivel
    function loadComplete() {

        timerL.stop();

        neonLightsMat.emissiveMap = assets.neonMapE.texture;
        neonLightsMat.map = assets.neonMapD.texture;
        neonLightsMat.needsUpdate = true;

        var materialSuelo = new THREE.MeshPhongMaterial({
            color: 0x4B5F64,
            specular: 0x666666,
            shininess: 100,
            reflectivity: 5
        });

        var materialParedes = new THREE.MeshLambertMaterial({
            color: 0xB0C4DE
        });

        var materialMarcos = new THREE.MeshPhongMaterial({
            color: 0xeff3f8,
            specular: 0x666666,
            shininess: 15,
            reflectivity: 5
        });

        var materialPuertas = new THREE.MeshPhongMaterial({
            color: 0x000000,
            specular: 0x666666,
            shininess: 20,
            reflectivity: 5
        });

        //console.log(assets.px1);

        for (var i = 0; i < 15; i++){
            meshes["p1"+i] = assets.px1.mesh.clone();
            meshes["p1"+i].name = "Px1-"+i;
            meshes["p1"+i].scale.set(5,5,5);
            meshes["p1"+i].rotation.set(0,Math.PI/2,0);
            meshes["p1"+i].position.z = 40*i;
            meshes["p1"+i].material.materials[0] = materialSuelo;
            meshes["p1"+i].material.materials[1] = materialParedes;
            movingGroup.add(meshes["p1"+i]);
        }

        for (var i = 0; i < 15; i++){
            meshes["p2"+i] = assets.px2.mesh.clone();
            meshes["p2"+i].name = "Px2-"+i;
            meshes["p2"+i].scale.set(5,5,5);
            meshes["p2"+i].rotation.set(0,Math.PI/2,0);
            meshes["p2"+i].position.x = 0.16;
            meshes["p2"+i].position.y = 0.12;
            meshes["p2"+i].position.z = (40 * i) + 20;
            meshes["p2"+i].material.materials[2] = materialSuelo;
            meshes["p2"+i].material.materials[0] = materialParedes;
            meshes["p2"+i].material.materials[1] = materialMarcos;
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

        for (var i = 0; i < 15; i++){
            meshes["puertaIzq"+i] = assets.puerta1.mesh.clone();
            meshes["puertaIzq"+i].name = "PuertaIzq-"+i;
            meshes["puertaIzq"+i].scale.set(5,5,5);
            meshes["puertaIzq"+i].rotation.set(0,Math.PI/2,0);
            meshes["puertaIzq"+i].position.z = 80*i + 9.7;
            meshes["puertaIzq"+i].material.materials[1] = neonLightsMat;
            meshes["puertaIzq"+i].material.materials[0] = materialPuertas;
            meshes["puertaIzq"+i].tl = new TimelineMax({repeat: -1});
            meshes["puertaIzq"+i].tl.to(meshes["puertaIzq"+i].position, Math.floor(Math.random() * 10) + 5  , {x: 10, ease:Back.easeOut});
            meshes["puertaIzq"+i].tl.to(meshes["puertaIzq"+i].position, Math.floor(Math.random() * 10) + 5  , {x: 0, ease:Back.easeIn});

            movingGroup.add(meshes["puertaIzq"+i]);
        }

        /*for(var i = 0; i < 15; i++) {
            meshes["neon"+i] = assets.neon.mesh.clone();
            meshes["neon"+i].name = "Neon-"+i;
            meshes["neon"+i].scale.set(5,5,5);
            meshes["neon"+i].rotation.set(0,Math.PI/2,0);
            meshes["neon"+i].position.x = 0.08;
            meshes["neon"+i].position.y = 0.14;
            meshes["neon"+i].position.z = 40*i;
            meshes["neon"+i].material.materials[0] = neonLightsMat;
            movingGroup2.add(meshes["neon"+i]);
        }
        neonComp.scene.add(movingGroup2);*/

        mainComp.scene.add(movingGroup);
        mainComp.scene.add(mainLight);
        //mainComp.scene.add(dirLight);

        /*
            Inicio de Shaders ! :D
        */


        /*neonComp.renderPass = new THREE.RenderPass(neonComp.scene,cam2);
        neonComp.blurPass = new THREE.ShaderPass(THREE.HorizontalBlurShader);

        neonComp.blurPass.uniforms["tDiffuse"].value = renderer.renderTarget2;
        neonComp.blurPass.uniforms["h"].value = 3.0 / window.innerWidth*2;
        neonComp.blurPass2 = new THREE.ShaderPass(THREE.VerticalBlurShader);
        neonComp.blurPass2.uniforms["v"].value = 3.0 / window.innerHeight*2;

        neonComp.copyPass = new THREE.ShaderPass(THREE.CopyShader);

        neonComp.composer = new THREE.EffectComposer(renderer,renderer2);
        neonComp.composer.addPass(neonComp.renderPass);
        neonComp.composer.addPass(neonComp.blurPass);
        neonComp.composer.addPass(neonComp.blurPass2);
        neonComp.composer.addPass(neonComp.copyPass);
        neonComp.composer.setSize(window.innerWidth,window.innerHeight);*/


        mainComp.composer = new THREE.EffectComposer(renderer,renderer3);
        mainComp.renderPass = new THREE.RenderPass(mainComp.scene,cam);
        /*mainComp.blendPass = new THREE.ShaderPass(THREE.AdditiveBlendShader);
        mainComp.blendPass.uniforms["tAdd"].value = neonComp.composer.renderTarget1.texture;
        mainComp.blendPass.uniforms["amount"].value = 2.0;*/
        mainComp.fxaaPass = new THREE.ShaderPass(THREE.FXAAShader);
        mainComp.fxaaPass.uniforms["resolution"].value = new THREE.Vector2(1 / window.innerWidth, 1 / window.innerHeight);


        mainComp.composer.addPass(mainComp.renderPass);
        mainComp.composer.addPass(mainComp.fxaaPass);
        /*mainComp.composer.addPass(mainComp.blendPass);
        mainComp.blendPass.needsSwap = true;
        mainComp.blendPass.renderToScreen = true;*/
        mainComp.fxaaPass.renderToScreen = true;

        mainComp.composer.setSize(window.innerWidth,window.innerHeight);

        /*
            Fin de Shaders *0*
        */

        //mainComp.scene.fog = new THREE.FogExp2(0x000000, 0.01);
        window.scene = mainComp.scene;

        dispose3(loadingMap.scene);

        colorCount = 0;

        timerM.start();

        TEConfig.mode = TEConfig.modes.game;
        $("#loading").hide();
        $("#loading").removeClass();
    }

    function mainAnimate() {

        var delta = timerM.getDelta();
        var elapsed = timerM.getElapsedTime();
        //console.log(elapsed);

        if (assets['bgMusic'].aud.isPlaying){

            if (elapsed >= "5" && elapsed <= "10") {
                mainLight.intensity += 0.1 * delta;
                dirLight.intensity += 0.01 * delta;
            }
            if(elapsed >= "10"){
                player.speed = analyzer1.getAverageFrequency() / 4;
            }

            mainLight.distance = analyzer1.getAverageFrequency();


            movingGroup.position.z -= player.speed * delta;
            movingGroup2.position.z -= player.speed * delta;

            if (movingGroup.position.z <= -400){
                movingGroup.position.z = 0;
                movingGroup2.position.z = 0;
            }

            neonLightsMat.emissive.r = (Math.sin(0.00353 * colorCount) * 127 + 128) / 255;
            neonLightsMat.emissive.g = (Math.cos(0.00353 * colorCount + 2) * 127 + 128) / 255;
            neonLightsMat.emissive.b = (Math.sin(0.00353 * colorCount + 4) * 127 + 128) / 255;

            colorCount++;

            neonLightsMat.emissiveIntensity = analyzer1.getAverageFrequency() / 100;
        }else {

            mainLight.distance = 1;

            colorCount = 0;

            neonLightsMat.emissiveIntensity = 0;

            TEConfig.mode = 1;

            dispose3(mainComp.scene);
        }

        renderMain(delta);
    }

    function renderMain(delta) {
        //neonComp.composer.render(delta);
        mainComp.composer.render(delta);
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