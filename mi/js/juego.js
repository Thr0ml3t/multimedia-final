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

    var pista;

	function init() {
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

        moveGroup.position.y = -10;


        for(var i = 0; i < 15; i++){
            var clone = assets.pista.mesh.clone();

            clone.position.z = i * 23.9 * 5;
            clone.position.y = -5.1;
            clone.receiveShadow = true;
            clone.name = 'Pista ' + i;
            clone.scale.set(5,5,5);

            pista.add(clone);
        }

        moveGroup.add(pista);

        floor = new THREE.Mesh(
            new THREE.PlaneGeometry(1000,1000,32,32),
            assets.ground.material
        );

        floor.rotation.x = -Math.PI / 2;
        floor.position.y = -5.5;

        floor.castShadow = false;
        floor.receiveShadow = true;

        floor.name = 'Suelo';

        /*
         * SkyDome
         */
        scn.background = assets.skyDome.textureC;

        moveGroup.add(floor);

        scn.add(lights.luzAmbiental);
        scn.add(lights.luz1);
        scn.add(moveGroup);
	}

    function animate(){

    }


	return {
        init: init,
        animate: animate
	}
}();