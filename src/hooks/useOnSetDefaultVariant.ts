// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { useNotifier } from "@mzawadie/hooks/useNotifier";
import { useProductVariantSetDefaultMutation } from "@mzawadie/pages/products/mutations";
import { ProductDetails_product_variants } from "@mzawadie/pages/products/types/ProductDetails";
import { VariantUpdate_productVariantUpdate_productVariant } from "@mzawadie/pages/products/types/VariantUpdate";
import { getProductErrorMessage } from "@mzawadie/utils/errors";
import { useIntl } from "react-intl";

function useOnSetDefaultVariant(
    productId: string,
    variant: ProductDetails_product_variants | VariantUpdate_productVariantUpdate_productVariant
) {
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
                const defaultVariant = data.productVariantSetDefault.product.variants.find(
                    (variant) => variant.id === data.productVariantSetDefault.product.defaultVariant.id
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

    const onSetDefaultVariant = (selectedVariant = null) => {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        productVariantSetDefault({
            variables: {
                productId,
                variantId: variant ? variant.id : selectedVariant.id,
            },
        });
    };

    return onSetDefaultVariant;
}

export default useOnSetDefaultVariant;
