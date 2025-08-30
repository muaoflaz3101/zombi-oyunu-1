import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useState } from "react";
import { KeyboardControls } from "@react-three/drei";
import "@fontsource/inter";
import Game from "./components/Game";
import { useGame } from "./lib/stores/useGame";
import StartScreen from "./components/UI/StartScreen";

// Define control keys for the game
enum Controls {
  forward = 'forward',
  backward = 'backward',
  leftward = 'leftward',
  rightward = 'rightward',
  reload = 'reload',
  inventory = 'inventory',
  shop = 'shop',
  interact = 'interact',
  start = 'start'
}

const controls = [
  { name: Controls.forward, keys: ["KeyW", "ArrowUp"] },
  { name: Controls.backward, keys: ["KeyS", "ArrowDown"] },
  { name: Controls.leftward, keys: ["KeyA", "ArrowLeft"] },
  { name: Controls.rightward, keys: ["KeyD", "ArrowRight"] },
  { name: Controls.reload, keys: ["KeyF"] },
  { name: Controls.inventory, keys: ["KeyE"] },
  { name: Controls.shop, keys: ["KeyX"] },
  { name: Controls.interact, keys: ["KeyF"] },
  { name: Controls.start, keys: ["Space"] },
];

// Main App component
function App() {
  const { phase } = useGame();
  const [showCanvas, setShowCanvas] = useState(false);

  // Show the canvas once everything is loaded
  useEffect(() => {
    setShowCanvas(true);
  }, []);

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}>
      {showCanvas && (
        <KeyboardControls map={controls}>
          {phase === 'ready' && <StartScreen />}
          
          {(phase === 'playing' || phase === 'ended') && (
            <Canvas
              shadows
              camera={{
                position: [0, 2, 8],
                fov: 75,
                near: 0.1,
                far: 1000
              }}
              gl={{
                antialias: true,
                powerPreference: "default"
              }}
            >
              <color attach="background" args={["#87CEEB"]} />
              
              <Suspense fallback={null}>
                <Game />
              </Suspense>
            </Canvas>
          )}
        </KeyboardControls>
      )}
    </div>
  );
}

export default App;
