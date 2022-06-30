import { Color } from  "three"

const HaloShader = {
    uniforms: {
        color1: {
            value: new Color("yellow")
        },
        color2: {
            value: new Color("purple")
        }
    },
    vertexShader: `
    varying vec2 vUv;

    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
    }`,
    fragmentShader: `
    glEnable(GL_BLEND);
    glBlendFunc(GL_SRC_ALPHA, GL_ONE_MINUS_SRC_ALPHA);
    uniform vec3 color1;
    uniform vec3 color2;
  
    varying vec2 vUv;
    
    void main() {
        vec4 innerColor = vec4(color1, 1);
        vec4 outerColor = vec4(color2, 0);
        if (gl_FragCoord.z < 0.85 || gl_FragCoord.z > 0.85) {
            gl_FragColor = vec4(mix(innerColor, outerColor, vUv.x), 1.0);
        } else {
            gl_FragColor = vec4(0,0,0, 1.0);
        }
    }`
  };
  
  export { HaloShader };
  