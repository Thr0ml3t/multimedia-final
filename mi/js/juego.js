var AppJuego = function() {

	var assets;

    var torretaTest;

    var scn; // Variable para alamcenar la escena

    var lights = {
        luzAmbiental: null,
        luz1: null
    };

    var floor;

    var moveGroup;

    var pista,edificiosL,edificiosR;

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
         * Agrega todos nuestros elementos a la escena
         */
        scn.add(sky);
        scn.add(lights.luzAmbiental);
        scn.add(lights.luz1);
        scn.add(moveGroup);


        timer01.start();
	}

    function animate(){
        var delta = timer01.getDelta();
        var speed = 50 * delta;

        moveGroup.position.z -= speed;

        console.log(moveGroup.position.z);


        /*if(moveGroup.position.z <= -840){
            moveGroup.position.z = 0;
        }*/
    }


	return {
        init: init,
        animate: animate
	}
}();