import * as THREE from "three";

export interface Bullet {
  id: string;
  position: THREE.Vector3;
  direction: THREE.Vector3;
  speed: number;
  damage: number;
  lifeTime: number;
  maxLifeTime: number;
}

export function createBullet(
  startPosition: THREE.Vector3,
  direction: THREE.Vector3,
  damage: number = 25
): Bullet {
  return {
    id: `bullet_${Date.now()}_${Math.random()}`,
    position: startPosition.clone(),
    direction: direction.normalize(),
    speed: 50,
    damage,
    lifeTime: 0,
    maxLifeTime: 3 // 3 seconds
  };
}

export function updateBullet(bullet: Bullet, delta: number): boolean {
  bullet.position.add(bullet.direction.clone().multiplyScalar(bullet.speed * delta));
  bullet.lifeTime += delta;
  
  return bullet.lifeTime < bullet.maxLifeTime;
}

export function checkBulletEnemyCollision(
  bullet: Bullet,
  enemyPosition: THREE.Vector3,
  hitRadius: number = 1
): boolean {
  return bullet.position.distanceTo(enemyPosition) < hitRadius;
}

export function getTimeOfDayString(timeOfDay: number): string {
  const hours = Math.floor(timeOfDay);
  const minutes = Math.floor((timeOfDay % 1) * 60);
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

export function isNightTime(timeOfDay: number): boolean {
  return timeOfDay < 6 || timeOfDay > 18;
}

export function getDayNightColor(timeOfDay: number): THREE.Color {
  if (timeOfDay >= 6 && timeOfDay <= 18) {
    // Day time - bright blue sky
    return new THREE.Color(0x87CEEB);
  } else {
    // Night time - dark blue/black
    const nightIntensity = Math.min(1, Math.abs(timeOfDay - 12) / 6);
    return new THREE.Color().setHSL(0.6, 0.3, 0.1 * (1 - nightIntensity));
  }
}

export function getLightIntensity(timeOfDay: number): number {
  if (timeOfDay >= 6 && timeOfDay <= 18) {
    // Day time
    return 1;
  } else {
    // Night time - reduce intensity
    return 0.2;
  }
}

export function spawnEnemyWave(waveNumber: number): Array<{
  type: 'zombie' | 'boss' | 'gang';
  position: [number, number, number];
  health: number;
}> {
  const enemies = [];
  const baseEnemyCount = 5;
  const enemyCount = baseEnemyCount + waveNumber * 2;
  
  // Spawn regular zombies
  for (let i = 0; i < enemyCount; i++) {
    const angle = (i / enemyCount) * Math.PI * 2;
    const distance = 30 + Math.random() * 20;
    
    enemies.push({
      type: 'zombie' as const,
      position: [
        Math.cos(angle) * distance,
        0,
        Math.sin(angle) * distance
      ] as [number, number, number],
      health: 100 + waveNumber * 20
    });
  }
  
  // Spawn boss every 5 waves
  if (waveNumber % 5 === 0) {
    enemies.push({
      type: 'boss' as const,
      position: [50, 0, 50] as [number, number, number],
      health: 500 + waveNumber * 100
    });
  }
  
  // Spawn gang enemies every 3 waves
  if (waveNumber % 3 === 0) {
    for (let i = 0; i < 2; i++) {
      const angle = Math.random() * Math.PI * 2;
      const distance = 25;
      
      enemies.push({
        type: 'gang' as const,
        position: [
          Math.cos(angle) * distance,
          0,
          Math.sin(angle) * distance
        ] as [number, number, number],
        health: 150 + waveNumber * 30
      });
    }
  }
  
  return enemies;
}
