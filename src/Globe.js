import { useRef, useEffect, useState } from "react";
import { BackSide, Color } from "three"
import { Canvas } from '@react-three/fiber'
import { Instances, OrbitControls, PerspectiveCamera } from "@react-three/drei"
import GlobePixel from "./GlobePixel"
import LandformCanvas from "./LandformCanvas";
//import { HaloShader } from "./HaloShader"

import { DEG2RAD } from 'three/src/math/MathUtils'

// What this needs

// Function -- pixel density and functions to break off photo into regions to send as props to pixel

// halo behind
// Start working on arcs, points, etc...

// Maybe later make a cool shooting/pulsing star background!

function setupPixels(dotDensity, rows, globeRadius, canvasRef) {
    const canvasHeight = canvasRef.current.height;
    const canvasWidth = canvasRef.current.width;
    const globePixels = []
    for (let lat = -90; lat<= 90; lat+=(180/rows) ) {
        const layerRadius = Math.cos(Math.abs(lat) * DEG2RAD) * globeRadius;
        const circumference = Math.PI * 2 * layerRadius
        const dotsInLayer = circumference / dotDensity
        for (let dotIndex = 0; dotIndex < dotsInLayer; dotIndex++) {
            const long = -180 + (dotIndex * 360/dotsInLayer)
            if (isPixelVisible(lat, long, rows, canvasRef, canvasHeight, canvasWidth))
{            globePixels.push(<GlobePixel key={lat + ", " + long} lat={lat} long={long} position={sphere2Rect(lat, long, globeRadius, layerRadius)}/>)
}        }
    }
    return globePixels;
}

function sphere2Rect(lat, long, globeRadius, radius) {
    const xPos = radius * Math.sin(long * DEG2RAD);
    const yPos = globeRadius * Math.sin(lat * DEG2RAD);
    const zPos = radius * Math.cos(long * DEG2RAD);
    return [xPos, yPos, zPos];
}

function gps2cartesian(lat, long) {
    var xPercentile
    var yPercentile

    if (long < 0) {
        xPercentile = 0.5 -  Math.abs(long/360)
    } else {
        xPercentile = long/360 + 0.5
    }

    if (lat < 0) {
        yPercentile = Math.abs(lat/180) + 0.5
    } else {
        yPercentile = 0.5 - lat/180
    }

    return [xPercentile, yPercentile]
}

/** function inscribedTransform(lat) {

    I need to draw a picture for this in order to really make it work
    Also need to rework below method to average out nearby pixels

    Lights: LHS, top middle, bottom middle, and bottom leftish

} */

function isPixelVisible(lat, long, rows, canvasRef, canvasHeight, canvasWidth) {
    const converted = gps2cartesian(lat, long)
    const relativeX = Math.round(converted[0] * canvasWidth)
    const relativeY = Math.round(converted[1] * canvasHeight)
    const pixelData = canvasRef.current.getContext("2d").getImageData(relativeX,relativeY,1,1).data[3]
    if (pixelData === 255) {
        return true;
    } else {
        return false;
    }
}


