import { Html } from "@react-three/drei";
import { usePlayer } from "../../lib/stores/usePlayer";
import { useWorld } from "../../lib/stores/useWorld";
import { useGame } from "../../lib/stores/useGame";

export default function GameHUD() {
  const { health, ammo, level, experience } = usePlayer();
  const { timeOfDay, wave } = useWorld();
  const { phase } = useGame();

  if (phase !== 'playing') return null;

  const timeString = `${Math.floor(timeOfDay)}:${Math.floor((timeOfDay % 1) * 60).toString().padStart(2, '0')}`;
  const isNight = timeOfDay < 6 || timeOfDay > 18;

  return (
    <Html fullscreen>
      <div className="absolute inset-0 pointer-events-none text-white">
        {/* Top HUD */}
        <div className="absolute top-4 left-4 bg-black bg-opacity-70 p-4 rounded-lg">
          <div className="text-lg font-bold">Health: {health}/100</div>
          <div className="text-lg">Ammo: {ammo}</div>
          <div className="text-sm">Level: {level}</div>
          <div className="text-sm">XP: {experience}</div>
        </div>

        {/* Top right - Time and wave */}
        <div className="absolute top-4 right-4 bg-black bg-opacity-70 p-4 rounded-lg text-right">
          <div className="text-lg font-bold">{timeString} {isNight ? '🌙' : '☀️'}</div>
          <div className="text-sm">Wave: {wave}</div>
        </div>

        {/* Crosshair */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-1 h-1 bg-white rounded-full"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 border border-white rounded-full opacity-50"></div>
        </div>

        {/* Controls reminder */}
        <div className="absolute bottom-4 left-4 bg-black bg-opacity-70 p-3 rounded-lg text-xs">
          <div>WASD: Move</div>
          <div>Mouse: Look</div>
          <div>Click: Shoot</div>
          <div>F: Reload</div>
          <div>E: Inventory</div>
          <div>X: Shop</div>
        </div>
      </div>
    </Html>
  );
}
