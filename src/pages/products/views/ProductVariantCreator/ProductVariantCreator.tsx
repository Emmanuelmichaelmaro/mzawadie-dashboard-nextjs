// @ts-nocheck
import { useShopLimitsQuery } from "@mzawadie/components/Shop/query";
import { WindowTitle } from "@mzawadie/components/WindowTitle";
import { DEFAULT_INITIAL_SEARCH_DATA } from "@mzawadie/core";
import useNavigator from "@mzawadie/hooks/useNavigator";
import { useNotifier } from "@mzawadie/hooks/useNotifier";
import { useProductVariantBulkCreateMutation } from "@mzawadie/pages/products/mutations";
import { useCreateMultipleVariantsData } from "@mzawadie/pages/products/queries";
import { productUrl } from "@mzawadie/pages/products/urls";
import useAttributeValueSearchHandler from "@mzawadie/utils/handlers/attributeValueSearchHandler";
import { mapEdgesToItems } from "@mzawadie/utils/maps";
import React from "react";
import { useIntl } from "react-intl";

import { ProductVariantCreatorPage } from "../../components/ProductVariantCreatorPage";

interface ProductVariantCreatorProps {
    id: string;
}

const ProductVariantCreator: React.FC<ProductVariantCreatorProps> = ({ id }) => {
    const navigate = useNavigator();
    const notify = useNotifier();
    const intl = useIntl();

    const { data } = useCreateMultipleVariantsData({
        displayLoader: true,
        variables: {
            id,
            firstValues: 10,
        },
    });

    const [bulkProductVariantCreate, bulkProductVariantCreateOpts] =
        useProductVariantBulkCreateMutation({
            onCompleted: (data) => {
                if (data.productVariantBulkCreate.errors.length === 0) {
                    notify({
                        status: "success",
                        text: intl.formatMessage({
                            defaultMessage: "Successfully created variants",
                            id: "oChkS4",
                            description: "success message",
                        }),
                    });
                    navigate(productUrl(id));
                }
            },
        });

    const limitOpts = useShopLimitsQuery({
        variables: {
            productVariants: true,
        },
    });

    const {
        loadMore: loadMoreAttributeValues,
        search: searchAttributeValues,
        reset: searchAttributeReset,
        result: searchAttributeValuesOpts,
    } = useAttributeValueSearchHandler(DEFAULT_INITIAL_SEARCH_DATA);

    const fetchMoreAttributeValues = {
        hasMore: !!searchAttributeValuesOpts.data?.attribute?.choices?.pageInfo?.hasNextPage,
        loading: !!searchAttributeValuesOpts.loading,
        onFetchMore: loadMoreAttributeValues,
    };

    const attributeValues = mapEdgesToItems(searchAttributeValuesOpts?.data?.attribute.choices) || [];

    return (
        <>
            <WindowTitle
                title={intl.formatMessage({
                    defaultMessage: "Create Variants",
                    id: "z+wMgQ",
                    description: "window title",
                })}
            />

            <ProductVariantCreatorPage
                errors={bulkProductVariantCreateOpts.data?.productVariantBulkCreate.errors || []}
                channelListings={data?.product?.channelListings?.map((listing) => ({
                    currency: listing.channel.currencyCode,
                    id: listing.channel.id,
                    name: listing.channel.name,
                    price: "",
                }))}
                attributes={data?.product?.productType?.variantAttributes || []}
                attributeValues={attributeValues}
                fetchAttributeValues={searchAttributeValues}
                fetchMoreAttributeValues={fetchMoreAttributeValues}
                limits={limitOpts.data?.shop?.limits}
                onSubmit={(inputs) =>
                    bulkProductVariantCreate({
                        variables: { id, inputs },
                    })
                }
                onAttributeSelectBlur={searchAttributeReset}
                warehouses={mapEdgesToItems(data?.warehouses) || []}
            />
        </>
    );
};

ProductVariantCreator.displayName = "ProductVariantCreator";

export default ProductVariantCreator;
