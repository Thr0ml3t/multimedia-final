/**
 * Created by thr0m on 05/10/2016.
 */
var TEConfig = {
    fxSound: false,
    bgMusic: true,
    isMenu: true,
    isLoading: true,
    isPlaying: false,

    level_W: 560,
    level_D: 20,
    step: 480
};

var TEMain = function () {
    var sceneLoading,mainScene,menuScene;
    var camera,renderer,audioListener;

    var stats;


    function init() {
        sceneLoading = new THREE.Scene();
        mainScene = new THREE.Scene();
        menuScene = new THREE.Scene();

        THREE.Cache.enabled = true;

        stats = new Stats();
        stats.showPanel(1);
        document.body.appendChild( stats.dom );


        mainScene.fog = new THREE.FogExp2(0x000000, 0.01);
        camera = new THREE.PerspectiveCamera( 90, window.innerWidth/window.innerHeight , 1, 100000 );

        camera.position.set(0, 10, -5);
        camera.lookAt(new THREE.Vector3(0, 10, 0));

        audioListener = new THREE.AudioListener;
        camera.add(audioListener);

        renderer = new THREE.WebGLRenderer();
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize( window.innerWidth, window.innerHeight );
        renderer.setClearColor( 0x000000, 1 );
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.Type = THREE.PCFSoftShadowMap;

        $("#game").append(renderer.domElement);

        window.scene = mainScene;


        TEMenu.init();
        resize();
        render();

    };

    $(window).resize(function() {
        resize();
    });


    function resize() {
        var w = window.innerWidth;
        var h = window.innerHeight;

        renderer.setSize( w ,h );
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
    }

    function render() {
        requestAnimationFrame(render);
        stats.begin();
        if(TEConfig.isMenu){

            TEMenu.animateMenu();
            renderer.render(menuScene,camera);
        }else{
            if(TEConfig.isLoading){
                TEGame.loadinAnimate();
                renderer.render(sceneLoading,camera);
                console.log("Cargando");
            }else {
                renderer.render(mainScene,camera);
                //console.log("Main Render");
            }
        }
        stats.end();
    }

    return {
        init: init,
        getMenuScene: function(){return menuScene;},
        getMainScene: function(){return mainScene;},
        getLoadingScene: function(){return sceneLoading;},
        getAudioListener: function(){return audioListener;}
    }

}();



$(document).ready(function () {
    TEMenu.openMenu();

    TEMain.init();

    $("#closeNav").click(function () {
        TEMenu.closeMenu();
    });

    $("#startGame").click(function () {
        TEGame.init();
        TEMenu.startGame();
    });
});