function Globe() {
    const dotDensity = 0.03
    const globeRadius = 2
    const rows = 270 //180
    const globePixelRadius = 0.005 //(Math.PI * globeRadius) / rows * 0.9
    const sphereZOffset = -6.35

    const canvasRef = useRef(null);
    const [landformLoaded, setLandformLoaded] = useState(false)
    const [pixelsRendered, setPixelsRendered] = useState(false)
    const [sphereLoaded, setSphereLoaded] = useState(false)
    const [sphereRendered, setSphereRendered] = useState(false)
    const [sphereBounds, setSphereBounds] = useState({max: 0, min: 0})

    function onLoadCanvas() {
        setLandformLoaded(true)
    }

    function onLoadSphere() {
       setSphereLoaded(true)
    }

    const landformCanvas = <LandformCanvas onLoad={onLoadCanvas} loaded={landformLoaded} ref={canvasRef} />

    const [pixelsArray, setPixelsArray] = useState(null)
    // setupPixels(dotDensity, rows, globeRadius, canvasRef)

    const frameRef = useRef(null)
    const cameraRef = useRef(null)
    const lightRef = useRef(null)
    const haloRef = useRef(null)

    const HaloShader = {
        uniforms: {
            color1: {
                value: new Color(0x15E3FD)
            },
            color2: {
                value: new Color(0x2096F9)
            },
            min: {
                value: sphereBounds.min
            },
            max: {
                value: sphereBounds.max
            }
        },
        vertexShader: `
        uniform highp float max;
        uniform highp float min;
        
        varying vec2 vUv;

        void main() {
            vUv.y = abs((position.z - min) / (max - min));
            vUv.y = pow(vUv.y, 7.0);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
        }`,
        fragmentShader: `
        uniform vec3 color1;
        uniform vec3 color2;

        varying vec2 vUv;
        
        void main() {
            vec4 innerColor = vec4(color1, 1);
            vec4 outerColor = vec4(color2, 0);
            gl_FragColor = vec4(mix(innerColor, outerColor, vUv.y));
        }`,
        transparent: true
      };

    useEffect(() => {
        if (landformLoaded && !pixelsRendered) {
            setPixelsArray(setupPixels(dotDensity, rows, globeRadius, canvasRef))
            setPixelsRendered(true)
        }
        if (sphereLoaded && !sphereRendered) {
            haloRef.current.computeBoundingBox()
            const bounds = {max: (haloRef.current.boundingBox.max.z), min: (haloRef.current.boundingBox.min.z)}
            console.log(bounds)
            setSphereBounds(bounds)
            setSphereRendered(true)
        }
    },[landformLoaded, sphereLoaded, sphereRendered, pixelsRendered])

    return (
        <div ref={frameRef} className="h-full w-full bg-gray-600 ">
            <div className="h-0 w-0 overflow-hidden">{landformCanvas}</div>
            <Canvas>
                <PerspectiveCamera ref={cameraRef} position={[0,0,6]} makeDefault>{/** 0,0,6 */}
                    <group>
                        <pointLight ref={lightRef} args={[0x64B2F9,5]} position={[-40, 10, 5]}/>
                        <directionalLight ref={lightRef} args={[0xC787F1,1]} position={[40, 40, 5]}/>
                        <directionalLight ref={lightRef} args={[0x87D7F1,0.75]} position={[-1.5, -10, 5]}/>
                        <directionalLight ref={lightRef} args={[0x8EE7F8,1.2]} position={[-20, 30, -5.5]}/>
                        <mesh rotation-x={Math.PI * 0.03} rotation-y={Math.PI * 0.03} position={[0,0,sphereZOffset]}>{/**0,0,-6.55 */}
                            <sphereGeometry onUpdate={onLoadSphere} ref={haloRef} args={[globeRadius * 1.15, 96, 48, Math.PI ,Math.PI, 0, Math.PI]} />
                            <shaderMaterial side={BackSide} attach="material" args={[HaloShader]}/>
                            
                        </mesh>

                    </group>
                </PerspectiveCamera>
                <directionalLight args={[0xffff00,0]} position={[-2, -2, 2]}/>
                
                <OrbitControls enableZoom={false} autoRotate={false} args={[cameraRef.current, frameRef]}/>

                <mesh position={[0,0,0]}>
                    <meshStandardMaterial emissiveIntensity={0.75} metalness={0} roughness={0.75} color={0x1A174F} />
                    <sphereGeometry args={[globeRadius, 96, 48]} />
                
                    <Instances limit={500000}>
                        <circleGeometry args={[globePixelRadius,5]} />
                        <meshStandardMaterial color={0xffffff} />
                        {pixelsArray}
                    </Instances>
                </mesh>
            </ Canvas>
        </div>
    )
}

export default Globe;
