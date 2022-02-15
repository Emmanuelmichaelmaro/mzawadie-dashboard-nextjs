// @ts-nocheck
import { WindowTitle } from "@mzawadie/components/WindowTitle";
import { maybe } from "@mzawadie/core";
import useNavigator from "@mzawadie/hooks/useNavigator";
import useNotifier from "@mzawadie/hooks/useNotifier";
import createMetadataCreateHandler from "@mzawadie/utils/handlers/metadataCreateHandler";
import { useMetadataUpdate, usePrivateMetadataUpdate } from "@mzawadie/utils/metadata/updateMetadata";
import React from "react";
import { useIntl } from "react-intl";

import ProductTypeCreatePage, { ProductTypeForm } from "../components/ProductTypeCreatePage";
import { TypedProductTypeCreateMutation } from "../mutations";
import { TypedProductTypeCreateDataQuery } from "../queries";
import { ProductTypeCreate as ProductTypeCreateMutation } from "../types/ProductTypeCreate";
import { productTypeListUrl, productTypeUrl } from "../urls";

export const ProductTypeCreate: React.FC = () => {
    const navigate = useNavigator();
    const notify = useNotifier();
    const intl = useIntl();
    const [updateMetadata] = useMetadataUpdate({});
    const [updatePrivateMetadata] = usePrivateMetadataUpdate({});

    const handleCreateSuccess = (updateData: ProductTypeCreateMutation) => {
        if (updateData.productTypeCreate?.errors.length === 0) {
            notify({
                status: "success",
                text: intl.formatMessage({
                    defaultMessage: "Successfully created product type",
                    id: "paa4m0",
                }),
            });
            navigate(productTypeUrl(updateData.productTypeCreate?.productType?.id));
        }
    };
    return (
        <TypedProductTypeCreateMutation onCompleted={handleCreateSuccess}>
            {(createProductType, createProductTypeOpts) => {
                const handleCreate = async (formData: ProductTypeForm) => {
                    const result = await createProductType({
                        variables: {
                            input: {
                                hasVariants: false,
                                isShippingRequired: formData.isShippingRequired,
                                name: formData.name,
                                taxCode: formData.taxType,
                                weight: formData.weight,
                            },
                        },
                    });

                    return result.data?.productTypeCreate?.productType?.id || null;
                };
                const handleSubmit = createMetadataCreateHandler(
                    handleCreate,
                    updateMetadata,
                    updatePrivateMetadata
                );

                return (
                    <TypedProductTypeCreateDataQuery displayLoader>
                        {({ data, loading }) => (
                            <>
                                <WindowTitle
                                    title={intl.formatMessage({
                                        defaultMessage: "Create Product Type",
                                        description: "window title",
                                        id: "SSWFo8",
                                    })}
                                />
                                <ProductTypeCreatePage
                                    defaultWeightUnit={maybe(() => data?.shop.defaultWeightUnit)}
                                    disabled={loading}
                                    errors={createProductTypeOpts.data?.productTypeCreate?.errors || []}
                                    pageTitle={intl.formatMessage({
                                        defaultMessage: "Create Product Type",
                                        description: "header",
                                        id: "bq1eEx",
                                    })}
                                    saveButtonBarState={createProductTypeOpts.status}
                                    taxTypes={data?.taxTypes || []}
                                    onBack={() => navigate(productTypeListUrl())}
                                    onSubmit={handleSubmit}
                                />
                            </>
                        )}
                    </TypedProductTypeCreateDataQuery>
                );
            }}
        </TypedProductTypeCreateMutation>
    );
};

export default ProductTypeCreate;
