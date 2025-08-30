import { Html } from "@react-three/drei";
import { useInventory } from "../../lib/stores/useInventory";
import { usePlayer } from "../../lib/stores/usePlayer";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

interface ShopItem {
  id: string;
  name: string;
  price: number;
  description: string;
  levelRequired: number;
}

const shopItems: ShopItem[] = [
  { id: 'pistol_ammo', name: 'Pistol Ammo', price: 10, description: '30 rounds', levelRequired: 1 },
  { id: 'medkit', name: 'Medkit', price: 50, description: 'Restores 50 HP', levelRequired: 1 },
  { id: 'shotgun', name: 'Shotgun', price: 200, description: 'Close range weapon', levelRequired: 3 },
  { id: 'rifle', name: 'Rifle', price: 500, description: 'Long range weapon', levelRequired: 5 },
  { id: 'armor', name: 'Body Armor', price: 300, description: 'Reduces damage taken', levelRequired: 4 },
];

export default function Shop() {
  const { toggleShop, money, buyItem } = useInventory();
  const { level } = usePlayer();

  const handlePurchase = (item: ShopItem) => {
    if (money >= item.price && level >= item.levelRequired) {
      buyItem(item.id, item.price);
      console.log(`Purchased ${item.name}`);
    }
  };

  return (
    <Html fullscreen>
      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <Card className="w-96 bg-gray-900 text-white border-gray-700">
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              Shop
              <Button onClick={toggleShop} variant="outline" size="sm">
                Close
              </Button>
            </CardTitle>
            <div className="text-sm text-yellow-400">Money: ${money}</div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {shopItems.map((item) => (
                <div 
                  key={item.id} 
                  className="border border-gray-600 p-3 rounded hover:bg-gray-700"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium">{item.name}</div>
                      <div className="text-xs text-gray-400">{item.description}</div>
                      <div className="text-xs text-blue-400">
                        Level {item.levelRequired} required
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-yellow-400">${item.price}</div>
                      <Button
                        size="sm"
                        onClick={() => handlePurchase(item)}
                        disabled={money < item.price || level < item.levelRequired}
                        className="mt-1"
                      >
                        Buy
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-4 text-sm text-gray-400">
              Press X to close shop
            </div>
          </CardContent>
        </Card>
      </div>
    </Html>
  );
}
