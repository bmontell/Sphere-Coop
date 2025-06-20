import './App.css'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { Stars } from './Stars'
import { Sphere } from './Sphere'
import { useState } from 'react'

export default function App() {
  const [useVideoTexture, setUseVideoTexture] = useState(false)

  return (
    <>
      <Canvas camera={{ position: [0, 0.5, 2] }} style={{ background: '#000000' }}>
        <ambientLight intensity={0.1}/>
        <pointLight position={[2, 2, 2]} />
        <Sphere shouldUseVideoTexture={useVideoTexture} />
        <OrbitControls enableZoom={false} />
        <Stars factor={8} saturation={1} />
      </Canvas>
      <button
        style={{
          position: 'absolute',
          top: 20,
          left: 20,
          zIndex: 1,
          padding: '8px 16px',
          fontSize: '16px',
          borderRadius: '4px',
          border: 'none',
          color: '#fff',
          cursor: 'pointer'
        }}
        onClick={() => setUseVideoTexture((prev) => !prev)}
      >
        {useVideoTexture ? 'Switch to Earth' : 'Switch to Video Sphere'}
      </button>
    </>
  )
}
