import { useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useKeyboardControls, PointerLockControls } from "@react-three/drei";
import * as THREE from "three";
import { usePlayer } from "../lib/stores/usePlayer";

enum Controls {
  forward = 'forward',
  backward = 'backward',
  leftward = 'leftward',
  rightward = 'rightward',
  reload = 'reload'
}

export default function Player() {
  const playerRef = useRef<THREE.Mesh>(null);
  const controlsRef = useRef<any>(null);
  const { camera } = useThree();
  const [, getKeys] = useKeyboardControls<Controls>();
  const { 
    position, 
    velocity, 
    health, 
    ammo, 
    setPosition, 
    setVelocity, 
    reload,
    takeDamage 
  } = usePlayer();

  const moveSpeed = 5;
  const direction = useRef(new THREE.Vector3());
  const frontVector = useRef(new THREE.Vector3());
  const sideVector = useRef(new THREE.Vector3());

  useEffect(() => {
    // Set initial camera position
    camera.position.set(position[0], position[1] + 1.6, position[2]);
  }, [camera, position]);

  useFrame((state, delta) => {
    if (!controlsRef.current) return;

    const keys = getKeys();
    
    // Get camera direction
    const cameraDirection = new THREE.Vector3();
    camera.getWorldDirection(cameraDirection);
    
    // Calculate movement vectors
    frontVector.current.set(0, 0, Number(keys.backward) - Number(keys.forward));
    sideVector.current.set(Number(keys.leftward) - Number(keys.rightward), 0, 0);
    
    direction.current
      .subVectors(frontVector.current, sideVector.current)
      .normalize()
      .multiplyScalar(moveSpeed * delta);

    // Apply movement relative to camera direction
    const moveVector = new THREE.Vector3();
    moveVector.copy(direction.current);
    moveVector.applyQuaternion(camera.quaternion);
    moveVector.y = 0; // Don't move up/down

    // Update position
    const newPosition: [number, number, number] = [
      position[0] + moveVector.x,
      position[1],
      position[2] + moveVector.z
    ];

    setPosition(newPosition);

    // Update camera position to follow player
    camera.position.set(newPosition[0], newPosition[1] + 1.6, newPosition[2]);

    // Handle reload
    if (keys.reload) {
      reload();
    }

    // Update player mesh position if it exists
    if (playerRef.current) {
      playerRef.current.position.set(...newPosition);
    }

    console.log(`Player position: ${newPosition[0].toFixed(2)}, ${newPosition[1].toFixed(2)}, ${newPosition[2].toFixed(2)}`);
  });

  return (
    <>
      {/* Pointer lock controls for mouse look */}
      <PointerLockControls ref={controlsRef} />
      
      {/* Player representation (invisible in first person) */}
      <mesh ref={playerRef} position={position} visible={false}>
        <boxGeometry args={[0.6, 1.8, 0.6]} />
        <meshStandardMaterial color="blue" />
      </mesh>
    </>
  );
}
