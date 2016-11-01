/**
 * Created by thr0m on 05/10/2016.
 */
var TEConfig = {
    fxSound: false,
    bgMusic: true,
    isMenu: true,
    isLoading: true,
    isPlaying: false,
    modes: {
        menu: 1,
        loading: 2,
        game: 3
    },
    mode: 1,

    level_W: 560,
    level_D: 20,
    step: 480
};

var TEMain = function () {
    var camera,renderer,audioListener;

    var stats;

    function init() {

        THREE.Cache.enabled = true;

        stats = new Stats();
        stats.showPanel(0);
        document.body.appendChild( stats.dom );

        camera = new THREE.PerspectiveCamera( 103, window.innerWidth/window.innerHeight , 0.1, 100 );

        camera.position.set(0, 10, -5);
        camera.lookAt(new THREE.Vector3(0, 10, 0));

        audioListener = new THREE.AudioListener;
        camera.add(audioListener);

        renderer = new THREE.WebGLRenderer( { antialias: false } );
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize( window.innerWidth, window.innerHeight );
        renderer.setClearColor( 0x000000, 1 );
        renderer.autoClear = false;
        renderer.sortObjects = false;
        //renderer.shadowMap.enabled = true;
        //renderer.shadowMap.Type = THREE.PCFSoftShadowMap;

        $("#game").append(renderer.domElement);

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

        TEMenu.resizeMenu();

        camera.aspect = w / h;
        camera.updateProjectionMatrix();
    }

    function render() {
        requestAnimationFrame(render);
        stats.begin();

        switch (TEConfig.mode){
            case 1:
                TEMenu.animateMenu();
                //renderer.render(menuScene,camera);
                break;
            case 2:
                TEGame.loadinAnimate();
                //renderer.render(sceneLoading,camera);
                console.log("Cargando");
                break;
            case 3:
                TEGame.mainAnimate();
                //renderer.render(mainScene,camera);
                break;
            default:
                break;
        }

        stats.end();
    }

    return {
        init: init,
        getAudioListener: function(){
            return audioListener;
        },
        getCamera: function(){
            return camera;
        },
        getRenderer: function () {
            return renderer;
        }
    }

}();



$(document).ready(function () {
    TEMenu.openMenu();

    TEMain.init();

    var menuSound = new Howl({
        src: ['assets/sonidos/menu/hover-menu.WAV'],
        volume: 0.5
    });

    var confirmSound = new Howl({
        src: ['assets/sonidos/menu/confirm.WAV'],
        volume: 0.5
    });

    $("#startGame").click(function () {
        confirmSound.play();
        TEGame.init();
        TEMenu.startGame();
    });

    $("#menu a").mouseenter(function () {
        menuSound.play();
    });
});