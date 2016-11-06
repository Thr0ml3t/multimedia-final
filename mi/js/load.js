var AppLoader = function () {
    var loaderManager;

    var assets = {
        torreta1: {
            tipo: 'modelo',
            path: 'assets/torreta1/torreta1.js',
            mesh: null
        },
        torreta2: {
            tipo: 'modelo',
            path: 'assets/torreta2/torreta2.js',
            mesh: null
        },
        torreta3: {
            tipo: 'modelo',
            path: 'assets/torreta3/torreta3.js',
            mesh: null
        },
        edificio: {
            tipo: 'modelo',
            path: 'assets/edificio/edificio.js',
            mesh: null
        },
        skyDome: {
            tipo: 'textura',
            path: 'assets/skydome/3949.jpg',
            texture: null
        },
        ground: {
            tipo: 'materialPhong',
            path: 'assets/terreno/ground.jpg',
            material: null
        },
        pista: {
            tipo: 'modelo',
            path: 'assets/pista/pista.js',
            mesh: null
        }
    };

    function load() {
        loaderManager = new THREE.LoadingManager();
        jsonLoader = new THREE.JSONLoader(loaderManager);
        audioLoader = new THREE.AudioLoader(loaderManager);
        textureLoader = new THREE.TextureLoader(loaderManager);
        cLoader = new THREE.CubeTextureLoader();

        loaderManager.onProgress = function (item, loaded, total) {
            console.log(item,loaded,total);
            console.log( (loaded / total * 100) + '% loaded' );
        };

        loaderManager.onLoad = function () {
            AppMain.setIsLoading(false);
            AppJuego.init();
        };

        // Carga todos los assets en mi arreglo
        for(var _key in assets){
            (function (key) {
                switch (assets[key].tipo) {
                    case 'modelo':
                        jsonLoader.load(
                            assets[key].path,
                            function (geometry, materials) {
                                var material = new THREE.MeshFaceMaterial(materials);
                                var mesh = new THREE.Mesh(geometry, material);

                                mesh.traverse(function (node) {
                                    if(node instanceof THREE.Mesh){
                                        node.castShadow = true;
                                        node.receiveShadow = true;
                                    }
                                });
                                assets[key].mesh = mesh;
                            }
                        );
                        break;
                    case 'sonido':
                        audioLoader.load(
                            assets[key].path,
                            function (buffer) {
                                var sound = new THREE.Audio(listener);
                                sound.autoplay = true;
                                sound.setBuffer(buffer);
                                sound.setVolume(0.5);

                                assets[key].aud = sound;

                                analyzer1 = new THREE.AudioAnalyser(assets[key].aud,32);
                            }
                        );
                        break;
                    case 'textura':
                        textureLoader.load(
                            assets[key].path,
                            function (texture) {
                                assets[key].texture = texture;
                            }
                        );
                        break;
                    case 'skycube':
                        var textureCube = cLoader.load( [
                            assets[key].path + 'posx.bmp', assets[key].path + 'negx.bmp',
                            assets[key].path + 'posy.bmp', assets[key].path + 'negy.bmp',
                            assets[key].path + 'posz.bmp', assets[key].path + 'negz.bmp'
                        ] );
                        assets[key].textureC = textureCube;
                        break;
                    case 'materialPhong':
                        textureLoader.load(
                            assets[key].path,
                            function (texture) {
                                texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
                                texture.repeat.set(10,10);

                                var material = new THREE.MeshPhongMaterial({
                                    color: 0xffffff,
                                    map: texture
                                });

                                assets[key].material = material;
                            }
                        );
                        break;
                }
            })(_key);
        }

    }
    return {
        load: load,
        getAssets: function () {
            return assets;
        }
    }
}();