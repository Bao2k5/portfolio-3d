import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Sphere, MeshDistortMaterial, Float } from "@react-three/drei";

const DataCoreBlob = () => {
  return (
    <Float speed={2} rotationIntensity={1.5} floatIntensity={2}>
      {/* Outer Holographic Network Distorted Sphere */}
      <Sphere visible args={[1, 64, 64]} scale={2.4}>
        <MeshDistortMaterial
          color="#00f0ff"
          attach="material"
          distort={0.5}
          speed={2}
          roughness={0}
          metalness={1}
          wireframe={true}
          emissive="#00f0ff"
          emissiveIntensity={0.8}
          transparent
          opacity={0.8}
        />
      </Sphere>
      {/* Inner Glowing Energy Core */}
      <Sphere visible args={[1, 32, 32]} scale={1.8}>
        <MeshDistortMaterial
          color="#8a2be2"
          attach="material"
          distort={0.3}
          speed={3}
          roughness={0.2}
          metalness={0.8}
          emissive="#8a2be2"
          emissiveIntensity={2}
        />
      </Sphere>
    </Float>
  );
};

const OrbitingDataRings = () => {
  const count = 400;
  const mesh = useRef();
  
  const particlesPosition = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * 2 * Math.PI;
      // create bands of data
      const phi = (Math.random() - 0.5) * 0.5 + Math.PI / 2; 
      const r = 3.5 + Math.random() * 0.5;
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta); // x
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta); // y
      positions[i * 3 + 2] = r * Math.cos(phi); // z
    }
    return positions;
  }, [count]);

  useFrame((state) => {
    mesh.current.rotation.y = state.clock.getElapsedTime() * 0.5;
    mesh.current.rotation.z = state.clock.getElapsedTime() * 0.2;
    mesh.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.2;
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={particlesPosition}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        color="#ffffff"
        transparent
        opacity={0.9}
        sizeAttenuation
        blending={2}
      />
    </points>
  );
};

const HeroExperience = () => {
  return (
    <div style={{ width: "100%", height: "100%" }}>
      <Canvas camera={{ position: [0, 0, 9], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 10]} intensity={2} color="#00f0ff" />
        <directionalLight position={[-10, -10, -10]} intensity={2} color="#ff00ff" />
        <OrbitControls
          enablePan={false}
          enableZoom={false}
          autoRotate
          autoRotateSpeed={1.5}
        />
        <DataCoreBlob />
        <OrbitingDataRings />
      </Canvas>
    </div>
  );
};

export default HeroExperience;
