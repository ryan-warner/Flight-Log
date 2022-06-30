import { Color } from  "three"
import { BackSide } from "three"

function HaloShader(props) {

    const HaloShader = {
        uniforms: {
            innerColorInit: {
                value: new Color(props.innerColor)
            },
            outerColorInit: {
                value: new Color(props.outerColor)
            },
            min: {
                value: props.bounds.min
            },
            max: {
                value: props.bounds.max
            }
        },
        vertexShader: `
        uniform highp float max;
        uniform highp float min;
        
        varying vec2 vUv;

        void main() {
            vUv.y = abs((position.z - min) / (max - min));
            vUv.y = pow(vUv.y, 12.0);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
        }`,
        fragmentShader: `
        uniform vec3 innerColorInit;
        uniform vec3 outerColorInit;

        varying vec2 vUv;
        
        void main() {
            vec4 innerColor = vec4(innerColorInit, 1);
            vec4 outerColor = vec4(outerColorInit, 0);
            gl_FragColor = vec4(mix(innerColor, outerColor, vUv.y));
        }`,
        transparent: true
    };

    return (
        <shaderMaterial side={BackSide} attach="material" args={[HaloShader]}/>
    )
}

export default HaloShader;
  