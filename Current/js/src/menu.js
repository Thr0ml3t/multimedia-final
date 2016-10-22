/**
 * Created by thr0m on 05/10/2016.
 */


var TEMenu = function () {

    var menuBlur = {};

    var finalScene = {};

    var sceneD;

    var cam;

    var renderer;

    var movingGroup = [];
    var movingGroup2 = [];

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
        menuBlur.scene = TEMain.getMenuScene();

        finalScene.scene = new THREE.Scene();

        renderer = TEMain.getRenderer();

        cam = TEMain.getCamera();

        cam.far = 2000;
        cam.updateProjectionMatrix();


        for ( var z= -1000; z < 1000; z+=20 ) {

            var geometry   = new THREE.SphereGeometry(0.5, 32, 32)
            var material = new THREE.MeshPhongMaterial({
                color: 0xffffff,
                emissive: 0x9db4ff,
                emissiveIntensity: 1
            });
            var sphere = new THREE.Mesh(geometry, material);


            sphere.position.x = Math.random() * 1000 - 500;
            sphere.position.y = Math.random() * 1000 - 500;

            sphere.position.z = z;

            sphere.scale.x = sphere.scale.y = 5;

            menuBlur.scene.add(sphere);
            var clone = sphere.clone();
            finalScene.scene.add(clone);

            movingGroup.push(sphere);
            movingGroup2.push(clone);

        }

        //finalScene.scene = menuBlur.scene.clone();


        // Escena Blur
        menuBlur.composer = new THREE.EffectComposer(renderer);

        menuBlur.renderPass = new THREE.RenderPass(menuBlur.scene,cam);
        menuBlur.composer.addPass(menuBlur.renderPass);


        menuBlur.blurPass = new THREE.ShaderPass(THREE.HorizontalBlurShader);
        menuBlur.blurPass.uniforms["h"].value = 3.0 / window.innerWidth;
        menuBlur.composer.addPass(menuBlur.blurPass);

        menuBlur.blurPass2 = new THREE.ShaderPass(THREE.VerticalBlurShader);
        menuBlur.blurPass2.uniforms["v"].value = 3.0 / window.innerHeight;
        menuBlur.composer.addPass(menuBlur.blurPass2);

        menuBlur.copyPass = new THREE.ShaderPass(THREE.CopyShader);
        menuBlur.composer.addPass(menuBlur.copyPass);

        menuBlur.composer.setSize(window.innerWidth,window.innerHeight);

        // Escena Final
        finalScene.renderPass = new THREE.RenderPass(finalScene.scene,cam);
        finalScene.blendPass = new THREE.ShaderPass(THREE.AdditiveBlendShader);
        finalScene.blendPass.uniforms["tAdd"].value = menuBlur.composer.renderTarget2.texture;
        finalScene.blendPass.uniforms["amount"].value = 2.0;
        finalScene.fxaaPass = new THREE.ShaderPass(THREE.FXAAShader);

        finalScene.composer = new THREE.EffectComposer(renderer);
        finalScene.composer.addPass(finalScene.renderPass);
        finalScene.composer.addPass(finalScene.blendPass);
        finalScene.composer.addPass(finalScene.fxaaPass);
        finalScene.blendPass.renderToScreen = true;

        finalScene.composer.setSize(window.innerWidth,window.innerHeight);

    };

    function animateMenu(delta) {

        for(var i=0; i<movingGroup.length; i++) {
            star = movingGroup[i];
            star2 = movingGroup2[i];

            posNew = delta * i;

            star.position.z +=  posNew;
            star2.position.z +=  posNew;

            if(star.position.z>1000){
                star.position.z-=2000;
                star2.position.z-=2000;
            }

        }

    };

    function renderMenu(delta) {
        menuBlur.composer.render(delta);
        finalScene.composer.render(delta);
        //renderer.render(menuBlur.scene,cam);
    };

    return {
        openMenu: openMenu,
        closeMenu: closeMenu,
        startGame: startGame,
        init: init,
        animateMenu: animateMenu,
        renderMenu: renderMenu
    }

}();