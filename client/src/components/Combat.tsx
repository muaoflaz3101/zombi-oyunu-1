import { useRef, useState, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { usePlayer } from "../lib/stores/usePlayer";
import { useWorld } from "../lib/stores/useWorld";
import { useAudio } from "../lib/stores/useAudio";
import { createBullet, updateBullet, checkBulletEnemyCollision, type Bullet } from "../lib/gameUtils";

export default function Combat() {
  const { camera, raycaster } = useThree();
  const bulletsRef = useRef<THREE.Group>(null);
  const [bullets, setBullets] = useState<Bullet[]>([]);
  const { shoot } = usePlayer();
  const { enemies, damageEnemy } = useWorld();
  const { playHit } = useAudio();
  
  // Handle mouse clicks for shooting
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (event.button === 0) { // Left click
        if (shoot()) {
          // Create bullet from camera position and direction
          const cameraDirection = new THREE.Vector3();
          camera.getWorldDirection(cameraDirection);
          
          const bullet = createBullet(
            camera.position.clone(),
            cameraDirection,
            25
          );
          
          setBullets(prev => [...prev, bullet]);
          console.log(`Bullet fired: ${bullet.id}`);
        }
      }
    };

    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [camera, shoot]);

  // Update bullets and check collisions
  useFrame((state, delta) => {
    setBullets(prevBullets => {
      const updatedBullets: Bullet[] = [];
      
      prevBullets.forEach(bullet => {
        // Update bullet position
        const stillAlive = updateBullet(bullet, delta);
        
        if (stillAlive) {
          // Check collision with enemies
          let hitEnemy = false;
          
          enemies.forEach(enemy => {
            if (!hitEnemy) {
              const enemyPos = new THREE.Vector3(
                enemy.position[0],
                enemy.position[1] + 1,
                enemy.position[2]
              );
              
              if (checkBulletEnemyCollision(bullet, enemyPos, 1)) {
                const killed = damageEnemy(enemy.id, bullet.damage);
                hitEnemy = true;
                playHit();
                
                console.log(`Bullet ${bullet.id} hit enemy ${enemy.id} for ${bullet.damage} damage`);
                
                if (killed) {
                  console.log(`Enemy ${enemy.id} killed!`);
                }
              }
            }
          });
          
          if (!hitEnemy) {
            updatedBullets.push(bullet);
          }
        }
      });
      
      return updatedBullets;
    });
  });

  return (
    <group ref={bulletsRef}>
      {bullets.map((bullet) => (
        <mesh key={bullet.id} position={bullet.position}>
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshStandardMaterial color="#FFD700" emissive="#FFD700" emissiveIntensity={0.5} />
        </mesh>
      ))}
    </group>
  );
}
