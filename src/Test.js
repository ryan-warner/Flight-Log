import { Canvas } from '@react-three/fiber'
import { useRef } from "react";
import { Instances } from '@react-three/drei'
import { MathUtils } from "three";
import SmallBox from './SmallBox';

function Test() {
    const meshRef = useRef(null)
    const degRotation = 45*3.14/180
    const smallSquare = <boxGeometry args={[0.25, 0.25, 0.25]} />
    const material = <meshBasicMaterial color="rgb(0,0,255)" />
    var dummy = <object3D />

    const smallBoxes = Array.from({ length: 5 }, () => ({
        xPos: MathUtils.randFloatSpread(10),
        yPos: MathUtils.randFloatSpread(10),
        zPos: MathUtils.randFloatSpread(10)
      }))
      


    return (
        <div className="bg-green-100 h-full w-full">
            <Canvas>
                <ambientLight color="yellow" />
                <directionalLight args={[10,10,10]} intensity={100} color="white" />
                <axesHelper />
                <Instances limit={5}>
                    <boxGeometry args={[1,1,1]} scale={0.025}/>
                    <meshPhongMaterial color="rgb(0,0,255)" />
                    {smallBoxes.map((data, i) => 
                    (<SmallBox key={i} xPos={data.xPos} yPos={data.yPos} zPos={data.zPos}/>))}
                </Instances>
            </Canvas>
        </div>
    )
}

export default Test;