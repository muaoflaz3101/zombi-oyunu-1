import { useRef, useState } from "react";
import { Html } from "@react-three/drei";
import { usePlayer } from "../../lib/stores/usePlayer";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import * as THREE from "three";

interface Mission {
  id: string;
  title: string;
  description: string;
  reward: string;
  completed: boolean;
}

const missions: Mission[] = [
  {
    id: 'kill_10_zombies',
    title: 'Zombie Hunter',
    description: 'Kill 10 zombies',
    reward: 'Pistol + 50 ammo',
    completed: false
  },
  {
    id: 'find_medkits',
    title: 'Medical Supply Run',
    description: 'Find 3 medkits in houses',
    reward: 'Shotgun + $200',
    completed: false
  },
  {
    id: 'survive_night',
    title: 'Night Survivor',
    description: 'Survive one full night cycle',
    reward: 'Rifle + Body Armor',
    completed: false
  }
];

export default function Jessy() {
  const jessyRef = useRef<THREE.Mesh>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [currentMissions] = useState(missions);
  const { position: playerPosition, addExperience, addMoney } = usePlayer();

  const jessyPosition: [number, number, number] = [0, 1, 28];
  
  // Check if player is near Jessy
  const playerPos = new THREE.Vector3(...playerPosition);
  const jessyPos = new THREE.Vector3(...jessyPosition);
  const distanceToPlayer = playerPos.distanceTo(jessyPos);
  const isNearJessy = distanceToPlayer < 3;

  const handleInteraction = () => {
    setShowDialog(!showDialog);
  };

  const completeMission = (mission: Mission) => {
    // Add rewards
    addExperience(100);
    addMoney(100);
    console.log(`Mission completed: ${mission.title}`);
    // In a real game, you'd update mission status
  };

  return (
    <group>
      {/* Jessy NPC */}
      <mesh ref={jessyRef} position={jessyPosition} castShadow>
        <boxGeometry args={[0.8, 1.8, 0.8]} />
        <meshStandardMaterial color="#4169E1" />
      </mesh>
      
      {/* Name tag */}
      <Html position={[jessyPosition[0], jessyPosition[1] + 2, jessyPosition[2]]}>
        <div className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-bold">
          Jessy
        </div>
      </Html>

      {/* Interaction prompt */}
      {isNearJessy && (
        <Html position={[jessyPosition[0], jessyPosition[1] + 1.5, jessyPosition[2]]}>
          <div className="bg-yellow-500 text-black px-2 py-1 rounded text-xs font-bold">
            Press F to talk
          </div>
        </Html>
      )}

      {/* Mission dialog */}
      {showDialog && isNearJessy && (
        <Html fullscreen>
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <Card className="w-96 bg-blue-900 text-white border-blue-700">
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  Jessy - Mission Command
                  <Button onClick={handleInteraction} variant="outline" size="sm">
                    Close
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <p className="text-blue-200 text-sm">
                    "Welcome to the safe house! I have missions that will help you survive and get better equipment."
                  </p>
                </div>
                
                <div className="space-y-3">
                  {currentMissions.map((mission) => (
                    <div 
                      key={mission.id} 
                      className={`border p-3 rounded ${
                        mission.completed 
                          ? 'border-green-500 bg-green-900 bg-opacity-30' 
                          : 'border-blue-500 bg-blue-900 bg-opacity-30'
                      }`}
                    >
                      <div className="font-medium">{mission.title}</div>
                      <div className="text-xs text-gray-300 mb-2">{mission.description}</div>
                      <div className="text-xs text-yellow-400">Reward: {mission.reward}</div>
                      
                      {!mission.completed && (
                        <Button
                          size="sm"
                          onClick={() => completeMission(mission)}
                          className="mt-2 bg-blue-600 hover:bg-blue-700"
                        >
                          Accept Mission
                        </Button>
                      )}
                      
                      {mission.completed && (
                        <div className="text-green-400 text-xs mt-2">✓ Completed</div>
                      )}
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 text-xs text-gray-400">
                  Complete missions to unlock new weapons and earn money!
                </div>
              </CardContent>
            </Card>
          </div>
        </Html>
      )}
    </group>
  );
}
