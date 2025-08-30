import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  type: 'weapon' | 'ammo' | 'consumable' | 'misc';
}

interface InventoryState {
  items: InventoryItem[];
  money: number;
  showInventory: boolean;
  showShop: boolean;
  
  // Actions
  addItem: (item: Omit<InventoryItem, 'quantity'>, quantity?: number) => void;
  removeItem: (id: string, quantity?: number) => void;
  useItem: (id: string) => boolean;
  toggleInventory: () => void;
  toggleShop: () => void;
  buyItem: (itemId: string, price: number) => boolean;
  addMoney: (amount: number) => void;
}

export const useInventory = create<InventoryState>()(
  subscribeWithSelector((set, get) => ({
    items: [
      { id: 'pistol', name: 'Pistol', quantity: 1, type: 'weapon' },
      { id: 'medkit', name: 'Medkit', quantity: 2, type: 'consumable' }
    ],
    money: 100,
    showInventory: false,
    showShop: false,
    
    addItem: (item, quantity = 1) => set((state) => {
      const existingItem = state.items.find(i => i.id === item.id);
      
      if (existingItem) {
        return {
          items: state.items.map(i => 
            i.id === item.id 
              ? { ...i, quantity: i.quantity + quantity }
              : i
          )
        };
      } else {
        return {
          items: [...state.items, { ...item, quantity }]
        };
      }
    }),
    
    removeItem: (id, quantity = 1) => set((state) => {
      const item = state.items.find(i => i.id === id);
      if (!item) return state;
      
      if (item.quantity <= quantity) {
        return {
          items: state.items.filter(i => i.id !== id)
        };
      } else {
        return {
          items: state.items.map(i => 
            i.id === id 
              ? { ...i, quantity: i.quantity - quantity }
              : i
          )
        };
      }
    }),
    
    useItem: (id) => {
      const state = get();
      const item = state.items.find(i => i.id === id);
      
      if (!item || item.quantity <= 0) return false;
      
      // Use the item (implement specific logic per item type)
      if (item.type === 'consumable') {
        get().removeItem(id, 1);
        console.log(`Used ${item.name}`);
        return true;
      }
      
      return false;
    },
    
    toggleInventory: () => set((state) => ({
      showInventory: !state.showInventory,
      showShop: false // Close shop when opening inventory
    })),
    
    toggleShop: () => set((state) => ({
      showShop: !state.showShop,
      showInventory: false // Close inventory when opening shop
    })),
    
    buyItem: (itemId, price) => {
      const state = get();
      if (state.money >= price) {
        set({ money: state.money - price });
        
        // Add the item to inventory
        const itemMap: Record<string, Omit<InventoryItem, 'quantity'>> = {
          'pistol_ammo': { id: 'pistol_ammo', name: 'Pistol Ammo', type: 'ammo' },
          'medkit': { id: 'medkit', name: 'Medkit', type: 'consumable' },
          'shotgun': { id: 'shotgun', name: 'Shotgun', type: 'weapon' },
          'rifle': { id: 'rifle', name: 'Rifle', type: 'weapon' },
          'armor': { id: 'armor', name: 'Body Armor', type: 'misc' }
        };
        
        const item = itemMap[itemId];
        if (item) {
          get().addItem(item, itemId === 'pistol_ammo' ? 30 : 1);
        }
        
        return true;
      }
      return false;
    },
    
    addMoney: (amount) => set((state) => ({
      money: state.money + amount
    }))
  }))
);
