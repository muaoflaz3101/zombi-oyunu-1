import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

interface PlayerState {
  position: [number, number, number];
  velocity: [number, number, number];
  health: number;
  maxHealth: number;
  ammo: number;
  maxAmmo: number;
  level: number;
  experience: number;
  experienceToNext: number;
  money: number;
  
  // Weapon state
  currentWeapon: string;
  isReloading: boolean;
  lastShotTime: number;
  
  // Actions
  setPosition: (position: [number, number, number]) => void;
  setVelocity: (velocity: [number, number, number]) => void;
  takeDamage: (damage: number) => void;
  heal: (amount: number) => void;
  shoot: () => boolean;
  reload: () => void;
  addExperience: (exp: number) => void;
  addMoney: (amount: number) => void;
  spendMoney: (amount: number) => boolean;
}

export const usePlayer = create<PlayerState>()(
  subscribeWithSelector((set, get) => ({
    position: [0, 0, 0],
    velocity: [0, 0, 0],
    health: 100,
    maxHealth: 100,
    ammo: 30,
    maxAmmo: 30,
    level: 1,
    experience: 0,
    experienceToNext: 100,
    money: 100,
    
    currentWeapon: 'pistol',
    isReloading: false,
    lastShotTime: 0,
    
    setPosition: (position) => set({ position }),
    setVelocity: (velocity) => set({ velocity }),
    
    takeDamage: (damage) => set((state) => ({
      health: Math.max(0, state.health - damage)
    })),
    
    heal: (amount) => set((state) => ({
      health: Math.min(state.maxHealth, state.health + amount)
    })),
    
    shoot: () => {
      const state = get();
      const now = Date.now();
      
      if (state.isReloading || state.ammo <= 0 || now - state.lastShotTime < 200) {
        return false;
      }
      
      set({
        ammo: state.ammo - 1,
        lastShotTime: now
      });
      
      console.log(`Shot fired! Ammo remaining: ${state.ammo - 1}`);
      return true;
    },
    
    reload: () => {
      const state = get();
      if (state.isReloading || state.ammo === state.maxAmmo) return;
      
      set({ isReloading: true });
      
      setTimeout(() => {
        set({
          ammo: state.maxAmmo,
          isReloading: false
        });
        console.log('Reload complete!');
      }, 2000);
    },
    
    addExperience: (exp) => set((state) => {
      const newExp = state.experience + exp;
      const newLevel = state.level + Math.floor(newExp / state.experienceToNext);
      
      return {
        experience: newExp % state.experienceToNext,
        level: newLevel,
        experienceToNext: 100 * newLevel // Scale XP requirement
      };
    }),
    
    addMoney: (amount) => set((state) => ({
      money: state.money + amount
    })),
    
    spendMoney: (amount) => {
      const state = get();
      if (state.money >= amount) {
        set({ money: state.money - amount });
        return true;
      }
      return false;
    }
  }))
);
