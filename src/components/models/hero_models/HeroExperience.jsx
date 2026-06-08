import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

const ParticleWave = () => {
  const count = 3600;
  const points = useRef();

  // Create grid coordinates
  const [positions, step] = useMemo(() => {
    const temp = new Float32Array(count * 3);
    const step = Math.sqrt(count);
    let i = 0;
    for (let x = 0; x < step; x++) {
      for (let z = 0; z < step; z++) {
        const u = (x / step - 0.5) * 16;
        const v = (z / step - 0.5) * 16;
        temp[i++] = u; // X
        temp[i++] = 0; // Y (animated)
        temp[i++] = v; // Z
      }
    }
    return [temp, step];
  }, [count]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const array = points.current.geometry.attributes.position.array;
    let index = 0;
    for (let x = 0; x < step; x++) {
      for (let z = 0; z < step; z++) {
        const u = (x / step - 0.5) * 16;
        const v = (z / step - 0.5) * 16;
        
        // Dynamic wave logic
        const dist = Math.sqrt(u * u + v * v);
        const y = Math.sin(dist * 0.8 - time * 2.5) * 0.7 + Math.cos(u * 1.5 + time) * 0.3;
        
        array[index * 3 + 1] = y; // update Y
        index++;
      }
    }
    points.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#00f0ff" // Glowing Neon Cyan
        size={0.08}
        sizeAttenuation
        transparent
        opacity={0.85}
        depthWrite={false}
        blending={2} // Additive blending
      />
    </points>
  );
};

const HeroExperience = () => {
  return (
    <div style={{ width: "100%", height: "100%" }}>
      <Canvas camera={{ position: [0, 6, 12], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <OrbitControls
          enablePan={false}
          enableZoom={true}
          maxDistance={18}
          minDistance={6}
          autoRotate
          autoRotateSpeed={0.8}
        />
        <ParticleWave />
      </Canvas>
    </div>
  );
};

export default HeroExperience;
