import { useTexture } from "@react-three/drei";
import * as THREE from "three";

export default function Environment() {
  const grassTexture = useTexture("/textures/grass.png");
  const asphaltTexture = useTexture("/textures/asphalt.png");
  
  // Configure texture repeat
  grassTexture.wrapS = grassTexture.wrapT = THREE.RepeatWrapping;
  grassTexture.repeat.set(20, 20);
  
  asphaltTexture.wrapS = asphaltTexture.wrapT = THREE.RepeatWrapping;
  asphaltTexture.repeat.set(5, 20);

  return (
    <group>
      {/* Main terrain */}
      <mesh position={[0, -0.1, 0]} receiveShadow>
        <planeGeometry args={[200, 200]} />
        <meshStandardMaterial map={grassTexture} />
      </mesh>
      
      {/* Roads */}
      <mesh position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[8, 200]} />
        <meshStandardMaterial map={asphaltTexture} />
      </mesh>
      
      <mesh position={[0, 0, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[8, 200]} />
        <meshStandardMaterial map={asphaltTexture} />
      </mesh>
      
      {/* Trees and props */}
      {Array.from({ length: 50 }, (_, i) => {
        const x = (Math.random() - 0.5) * 180;
        const z = (Math.random() - 0.5) * 180;
        
        // Avoid placing trees on roads
        if (Math.abs(x) < 6 || Math.abs(z) < 6) return null;
        
        return (
          <group key={i} position={[x, 0, z]}>
            {/* Tree trunk */}
            <mesh position={[0, 2, 0]} castShadow>
              <cylinderGeometry args={[0.3, 0.3, 4]} />
              <meshStandardMaterial color="#8B4513" />
            </mesh>
            {/* Tree foliage */}
            <mesh position={[0, 5, 0]} castShadow>
              <sphereGeometry args={[2, 8, 6]} />
              <meshStandardMaterial color="#228B22" />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}
