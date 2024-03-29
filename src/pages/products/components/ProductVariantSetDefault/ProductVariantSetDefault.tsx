import { CardMenu } from "@mzawadie/components/CardMenu";
import React from "react";
import { useIntl } from "react-intl";

interface ProductVariantSetDefaultProps {
    onSetDefaultVariant: () => void;
}

const ProductVariantSetDefault: React.FC<ProductVariantSetDefaultProps> = ({ onSetDefaultVariant }) => {
    const intl = useIntl();

    return (
        <CardMenu
            menuItems={[
                {
                    label: intl.formatMessage({
                        defaultMessage: "Set as default",
                        id: "SZH0fw",
                        description: "set variant as default, button",
                    }),
                    onSelect: onSetDefaultVariant,
                    testId: "setDefault",
                },
            ]}
            data-test-id="menu"
        />
    );
};

ProductVariantSetDefault.displayName = "ProductVariantSetDefault";

export default ProductVariantSetDefault;
