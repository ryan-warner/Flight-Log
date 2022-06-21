import { useRef } from "react";
import { Instance } from "@react-three/drei"
import { useFrame} from "@react-three/fiber"

function SmallBox(props) {
    const boxRef = useRef(null)
    useFrame(() => {
        boxRef.current.position.set(
            props.xPos,
            props.yPos,
            props.zPos
        )
    }
    )

    return (
        <Instance ref={boxRef} />
    )
}

export default SmallBox;