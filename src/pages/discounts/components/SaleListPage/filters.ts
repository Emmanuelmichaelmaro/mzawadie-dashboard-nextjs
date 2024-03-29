import { IFilter } from "@mzawadie/components/Filter";
import { MultiAutocompleteChoiceType } from "@mzawadie/components/MultiAutocompleteSelectField";
import { FilterOpts, MinMax } from "@mzawadie/core";
import { DiscountStatusEnum, DiscountValueTypeEnum } from "@mzawadie/graphql";
import { createDateField, createOptionsField } from "@mzawadie/utils/filters/fields";
import { defineMessages, IntlShape } from "react-intl";

export enum SaleFilterKeys {
    saleType = "saleType",
    started = "started",
    status = "status",
    channel = "channel",
}

export interface SaleListFilterOpts {
    saleType: FilterOpts<DiscountValueTypeEnum>;
    started: FilterOpts<MinMax>;
    status: FilterOpts<DiscountStatusEnum[]>;
    channel: FilterOpts<string> & { choices: MultiAutocompleteChoiceType[] };
}

const messages = defineMessages({
    active: {
        defaultMessage: "Active",
        id: "AnqH4p",
        description: "sale status",
    },
    channel: {
        defaultMessage: "Channel",
        id: "1BNKCZ",
        description: "sale channel",
    },
    expired: {
        defaultMessage: "Expired",
        id: "RBxYJf",
        description: "sale status",
    },
    fixed: {
        defaultMessage: "Fixed amount",
        id: "XDBeA+",
        description: "discount type",
    },
    percentage: {
        defaultMessage: "Percentage",
        id: "s17U7u",
        description: "discount type",
    },
    scheduled: {
        defaultMessage: "Scheduled",
        id: "BanAhF",
        description: "sale status",
    },
    started: {
        defaultMessage: "Started",
        id: "zjHH6b",
        description: "sale start date",
    },
    status: {
        defaultMessage: "Status",
        id: "SpngiS",
        description: "sale status",
    },
    type: {
        defaultMessage: "Discount Type",
        id: "KHZlmi",
    },
});

export function createFilterStructure(
    intl: IntlShape,
    opts: SaleListFilterOpts
): IFilter<SaleFilterKeys> {
    return [
        {
            ...createOptionsField(
                SaleFilterKeys.channel,
                intl.formatMessage(messages.channel),
                [opts.channel.value],
                false,
                opts.channel.choices
            ),
            active: opts.channel.active,
        },
        {
            ...createDateField(
                SaleFilterKeys.started,
                intl.formatMessage(messages.started),
                opts.started.value
            ),
            active: opts.started.active,
        },
        {
            ...createOptionsField(
                SaleFilterKeys.status,
                intl.formatMessage(messages.status),
                opts.status.value,
                true,
                [
                    {
                        label: intl.formatMessage(messages.active),
                        value: DiscountStatusEnum.ACTIVE,
                    },
                    {
                        label: intl.formatMessage(messages.expired),
                        value: DiscountStatusEnum.EXPIRED,
                    },
                    {
                        label: intl.formatMessage(messages.scheduled),
                        value: DiscountStatusEnum.SCHEDULED,
                    },
                ]
            ),
            active: opts.status.active,
        },
        {
            ...createOptionsField(
                SaleFilterKeys.saleType,
                intl.formatMessage(messages.type),
                [opts.saleType.value],
                false,
                [
                    {
                        label: intl.formatMessage(messages.fixed),
                        value: DiscountValueTypeEnum.FIXED,
                    },
                    {
                        label: intl.formatMessage(messages.percentage),
                        value: DiscountValueTypeEnum.PERCENTAGE,
                    },
                ]
            ),
            active: opts.saleType.active,
        },
    ];
}
