/**
 * Created by thr0m on 05/10/2016.
 */


var TEMenu = function () {

    var menuBlur = {};

    var finalScene = {};

    var sceneD;

    var timer,delta;

    var cam;

    var renderer;

    var movingGroup = [];
    var movingGroup2 = [];

    var timeLine;

    function openMenu() {
        $("#menu").addClass("animated zoomInDown");
        $("#menu").one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
            $("#menu").removeClass("animated zoomInDown");
        });
        $("#menu").show();
        TEConfig.mode = TEConfig.modes.menu;

        $("#bg1").hide();
        $("#bg2").hide();
        $("#bg3").hide();
        $("#info").hide();
        $("#regresar").hide();


        // Nueva Time Line :D!!!
        timeLine = new TimelineMax({delay: 0.5});

        timeLine.to($("#gameName1"),2,{transform: "translate(0,0)", ease: Bounce.easeOut});
        timeLine.to($("#gameName1"),2,{opacity: 1, ease: Power2.easeInOut},"-=2");
        //timeLine.to($("#gameName1"),2,{transform: "translate(-500px,0)", ease: Power2.easeInOut});
        //timeLine.to($("#gameName1"),2,{opacity: 0, ease: Power2.easeInOut},"-=2");
        timeLine.to($("#gameName2"),2,{transform: "translate(0,0)", ease: Bounce.easeOut},"-=2");
        timeLine.to($("#gameName2"),2,{opacity: 1, ease: Power2.easeInOut}, "-=2");
        //timeLine.to($("#gameName2"),2,{transform: "translate(500px,0)", ease: Power2.easeInOut});


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

        dispose3(menuBlur.scene);
        dispose3(finalScene.scene);

        timeLine.stop();

        timer.stop();

        menuBlur = null;
        finalScene = null;

        /*TEConfig.isLoading = true;
        TEConfig.isMenu = false;*/
        //$("#myNav").css("opacity","0");
    };

    function init() {
        menuBlur.scene = new THREE.Scene();

        finalScene.scene = new THREE.Scene();

        renderer = TEMain.getRenderer();

        cam = TEMain.getCamera();

        cam.far = 2000;
        cam.updateProjectionMatrix();

        timer = new THREE.Clock();


        for ( var z= -1000; z < 1000; z+=20 ) {

            var geometry   = new THREE.SphereGeometry(0.5, 32, 32)
            var material = new THREE.MeshPhongMaterial({
                color: 0xffffff,
                emissive: 0x9db4ff,
                emissiveIntensity: 1
            });
            var sphere = new THREE.Mesh(geometry, material);


            sphere.position.x = Math.floor(Math.random() * 2000) - 1000;
            sphere.position.y = Math.floor(Math.random() * 2000) - 1000;

            sphere.position.z = z;

            sphere.scale.x = sphere.scale.y = 5;


            sphere.material.emissive.r = (Math.sin(0.1 * z) * 127 + 128) / 255;
            sphere.material.emissive.g = (Math.sin(0.2 * z) * 127 + 128) / 255;
            sphere.material.emissive.b = (Math.sin(0.3 * z) * 127 + 128) / 255;

            menuBlur.scene.add(sphere);
            //var clone = sphere.clone();
            //finalScene.scene.add(clone);

            movingGroup.push(sphere);
            //movingGroup2.push(clone);

        }

        //finalScene.scene = menuBlur.scene.clone();


        // Escena Blur

        menuBlur.renderPass = new THREE.RenderPass(menuBlur.scene,cam);
        menuBlur.fxaaPass = new THREE.ShaderPass(THREE.FXAAShader);
        menuBlur.fxaaPass.uniforms["resolution"].value = new THREE.Vector2(1 / window.innerWidth, 1 / window.innerHeight);
        menuBlur.blurPass = new THREE.ShaderPass(THREE.MenuShader);
        menuBlur.blurPass.uniforms["h"].value = 3.0 / window.innerWidth;
        menuBlur.blurPass.uniforms["v"].value = 3.0 / window.innerHeight;
        menuBlur.copyPass = new THREE.ShaderPass(THREE.CopyShader);


        menuBlur.composer = new THREE.EffectComposer(renderer);
        menuBlur.composer.addPass(menuBlur.renderPass);
        menuBlur.composer.addPass(menuBlur.fxaaPass);
        menuBlur.composer.addPass(menuBlur.blurPass);
        menuBlur.composer.addPass(menuBlur.copyPass);
        menuBlur.copyPass.renderToScreen = true;


        menuBlur.composer.setSize(window.innerWidth,window.innerHeight);

        // Escena Final
        /*finalScene.renderPass = new THREE.RenderPass(finalScene.scene,cam);
        finalScene.blendPass = new THREE.ShaderPass(THREE.AdditiveBlendShader);
        finalScene.blendPass.uniforms["tAdd"].value = menuBlur.composer.renderTarget2.texture;
        finalScene.blendPass.uniforms["amount"].value = 7.0;
        finalScene.fxaaPass = new THREE.ShaderPass(THREE.FXAAShader);
        finalScene.fxaaPass.uniforms["resolution"].value = new THREE.Vector2(1 / window.innerWidth, 1 / window.innerHeight);

        finalScene.composer = new THREE.EffectComposer(renderer);
        finalScene.composer.addPass(finalScene.renderPass);
        finalScene.composer.addPass(finalScene.fxaaPass);
        finalScene.composer.addPass(finalScene.blendPass);
        //finalScene.blendPass.renderToScreen = true;
        finalScene.blendPass.renderToScreen = true;*/

        //finalScene.composer.setSize(window.innerWidth,window.innerHeight);

        timer.start();
    };

    function animateMenu() {

        delta = timer.getDelta();

        for(var i=0; i<movingGroup.length; i++) {
            star = movingGroup[i];
           //star2 = movingGroup2[i];

            posNew = delta * i;

            star.position.z +=  posNew;
            //star2.position.z +=  posNew;

            if(star.position.z>2000){
                star.position.z-=2000;
                //star2.position.z-=2000;
            }
        }

        renderMenu(delta);
    };

    function renderMenu(delta) {
        menuBlur.composer.render(delta);
        //finalScene.composer.render(delta);
    };


    function resizeMenu() {
        if(menuBlur != null){
            menuBlur.composer.setSize(window.innerWidth,window.innerHeight);
            menuBlur.fxaaPass.uniforms["resolution"].value = new THREE.Vector2(1 / window.innerWidth, 1 / window.innerHeight);
        }
    };

    return {
        openMenu: openMenu,
        closeMenu: closeMenu,
        startGame: startGame,
        init: init,
        animateMenu: animateMenu,
        resizeMenu: resizeMenu
    }

}();