/**
 * Created by thr0m on 24/10/2016.
 */

THREE.MenuShader = {

    uniforms: {

        "tDiffuse": { value: null },
        "h":        { value: 1.0 / 512.0 },
        "v":        { value: 1.0 / 512.0 }

    },

    vertexShader: [

        "varying vec2 vUv;",

        "void main() {",

        "vUv = uv;",
        "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

        "}"

    ].join( "\n" ),

    fragmentShader: [

        "uniform sampler2D tDiffuse;",
        "uniform float h;",
        "uniform float v;",

        "varying vec2 vUv;",

        "void main() {",

        "vec4 sum = vec4( 0.0 );",

        "sum += texture2D( tDiffuse, vec2( vUv.x - 4.0 * h, vUv.y ) ) * 0.0162162162;",
        "sum += texture2D( tDiffuse, vec2( vUv.x - 3.0 * h, vUv.y ) ) * 0.0540540541;",
        "sum += texture2D( tDiffuse, vec2( vUv.x - 2.0 * h, vUv.y ) ) * 0.1216216216;",
        "sum += texture2D( tDiffuse, vec2( vUv.x - 1.0 * h, vUv.y ) ) * 0.1945945946;",

        "sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y ) ) * 0.2270270270;",

        "sum += texture2D( tDiffuse, vec2( vUv.x + 1.0 * h, vUv.y ) ) * 0.1945945946;",
        "sum += texture2D( tDiffuse, vec2( vUv.x + 2.0 * h, vUv.y ) ) * 0.1216216216;",
        "sum += texture2D( tDiffuse, vec2( vUv.x + 3.0 * h, vUv.y ) ) * 0.0540540541;",
        "sum += texture2D( tDiffuse, vec2( vUv.x + 4.0 * h, vUv.y ) ) * 0.0162162162;",

        "vec4 sum2 = vec4( 0.0 );",

        "sum2 += texture2D( tDiffuse, vec2( vUv.x, vUv.y - 4.0 * v ) ) * 0.0162162162;",
        "sum2 += texture2D( tDiffuse, vec2( vUv.x, vUv.y - 3.0 * v ) ) * 0.0540540541;",
        "sum2 += texture2D( tDiffuse, vec2( vUv.x, vUv.y - 2.0 * v ) ) * 0.1216216216;",
        "sum2 += texture2D( tDiffuse, vec2( vUv.x, vUv.y - 1.0 * v ) ) * 0.1945945946;",

        "sum2 += texture2D( tDiffuse, vec2( vUv.x, vUv.y ) ) * 0.2270270270;",

        "sum2 += texture2D( tDiffuse, vec2( vUv.x, vUv.y + 1.0 * v ) ) * 0.1945945946;",
        "sum2 += texture2D( tDiffuse, vec2( vUv.x, vUv.y + 2.0 * v ) ) * 0.1216216216;",
        "sum2 += texture2D( tDiffuse, vec2( vUv.x, vUv.y + 3.0 * v ) ) * 0.0540540541;",
        "sum2 += texture2D( tDiffuse, vec2( vUv.x, vUv.y + 4.0 * v ) ) * 0.0162162162;",

        "gl_FragColor = sum + sum2;",

        "}"

    ].join( "\n" )

};
