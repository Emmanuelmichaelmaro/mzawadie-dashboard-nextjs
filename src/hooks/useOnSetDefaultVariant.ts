// @ts-nocheck
import { Node, useProductVariantSetDefaultMutation } from "@mzawadie/graphql";
import { useNotifier } from "@mzawadie/hooks/useNotifier";
import { getProductErrorMessage } from "@mzawadie/utils/errors";
import { useIntl } from "react-intl";

function useOnSetDefaultVariant(productId: string, variant: Node) {
    const notify = useNotifier();
    const intl = useIntl();

    const [productVariantSetDefault] = useProductVariantSetDefaultMutation({
        onCompleted: (data) => {
            const { errors } = data.productVariantSetDefault;

            if (errors.length) {
                errors.map((error) =>
                    notify({
                        status: "error",
                        text: getProductErrorMessage(error, intl),
                    })
                );
            } else {
                const defaultVariant = data.productVariantSetDefault?.product?.variants?.find(
                    (variant) =>
                        variant?.id === data.productVariantSetDefault?.product?.defaultVariant?.id
                );

                if (defaultVariant) {
                    notify({
                        status: "success",
                        text: intl.formatMessage(
                            {
                                defaultMessage: "Variant {name} has been set as default.",
                                id: "gSQ0Ge",
                            },
                            { name: defaultVariant.name }
                        ),
                    });
                }
            }
        },
    });

    return (selectedVariant = null) => {
        productVariantSetDefault({
            variables: {
                productId,
                variantId: variant ? variant.id : selectedVariant?.id,
            },
        }).then();
    };
}

export default useOnSetDefaultVariant;
