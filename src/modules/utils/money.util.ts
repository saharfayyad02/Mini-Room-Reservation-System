import { Decimal } from "generated/prisma/runtime/client";

export class MoneyUtil {
    static calculateNights(checkIn: Date | string, checkOut: Date | string): number {
    const start = new Date(checkIn);
    const end = new Date(checkOut);

    const diffInMs = end.getTime() - start.getTime();
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

    return Math.ceil(diffInDays); // Round up → 1 night if same day → next day
  }
    static calculateTotalAmount(rooms:{price:Decimal;nights:number}[]): Decimal {
        
        return rooms.reduce((total, room) => {
            return total.add(room.price.mul(room.nights));
        }, new Decimal(0));
    }
}

