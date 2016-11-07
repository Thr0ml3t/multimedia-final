var AppConfig = {

};


var AppMain = function() {
	var camera, renderer, mainScene;
	var stats;
    var isLoading;
    var keyboard = {};

	function init () {
		stats = new Stats();
        isLoading = true;
		stats.showPanel(0);
		document.body.appendChild( stats.dom );

		camera = new THREE.PerspectiveCamera( 103, window.innerWidth / window.innerHeight, 0.1, 1000 );
        camera.position.y = 10.0;
        camera.lookAt(new THREE.Vector3(0,-10,-15));

        mainScene = new THREE.Scene();

        mainScene.fog = new THREE.FogExp2(0xb9ddf6, 0.005);

        window.scene = mainScene;

		camera.position.set(0,0,-5);
        camera.lookAt(new THREE.Vector3(0, 0, 0));

		renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize( window.innerWidth, window.innerHeight );
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        $("#juego").append(renderer.domElement);

        AppLoader.load();

        resizeCamera();
        renderG();
	}

	function resizeCamera() {
        var w = window.innerWidth;
        var h = window.innerHeight;

        renderer.setSize( w ,h );

        camera.aspect = w / h;
        camera.updateProjectionMatrix();
    }

    function animate() {
        AppJuego.animate();
    }

    function renderG() {
        stats.begin();
        if(!isLoading){
            animate();
            renderer.render(mainScene,camera);
        }
        stats.end();
        requestAnimationFrame(renderG);
    }

    function keyDown(keyCode){
        keyboard[keyCode] = true;
    }

    function keyUp(keyCode){
        keyboard[keyCode] = false;
    }


    return {
    	init: init,
    	resize: resizeCamera,
    	getCamera: function(){
    		return camera;
    	},
    	getRenderer: function(){
    		return renderer;
    	},
        getIsLoading: function () {
            return isLoading;
        },
        getScene: function () {
            return mainScene;
        },
        setIsLoading: function (loading) {
            isLoading = loading;
        },
        keyUp: keyUp,
        keyDown: keyDown,
        getKey: function () {
            return keyboard;
        }
    }
}();

$(document).ready(function() {

	AppMain.init();

	$(window).resize(function() {
        AppMain.resize();
    });

    $(window).on("keydown", function (e) {
        AppMain.keyDown(e.keyCode)
    });

    $(window).on("keyup", function (e) {
        AppMain.keyUp(e.keyCode);
    });

});