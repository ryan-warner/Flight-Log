import { Canvas } from '@react-three/fiber'
import { CircleBufferGeometry } from 'three'

// What this needs

// Sphere matching the globe that we're looking for in terms of size
// Instanced Mesh of all pixels
// halo behind
// Start working on arcs, points, etc...

// Maybe later make a cool shooting/pulsing star background!



function Globe() {
    //const circle = <circleGeometry args={[100, 5]} />
    const material = <meshStandardMaterial color="white" />
    const circle = new CircleBufferGeometry(0.1, 5)

    return (
        <div className="h-full w-full">
            <Canvas>
                <ambientLight />
                <directionalLight color="green" castShadow={true} position={[-10, -100, 100]} />
                <mesh>
                    <sphereGeometry args={[2.5, 96, 48]} />
                    <instancedMesh args={[null, null, 1200]} >
                        <circleGeometry args={[0.1, 5]} >
                            <instancedBufferAttribute args={[1]} />
                        </circleGeometry>
                        <meshBasicMaterial color="blue" />
                    </instancedMesh>
                </ mesh>
            </ Canvas>
        </div>
    )
}

export default Globe;
