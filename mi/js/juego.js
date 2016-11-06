var AppJuego = function() {

    var jugador = {
        vel: 0.0,
        velMaxima: 100.0,
        accel: 0.1,
        slideSpeed: 0.0,
        slideAccel: 10.0,
        maxSlideSpeed: 40.0
    };

	var assets;

    var scn; // Variable para alamcenar la escena

    var lights = {
        luzAmbiental: null,
        luz1: null
    };

    var floor;

    var moveGroup;

    var pista,edificiosL,edificiosR, nave;

    var timer01;

	function init() {

        timer01 = new THREE.Clock();

        scn = AppMain.getScene();
		assets = AppLoader.getAssets();

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

        moveGroup.position.y = -10;


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

        for (var i = 0; i < 200; i++){
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

        for (var i = 0; i < 200; i++){
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
            new THREE.PlaneGeometry(50000,50000,32,32),
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

        var sky = new THREE.Mesh(skyGeo,skyMat);
        sky.material.side = THREE.BackSide;
        sky.name = 'Sky Dome';

        /**
         * Nave O.o
         */
        nave = assets.falcon.mesh.clone();

        nave.position.y = -13;
        nave.position.z = 15;
        nave.scale.set(10,10,10);


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
                jugador.slideSpeed -= jugador.slideAccel;
                jugador.slideSpeed = Math.max(jugador.slideSpeed,-jugador.maxSlideSpeed);
            }else if(keyB[68]){
                jugador.slideSpeed += jugador.slideAccel;
                jugador.slideSpeed = Math.min(jugador.slideSpeed,jugador.maxSlideSpeed);
            }else{
                jugador.slideSpeed *= 0.8;
            }
        }

        var next = moveGroup.position.x + jugador.slideSpeed * delta;

        if(next > 45 || next < -45){
            jugador.slideSpeed = -jugador.slideSpeed * 1;

        }
    }

    function animate(){
        var delta = timer01.getDelta();
        //var speed = 50 * delta;

        /**
         * Controla la nave :b
         */
        controlNave(delta);

        nave.rotation.z = jugador.slideSpeed * delta * 0.2;
        moveGroup.position.x += jugador.slideSpeed * delta;
        moveGroup.position.z -= jugador.vel * delta;

        //console.log(moveGroup.position.z);

        /*if(moveGroup.position.z <= -840){
            moveGroup.position.z = 0;
        }*/
    }


	return {
        init: init,
        animate: animate
	}
}();