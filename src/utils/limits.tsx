import { RefreshLimits_shop_limits } from "@mzawadie/components/Shop/types/RefreshLimits";
import { LimitInfoFragment } from "@mzawadie/fragments/types/LimitInfoFragment";

export function hasLimits(limits: RefreshLimits_shop_limits, key: keyof LimitInfoFragment): boolean {
    if (limits === undefined) {
        return false;
    }

    return limits.allowedUsage[key] !== null;
}

export function isLimitReached(
    limits: RefreshLimits_shop_limits,
    key: keyof LimitInfoFragment
): boolean {
    if (!hasLimits(limits, key)) {
        return false;
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return limits?.currentUsage[key] >= limits?.allowedUsage[key];
}
