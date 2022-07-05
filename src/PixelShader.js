import { Color } from  "three"

function PixelShader(props) {

    const PixelShader = {
        uniforms: {
            fadeThreshold: {
                value: 0.978
            },
            alphaFallOff: {
                value: 400
            },
            pixelColor: {
                value: new Color(0xD6D2DE)
            }
        },
        vertexShader: `
        uniform highp float max;
        uniform highp float min;
        
        varying vec2 vUv;

        void main() {
            vec4 mvPosition = vec4( position, 1.0 );
            mvPosition = instanceMatrix * mvPosition;
            gl_Position = projectionMatrix * modelViewMatrix * mvPosition;
            vUv.y = abs((mvPosition.z - min) / (max - min));
        }`,
        fragmentShader: `
        uniform float fadeThreshold;
        uniform float alphaFallOff;
        uniform vec3 pixelColor;

        varying vec2 vUv;
        
        void main() {
            gl_FragColor = vec4(pixelColor, 1.0);
            if (gl_FragCoord.z > fadeThreshold) {
                gl_FragColor.a = 1.0 + (fadeThreshold - gl_FragCoord.z) * alphaFallOff;
            }
        }`,
        transparent: true
    };

    return (
        <shaderMaterial attach="material" args={[PixelShader]}/>
    )
}

export default PixelShader;