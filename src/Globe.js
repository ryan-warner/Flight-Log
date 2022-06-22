import { Canvas } from '@react-three/fiber'
import { Instances, OrbitControls } from "@react-three/drei"
import GlobePixel from "./GlobePixel"
import landformMap from "./assets/earthLandmass.png"

import { MathUtils } from 'three'
import { DEG2RAD } from 'three/src/math/MathUtils'
import { CameraIcon } from '@heroicons/react/outline'

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

function setupPixels(dotDensity, rows, globeRadius) {
    const globePixels = []
    for (let lat = -90; lat<= 90; lat+=(180/rows) ) {
        const layerRadius = Math.cos(Math.abs(lat) * DEG2RAD) * globeRadius;
        const circumference = Math.PI * 2 * layerRadius
        const dotsInLayer = circumference / dotDensity
        //console.log(dotsInLayer)
        for (let dotIndex = 0; dotIndex < dotsInLayer; dotIndex++) {
            const long = -180 + (dotIndex * 360/dotsInLayer)
            globePixels.push(<GlobePixel key={lat + ", " + long} position={sphere2Rect(lat, long, globeRadius, layerRadius)}/>)
        }
    }
    console.log(globePixels.length)
    return globePixels;
}

function sphere2Rect(lat, long, globeRadius, radius) {
    const xPos = radius * Math.sin(long * DEG2RAD);
    const yPos = globeRadius * Math.sin(lat * DEG2RAD);
    const zPos = radius * Math.cos(long * DEG2RAD);
    return [xPos, yPos, zPos];
}

function isPixelVisible(image, lat, long) {
    return true;
}


function Globe() {
    const dotDensity = 0.05
    const globeRadius = 2
    const rows = 180
    const globePixelRadius = 0.015 //(Math.PI * globeRadius) / rows * 0.9
    const landmassesCanvas = <canvas><img scr={landformMap}></img></canvas>
    const globeCamera = <perspectiveCamera makeDefault />


    const globePixels = Array.from({ length: 5000 }, () => ({
        xPos: MathUtils.randFloatSpread(11),
        yPos: MathUtils.randFloatSpread(11),
        zPos: MathUtils.randFloatSpread(1)
      }))

    return (
        <div className="h-full w-full">
            <Canvas>
                
                <ambientLight />
                <directionalLight color="purple" castShadow={true} position={[-10, -10, 100]}/>
                {globeCamera}
                
                <mesh position={[0,0,0]} castShadow={true}>
                    <meshBasicMaterial wireframe={false} color={"rgb(255,255,0)"} />
                    <sphereGeometry args={[globeRadius, 96, 48]} />
                </ mesh>
                
                <Instances limit={500000}>
                    <circleGeometry args={[globePixelRadius,5]} />
                    <meshPhongMaterial color="rgb(0,0,255)" />
                    {setupPixels(dotDensity, rows, globeRadius)}
                </Instances>
            </ Canvas>
        </div>
    )
}

export default Globe;
