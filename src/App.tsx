import './App.css'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { Stars } from './Stars'
import { Sphere } from './Sphere'

export default function App() {
  return (
    <Canvas camera={{ position: [0, 0.5, 2] }} style={{ background: '#000000' }}>
      <ambientLight intensity={0.1}/>
      <pointLight position={[2, 2, 2]} />
      <Sphere />
      <OrbitControls enableZoom={false} />
      <Stars factor={8} saturation={1} />
    </Canvas>
  )
}

