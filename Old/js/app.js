/**
 * Created by thr0m on 28/09/2016.
 */
$(function () {
    var scene, camera, render3D, aspect;

    var controls;

    var pasillos = new THREE.Group();

    var keyboard = {};

    var player = {  height: 6.0,
                    minHeight: 1.0,
                    maxHeight: 12.0,
                    speed: 5.0,
                    maxSpeed: 40,
                    acceleration: 0.1,
                    slideSpeed: 0,
                    slideAcceleration: 5.0,
                    maxSideSpeed: 20,
                    pitchSpeed: 0,
                    pitchAcceleration: 3.0,
                    pitchMaxSpeed: 20
    };

    var mapGroup, mapGroup2, neonLights;

    var light, light2;

    var timer01;

    var listener;

    var analyzer1;
    var coso;

    var taskF = false;

    var task2 = false;

    var task3 = false;

    var emissiveM;

    var obsIzq, matObstaculo, obstGroup;


    var neonMaterial;


    init();
    animate();

    $(window).on("resize", function () {
        var game = $("#game");
        var w = game.innerWidth();
        var h = game.innerHeight();

        aspect = w / h;
        camera.aspect = aspect;
        camera.updateProjectionMatrix();

        render3D.setSize(game.innerWidth(), game.innerHeight());
    });

    $(window).on("keydown", function (e) {
        keyboard[e.keyCode] = true;
    });

    $(window).on("keyup", function (e) {
        keyboard[e.keyCode] = false;
    });

    function init() {

        timer01 = new THREE.Clock();
        scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(0x000000, 0.01);

        var game = $("#game");
        aspect = game.innerWidth() / game.innerHeight();

        camera = new THREE.PerspectiveCamera(90, aspect, 0.1, 1000);

        listener = new THREE.AudioListener();

        camera.add(listener);

        var loader = new THREE.JSONLoader();

        var mapLoader = new THREE.TextureLoader();

        var soundLoader = new THREE.AudioLoader();


        mapGroup = new THREE.Object3D();
        mapGroup2 = new THREE.Object3D();
        neonLights = new THREE.Object3D();
        obstGroup = new THREE.Object3D();

        pasillos.name = "PAS";


        neonMaterial = new THREE.MeshPhongMaterial({
            color: 0xffffff,
            emissive: 0xffffff,
            emissiveIntensity: 0
        });
        neonMaterial.name = "NeonMat";


        loader.load(
            "js/modelos/pasillos/p1.js",
            function (geometry, materials) {
                var material = new THREE.MeshFaceMaterial(materials);
                var mesh = new THREE.Mesh(geometry, material);

                mesh.name = "Px1";
                mesh.receiveShadow = true;
                mesh.receiveShadow = true;
                mesh.scale.set(5, 5, 5);
                var copy;
                for (var i = 0; i < 15; i++) {
                    copy = mesh.clone();

                    copy.name = "P" + i;

                    copy.scale.set(5, 5, 5);
                    copy.rotation.set(0, Math.PI / 2, 0);
                    copy.position.z = (40 * i);

                    mapGroup.add(copy);
                }

                scene.add(mapGroup);

                //coso = mapGroup.getObjectByName("P1",true);

                //pasilloGroup.name("Pasillos");
                //scene.add(pasilloGroup);
            }
        );


        var promiss = new Promise(function (resolve, reject) {
            loader.load(
                "js/modelos/pasillos/neon.js",
                function (geometry, materials) {
                    var material = new THREE.MeshFaceMaterial(materials);
                    var mesh = new THREE.Mesh(geometry, material);

                    mesh.name = "Px1";
                    mesh.receiveShadow = true;
                    mesh.receiveShadow = true;
                    mesh.scale.set(5, 5, 5);
                    var copy;
                    for (var i = 0; i < 15; i++) {
                        copy = mesh.clone();

                        copy.name = "neon" + i;

                        copy.material.materials[0] = neonMaterial;

                        copy.scale.set(5, 5, 5);
                        copy.rotation.set(0, Math.PI / 2, 0);
                        copy.position.x = 0.08;
                        copy.position.y = 0.14;
                        copy.position.z = (40 * i) - 0.07;

                        neonLights.add(copy);
                    }

                    scene.add(neonLights);

                    var mat = mesh.material.materials[0];

                    resolve(mat);
                }
            );
        });

        var promiseTexture = new Promise(function (resolve, reject) {
            mapLoader.load(
                'js/modelos/pasillos/map_light.jpg',
                function (texture) {
                    resolve(texture);
                }
            );
        });

        var pppTexture = new Promise(function (resolve, reject) {
            mapLoader.load(
                'js/modelos/pasillos/map_diff.jpg',
                function (texture) {
                    resolve(texture);
                }
            );
        });

        promiss.then(function (material) {

            coso = material;

            promiseTexture.then(function (emmiMap) {
                coso.emissiveMap = emmiMap;
                pppTexture.then(function (diffText) {
                    coso.map = diffText;
                    coso.needsUpdate = true;
                    //taskf = true;
                });
            });


            //taskF = true;
        });



        loader.load(
            "js/modelos/pasillos/p2.js",
            function (geometry, materials) {
                var material = new THREE.MeshFaceMaterial(materials);
                var mesh = new THREE.Mesh(geometry, material);

                mesh.name = "Px2";

                mesh.receiveShadow = true;
                mesh.receiveShadow = true;
                mesh.scale.set(5, 5, 5);

                var copy;
                for (var i = 0; i < 14; i++) {

                    copy = mesh.clone();

                    copy.name = i;

                    copy.scale.set(5, 5, 5);
                    copy.rotation.set(0, Math.PI / 2, 0);
                    copy.position.y = 0.12;
                    copy.position.x = 0.16;
                    copy.position.z = (40 * i) + 20;


                    mapGroup2.add(copy);
                }

                mapGroup2.name = "ps2";
                scene.add(mapGroup2);

                taskF = true;

                /*mesh.position.x = 44.45;
                 mesh.position.z = -0.5;

                 pasillos.add(mesh);*/
            }
        );

        loader.load(
            "js/modelos/pasillos/pl.js",
            function (geometry, materials) {
                var material = new THREE.MeshFaceMaterial(materials);
                var mesh = new THREE.Mesh(geometry, material);

                mesh.name = "PL";
                mesh.receiveShadow = true;
                mesh.receiveShadow = true;
                mesh.scale.set(5, 5, 5);

                pasillos.add(mesh);
            }
        );

        /*loader.load(
            "js/modelos/nave/ship.js",
            function (geometry, materials) {
                var material = new THREE.MeshFaceMaterial(materials);
                var mesh = new THREE.Mesh(geometry, material);

                mesh.name = "Ship";
                mesh.receiveShadow = true;
                mesh.receiveShadow = true;
                mesh.scale.set(0.10, 0.10, 0.10);
                mesh.position.set(0,-2.40,-9.52);

                scene.add(mesh);
            }
        );*/


        var ObstaclePromise = new Promise(function (resolve, reject) {
            loader.load(
                "js/modelos/pasillos/obizq.js",
                function (geometry, materials) {
                    //var material = new THREE.MeshFaceMaterial(materials);

                    resolve(geometry);
                }
            );
        });

        ObstaclePromise.then(function (mesh) {

            matObstaculo = new THREE.MeshLambertMaterial({
                color: 0x00ff00
            });

            var geom = mesh;

            obsIzq = new THREE.Mesh(geom, matObstaculo);

            obsIzq.scale.set(5, 5, 5);
            obsIzq.rotation.set(0, Math.PI / 2, 0);

            task2 = true;

        });

        mapGroup.castShadow = true;


        var bgmusic = new THREE.Audio(listener);
        soundLoader.load('music/music.ogg', function (buffer) {
            bgmusic.setBuffer(buffer);
            bgmusic.setVolume(0.3);
            bgmusic.setLoop(true);
            bgmusic.play();
        });

        analyzer1 = new THREE.AudioAnalyser(bgmusic, 32);

        //console.log(pasillos);

        /*var obj3d = scene.getObjectByName('PAS');

         //console.log(obj3d);
         var children = obj3d.children;

         console.log(children.length);

         for(var i = children.length-1;i>=0;i--){
         children[i].scale.set(1,1,1);
         console.log("Sup");
         }*/

        //pasillos.children[0].position.x = -100;

        //scene.add(pasillos);


        light = new THREE.PointLight(0xffffff, 0.5, 100);
        light.position.set(0, 10, -5);
        light.castShadow = true;
        //scene.add(light);

        var color = "0x" + randColor();

        light2 = new THREE.PointLight(0xffffff, 0, 0);
        light2.position.set(0, 10, -5);
        light2.castShadow = true;


        scene.add(light2);

        var sphereSize = 2;
        var pointLightHelper = new THREE.PointLightHelper(light2, sphereSize);
        scene.add(pointLightHelper);


        /*var light = new THREE.DirectionalLight( 0xffffff );
         light.position.set( 1, 1, 1 );
         light.castShadow = true;
         light.name = "Directional Light";
         scene.add( light );

         light = new THREE.AmbientLight(0x4c4c4c);
         light.name = "Ambient Light";
         scene.add(light);*/

        camera.position.set(0, player.height, -5);
        camera.lookAt(new THREE.Vector3(0, player.height, 0));

        render3D = new THREE.WebGLRenderer();

        //render3D.autoClear = false;

        render3D.setPixelRatio(window.devicePixelRatio);

        render3D.setSize(game.innerWidth(), game.innerHeight());

        render3D.gammaInput = true;

        render3D.shadowMap.enabled = true;
        render3D.shadowMap.type = THREE.PCFSoftShadowMap;

        render3D.shadowCameraNear = 3;
        render3D.shadowCameraFar = camera.far;
        render3D.shadowCameraFov = 50;

        render3D.shadowMapBias = 0.0039;
        render3D.shadowMapDarkness = 0.5;
        render3D.shadowMapWidth = 1024;
        render3D.shadowMapHeight = 1024;


        document.getElementById("game").appendChild(render3D.domElement);


        window.scene = scene;


        /*controls = new THREE.OrbitControls( camera, render3D.domElement);
         controls.enableDamping = true;
         controls.dampingFactor = 0.25;
         controls.enableZoom = true;*/

        timer01.start();


    }

    function randColor() {
        var color = (function lol(m, s, c) {
            return s[m.floor(m.random() * s.length)] +
                (c && lol(m, s, c - 1));
        })(Math, '3456789ABCDEF', 4);
        return color;
    }

    /* setInterval(function () {
     light2.color.setHex( Number('0x'+randColor()) );
     }, 200);*/

    var last = 0;
    var cont = 0;

    function animate(now) {
        requestAnimationFrame(animate);


        if (task2) {
            var temp;

            for (var i = 0; i < 13; i++) {
                temp = obsIzq.clone();
                var bbox = new THREE.BoundingBoxHelper(temp,0xff0000);

                temp.position.z = (40 * i) + 20;
                bbox.update();




                obstGroup.add(temp);
                obstGroup.add(bbox);
            }
            scene.add(obstGroup);
            task2 = false;
        }

        var delta = timer01.getDelta();

        //player.speed += delta * analyzer1.getAverageFrequency()/40;
        player.speed = analyzer1.getAverageFrequency() / 4;//Math.min(player.speed,player.maxSpeed);


        var elapsed = timer01.getElapsedTime();


        if (!last || now - last >= 352) {
            last = now;
            //$("#score").text("Intensidad Luz: " + analyzer1.getAverageFrequency() / 50);
            //light2.color.setHex( Number(randiiiC) );
            /*light2.color.r = Math.random();
             light2.color.g = Math.random();
             light3.color.b = Math.random();*/

        }
        //light2.color.r = (Math.sin(0.0353*cont + 0) * 127 + 128)/255;
        //light2.color.g = (Math.sin(0.0353*cont + 2) * 127 + 128)/255;
        //light2.color.b = (Math.sin(0.0353*cont + 4) * 127 + 128)/255;

        cont++;
        //$("#score").text("Intensidad Luz: " + analyzer1.getAverageFrequency() / 50 + "Distancia: " + analyzer1.getAverageFrequency());
        $("#inte").text("Tiempo: " + timer01.getElapsedTime());
        $("#dist").text("Velocidad: " + player.speed);
        $("#dist").text("Distancia: " + mapGroup.position.z);
        //$("#cR").text("Color: " + (Math.sin(0.01*cont + 0) * 127 + 128)/255 + "," + (Math.sin(0.01*cont + 2) * 127 + 128)/255 + "," +(Math.sin(0.01*cont + 4) * 127 + 128)/255);


        if (elapsed >= "5" && elapsed <= "10") {
            light2.intensity += delta * 0.1;
        }
        light2.distance = analyzer1.getAverageFrequency();

        if (taskF) {



            /*var cost = neonLights.children;

            if (task3){
                cost[0].material.materials[0].emissiveMap = emissiveM;
                //console.log(cost[0].material.materials[0].emissiveMap);
                task3 = false;
                taskF = false;
            }*/


            coso.emissive.r = (Math.sin(0.00353 * cont) * 127 + 128) / 255;
            coso.emissive.g = (Math.cos(0.00353 * cont + 2) * 127 + 128) / 255;
            coso.emissive.b = -(Math.sin(0.00353 * cont + 4) * 127 + 128) / 255;

           /* coso.color.g = (Math.sin(0.00353 * cont) * 127 + 128) / 255;
            coso.color.b = (Math.cos(0.00353 * cont + 2) * 127 + 128) / 255;
            coso.color.r = -(Math.sin(0.00353 * cont + 4) * 127 + 128) / 255;

            /*coso.color.r = analyzer1.getAverageFrequency() / 255;
             coso.color.g = analyzer1.getAverageFrequency() / 255;
             coso.color.b = analyzer1.getAverageFrequency() / 255;*/

            coso.emissiveIntensity = analyzer1.getAverageFrequency() / 255;
        }

        ///phong1SG

        if (elapsed >= "10") {
            mapGroup.position.z -= delta * player.speed;
            mapGroup2.position.z -= delta * player.speed;
            neonLights.position.z -= delta * player.speed;
            obstGroup.position.z -= delta * player.speed;
        }

        if (mapGroup.position.z <= -480) {
            mapGroup.position.z = 0;
            mapGroup2.position.z = 0;
            neonLights.position.z = 0;
            obstGroup.position.z = 0;
        }

        //controls.update();
        /*if (keyboard[87]) {
            camera.position.x -= Math.sin(camera.rotation.y) * 0.5;
            camera.position.z -= -Math.cos(camera.rotation.y) * 0.5;

            light.position.x -= Math.sin(camera.rotation.y) * 0.5;
            light.position.z -= -Math.cos(camera.rotation.y) * 0.5;

            light2.position.x -= Math.sin(camera.rotation.y) * 0.5;
            light2.position.z -= -Math.cos(camera.rotation.y) * 0.5;

            camera.updateProjectionMatrix();
        }

        if (keyboard[83]) {
            camera.position.x += Math.sin(camera.rotation.y) * 0.5;
            camera.position.z += -Math.cos(camera.rotation.y) * 0.5;

            light.position.x += Math.sin(camera.rotation.y) * 0.5;
            light.position.z += -Math.cos(camera.rotation.y) * 0.5;

            light2.position.x += Math.sin(camera.rotation.y) * 0.5;
            light2.position.z += -Math.cos(camera.rotation.y) * 0.5;

            camera.updateProjectionMatrix();
        }*/


        if(keyboard[65] || keyboard[37]) { // Tecla A
            player.slideSpeed += player.slideAcceleration;
            player.slideSpeed = Math.min(player.slideSpeed,player.maxSideSpeed);
        }else if(keyboard[68] || keyboard[39]) { // Tecla D
            player.slideSpeed -= player.slideAcceleration;
            player.slideSpeed = Math.max(player.slideSpeed,-player.maxSideSpeed);
        }else{
            player.slideSpeed *= 0.8;
        }

        var next = camera.position.x + delta * player.slideSpeed;

        if(next > 7 || next < -7){
            player.slideSpeed = -player.slideSpeed * 1;
        }

        camera.position.x += delta * player.slideSpeed;

        mapGroup.rotation.z = delta *player.slideSpeed * 0.28;
        mapGroup2.rotation.z = delta * player.slideSpeed * 0.28;
        neonLights.rotation.z = delta * player.slideSpeed * 0.28;
        obstGroup.rotation.z = delta * player.slideSpeed * 0.28;

        if(keyboard[87]) {
            player.pitchSpeed += player.pitchAcceleration;
            player.pitchSpeed = Math.min(player.pitchSpeed,player.pitchMaxSpeed);
        }else if(keyboard[83]) {
            player.pitchSpeed -= player.pitchAcceleration;
            player.pitchSpeed = Math.min(player.pitchSpeed,player.pitchMaxSpeed);
        }else {
            player.pitchSpeed *= 0.8;
        }

        var next2 = camera.position.y + delta * player.pitchSpeed;

        //console.log(next2);

        if(next2 < player.minHeight || next2 > player.maxHeight){
            player.pitchSpeed = -player.pitchSpeed * 1;
        }

        camera.position.y += delta * player.pitchSpeed;


        /*if (keyboard[37]) {
            camera.rotation.y -= Math.PI * 0.02;
            camera.updateProjectionMatrix();
        }

        if (keyboard[39]) {
            camera.rotation.y += Math.PI * 0.02;
            camera.updateProjectionMatrix();
        }*/

        console.log(player.pitchAcceleration);

        render3D.render(scene, camera);

    }
});