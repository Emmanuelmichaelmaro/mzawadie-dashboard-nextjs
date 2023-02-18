import { IFilter } from "@mzawadie/components/Filter";
import { FilterOpts, commonMessages } from "@mzawadie/core";
import { ProductTypeConfigurable, ProductTypeEnum } from "@mzawadie/types/globalTypes";
import { createOptionsField } from "@mzawadie/utils/filters/fields";
import { defineMessages, IntlShape } from "react-intl";

export enum ProductTypeFilterKeys {
    configurable = "configurable",
    type = "type",
}

export interface ProductTypeListFilterOpts {
    configurable: FilterOpts<ProductTypeConfigurable>;
    type: FilterOpts<ProductTypeEnum>;
}

const messages = defineMessages({
    configurable: {
        defaultMessage: "Configurable",
        id: "X90t9n",
        description: "product type",
    },
    digital: {
        defaultMessage: "Digital",
        id: "dS8Adx",
        description: "product",
    },
    shippable: {
        defaultMessage: "Shippable",
        id: "U5aVd8",
        description: "product",
    },
    type: {
        defaultMessage: "Type",
        id: "Jsh6+U",
        description: "product type is digital or physical",
    },
});

export function createFilterStructure(
    intl: IntlShape,
    opts: ProductTypeListFilterOpts
): IFilter<ProductTypeFilterKeys> {
    return [
        {
            ...createOptionsField(
                ProductTypeFilterKeys.configurable,
                intl.formatMessage(messages.configurable),
                [opts.configurable.value],
                false,
                [
                    {
                        label: intl.formatMessage(commonMessages.yes),
                        value: ProductTypeConfigurable.CONFIGURABLE,
                    },
                    {
                        label: intl.formatMessage(commonMessages.no),
                        value: ProductTypeConfigurable.SIMPLE,
                    },
                ]
            ),
            active: opts.configurable.active,
        },
        {
            ...createOptionsField(
                ProductTypeFilterKeys.type,
                intl.formatMessage(messages.type),
                [opts.type.value],
                false,
                [
                    {
                        label: intl.formatMessage(messages.digital),
                        value: ProductTypeEnum.DIGITAL,
                    },
                    {
                        label: intl.formatMessage(messages.shippable),
                        value: ProductTypeEnum.SHIPPABLE,
                    },
                ]
            ),
            active: opts.type.active,
        },
    ];
}
