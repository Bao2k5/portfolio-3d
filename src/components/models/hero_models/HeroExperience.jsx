import { useRef, useMemo, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

const RealAirplane = () => {
  const group = useRef();
  
  // Load the downloaded GLB model
  const { scene } = useGLTF("/models/airplane.glb");
  
  // Clone the scene so it can be reused safely
  const airplaneScene = useMemo(() => scene.clone(), [scene]);

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
      {/* 
        Adjust scale and rotation here if the downloaded model 
        is too big, too small, or flying backward.
      */}
      <primitive object={airplaneScene} scale={0.01} rotation={[0, 0, 0]} />
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
        {/* Ambient light to see the model properly */}
        <ambientLight intensity={1.5} />
        <directionalLight position={[10, 10, 10]} intensity={3} color="#ffffff" />
        <directionalLight position={[-10, -10, -10]} intensity={1} color="#aaaaff" />
        
        <Suspense fallback={null}>
          <RealAirplane />
        </Suspense>
        
        <WarpSpeedParticles />
      </Canvas>
    </div>
  );
};

export default HeroExperience;
