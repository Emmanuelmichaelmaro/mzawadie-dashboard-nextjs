// @ts-nocheck
import { Card, CardContent } from "@material-ui/core";
import FormSpacer from "@mzawadie/components/FormSpacer";
import { MultiSelectField } from "@mzawadie/components/MultiSelectField";
import { PageHeader } from "@mzawadie/components/PageHeader";
import { SingleSelectField } from "@mzawadie/components/SingleSelectField";
import React from "react";
import { useIntl } from "react-intl";

interface ProductCategoryAndCollectionsFormProps {
    categories?: Array<{ value: string; label: string }>;
    collections?: Array<{ value: string; label: string }>;
    errors: { [key: string]: string };
    productCollections?: string[];
    category?: string;
    loading?: boolean;
    onChange: (event: React.ChangeEvent<any>) => void;
}

const ProductCategoryAndCollectionsForm = ({
    categories,
    collections,
    errors,
    productCollections,
    category,
    loading,
    onChange,
}: ProductCategoryAndCollectionsFormProps) => {
    const intl = useIntl();

    return (
        <Card>
            <PageHeader
                title={intl.formatMessage({
                    defaultMessage: "Organization",
                    id: "fyE8BN",
                    description: "product organization, header",
                })}
            />

            <CardContent>
                <SingleSelectField
                    disabled={loading}
                    error={!!errors.category}
                    hint={errors.category}
                    label={intl.formatMessage({
                        defaultMessage: "Category",
                        id: "ccXLVi",
                    })}
                    choices={loading ? [] : categories}
                    name="category"
                    value={category}
                    onChange={onChange}
                />

                <FormSpacer />

                <MultiSelectField
                    disabled={loading}
                    error={!!errors.collections}
                    hint={errors.collections}
                    label={intl.formatMessage({
                        defaultMessage: "Collections",
                        id: "ulh3kf",
                    })}
                    choices={loading ? [] : collections}
                    name="collections"
                    value={productCollections}
                    onChange={onChange}
                />
            </CardContent>
        </Card>
    );
};

ProductCategoryAndCollectionsForm.displayName = "ProductCategoryAndCollectionsForm";

export default ProductCategoryAndCollectionsForm;
