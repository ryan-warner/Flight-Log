import { useRef } from "react";
import { useFrame} from "@react-three/fiber"
import { Instance } from "@react-three/drei"

// Functions to write
// rotation transformation - take center and rotate normal to it
// isVisible -- based on aggregate image data

function isVisible(lat, long) {
    return true;
}


function GlobePixel(props) {
    const pixelRef = useRef(null);
    useFrame(() => {
        pixelRef.current.position.set(
            props.position[0],
            props.position[1],
            props.position[2]
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