// @ts-nocheck
import { WindowTitle } from "@mzawadie/components/WindowTitle";
import { getMutationErrors, maybe } from "@mzawadie/core";
import useNavigator from "@mzawadie/hooks/useNavigator";
import { useNotifier } from "@mzawadie/hooks/useNotifier";
import { ProductTypeKindEnum } from "@mzawadie/types/globalTypes";
import createMetadataCreateHandler from "@mzawadie/utils/handlers/metadataCreateHandler";
import { useMetadataUpdate, usePrivateMetadataUpdate } from "@mzawadie/utils/metadata/updateMetadata";
import React from "react";
import { useIntl } from "react-intl";

import { ProductTypeCreatePage, ProductTypeForm } from "../components/ProductTypeCreatePage";
import { TypedProductTypeCreateMutation } from "../mutations";
import { TypedProductTypeCreateDataQuery } from "../queries";
import { ProductTypeCreate as ProductTypeCreateMutation } from "../types/ProductTypeCreate";
import {
    productTypeAddUrl,
    ProductTypeAddUrlQueryParams,
    productTypeListUrl,
    productTypeUrl,
} from "../urls";

interface ProductTypeCreateProps {
    params: ProductTypeAddUrlQueryParams;
}

export const ProductTypeCreate: React.FC<ProductTypeCreateProps> = ({ params }) => {
    const navigate = useNavigator();
    const notify = useNotifier();
    const intl = useIntl();
    const [updateMetadata] = useMetadataUpdate({});
    const [updatePrivateMetadata] = usePrivateMetadataUpdate({});

    const handleCreateSuccess = (updateData: ProductTypeCreateMutation) => {
        if (updateData.productTypeCreate.errors.length === 0) {
            notify({
                status: "success",
                text: intl.formatMessage({
                    defaultMessage: "Successfully created product type",
                    id: "paa4m0",
                }),
            });
            navigate(productTypeUrl(updateData.productTypeCreate?.productType.id));
        }
    };

    const handleChangeKind = (kind: ProductTypeKindEnum) =>
        navigate(
            productTypeAddUrl({
                ...params,
                kind,
            })
        );

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
                                kind: formData.kind,
                                taxCode: formData.taxType,
                                weight: formData.weight,
                            },
                        },
                    });

                    return {
                        id: result.data?.productTypeCreate.productType?.id || null,
                        errors: getMutationErrors(result),
                    };
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
                                    defaultWeightUnit={maybe(() => data.shop.defaultWeightUnit)}
                                    disabled={loading}
                                    errors={createProductTypeOpts.data?.productTypeCreate.errors || []}
                                    pageTitle={intl.formatMessage({
                                        defaultMessage: "Create Product Type",
                                        description: "header",
                                        id: "bq1eEx",
                                    })}
                                    saveButtonBarState={createProductTypeOpts.status}
                                    taxTypes={data?.taxTypes || []}
                                    kind={params?.kind}
                                    onChangeKind={handleChangeKind}
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
