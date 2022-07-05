import { CubicBezierCurve3, Vector3 } from "three";
import { DEG2RAD, RAD2DEG } from 'three/src/math/MathUtils'

function coordToVector(lat, long, radius) {
    const xPos = (radius * Math.cos(lat * DEG2RAD)) * Math.sin(long * DEG2RAD);
    const yPos = radius * Math.sin(lat * DEG2RAD); 
    const zPos = (radius * Math.cos(lat * DEG2RAD)) * Math.cos(long * DEG2RAD);
    return new Vector3(xPos, yPos, zPos);
}

function intermediatePoint(startLat, startLong, endLat, endLong, fraction) {
    const deltaPhi = (endLat-startLat) * DEG2RAD;
    const deltaLambda = (endLong-startLong) * DEG2RAD;

    const a = Math.sin(deltaPhi/2) * Math.sin(deltaPhi/2) +
            Math.cos(startLat) * Math.cos(startLat) *
            Math.sin(deltaLambda/2) * Math.sin(deltaLambda/2);
    const delta = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    const e = Math.sin((1 - fraction) * delta) / Math.sin(delta)
    const f = Math.sin(fraction * delta) / Math.sin(delta)
    const x = e * Math.cos(startLat * DEG2RAD) * Math.cos(startLong * DEG2RAD) + f * Math.cos(endLat * DEG2RAD) * Math.cos(endLong * DEG2RAD)
    const y = e * Math.cos(startLat * DEG2RAD) * Math.sin(startLong * DEG2RAD) + f * Math.cos(endLat * DEG2RAD) * Math.sin(endLong * DEG2RAD)
    const z = e * Math.sin(startLat * DEG2RAD) + f * Math.sin(endLat * DEG2RAD)
    const phiInt = Math.atan2(z, Math.sqrt((x * x) + (y * y))) * RAD2DEG
    const lambdaInt = Math.atan2(y, x) * RAD2DEG

    return [phiInt, lambdaInt]
}

function calculateControls(startLat, startLong, endLat, endLong, radius, surfaceOffset) {
    // calculate great circle -- calculate coordinate at point, then take an offset and calculate

    const control1Coords = intermediatePoint(startLat, startLong, endLat, endLong, 0.20)
    const control2Coords = intermediatePoint(startLat, startLong, endLat, endLong, 0.80)

    const control1 = coordToVector(control1Coords[0], control1Coords[1], radius + surfaceOffset)
    const control2 = coordToVector(control2Coords[0], control2Coords[1], radius + surfaceOffset)

    return [control1, control2]
}

function FlightPath(props) {
    const start = coordToVector(props.startLat, props.startLong, 2)
    const end = coordToVector(props.endLat, props.endLong, 2)
    const controlPoints = calculateControls(props.startLat, props.startLong, props.endLat, props.endLong, 2, 0.5)

    const curve = new CubicBezierCurve3(start, controlPoints[0], controlPoints[1], end)

    return (
        <mesh>
        <tubeGeometry args={[curve, 1000, 0.005, 4, false]} >
            <meshStandardMaterial color={0xFFFFFF} />
        </tubeGeometry>
        </mesh>
    )
}

export default FlightPath;