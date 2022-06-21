import { useRef } from "react";
import { useFrame} from "@react-three/fiber"
import { Instance } from "@react-three/drei"

function isVisible(lat, long) {
    return true;
}


function GlobePixel(props) {
    if (isVisible(1, 2)) {
        return null;
    }
    
    const pixelRef = useRef(null);

    useFrame(() => {
        pixelRef.current.position.set(
            props.xPos,
            props.yPos,
            props.zPos
        )
        }
    )

    return (
        <Instance ref={pixelRef} />
    )
}

export default GlobePixel;