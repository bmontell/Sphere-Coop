import { extend, useFrame } from '@react-three/fiber'
import './App.css'
import { shaderMaterial, useTexture } from '@react-three/drei'
import { useRef } from 'react'
import type { ShaderMaterial } from 'three'

export function Sphere() {

  const dayTexture = useTexture('2k_earth_daymap.jpg')
  const nightTexture = useTexture('2k_earth_nightmap.jpg')
  const cloudTexture = useTexture('2k_earth_clouds.jpg')
  const bathymetryTexture = useTexture('bathymetry.jpg')

  const timeRef = useRef(0)
  const matRef = useRef<ShaderMaterial>(null)
  useFrame((_state, delta) => {
    timeRef.current += delta
    if (matRef.current) {
      matRef.current.uniforms.uTime.value = timeRef.current
    }
    console.log(matRef.current)
  })

  return (
    <mesh>
      <sphereGeometry args={[1,50,50]} />
      {/* @ts-expect-error shader type */}
      <customShaderMaterial
        ref={matRef}
        uDayTexture={dayTexture}
        uNightTexture={nightTexture}
        uCloudTexture={cloudTexture}
        uBathymetryTexture={bathymetryTexture} />
    </mesh>
  )
}

const SphereMaterial = shaderMaterial(
  {
    uDayTexture: { value: null },
    uNightTexture: { value: null },
    uCloudTexture: { value: null },
    uBathymetryTexture: { value: null },
    uTime: { value: 0.0 }
  },
  `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vLightDir;

    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);
      vLightDir = normalize(normalMatrix * vec3(1.0, 0.1, 0.0));

      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  `
    uniform sampler2D uDayTexture;
    uniform sampler2D uNightTexture;
    uniform sampler2D uCloudTexture;
    uniform sampler2D uBathymetryTexture;
    uniform float uTime;

    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vLightDir;

    void main() {
      vec3 dayColor = texture2D(uDayTexture, vUv).rgb;
      vec3 nightColor = 0.5 * texture2D(uNightTexture, vUv).rgb;
      vec3 cloudColor = texture2D(uCloudTexture, vUv).rgb;

      dayColor = mix(dayColor, vec3(1.0), cloudColor.r);

      vec3 dryColor = dayColor;
      if (distance(dayColor, vec3(30.0, 59.0, 117.0)/255.0) < 0.25) {
        float bathymetry = texture2D(uBathymetryTexture, vUv).b;
        dryColor = vec3(0.5, 0.43, 0.35) * (bathymetry < 0.7 ? 1.0 : bathymetry);
      }

      // dayColor = dryColor;

      float light = clamp(5.0 * dot(vLightDir, normalize(vNormal)), 0.0, 1.0);
      light = mix(0.02, 1.0, light);
      vec3 color = mix(nightColor, dayColor, light);

      // vec3 grayscale = vec3(dot(color, vec3(0.299, 0.587, 0.114)));
      // color = 0.5 * color;//mix(color, grayscale, 0.5);

      gl_FragColor = vec4(color, 1.0);
    }
  `
)

extend({ CustomShaderMaterial: SphereMaterial })
