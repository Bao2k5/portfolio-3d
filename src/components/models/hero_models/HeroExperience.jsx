import { useRef, useMemo, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

// Reusable objects for useFrame to prevent Memory Leaks / Garbage Collection crashes
const _dummyObj = new THREE.Object3D();
const _worldPos = new THREE.Vector3();
const _forward = new THREE.Vector3(0, 0, 1);
const _right = new THREE.Vector3(1, 0, 0);
const _up = new THREE.Vector3(0, 1, 0);
const _sideOffset = new THREE.Vector3();
const _forwardOffset = new THREE.Vector3();
const _downOffset = new THREE.Vector3();
const _jetPos = new THREE.Vector3();
const _targetPos = new THREE.Vector3();
const _targetLook = new THREE.Vector3();
const _velocityDelta = new THREE.Vector3();
const _lookTarget = new THREE.Vector3();

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
  
  // Load the downloaded GLB model
  const { scene } = useGLTF("/models/airplane.glb");
  
  // Clone the scene for main jet and wingmen
  const mainJet = useMemo(() => scene.clone(), [scene]);
  const leftWingman = useMemo(() => scene.clone(), [scene]);
  const rightWingman = useMemo(() => scene.clone(), [scene]);

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
      const isShooting = t > 2.5 && (t % 5) < 1.5; // Shoot for 1.5s every 5s
      
      _targetPos.set(
        state.pointer.x * 10,
        state.pointer.y * 5 + Math.sin(t * 2) * 0.2,
        isShooting ? 3 : 0
      );
      group.current.position.lerp(_targetPos, 0.05);

      _targetLook.set(state.pointer.x * 30, state.pointer.y * 30, 40);
      
      _dummyObj.position.copy(group.current.position);
      _dummyObj.lookAt(_targetLook);
      _dummyObj.rotateZ(-state.pointer.x * Math.PI * 0.3);
      
      group.current.quaternion.slerp(_dummyObj.quaternion, 0.1);
      
      // === SHOOTING LOGIC ===
      if (isShooting && t - laserState.current.lastShoot > 0.05) {
        const idx = laserState.current.nextIdx;
        
        // Directions
        _forward.set(0, 0, 1).applyQuaternion(group.current.quaternion).normalize();
        _right.set(1, 0, 0).applyQuaternion(group.current.quaternion).normalize();
        _up.set(0, 1, 0).applyQuaternion(group.current.quaternion).normalize();
        
        // Common offsets
        const isLeft = idx % 2 === 0;
        _sideOffset.copy(_right).multiplyScalar(isLeft ? -1.8 : 1.8);
        _forwardOffset.copy(_forward).multiplyScalar(2.0);
        _downOffset.copy(_up).multiplyScalar(-0.3);
        
        // --- MAIN JET (Cyan) ---
        const laser1 = lasersData1.current[idx];
        laser1.active = true; laser1.life = 0;
        group.current.getWorldPosition(_jetPos);
        laser1.position.copy(_jetPos).add(_forwardOffset).add(_sideOffset).add(_downOffset);
        laser1.velocity.copy(_forward).multiplyScalar(80);
        laser1.velocity.x += (Math.random() - 0.5) * 3;
        laser1.velocity.y += (Math.random() - 0.5) * 3;

        // --- LEFT WINGMAN (Magenta) ---
        if (leftWingmanGroup.current) {
          const laser2 = lasersData2.current[idx];
          laser2.active = true; laser2.life = 0;
          leftWingmanGroup.current.getWorldPosition(_jetPos);
          laser2.position.copy(_jetPos).add(_forwardOffset).add(_sideOffset).add(_downOffset);
          laser2.velocity.copy(_forward).multiplyScalar(80);
          laser2.velocity.x += (Math.random() - 0.5) * 3;
          laser2.velocity.y += (Math.random() - 0.5) * 3;
        }

        // --- RIGHT WINGMAN (Yellow) ---
        if (rightWingmanGroup.current) {
          const laser3 = lasersData3.current[idx];
          laser3.active = true; laser3.life = 0;
          rightWingmanGroup.current.getWorldPosition(_jetPos);
          laser3.position.copy(_jetPos).add(_forwardOffset).add(_sideOffset).add(_downOffset);
          laser3.velocity.copy(_forward).multiplyScalar(80);
          laser3.velocity.x += (Math.random() - 0.5) * 3;
          laser3.velocity.y += (Math.random() - 0.5) * 3;
        }
        
        laserState.current.nextIdx = (idx + 1) % LASER_COUNT;
        laserState.current.lastShoot = t;
        
        // Recoil effect (push back) and Shake effect (only for main group)
        group.current.position.add(_forwardOffset.copy(_forward).multiplyScalar(-0.08));
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
    const updateLasers = (dataRef, meshRef) => {
      if (!meshRef.current) return;
      for (let i = 0; i < LASER_COUNT; i++) {
        const laser = dataRef.current[i];
        if (laser.active) {
          laser.life += 0.016; // approx 60fps delta
          _velocityDelta.copy(laser.velocity).multiplyScalar(0.016);
          laser.position.add(_velocityDelta);
          
          _dummyObj.position.copy(laser.position);
          _lookTarget.copy(laser.position).add(laser.velocity);
          _dummyObj.lookAt(_lookTarget);
          _dummyObj.rotateX(Math.PI / 2);
          _dummyObj.scale.set(1, 4, 1);
          _dummyObj.updateMatrix();
          meshRef.current.setMatrixAt(i, _dummyObj.matrix);
          
          if (laser.life > 1) {
            laser.active = false;
            _dummyObj.scale.set(0, 0, 0);
            _dummyObj.updateMatrix();
            meshRef.current.setMatrixAt(i, _dummyObj.matrix);
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
