import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useWorld } from "../lib/stores/useWorld";
import { getDayNightColor, getLightIntensity } from "../lib/gameUtils";

export default function Lighting() {
  const directionalLightRef = useRef<THREE.DirectionalLight>(null);
  const ambientLightRef = useRef<THREE.AmbientLight>(null);
  const { timeOfDay } = useWorld();

  useFrame(() => {
    if (directionalLightRef.current && ambientLightRef.current) {
      const intensity = getLightIntensity(timeOfDay);
      
      directionalLightRef.current.intensity = intensity;
      ambientLightRef.current.intensity = intensity * 0.3;
      
      // Update sun position based on time
      const sunAngle = (timeOfDay / 24) * Math.PI * 2 - Math.PI / 2;
      directionalLightRef.current.position.set(
        Math.cos(sunAngle) * 50,
        Math.sin(sunAngle) * 50,
        0
      );
    }
  });

  useEffect(() => {
    // Update background color based on time of day
    const color = getDayNightColor(timeOfDay);
    document.querySelector('canvas')?.style.setProperty('background-color', `#${color.getHexString()}`);
  }, [timeOfDay]);

  return (
    <>
      {/* Directional light (sun) */}
      <directionalLight
        ref={directionalLightRef}
        position={[10, 10, 5]}
        intensity={1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={100}
        shadow-camera-left={-50}
        shadow-camera-right={50}
        shadow-camera-top={50}
        shadow-camera-bottom={-50}
      />
      
      {/* Ambient light */}
      <ambientLight ref={ambientLightRef} intensity={0.3} />
      
      {/* Additional point lights for night time */}
      {(timeOfDay < 6 || timeOfDay > 18) && (
        <>
          <pointLight position={[15, 5, 15]} intensity={0.5} distance={20} color="#FFD700" />
          <pointLight position={[-15, 5, 15]} intensity={0.5} distance={20} color="#FFD700" />
          <pointLight position={[15, 5, -15]} intensity={0.5} distance={20} color="#FFD700" />
          <pointLight position={[-15, 5, -15]} intensity={0.5} distance={20} color="#FFD700" />
        </>
      )}
    </>
  );
}
