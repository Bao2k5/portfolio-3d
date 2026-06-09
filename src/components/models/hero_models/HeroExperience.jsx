import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const StealthJet = () => {
  const group = useRef();
  
  // Custom glowing materials
  const jetMaterial = new THREE.MeshStandardMaterial({
    color: "#00f0ff",
    emissive: "#00f0ff",
    emissiveIntensity: 0.8,
    wireframe: true,
    transparent: true,
    opacity: 0.9,
  });

  const coreMaterial = new THREE.MeshStandardMaterial({
    color: "#aa00ff",
    emissive: "#8a2be2",
    emissiveIntensity: 2,
  });

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const entranceDuration = 2.5;

    if (t < entranceDuration) {
      // ENTRANCE ANIMATION: Spiraling in from outside
      const progress = t / entranceDuration; // 0 to 1
      const radius = 10 * (1 - progress);
      const angle = progress * Math.PI * 6; // 3 full spiral circles
      
      const x = Math.sin(angle) * radius;
      const z = Math.cos(angle) * radius;
      const y = Math.sin(progress * Math.PI) * 4; // Swooping up and down
      
      group.current.position.set(x, y, z);
      
      // Calculate tangent to look forward along the spiral
      const nextAngle = angle + 0.1;
      const nextRadius = 10 * (1 - Math.min(1, progress + 0.05));
      const nextX = Math.sin(nextAngle) * nextRadius;
      const nextZ = Math.cos(nextAngle) * nextRadius;
      const nextY = Math.sin(Math.min(1, progress + 0.05) * Math.PI) * 4;
      
      group.current.lookAt(nextX, nextY, nextZ);
      
      // Dynamic banking during spiral
      group.current.rotateZ(-Math.PI / 4); 
    } else {
      // HOVER & MOUSE TRACKING MODE
      // Smoothly bring it to the exact center (0, 0, 0) + slight floating
      const targetPos = new THREE.Vector3(0, Math.sin(t * 2) * 0.2, 0);
      group.current.position.lerp(targetPos, 0.05);

      // Mouse tracking: Calculate target look point based on mouse pointer
      // state.pointer is normalized between -1 and 1
      const targetX = state.pointer.x * 15;
      const targetY = state.pointer.y * 15 + Math.sin(t * 2) * 0.2; 
      const targetZ = 15; // Far away towards the screen
      
      const targetPosition = new THREE.Vector3(targetX, targetY, targetZ);
      
      // Use a dummy object to calculate the correct quaternion
      const dummy = new THREE.Object3D();
      dummy.position.copy(group.current.position);
      dummy.lookAt(targetPosition);
      
      // Smoothly interpolate current rotation to the target rotation
      group.current.quaternion.slerp(dummy.quaternion, 0.1);
      
      // Add realistic flight banking (roll) when moving mouse horizontally
      group.current.rotateZ(-state.pointer.x * Math.PI * 0.2);
    }
  });

  return (
    <group ref={group}>
      {/* Fuselage / Main Body (Diamond shape using 4 segments) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 1]}>
        <cylinderGeometry args={[0, 0.7, 4, 4]} />
        <primitive object={jetMaterial} attach="material" />
      </mesh>

      {/* Main Wings */}
      <mesh position={[0, -0.2, -0.2]}>
        <boxGeometry args={[5.5, 0.1, 1.5]} />
        <primitive object={jetMaterial} attach="material" />
      </mesh>

      {/* Tail Wings */}
      <mesh position={[0, 0, -1.2]} rotation={[0.1, 0, 0]}>
        <boxGeometry args={[2.5, 0.1, 0.8]} />
        <primitive object={jetMaterial} attach="material" />
      </mesh>

      {/* Vertical Tail Fins (Angled outwards) */}
      <mesh position={[-0.8, 0.5, -1.2]} rotation={[0, 0, -0.4]}>
        <boxGeometry args={[0.1, 1.2, 0.8]} />
        <primitive object={jetMaterial} attach="material" />
      </mesh>
      <mesh position={[0.8, 0.5, -1.2]} rotation={[0, 0, 0.4]}>
        <boxGeometry args={[0.1, 1.2, 0.8]} />
        <primitive object={jetMaterial} attach="material" />
      </mesh>

      {/* Cloud/Data Engine Core */}
      <mesh position={[0, 0, -1.2]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.3, 0.4, 0.8, 8]} />
        <primitive object={coreMaterial} attach="material" />
      </mesh>
      
      {/* Engine Thrust Flame */}
      <mesh position={[0, 0, -2]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.2, 1.5, 8]} />
        <meshStandardMaterial color="#ff00ff" emissive="#ff00ff" emissiveIntensity={4} transparent opacity={0.8} />
      </mesh>
    </group>
  );
};

const WarpSpeedParticles = () => {
  const count = 600;
  const mesh = useRef();
  
  const particlesPosition = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 30; // x spread
      positions[i * 3 + 1] = (Math.random() - 0.5) * 30; // y spread
      positions[i * 3 + 2] = (Math.random() - 0.5) * 50; // z depth
    }
    return positions;
  }, [count]);

  useFrame((state) => {
    // Simulate flying forward by moving particles towards the camera
    const array = mesh.current.geometry.attributes.position.array;
    // Base speed + extra speed based on mouse movement
    const speed = 0.2 + Math.abs(state.pointer.x) * 0.3;
    
    for (let i = 0; i < count; i++) {
      array[i * 3 + 2] += speed; // Move Z positive (towards screen)
      if (array[i * 3 + 2] > 10) {
        array[i * 3 + 2] = -40; // Reset far away
      }
    }
    mesh.current.geometry.attributes.position.needsUpdate = true;
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
        size={0.08}
        color="#ffffff"
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={2}
      />
    </points>
  );
};

const HeroExperience = () => {
  return (
    <div style={{ width: "100%", height: "100%" }}>
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
        <ambientLight intensity={1} />
        <directionalLight position={[10, 10, 10]} intensity={2} color="#00f0ff" />
        <directionalLight position={[-10, -10, -10]} intensity={2} color="#ff00ff" />
        
        {/* We do NOT use OrbitControls here because the Jet tracks the mouse natively */}
        <StealthJet />
        <WarpSpeedParticles />
      </Canvas>
    </div>
  );
};

export default HeroExperience;
