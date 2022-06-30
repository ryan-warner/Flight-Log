import { Color } from  "three"

function PixelShader() {

    const PixelShader = {
        uniforms: {
            fadeThreshold: {
                value: 500
            },
            alphaFallOff: {
                value: 0.015
            },
            pixelColor: {
                value: new Color(0xFFFFFF)
            }
        },
        vertexShader: `
        void main() {
            vec4 mvPosition = vec4( position, 1.0 );
            mvPosition = instanceMatrix * mvPosition;
            gl_Position = projectionMatrix * modelViewMatrix * mvPosition;
        }`,
        fragmentShader: `
        uniform float fadeThreshold;
        uniform float alphaFallOff;
        uniform vec3 pixelColor;
        
        void main() {
            gl_FragColor = vec4(pixelColor, 1.0);
            if (gl_FragCoord.x > fadeThreshold) {
                gl_FragColor.a = 1.0 + (fadeThreshold - gl_FragCoord.x) * alphaFallOff;
            }
        }`,
        transparent: true
    };

    return (
        <shaderMaterial attach="material" args={[PixelShader]}/>
    )
}

export default PixelShader;