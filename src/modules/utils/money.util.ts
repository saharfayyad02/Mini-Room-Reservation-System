import { Decimal } from "generated/prisma/runtime/client";

export class MoneyUtil {
    static calculateTotalAmount(items:{price:Decimal;qty:number}[]): Decimal {
        return items.reduce((total, item) => {
            return total.add(item.price.mul(item.qty));
        }, new Decimal(0));

    }
}