import { useState, useEffect } from "react";
import { useGame } from "../../lib/stores/useGame";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export default function StartScreen() {
  const [countdown, setCountdown] = useState(0);
  const [gameStarting, setGameStarting] = useState(false);
  const { start } = useGame();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (gameStarting && countdown > 0) {
      interval = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            start();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [gameStarting, countdown, start]);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.code === 'Space' && !gameStarting) {
        setGameStarting(true);
        setCountdown(10);
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [gameStarting]);

  const startGame = () => {
    setGameStarting(true);
    setCountdown(10);
  };

  return (
    <div className="absolute inset-0 bg-gradient-to-b from-red-900 to-black flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-6xl font-bold mb-8 text-red-400">ZOMBIE SURVIVAL</h1>
          
          {!gameStarting ? (
            <Card className="w-96 bg-black bg-opacity-70 text-white border-red-700">
              <CardHeader>
                <CardTitle>Welcome to the Apocalypse</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-300">
                  Survive waves of zombies, complete missions, and stay alive!
                </p>
                
                <Button onClick={startGame} className="w-full bg-red-600 hover:bg-red-700">
                  PRESS SPACE TO START
                </Button>
                
                <div className="text-left text-sm space-y-1 text-gray-400">
                  <div className="font-semibold text-white mb-2">Controls:</div>
                  <div>WASD - Move</div>
                  <div>Mouse - Look around</div>
                  <div>Left Click - Shoot</div>
                  <div>F - Reload</div>
                  <div>E - Inventory</div>
                  <div>X - Shop</div>
                  <div>F - Interact</div>
                </div>
                
                <div className="text-left text-sm space-y-1 text-gray-400">
                  <div className="font-semibold text-white mb-2">Objectives:</div>
                  <div>• Survive zombie waves</div>
                  <div>• Find weapons and supplies</div>
                  <div>• Complete missions from Jessy</div>
                  <div>• Enter buildings to loot items</div>
                  <div>• Level up to unlock better gear</div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="text-center">
              <div className="text-8xl font-bold text-red-400 mb-4">
                {countdown}
              </div>
              <div className="text-2xl text-white">
                Game Starting...
              </div>
              
              {/* Controls reminder during countdown */}
              <Card className="w-80 mt-8 bg-black bg-opacity-70 text-white border-red-700">
                <CardContent className="pt-6">
                  <div className="text-sm space-y-1">
                    <div className="font-semibold mb-2">Remember:</div>
                    <div>WASD - Move around</div>
                    <div>Mouse - Look around</div>
                    <div>Left Click - Shoot</div>
                    <div>F - Reload weapon</div>
                    <div>E - Open inventory</div>
                    <div>X - Open shop</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
    </div>
  );
}
