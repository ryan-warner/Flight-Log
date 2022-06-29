import { useRef, useEffect, useState } from "react";
import { BackSide } from "three"
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Instances, OrbitControls, PerspectiveCamera } from "@react-three/drei"
import GlobePixel from "./GlobePixel"
import LandformCanvas from "./LandformCanvas";

//import { DirectionalLight } from "three";

import { DEG2RAD } from 'three/src/math/MathUtils'

// What this needs

// old test code
//globePixels.map((data, i) => 
//(<GlobePixel key={i} position={[data.xPos, data.yPos, data.zPos]}/>))

// Function -- pixel density and functions to break off photo into regions to send as props to pixel

// Sphere matching the globe that we're looking for in terms of size
// Instanced Mesh of all pixels
// halo behind
// Start working on arcs, points, etc...

// Maybe later make a cool shooting/pulsing star background!

function setupPixels(dotDensity, rows, globeRadius, canvasRef) {

    //const context = canvas.getContext("2d");
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
    //console.log(canvasRef.current.getContext("2d").getImageData(500,305,1,1).data[3])
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

    const canvasRef = useRef(null);
    const [landformLoaded, setLandformLoaded] = useState(false)

    function onLoad() {
        setLandformLoaded(true)
    }

    const landformCanvas = <LandformCanvas onLoad={onLoad} loaded={landformLoaded} ref={canvasRef} />

    const [pixelsArray, setPixelsArray] = useState(null)
    // setupPixels(dotDensity, rows, globeRadius, canvasRef)

    const frameRef = useRef(null)
    const cameraRef = useRef(null)
    const lightRef = useRef(null)
    const haloRef = useRef(null)

    var directionalLight1 = <directionalLight ref={lightRef} args={[0xffffff,10]} position={[-2, -2, 2]}/>
    var globeCamera = <perspectiveCamera ref={cameraRef} makeDefault />

    //const { camera } = useThree();

    //var globeCameraTest = new PerspectiveCamera()
    //var directionalLightTest = new DirectionalLight(0xff00ff,10)
    //directionalLightTest.set.position(-2,-2,2)

    //const { camera } = useThree()

    useEffect(() => {
        if (landformLoaded) {
            setPixelsArray(setupPixels(dotDensity, rows, globeRadius, canvasRef))
        }
    },[landformLoaded])

    //3E3D6E -- good color

    return (
        <div ref={frameRef} className="h-full w-full bg-gray-600 ">
            <div className="h-0 w-0 overflow-hidden">{landformCanvas}</div>
            <Canvas>
                
                
                <PerspectiveCamera ref={cameraRef} position={[0,0,6]} makeDefault>
                    <group>
                        <pointLight ref={lightRef} args={[0x8AABE8,5]} position={[-40, 10, 5]}/>
                        <directionalLight ref={lightRef} args={[0xC787F1,1]} position={[40, 40, 5]}/>
                        <directionalLight ref={lightRef} args={[0x87D7F1,0.75]} position={[-2, -10, 5]}/>
                        <directionalLight ref={lightRef} args={[0x49DDF8,1.2]} position={[-20, 20, 2]}/>
                        <mesh rotation-x={Math.PI * 0.03} rotation-y={Math.PI * 0.03} position={[0,0,-6.55]}>
                            <sphereGeometry args={[globeRadius * 1.15, 96, 48, Math.PI ,Math.PI, 0, Math.PI]} />
                            <meshStandardMaterial side={BackSide} color={0xFFFFFF} />
                        </mesh>

                    </group>
                </PerspectiveCamera>
                <directionalLight args={[0xffff00,0]} position={[-2, -2, 2]}/>
                
                <OrbitControls enableZoom={false} autoRotate={true} args={[cameraRef.current, frameRef]}/>
                
                <mesh position={[0,0,0]}>
                    <meshStandardMaterial emissiveIntensity={0.75} metalness={0.25} roughness={0.7} color={0x1A174F} />
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
