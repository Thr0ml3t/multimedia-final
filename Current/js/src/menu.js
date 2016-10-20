/**
 * Created by thr0m on 05/10/2016.
 */


var TEMenu = function () {

    var scene;
    var cam;
    var movingGroup = [];

    function openMenu() {
        $("#menu").addClass("animated zoomInDown");
        $("#menu").one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
            $("#menu").removeClass("animated zoomInDown");
        });
        $("#menu").show();
        TEConfig.mode = TEConfig.modes.menu;
        /*TEConfig.isMenu = true;*/
        //$("#myNav").fadeIn();
        /*$("#myNav").css("opacity","1.0");
        $("#myNav").css("z-index","1");*/
    };

    function closeMenu() {
        $("#menu").removeClass("animated zoomInDown");
        $("#menu").addClass("animated zoomOutDown");
        $("#menu").hide();
        //$("#myNav").fadeOut(400);
        /*$("#myNav").css("opacity","0");
        $("#myNav").css("z-index","-1");*/
    };

    function startGame() {
        $("#menu").addClass("animated zoomOutDown");
        $("#loading").append('Cargando 0%' );
        $("#menu").one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
            $("#menu").hide();
        });
        TEConfig.mode = TEConfig.modes.loading;
        /*TEConfig.isLoading = true;
        TEConfig.isMenu = false;*/
        //$("#myNav").css("opacity","0");
    };

    function init() {
        scene = TEMain.getMenuScene();

        cam = TEMain.getCamera();

        cam.far = 2000;
        cam.updateProjectionMatrix();



        for ( var z= -1000; z < 1000; z+=20 ) {

            var geometry   = new THREE.SphereGeometry(0.5, 32, 32)
            var material = new THREE.MeshPhongMaterial({
                color: 0x000000,
                emissive: 0x9db4ff,
                emissiveIntensity: 1
            });
            var sphere = new THREE.Mesh(geometry, material)


            sphere.position.x = Math.random() * 1000 - 500;
            sphere.position.y = Math.random() * 1000 - 500;

            sphere.position.z = z;

            sphere.scale.x = sphere.scale.y = 2;

            scene.add( sphere );

            movingGroup.push(sphere);
        }
    };

    function animateMenu(delta) {
        for(var i=0; i<movingGroup.length; i++) {
            star = movingGroup[i];

            star.position.z +=  delta * i;

            if(star.position.z>2000) star.position.z-=3000;

        }

    };

    return {
        openMenu: openMenu,
        closeMenu: closeMenu,
        startGame: startGame,
        init: init,
        animateMenu: animateMenu
    }

}();