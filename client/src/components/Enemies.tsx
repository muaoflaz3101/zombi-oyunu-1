import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { usePlayer } from "../lib/stores/usePlayer";
import { useWorld } from "../lib/stores/useWorld";

interface Enemy {
  id: string;
  position: THREE.Vector3;
  health: number;
  type: 'zombie' | 'boss' | 'gang';
  speed: number;
  damage: number;
}

export default function Enemies() {
  const groupRef = useRef<THREE.Group>(null);
  const { position: playerPosition } = usePlayer();
  const { enemies, removeEnemy, damageEnemy } = useWorld();
  
  // Initialize enemies if none exist
  const initializedEnemies = useMemo(() => {
    if (enemies.length === 0) {
      const newEnemies: Enemy[] = [];
      
      // Spawn some zombies around the map
      for (let i = 0; i < 10; i++) {
        const angle = (i / 10) * Math.PI * 2;
        const distance = 20 + Math.random() * 30;
        newEnemies.push({
          id: `zombie_${i}`,
          position: new THREE.Vector3(
            Math.cos(angle) * distance,
            0,
            Math.sin(angle) * distance
          ),
          health: 100,
          type: 'zombie',
          speed: 2,
          damage: 20
        });
      }
      
      // Spawn a boss
      newEnemies.push({
        id: 'boss_1',
        position: new THREE.Vector3(50, 0, 50),
        health: 500,
        type: 'boss',
        speed: 1.5,
        damage: 50
      });
      
      return newEnemies;
    }
    return enemies;
  }, [enemies]);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    
    const playerPos = new THREE.Vector3(...playerPosition);
    
    // Update enemy AI
    initializedEnemies.forEach((enemy: Enemy, index: number) => {
      if (enemy.health <= 0) return;
      
      const enemyMesh = groupRef.current?.children[index] as THREE.Mesh;
      if (!enemyMesh) return;
      
      // Move towards player
      const direction = playerPos.clone().sub(enemy.position).normalize();
      enemy.position.add(direction.multiplyScalar(enemy.speed * delta));
      
      // Update mesh position
      enemyMesh.position.copy(enemy.position);
      
      // Check distance to player for attack
      const distanceToPlayer = enemy.position.distanceTo(playerPos);
      if (distanceToPlayer < 2) {
        // Attack player (implement damage later)
        console.log(`${enemy.type} attacking player!`);
      }
    });
  });

  return (
    <group ref={groupRef}>
      {initializedEnemies.map((enemy: Enemy, index: number) => (
        <mesh
          key={enemy.id}
          position={[enemy.position.x, enemy.position.y + 1, enemy.position.z]}
          castShadow
          userData={{ enemyId: enemy.id, type: enemy.type }}
        >
          <boxGeometry args={enemy.type === 'boss' ? [2, 3, 2] : [0.8, 1.8, 0.8]} />
          <meshStandardMaterial 
            color={
              enemy.type === 'boss' ? '#800080' : 
              enemy.type === 'gang' ? '#FF4500' : 
              '#8B0000'
            } 
          />
        </mesh>
      ))}
    </group>
  );
}
