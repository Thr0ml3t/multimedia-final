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

        "sum += texture2D( tDiffuse, vec2( vUv.x - 4.0 * h, vUv.y ) ) * 0.051;",
        "sum += texture2D( tDiffuse, vec2( vUv.x - 3.0 * h, vUv.y ) ) * 0.0918;",
        "sum += texture2D( tDiffuse, vec2( vUv.x - 2.0 * h, vUv.y ) ) * 0.12245;",
        "sum += texture2D( tDiffuse, vec2( vUv.x - 1.0 * h, vUv.y ) ) * 0.1531;",

        "sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y ) ) * 0.1633;",

        "sum += texture2D( tDiffuse, vec2( vUv.x + 1.0 * h, vUv.y ) ) * 0.1531;",
        "sum += texture2D( tDiffuse, vec2( vUv.x + 2.0 * h, vUv.y ) ) * 0.12245;",
        "sum += texture2D( tDiffuse, vec2( vUv.x + 3.0 * h, vUv.y ) ) * 0.0918;",
        "sum += texture2D( tDiffuse, vec2( vUv.x + 4.0 * h, vUv.y ) ) * 0.051;",

        "vec4 sum2 = sum + texture2D(tDiffuse,vUv);",

        "sum2 += texture2D( tDiffuse, vec2( vUv.x, vUv.y - 4.0 * v ) ) * 0.051;",
        "sum2 += texture2D( tDiffuse, vec2( vUv.x, vUv.y - 3.0 * v ) ) * 0.0918;",
        "sum2 += texture2D( tDiffuse, vec2( vUv.x, vUv.y - 2.0 * v ) ) * 0.12245;",
        "sum2 += texture2D( tDiffuse, vec2( vUv.x, vUv.y - 1.0 * v ) ) * 0.1531;",

        "sum2 += texture2D( tDiffuse, vec2( vUv.x, vUv.y ) ) * 0.1633;",

        "sum2 += texture2D( tDiffuse, vec2( vUv.x, vUv.y + 1.0 * v ) ) * 0.1531;",
        "sum2 += texture2D( tDiffuse, vec2( vUv.x, vUv.y + 2.0 * v ) ) * 0.12245;",
        "sum2 += texture2D( tDiffuse, vec2( vUv.x, vUv.y + 3.0 * v ) ) * 0.0918;",
        "sum2 += texture2D( tDiffuse, vec2( vUv.x, vUv.y + 4.0 * v ) ) * 0.051;",

        "gl_FragColor = texture2D(tDiffuse,vUv) + (sum2 + sum) * 1.5;",

        "}"

    ].join( "\n" )

};
