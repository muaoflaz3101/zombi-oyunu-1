import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { useMemo } from "react";

interface Building {
  position: [number, number, number];
  size: [number, number, number];
  doorPosition: [number, number, number];
  items: string[];
}

export default function Buildings() {
  const woodTexture = useTexture("/textures/wood.jpg");
  
  const buildings = useMemo<Building[]>(() => [
    {
      position: [15, 3, 15],
      size: [8, 6, 10],
      doorPosition: [11, 0, 15],
      items: ['pistol', 'medkit']
    },
    {
      position: [-15, 3, 15],
      size: [8, 6, 10],
      doorPosition: [-11, 0, 15],
      items: ['shotgun', 'ammo']
    },
    {
      position: [15, 3, -15],
      size: [8, 6, 10],
      doorPosition: [11, 0, -15],
      items: ['rifle', 'medkit', 'melee_stick']
    },
    {
      position: [-15, 3, -15],
      size: [8, 6, 10],
      doorPosition: [-11, 0, -15],
      items: ['ammo', 'medkit', 'melee_stick']
    },
    // Safe house with Jessy
    {
      position: [0, 3, 30],
      size: [12, 6, 12],
      doorPosition: [0, 0, 24],
      items: ['safe_house']
    }
  ], []);

  return (
    <group>
      {buildings.map((building, index) => (
        <group key={index}>
          {/* Main building structure */}
          <mesh position={building.position} castShadow receiveShadow>
            <boxGeometry args={building.size} />
            <meshStandardMaterial map={woodTexture} />
          </mesh>
          
          {/* Roof */}
          <mesh 
            position={[building.position[0], building.position[1] + building.size[1]/2 + 1, building.position[2]]} 
            castShadow
          >
            <boxGeometry args={[building.size[0] + 1, 2, building.size[2] + 1]} />
            <meshStandardMaterial color="#654321" />
          </mesh>
          
          {/* Door frame */}
          <mesh position={building.doorPosition}>
            <boxGeometry args={[2, 3, 0.2]} />
            <meshStandardMaterial color="#8B4513" />
          </mesh>
          
          {/* Windows */}
          <mesh position={[
            building.position[0] + building.size[0]/2 - 0.1, 
            building.position[1], 
            building.position[2] + 2
          ]}>
            <boxGeometry args={[0.2, 2, 3]} />
            <meshStandardMaterial color="#87CEEB" transparent opacity={0.6} />
          </mesh>
          
          <mesh position={[
            building.position[0] + building.size[0]/2 - 0.1, 
            building.position[1], 
            building.position[2] - 2
          ]}>
            <boxGeometry args={[0.2, 2, 3]} />
            <meshStandardMaterial color="#87CEEB" transparent opacity={0.6} />
          </mesh>
          
          {/* Interior items (visible when inside) */}
          {building.items.map((item, itemIndex) => (
            <mesh 
              key={itemIndex}
              position={[
                building.position[0] + (Math.random() - 0.5) * (building.size[0] - 2),
                0.5,
                building.position[2] + (Math.random() - 0.5) * (building.size[2] - 2)
              ]}
              userData={{ item, buildingIndex: index }}
            >
              <boxGeometry args={[0.5, 0.5, 0.5]} />
              <meshStandardMaterial color={
                item === 'pistol' || item === 'shotgun' || item === 'rifle' ? '#444444' :
                item === 'medkit' ? '#FF0000' :
                item === 'ammo' ? '#FFD700' :
                item === 'melee_stick' ? '#8B4513' :
                '#00FF00'
              } />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}
