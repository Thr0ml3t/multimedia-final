/**
 * Created by thr0m on 28/09/2016.
 */
$(function () {
    var scene, camera, render3D, aspect;
    var controls;

    var pasillos = new THREE.Group();

    var groups = [];

    var keyboard = {};

    var player = { height: 5.0, speed: 0.5 };

    var cont = $("#game");

    var mapGroup,mapGroup2;

    var light,light2;

    var timer01;

    var listener;

    var analyzer1;

    init();

    $(window).on("resize", function () {
        aspect = cont.innerWidth() / cont.innerHeight();
        camera.aspect = aspect;
        camera.updateProjectionMatrix();

        render3D.setSize(cont.innerWidth(), cont.innerHeight());
    });

    $(window).on("keydown", function (e) {
        keyboard[e.keyCode] = true;
    });

    $(window).on("keyup", function (e) {
        keyboard[e.keyCode] = false;
    });

    function init(){

        timer01 = new THREE.Clock();
        scene = new THREE.Scene();
        aspect = cont.innerWidth() / cont.innerHeight();

        camera = new THREE.PerspectiveCamera(90, aspect, 0.1, 1000);

        listener = new THREE.AudioListener();
        camera.add(listener);

        var loader = new THREE.JSONLoader();

        var soundLoader = new THREE.AudioLoader();

        mapGroup = new THREE.Object3D();
        mapGroup2 = new THREE.Object3D();

        pasillos.name = "PAS";


        loader.load(
            "js/modelos/pasillos/p1.js",
            function (geometry, materials) {
                var material = new THREE.MeshFaceMaterial(materials);
                var mesh = new THREE.Mesh(geometry,material);

                mesh.name = "Px1";
                mesh.receiveShadow = true;
                mesh.receiveShadow = true;
                mesh.scale.set(5,5,5);
                var copy;
                for(var i = 0;i < 15; i++){
                    copy = mesh.clone();

                    copy.name = "Pasillo - " + i;

                    copy.scale.set(5,5,5);
                    copy.rotation.set(0,Math.PI/2,0);
                    copy.position.z = (40 * i);

                    mapGroup.add(copy);
                }

                //pasilloGroup.name("Pasillos");
                //scene.add(pasilloGroup);
            }
        );

        loader.load(
            "js/modelos/pasillos/p2.js",
            function (geometry, materials) {
                var material = new THREE.MeshFaceMaterial(materials);
                var mesh = new THREE.Mesh(geometry,material);

                mesh.name = "Px2";

                mesh.receiveShadow = true;
                mesh.receiveShadow = true;
                mesh.scale.set(5,5,5);

                var copy;
                for(var i = 0;i < 14; i++){

                    copy = mesh.clone();

                    copy.name = "Pasillo 2 - " + i;

                    copy.scale.set(5,5,5);
                    copy.rotation.set(0,Math.PI/2,0);
                    copy.position.z = (40 * i) + 20;

                    mapGroup2.add(copy);
                }


                /*mesh.position.x = 44.45;
                mesh.position.z = -0.5;

                pasillos.add(mesh);*/
            }
        );

        loader.load(
            "js/modelos/pasillos/pl.js",
            function (geometry, materials) {
                var material = new THREE.MeshFaceMaterial(materials);
                var mesh = new THREE.Mesh(geometry,material);

                mesh.name = "PL";
                mesh.receiveShadow = true;
                mesh.receiveShadow = true;
                mesh.scale.set(5,5,5);

                pasillos.add(mesh);
            }
        );

        groups.push(mapGroup);
        groups.push(mapGroup2);

        scene.add(groups[0]);
        scene.add(groups[1]);

        var test = groups[0];

        test.name = "Holi";

        scene.add(test);


        var bgmusic = new THREE.Audio(listener);
        soundLoader.load('music/music.ogg',function (buffer) {
            bgmusic.setBuffer(buffer);
            bgmusic.setVolume(0.5);
            bgmusic.setLoop(true);
            bgmusic.play();
        });

        analyzer1 = new THREE.AudioAnalyser(bgmusic,32);

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


        light = new THREE.PointLight(0xffffff,0.5,100);
        light.position.set(0,10,-5);
        light.castShadow = true;
        //scene.add(light);

        var color = "0x"+randColor();

        light2 = new THREE.PointLight(Number(color),1,30);
        light2.position.set(0,10,-5);
        light2.castShadow = true;
        scene.add(light2);

        var sphereSize = 2;
        var pointLightHelper = new THREE.PointLightHelper( light2, sphereSize );
        scene.add( pointLightHelper );


        /*var light = new THREE.DirectionalLight( 0xffffff );
        light.position.set( 1, 1, 1 );
        light.castShadow = true;
        light.name = "Directional Light";
        scene.add( light );

        light = new THREE.AmbientLight(0x4c4c4c);
        light.name = "Ambient Light";
        scene.add(light);*/

        camera.position.set(0,player.height,-5);
        camera.lookAt(new THREE.Vector3(0,player.height,0));

        render3D = new THREE.WebGLRenderer();

        render3D.setSize(cont.innerWidth(), cont.innerHeight());

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

        animate();
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
    function animate(now) {
        requestAnimationFrame(animate);

        var delta = timer01.getDelta();

        var randiiiC = "000000".replace(/0/g,function(){return (~~(Math.random()*16)).toString(16);});

        randiiiC = '0x'+randiiiC;

        if(!last || now - last >= 2*1000){
            last = now;
            $("#score").text("Intensidad Luz: " + analyzer1.getAverageFrequency() / 50);
            //light2.color.setHex( Number(randiiiC) );
        }
        $("#score").text("Intensidad Luz: " + analyzer1.getAverageFrequency() / 50 + "Distancia: " + analyzer1.getAverageFrequency());
        light2.intensity = analyzer1.getAverageFrequency() / 50;
        light2.distance = analyzer1.getAverageFrequency();

        //


        /*mapGroup.position.z -= delta * 50;
        mapGroup2.position.z -= delta * 50;*/

        //controls.update();
        if(keyboard[87]) {
            camera.position.x -= Math.sin(camera.rotation.y) * player.speed;
            camera.position.z -= -Math.cos(camera.rotation.y) * player.speed;

            light.position.x -= Math.sin(camera.rotation.y) * player.speed;
            light.position.z -= -Math.cos(camera.rotation.y) * player.speed;

            light2.position.x -= Math.sin(camera.rotation.y) * player.speed;
            light2.position.z -= -Math.cos(camera.rotation.y) * player.speed;

            camera.updateProjectionMatrix();
        }

        if(keyboard[83]) {
            camera.position.x += Math.sin(camera.rotation.y) * player.speed;
            camera.position.z += -Math.cos(camera.rotation.y) * player.speed;

            light.position.x += Math.sin(camera.rotation.y) * player.speed;
            light.position.z += -Math.cos(camera.rotation.y) * player.speed;

            light2.position.x += Math.sin(camera.rotation.y) * player.speed;
            light2.position.z += -Math.cos(camera.rotation.y) * player.speed;

            camera.updateProjectionMatrix();
        }

        if(keyboard[37]) {
            camera.rotation.y -= Math.PI * 0.02;
            camera.updateProjectionMatrix();
        }

        if(keyboard[39]) {
            camera.rotation.y += Math.PI * 0.02;
            camera.updateProjectionMatrix();
        }

        render3D.render(scene, camera);
    }
});