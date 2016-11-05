var AppConfig = {

};


var AppMain = function() {
	var camera, renderer, mainScene;
	var stats;
    var isLoading;

	function init () {
		stats = new Stats();
        isLoading = true;
		stats.showPanel(0);
		document.body.appendChild( stats.dom );

		camera = new THREE.PerspectiveCamera( 103, window.innerWidth / window.innerHeight, 0.1, 1000 );

        mainScene = new THREE.Scene();

        //mainScene.fog = new THREE.Fog(0xffffff, 0.015, 100);

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

    }

    function renderG() {
        requestAnimationFrame(renderG);
        stats.begin();
        if(!isLoading){
            animate();
            renderer.render(mainScene,camera);
        }
        stats.end();
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
        }
    }
}();

$(document).ready(function() {

	AppMain.init();

	$(window).resize(function() {
        AppMain.resize();
    });

});