/**
 * Created by thr0m on 05/10/2016.
 */


var TEMenu = function () {

    var mesh;
    var scene;

    function openMenu() {
        $("#myNav").addClass("animated fadeInDown");
        TEConfig.isMenu = true;
        //$("#myNav").fadeIn();
        /*$("#myNav").css("opacity","1.0");
        $("#myNav").css("z-index","1");*/
    };

    function closeMenu() {
        $("#myNav").removeClass("animated fadeInDown")
        $("#myNav").addClass("animated fadeOutUp");
        //$("#myNav").fadeOut(400);
        /*$("#myNav").css("opacity","0");
        $("#myNav").css("z-index","-1");*/
    };

    function startGame() {
        $("#myNav").removeClass("animated fadeInDown");
        $("#myNav").addClass("animated fadeOutUp");
        TEConfig.isLoading = true;
        TEConfig.isMenu = false;
        //$("#myNav").css("opacity","0");
    };

    function init() {
        scene = TEMain.getMenuScene();

        mesh = new THREE.Mesh(
            new THREE.BoxGeometry(1,1,1),
            new THREE.MeshBasicMaterial({color: 0xff4444, wireframe: false})
        );

        mesh.position.z = 5;

        scene.add(mesh);
    };

    function animateMenu() {
        mesh.rotation.x += 0.01;
        mesh.position.x -= 0.05;
        if(mesh.position.x < -15) mesh.position.x = 15;
        mesh.position.y = Math.sin(mesh.position.x)+10;
    };

    return {
        openMenu: openMenu,
        closeMenu: closeMenu,
        startGame: startGame,
        init: init,
        animateMenu: animateMenu
    }

}();