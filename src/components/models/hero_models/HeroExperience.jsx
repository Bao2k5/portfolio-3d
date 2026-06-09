import { useRef, useMemo, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

const RealAirplane = () => {
  const group = useRef();
  const lasersRef1 = useRef();
  const lasersRef2 = useRef();
  const lasersRef3 = useRef();
  
  const LASER_COUNT = 30;
  const createLaserData = () => Array.from({ length: LASER_COUNT }, () => ({
    active: false, position: new THREE.Vector3(), velocity: new THREE.Vector3(), life: 0
  }));
  const lasersData1 = useRef(createLaserData());
  const lasersData2 = useRef(createLaserData());
  const lasersData3 = useRef(createLaserData());
  const laserState = useRef({ nextIdx: 0, lastShoot: 0 });
  
  const leftEngine = useRef();
  const rightEngine = useRef();
  const leftWingmanGroup = useRef();
  const rightWingmanGroup = useRef();
  
  // Load the downloaded GLB models
  const { scene: mainScene } = useGLTF("/models/airplane.glb");
  const { scene: w1Scene } = useGLTF("/models/wingman1.glb");
  const { scene: w2Scene } = useGLTF("/models/wingman2.glb");
  
  // Clone the scenes
  const mainJet = useMemo(() => mainScene.clone(), [mainScene]);
  const leftWingman = useMemo(() => w1Scene.clone(), [w1Scene]);
  const rightWingman = useMemo(() => w2Scene.clone(), [w2Scene]);

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
      // Make the airplane move across the screen following the mouse
      const isShooting = t > 2.5 && (t % 5) < 1.5; // Shoot for 1.5s every 5s
      
      const targetPos = new THREE.Vector3(
        state.pointer.x * 10, // Move left/right heavily
        state.pointer.y * 5 + Math.sin(t * 2) * 0.2, // Move up/down
        isShooting ? 3 : 0 // Dash forward towards the screen when shooting!
      );
      group.current.position.lerp(targetPos, 0.05);

      // Mouse tracking: Calculate target look point much further away
      const targetX = state.pointer.x * 30;
      const targetY = state.pointer.y * 30; 
      const targetZ = 40; // Far away towards the screen
      
      const targetPosition = new THREE.Vector3(targetX, targetY, targetZ);
      
      // Use a dummy object to calculate the correct quaternion
      const dummy = new THREE.Object3D();
      dummy.position.copy(group.current.position);
      dummy.lookAt(targetPosition);
      
      // Apply aggressive banking when moving
      dummy.rotateZ(-state.pointer.x * Math.PI * 0.3);
      
      // Smoothly interpolate current rotation to the target rotation
      group.current.quaternion.slerp(dummy.quaternion, 0.1);
      
      // === SHOOTING LOGIC ===
      if (isShooting && t - laserState.current.lastShoot > 0.05) {
        const idx = laserState.current.nextIdx;
        
        // Directions
        const forward = new THREE.Vector3(0, 0, 1).applyQuaternion(group.current.quaternion).normalize();
        const right = new THREE.Vector3(1, 0, 0).applyQuaternion(group.current.quaternion).normalize();
        const up = new THREE.Vector3(0, 1, 0).applyQuaternion(group.current.quaternion).normalize();
        
        // Common offsets
        const isLeft = idx % 2 === 0;
        const sideOffset = right.clone().multiplyScalar(isLeft ? -1.8 : 1.8);
        const forwardOffset = forward.clone().multiplyScalar(2.0);
        const downOffset = up.clone().multiplyScalar(-0.3);
        
        // --- MAIN JET (Cyan) ---
        const laser1 = lasersData1.current[idx];
        laser1.active = true; laser1.life = 0;
        const mainPos = new THREE.Vector3();
        group.current.getWorldPosition(mainPos);
        laser1.position.copy(mainPos).add(forwardOffset).add(sideOffset).add(downOffset);
        laser1.velocity.copy(forward).multiplyScalar(80);
        laser1.velocity.x += (Math.random() - 0.5) * 3;
        laser1.velocity.y += (Math.random() - 0.5) * 3;

        // --- LEFT WINGMAN (Magenta) ---
        if (leftWingmanGroup.current) {
          const laser2 = lasersData2.current[idx];
          laser2.active = true; laser2.life = 0;
          const leftPos = new THREE.Vector3();
          leftWingmanGroup.current.getWorldPosition(leftPos);
          laser2.position.copy(leftPos).add(forwardOffset).add(sideOffset).add(downOffset);
          laser2.velocity.copy(forward).multiplyScalar(80);
          laser2.velocity.x += (Math.random() - 0.5) * 3;
          laser2.velocity.y += (Math.random() - 0.5) * 3;
        }

        // --- RIGHT WINGMAN (Yellow) ---
        if (rightWingmanGroup.current) {
          const laser3 = lasersData3.current[idx];
          laser3.active = true; laser3.life = 0;
          const rightPos = new THREE.Vector3();
          rightWingmanGroup.current.getWorldPosition(rightPos);
          laser3.position.copy(rightPos).add(forwardOffset).add(sideOffset).add(downOffset);
          laser3.velocity.copy(forward).multiplyScalar(80);
          laser3.velocity.x += (Math.random() - 0.5) * 3;
          laser3.velocity.y += (Math.random() - 0.5) * 3;
        }
        
        laserState.current.nextIdx = (idx + 1) % LASER_COUNT;
        laserState.current.lastShoot = t;
        
        // Recoil effect (push back) and Shake effect (only for main group)
        group.current.position.add(forward.clone().multiplyScalar(-0.08));
        group.current.rotation.z += (Math.random() - 0.5) * 0.1;
      }
      
      // === AFTERBURNER LOGIC ===
      if (leftEngine.current && rightEngine.current) {
        const flicker = 0.8 + Math.random() * 0.4;
        const thrustScale = isShooting ? 2.5 : 1;
        leftEngine.current.scale.set(flicker, flicker * thrustScale, flicker);
        rightEngine.current.scale.set(flicker, flicker * thrustScale, flicker);
      }
    }
    
    // === UPDATE LASERS ===
    const dummyObj = new THREE.Object3D();
    const updateLasers = (dataRef, meshRef) => {
      if (!meshRef.current) return;
      for (let i = 0; i < LASER_COUNT; i++) {
        const laser = dataRef.current[i];
        if (laser.active) {
          laser.life += 0.016; // approx 60fps delta
          laser.position.add(laser.velocity.clone().multiplyScalar(0.016));
          
          dummyObj.position.copy(laser.position);
          dummyObj.lookAt(laser.position.clone().add(laser.velocity));
          dummyObj.rotateX(Math.PI / 2);
          dummyObj.scale.set(1, 4, 1);
          dummyObj.updateMatrix();
          meshRef.current.setMatrixAt(i, dummyObj.matrix);
          
          if (laser.life > 1) {
            laser.active = false;
            dummyObj.scale.set(0, 0, 0);
            dummyObj.updateMatrix();
            meshRef.current.setMatrixAt(i, dummyObj.matrix);
          }
        }
      }
      meshRef.current.instanceMatrix.needsUpdate = true;
    };

    updateLasers(lasersData1, lasersRef1);
    updateLasers(lasersData2, lasersRef2);
    updateLasers(lasersData3, lasersRef3);
  });

  return (
    <>
      <group ref={group}>
        {/* ================= MAIN JET ================= */}
        <group>
          <primitive object={mainJet} scale={0.015} rotation={[0, 0, 0]} />
          {/* Main Jet Afterburners */}
          <mesh ref={leftEngine} position={[-0.55, 0.1, -4.5]} rotation={[Math.PI / 2, 0, 0]}>
            <coneGeometry args={[0.25, 2, 16]} />
            <meshStandardMaterial color="#ff8c00" emissive="#ff4500" emissiveIntensity={6} toneMapped={false} transparent opacity={0.9} />
          </mesh>
          <mesh ref={rightEngine} position={[0.55, 0.1, -4.5]} rotation={[Math.PI / 2, 0, 0]}>
            <coneGeometry args={[0.25, 2, 16]} />
            <meshStandardMaterial color="#ff8c00" emissive="#ff4500" emissiveIntensity={6} toneMapped={false} transparent opacity={0.9} />
          </mesh>
        </group>

        {/* ================= LEFT WINGMAN ================= */}
        <group ref={leftWingmanGroup} position={[-5, -1.5, -5]}>
          <primitive object={leftWingman} scale={0.012} rotation={[0, 0, 0]} />
          <mesh position={[-0.45, 0.08, -3.6]} rotation={[Math.PI / 2, 0, 0]}>
            <coneGeometry args={[0.2, 1.5, 16]} />
            <meshStandardMaterial color="#00aaff" emissive="#00ffff" emissiveIntensity={5} toneMapped={false} transparent opacity={0.8} />
          </mesh>
          <mesh position={[0.45, 0.08, -3.6]} rotation={[Math.PI / 2, 0, 0]}>
            <coneGeometry args={[0.2, 1.5, 16]} />
            <meshStandardMaterial color="#00aaff" emissive="#00ffff" emissiveIntensity={5} toneMapped={false} transparent opacity={0.8} />
          </mesh>
        </group>

        {/* ================= RIGHT WINGMAN ================= */}
        <group ref={rightWingmanGroup} position={[5, -1.5, -5]}>
          <primitive object={rightWingman} scale={0.012} rotation={[0, 0, 0]} />
          <mesh position={[-0.45, 0.08, -3.6]} rotation={[Math.PI / 2, 0, 0]}>
            <coneGeometry args={[0.2, 1.5, 16]} />
            <meshStandardMaterial color="#00aaff" emissive="#00ffff" emissiveIntensity={5} toneMapped={false} transparent opacity={0.8} />
          </mesh>
          <mesh position={[0.45, 0.08, -3.6]} rotation={[Math.PI / 2, 0, 0]}>
            <coneGeometry args={[0.2, 1.5, 16]} />
            <meshStandardMaterial color="#00aaff" emissive="#00ffff" emissiveIntensity={5} toneMapped={false} transparent opacity={0.8} />
          </mesh>
        </group>
      </group>
      
      {/* Laser Projectiles */}
      {/* Main Jet Lasers (Cyan) */}
      <instancedMesh ref={lasersRef1} args={[null, null, LASER_COUNT]}>
        <cylinderGeometry args={[0.02, 0.02, 1, 8]} />
        <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={5} toneMapped={false} />
      </instancedMesh>
      
      {/* Left Wingman Lasers (Magenta) */}
      <instancedMesh ref={lasersRef2} args={[null, null, LASER_COUNT]}>
        <cylinderGeometry args={[0.02, 0.02, 1, 8]} />
        <meshStandardMaterial color="#ff00ff" emissive="#ff00ff" emissiveIntensity={5} toneMapped={false} />
      </instancedMesh>
      
      {/* Right Wingman Lasers (Yellow) */}
      <instancedMesh ref={lasersRef3} args={[null, null, LASER_COUNT]}>
        <cylinderGeometry args={[0.02, 0.02, 1, 8]} />
        <meshStandardMaterial color="#ffaa00" emissive="#ffaa00" emissiveIntensity={5} toneMapped={false} />
      </instancedMesh>
    </>
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

useGLTF.preload("/models/airplane.glb");
useGLTF.preload("/models/wingman1.glb");
useGLTF.preload("/models/wingman2.glb");
