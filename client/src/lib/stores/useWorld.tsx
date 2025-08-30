import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

interface Enemy {
  id: string;
  position: [number, number, number];
  health: number;
  maxHealth: number;
  type: 'zombie' | 'boss' | 'gang';
  speed: number;
  damage: number;
}

interface WorldState {
  timeOfDay: number; // 0-24 hours
  dayDuration: number; // seconds for a full day
  wave: number;
  enemies: Enemy[];
  
  // Actions
  updateTime: (delta: number) => void;
  addEnemy: (enemy: Enemy) => void;
  removeEnemy: (id: string) => void;
  damageEnemy: (id: string, damage: number) => boolean;
  nextWave: () => void;
}

export const useWorld = create<WorldState>()(
  subscribeWithSelector((set, get) => ({
    timeOfDay: 8, // Start at 8 AM
    dayDuration: 300, // 5 minutes per full day
    wave: 1,
    enemies: [],
    
    updateTime: (delta) => set((state) => {
      const timeIncrement = (delta / state.dayDuration) * 24;
      const newTime = (state.timeOfDay + timeIncrement) % 24;
      return { timeOfDay: newTime };
    }),
    
    addEnemy: (enemy) => set((state) => ({
      enemies: [...state.enemies, enemy]
    })),
    
    removeEnemy: (id) => set((state) => ({
      enemies: state.enemies.filter(enemy => enemy.id !== id)
    })),
    
    damageEnemy: (id, damage) => {
      const state = get();
      const enemy = state.enemies.find(e => e.id === id);
      
      if (!enemy) return false;
      
      const newHealth = enemy.health - damage;
      
      if (newHealth <= 0) {
        // Enemy dies
        set({
          enemies: state.enemies.filter(e => e.id !== id)
        });
        console.log(`Enemy ${id} killed!`);
        return true;
      } else {
        // Enemy takes damage
        set({
          enemies: state.enemies.map(e => 
            e.id === id ? { ...e, health: newHealth } : e
          )
        });
        console.log(`Enemy ${id} took ${damage} damage, ${newHealth} health remaining`);
        return false;
      }
    },
    
    nextWave: () => set((state) => ({
      wave: state.wave + 1
    }))
  }))
);
