import { Html } from "@react-three/drei";
import { useInventory } from "../../lib/stores/useInventory";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export default function Inventory() {
  const { items, toggleInventory } = useInventory();

  return (
    <Html fullscreen>
      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <Card className="w-96 bg-gray-900 text-white border-gray-700">
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              Inventory
              <Button onClick={toggleInventory} variant="outline" size="sm">
                Close
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-2">
              {items.map((item: any, index: number) => (
                <div 
                  key={index} 
                  className="border border-gray-600 p-2 rounded text-center hover:bg-gray-700 cursor-pointer"
                >
                  <div className="text-xs">{item.name}</div>
                  <div className="text-xs text-gray-400">x{item.quantity}</div>
                </div>
              ))}
              
              {/* Empty slots */}
              {Array.from({ length: Math.max(0, 20 - items.length) }, (_, index) => (
                <div 
                  key={`empty_${index}`} 
                  className="border border-gray-600 p-2 rounded h-16 bg-gray-800"
                />
              ))}
            </div>
            
            <div className="mt-4 text-sm text-gray-400">
              Press E to close inventory
            </div>
          </CardContent>
        </Card>
      </div>
    </Html>
  );
}
