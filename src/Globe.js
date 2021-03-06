import { useRef, useEffect, useState } from "react";
import { Canvas } from '@react-three/fiber'
import { Instances, OrbitControls, PerspectiveCamera, Stars } from "@react-three/drei"
import GlobePixel from "./GlobePixel"
import LandformCanvas from "./LandformCanvas";
import HaloShader from "./HaloShader"
import PixelShader from "./PixelShader"
import FlightPath from "./FlightPath"

import { DEG2RAD } from 'three/src/math/MathUtils'

// TO DO

// Animate arcs
// Add dots when arc is present
// Animate dot on landing -- should be a state thing

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

function isPixelVisible(lat, long, rows, canvasRef, canvasHeight, canvasWidth) {
    const converted = gps2cartesian(lat, long)
    const relativeX = Math.round(converted[0] * canvasWidth)
    const relativeY = Math.round(converted[1] * canvasHeight)
    const horizontalWeight = 1 - Math.abs(converted[0] * canvasWidth - relativeX)
    const verticalWeight = 1 - Math.abs(converted[1] * canvasHeight - relativeY)

    const roundedRight = horizontalWeight > 0.5 ? true : false
    const roundedUp = verticalWeight > 0.5 ? true : false

    const startX = roundedRight ? relativeX - 1 : relativeX
    const startY = roundedUp ? relativeY - 1 : relativeY

    const weights = 
        [
            (startX === relativeX ? horizontalWeight : 1 - horizontalWeight) * (startY === relativeY ? verticalWeight : 1 - verticalWeight),
            (startX + 1 === relativeX ? horizontalWeight : 1 -  horizontalWeight) * (startY === relativeY ? verticalWeight : 1 - verticalWeight),
            (startX === relativeX ? horizontalWeight : 1 - horizontalWeight) * (startY + 1 === relativeY ? verticalWeight : 1 - verticalWeight),
            (startX + 1 === relativeX ? horizontalWeight : 1 - horizontalWeight) * (startY + 1 === relativeY ? verticalWeight : 1 - verticalWeight)  
        ]

    var data = canvasRef.current.getContext("2d").getImageData(startX,startY,2,2).data
    data = [data[3], data[7], data[11], data[15]]
    data = data.map(point => point  / 255)

    var pixelAlpha = 0

    for (let i = 0; i < data.length; i++) {
        pixelAlpha = pixelAlpha + data[i] * weights[i]
    }

    if (pixelAlpha > 0.65) {
        return true;
    } else {
        if ((long < -120 || long > 120) && (lat < 45 || lat > -45) && pixelAlpha > 0.35) {
            return true;
        } else {
            return false;
        }
    }
}


function Globe() {
    const dotDensity = 0.03
    const globeRadius = 2
    const rows = 200 //180
    const globePixelRadius = 0.006 //(Math.PI * globeRadius) / rows * 0.9
    const sphereZOffset = -6.45

    const [landformLoaded, setLandformLoaded] = useState(false)
    const [pixelsRendered, setPixelsRendered] = useState(false)
    const [sphereLoaded, setSphereLoaded] = useState(false)
    const [sphereRendered, setSphereRendered] = useState(false)
    const [sphereBounds, setSphereBounds] = useState({max: 0, min: 0})

    const canvasRef = useRef(null);
    const frameRef = useRef(null)
    const cameraRef = useRef(null)
    const lightRef = useRef(null)
    const haloRef = useRef(null)
    const globeRef = useRef(null)

    function onLoadCanvas() {
        setLandformLoaded(true)
    }

    function onLoadSphere() {
       setSphereLoaded(true)
    }

    const landformCanvas = <LandformCanvas onLoad={onLoadCanvas} loaded={landformLoaded} ref={canvasRef} />

    const [pixelsArray, setPixelsArray] = useState(null)

    useEffect(() => {
        if (landformLoaded && !pixelsRendered) {
            setPixelsArray(setupPixels(dotDensity, rows, globeRadius, canvasRef))
            setPixelsRendered(true)
        }
        if (sphereLoaded && !sphereRendered) {
            haloRef.current.computeBoundingBox()
            const bounds = {max: (haloRef.current.boundingBox.max.z), min: (haloRef.current.boundingBox.min.z)}
            setSphereBounds(bounds)
            setSphereRendered(true)
        }
    },[landformLoaded, sphereLoaded, sphereRendered, pixelsRendered])

    return (
        <div ref={frameRef} className="h-full w-full bg-black ">
            <div className="h-0 w-0 overflow-hidden">{landformCanvas}</div>
            <Canvas gl={{antialias: false }}>
                <PerspectiveCamera ref={cameraRef} position={[0,0,6]} makeDefault>{/** 0,0,6 */}
                    <group>
                        <pointLight ref={lightRef} args={[0x64B2F9,5]} position={[-40, 10, 5]}/>
                        <directionalLight ref={lightRef} args={[0xC787F1,1]} position={[40, 40, 5]}/>
                        <directionalLight ref={lightRef} args={[0x87D7F1,0.75]} position={[-1.5, -10, 5]}/>
                        <directionalLight ref={lightRef} args={[0x8EE7F8,1.2]} position={[-20, 30, -5.5]}/>
                        <Stars radius={100} depth={50} count={1500} factor={4} saturation={0} fade speed={1} />
                        <mesh rotation-x={Math.PI * 0.03} rotation-y={Math.PI * 0.03} position={[0,0,sphereZOffset]}>{/**0,0,-6.55 */}
                            <sphereGeometry onUpdate={onLoadSphere} ref={haloRef} args={[globeRadius * 1.15, 96, 48, Math.PI ,Math.PI, 0, Math.PI]} />
                            <HaloShader bounds={sphereBounds} innerColor={0xDDF5FC} outerColor={0x3D42EF} />
                        </mesh>

                    </group>
                </PerspectiveCamera>
                
                <FlightPath 
                    startLat={27.9506}
                    startLong={-82.4572}
                    endLat={33.7490}
                    endLong={-84.3880}
                    small={true}
                />

                <FlightPath 
                    startLat={33.7490}
                    startLong={-84.3880}
                    endLat={50.1109}
                    endLong={8.6821}
                    small={false}
                />

                <directionalLight args={[0xffff00,0]} position={[-2, -2, 2]}/>
                
                <OrbitControls enableZoom={false} autoRotate={false} args={[cameraRef.current, frameRef]}/>

                <mesh position={[0,0,0]}>
                    <meshStandardMaterial emissiveIntensity={0.75} metalness={0} roughness={0.75} color={0x1A174F} />
                    <sphereGeometry ref={globeRef} args={[globeRadius, 96, 48]} />
                
                    <Instances limit={500000}>
                        <circleGeometry args={[globePixelRadius,5]} />
                        <PixelShader />
                        
                        {pixelsArray}
                    </Instances>
                </mesh>
            </ Canvas>
        </div>
    )
}

export default Globe;
