// Tamaño de la pista 16,000

var AppJuego = function() {

    var jugador = {
        vel: 0.0,
        velMaxima: 150.0,
        accel: 0.1,
        slideSpeed: 0.0,
        slideAccel: 10.0,
        maxSlideSpeed: 40.0
    };

	var assets;

    var scn, cam; // Variable para alamcenar la escena

    var lights = {
        luzAmbiental: null,
        luz1: null
    };

    var floor;

    var moveGroup;

    var pista,edificiosL,edificiosR,torretas,nave,sky;

    var torrArray = [null,null,null];

    var torrets = [];

    var naveBB,bbox;

    var timer01;

	function init() {

        timer01 = new THREE.Clock();

        scn = AppMain.getScene();
		assets = AppLoader.getAssets();
        cam = AppMain.getCamera();

        lights.luzAmbiental = new THREE.AmbientLight(0xffffff, 0.5);
        lights.luzAmbiental.name = 'Ambient Light';

        lights.luz1 = new THREE.DirectionalLight( 0xffffff, 0.5 );
        lights.luz1.castShadow = true;
        lights.luz1.name = 'Directional Light';

        moveGroup = new THREE.Object3D();
        moveGroup.name = 'Moving Group';

        pista = new THREE.Object3D();
        pista.name = 'Pista';

        edificiosL = new THREE.Object3D();
        edificiosL.name = 'Edificios Izquierda';

        edificiosR = new THREE.Object3D();
        edificiosR.name = 'Edificios Derecha';

        torretas = new THREE.Object3D();
        torretas.name = 'Torretas';

        moveGroup.position.y = -10;


        torrArray[0] = assets.torreta1.mesh;
        torrArray[1] = assets.torreta2.mesh;
        torrArray[2] = assets.torreta3.mesh;

        /**
         * Genera las toretas :O
         */
        for(var i = 0; i < 300; i++){
            var posRandX = Math.random();
            var posRandY = Math.random();
            var turretSelect = Math.floor((Math.random() * 3) + 0);

            var clone = torrArray[turretSelect].clone();

            clone.scale.set(2,2,2);
            clone.position.x = posRandX * 90 - 90/2;
            clone.position.z = - (posRandY * 50000) + 50000/2;
            clone.position.y = -6;
            clone.rotation.y = Math.PI;

            var turretBB = new THREE.BoundingBoxHelper(clone,0x00ff00);
            turretBB.update();
            turretBB.box.expandByVector(new THREE.Vector3(0,5,0));
            //scn.add(turretBB);

            torretas.add(clone);
            torrets.push(turretBB);

        }

        moveGroup.add(torretas);

        /**
         * Carga la Pista :D
         */
        for(var i = 0; i < 200; i++){
            var clone = assets.pista.mesh.clone();

            clone.position.z = i * 23.9 * 5;
            clone.position.y = -5.1;
            clone.receiveShadow = true;
            clone.name = 'Pista ' + i;
            clone.scale.set(5,5,5);

            pista.add(clone);
        }

        moveGroup.add(pista);

        /**
         * Genera los edificios de los lados
         */

        for (var i = 0; i < 300; i++){
            var clone = assets.edificio.mesh.clone();

            var randScale = Math.random() * (10 - 8) + 8;

            clone.scale.set(randScale,randScale,randScale);
            clone.position.y = -10;
            clone.position.x = 90;
            clone.name = 'Edificio-' + i;
            clone.position.z = i * 80;

            var randRot = THREE.Math.degToRad(Math.floor(Math.random() * (360 - 1)) + 0.5);

            clone.rotation.y = randRot;

            edificiosL.add(clone);
        }

        for (var i = 0; i < 300; i++){
            var clone = assets.edificio.mesh.clone();

            var randScale = Math.random() * (10 - 8) + 8;

            clone.scale.set(randScale,randScale,randScale);
            clone.position.y = -10;
            clone.position.x = -90;
            clone.name = 'Edificio-' + i;
            clone.position.z = i * 80;

            var randRot = THREE.Math.degToRad(Math.floor(Math.random() * (360 - 1)) + 2);

            clone.rotation.y = randRot;

            edificiosR.add(clone);
        }

        moveGroup.add(edificiosL);
        moveGroup.add(edificiosR);


        /**
         * Genera un suelo :b
         */
        floor = new THREE.Mesh(
            new THREE.PlaneGeometry(70000,70000,32,32),
            assets.ground.material
        );

        floor.rotation.x = -Math.PI / 2;
        floor.position.y = -5.5;

        floor.castShadow = false;
        floor.receiveShadow = true;

        floor.name = 'Suelo';

        moveGroup.add(floor);

        /*
         * Cielo
         */
        var skyGeo = new THREE.SphereGeometry(500,25,25);

        var skyMat = new THREE.MeshBasicMaterial({
            map: assets.skyDome.texture
        });

        sky = new THREE.Mesh(skyGeo,skyMat);
        sky.material.side = THREE.BackSide;
        sky.name = 'Sky Dome';

        /**
         * Nave O.o
         */
        nave = assets.falcon.mesh.clone();

        nave.name = 'Nave';

        nave.position.y = -13;
        nave.scale.set(10,10,10);

        bbox = new THREE.BoundingBoxHelper(nave,0xff0000);

        console.log(bbox);

        //scn.add(bbox);

        naveBB = new THREE.Box3().setFromObject(nave);


        scn.add(nave);
        /**
         * Agrega todos nuestros elementos a la escena
         */
        scn.add(sky);
        scn.add(lights.luzAmbiental);
        scn.add(lights.luz1);
        scn.add(moveGroup);


        timer01.start();
	}

	function controlNave(delta) {
        var keyB = AppMain.getKey();

        if (keyB[87]){
            if(jugador.vel < jugador.velMaxima){
                jugador.vel += jugador.accel;
            }
        }else{
            if(jugador.vel > 0){
                jugador.vel -= jugador.accel;
            }
        }

        if(keyB[83]){
            if(jugador.vel > 0){
                jugador.vel -= jugador.accel * 10.0;
            }
        }

        if(jugador.vel > 0){
            if(keyB[65]){
                jugador.slideSpeed += jugador.slideAccel;
                jugador.slideSpeed = Math.min(jugador.slideSpeed,jugador.maxSlideSpeed);
            }else if(keyB[68]){
                jugador.slideSpeed -= jugador.slideAccel;
                jugador.slideSpeed = Math.max(jugador.slideSpeed,-jugador.maxSlideSpeed);
            }else{
                jugador.slideSpeed *= 0.8;
            }
        }

        var next = nave.position.x + jugador.slideSpeed * delta;

        if(next > 45 || next < -45){
            jugador.slideSpeed = -jugador.slideSpeed * 1;

        }
    }

    function animate(){
        var delta = timer01.getDelta();

        /**
         * Controla la nave :b
         */
        controlNave(delta);

        bbox.update();

        for(var i = 0; i < torrets.length; i++){
            var col = bbox.box.intersectsBox(torrets[i].box);
            if(col){
                console.log(col);
                jugador.vel = 0;

            }
        }

        nave.rotation.z = -jugador.slideSpeed * delta * 0.2;
        nave.rotation.x = -jugador.vel * delta * 0.05;
        nave.position.x += jugador.slideSpeed * delta;
        nave.position.z += jugador.vel * delta;
        cam.position.x = nave.position.x;
        cam.position.z = nave.position.z-25;
        sky.position.z = nave.position.z;

    }


	return {
        init: init,
        animate: animate
	}
}();