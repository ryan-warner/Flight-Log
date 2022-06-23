import { useRef } from "react";
import { DEG2RAD } from 'three/src/math/MathUtils'
import { useFrame } from "@react-three/fiber"
import { Instance } from "@react-three/drei"
import { Euler, Matrix4 } from "three";

// Functions to write
// rotation transformation - take center and rotate normal to it

function isVisible(lat, long) {
    return true;
}


function GlobePixel(props) {
    const pixelRef = useRef(null);
    var dummyMatrix = new Matrix4()
    dummyMatrix.lookAt(
        {x: props.position[0],y: props.position[1],z: props.position[2]},
        {x: 0,y: 0,z: 0},
        {x:0,y: 0,z:1}
    )
    var dummyEuler = new Euler()
    dummyEuler.setFromRotationMatrix(dummyMatrix)
    useFrame(() => {
        //pixelRef.current.position.applyMatrix4()
        pixelRef.current.position.set(
            props.position[0],
            props.position[1],
            props.position[2]
            );
        pixelRef.current.rotation.set(
            dummyEuler._x,
            dummyEuler._y,
            dummyEuler._z
            )
        }
    )

    if (!isVisible(1, 2)) {
        return null;
    }

    return (
        <Instance ref={pixelRef} />
    )
}

export default GlobePixel;