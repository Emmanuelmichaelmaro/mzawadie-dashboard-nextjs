import { IMoney } from "./Money";

export { default as Money } from "./Money";
export * from "./Money";

export function addMoney(init: IMoney, ...args: IMoney[]): IMoney {
    return {
        amount: args.reduce((acc, curr) => acc + curr.amount, init.amount),
        currency: init.currency,
    };
}
export function subtractMoney(init: IMoney, ...args: IMoney[]): IMoney {
    return {
        amount: args.reduce((acc, curr) => acc - curr.amount, init.amount),
        currency: init.currency,
    };
}

export const formatMoney = (money: IMoney, locale: string) => {
    try {
        return money.amount.toLocaleString(locale, {
            currency: money.currency,
            style: "currency",
        });
    } catch (error) {
        return `${money.amount} ${money.currency}`;
    }
};
