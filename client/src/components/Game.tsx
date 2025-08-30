import { useFrame } from "@react-three/fiber";
import { useKeyboardControls } from "@react-three/drei";
import { useRef, useEffect } from "react";
import * as THREE from "three";
import Player from "./Player";
import Environment from "./Environment";
import Enemies from "./Enemies";
import Buildings from "./Buildings";
import GameHUD from "./UI/GameHUD";
import Inventory from "./UI/Inventory";
import Shop from "./UI/Shop";
import Jessy from "./NPCs/Jessy";
import Lighting from "./Lighting";
import Combat from "./Combat";
import { useGame } from "../lib/stores/useGame";
import { usePlayer } from "../lib/stores/usePlayer";
import { useWorld } from "../lib/stores/useWorld";
import { useInventory } from "../lib/stores/useInventory";

enum Controls {
  forward = 'forward',
  backward = 'backward',
  leftward = 'leftward',
  rightward = 'rightward',
  reload = 'reload',
  inventory = 'inventory',
  shop = 'shop',
  interact = 'interact'
}

export default function Game() {
  const gameRef = useRef<THREE.Group>(null);
  const [, getKeys] = useKeyboardControls<Controls>();
  const { phase } = useGame();
  const { showInventory, showShop, toggleInventory, toggleShop } = useInventory();
  const { updateTime } = useWorld();
  
  // Game loop
  useFrame((state, delta) => {
    if (phase !== 'playing') return;
    
    // Update world time for day/night cycle
    updateTime(delta);
    
    // Handle UI toggles
    const keys = getKeys();
    
    // Use refs to prevent multiple toggles
    const currentTime = Date.now();
    
    if (keys.inventory && !showInventory) {
      toggleInventory();
    }
    
    if (keys.shop && !showShop) {
      toggleShop();
    }
  });

  return (
    <group ref={gameRef}>
      {/* Game World */}
      <Lighting />
      <Environment />
      <Buildings />
      <Player />
      <Enemies />
      <Combat />
      <Jessy />
      
      {/* UI Components */}
      <GameHUD />
      {showInventory && <Inventory />}
      {showShop && <Shop />}
    </group>
  );
}
