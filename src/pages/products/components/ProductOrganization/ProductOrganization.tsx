// @ts-nocheck
import { Card, CardContent, Typography } from "@material-ui/core";
import CardSpacer from "@mzawadie/components/CardSpacer";
import { CardTitle } from "@mzawadie/components/CardTitle";
import { FormSpacer } from "@mzawadie/components/FormSpacer";
import Hr from "@mzawadie/components/Hr";
import {
    MultiAutocompleteSelectField,
    MultiAutocompleteChoiceType,
} from "@mzawadie/components/MultiAutocompleteSelectField";
import {
    SingleAutocompleteSelectField,
    SingleAutocompleteChoiceType,
} from "@mzawadie/components/SingleAutocompleteSelectField";
import { maybe, FetchMoreProps } from "@mzawadie/core";
import { ProductErrorFragment } from "@mzawadie/graphql";
import { ChangeEvent } from "@mzawadie/hooks/useForm";
import { getFormErrors, getProductErrorMessage } from "@mzawadie/utils/errors";
import { makeStyles } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

interface ProductType {
    hasVariants: boolean;
    id: string;
    name: string;
}

const useStyles = makeStyles(
    (theme) => ({
        card: {
            overflow: "visible",
        },
        cardSubtitle: {
            fontSize: theme.typography.body1.fontSize,
            marginBottom: theme.spacing(0.5),
        },
        label: {
            marginBottom: theme.spacing(0.5),
        },
    }),
    { name: "ProductOrganization" }
);

interface ProductOrganizationProps {
    canChangeType: boolean;
    categories?: SingleAutocompleteChoiceType[];
    categoryInputDisplayValue: string;
    collections?: MultiAutocompleteChoiceType[];
    collectionsInputDisplayValue: MultiAutocompleteChoiceType[];
    data: {
        category: string;
        collections: string[];
        productType?: ProductType;
    };
    disabled: boolean;
    errors: ProductErrorFragment[];
    productType?: ProductType;
    productTypeInputDisplayValue?: string;
    productTypes?: SingleAutocompleteChoiceType[];
    fetchCategories: (query: string) => void;
    fetchCollections: (query: string) => void;
    fetchMoreCategories: FetchMoreProps;
    fetchMoreCollections: FetchMoreProps;
    fetchMoreProductTypes?: FetchMoreProps;
    fetchProductTypes?: (data: string) => void;
    onCategoryChange: (event: ChangeEvent) => void;
    onCollectionChange: (event: ChangeEvent) => void;
    onProductTypeChange?: (event: ChangeEvent) => void;
}

const ProductOrganization: React.FC<ProductOrganizationProps> = (props) => {
    const {
        canChangeType,
        categories,
        categoryInputDisplayValue,
        collections,
        collectionsInputDisplayValue,
        data,
        disabled,
        errors,
        fetchCategories,
        fetchCollections,
        fetchMoreCategories,
        fetchMoreCollections,
        fetchMoreProductTypes,
        fetchProductTypes,
        productType,
        productTypeInputDisplayValue,
        productTypes,
        onCategoryChange,
        onCollectionChange,
        onProductTypeChange,
    } = props;

    const classes = useStyles(props);
    const intl = useIntl();

    const formErrors = getFormErrors(["productType", "category", "collections"], errors);

    return (
        <Card className={classes.card}>
            <CardTitle
                title={intl.formatMessage({
                    defaultMessage: "Organize Product",
                    id: "JjeZEG",
                    description: "section header",
                })}
            />

            <CardContent>
                {canChangeType ? (
                    <SingleAutocompleteSelectField
                        displayValue={productTypeInputDisplayValue}
                        error={!!formErrors.productType}
                        helperText={getProductErrorMessage(formErrors.productType, intl)}
                        name="productType"
                        disabled={disabled}
                        label={intl.formatMessage({
                            defaultMessage: "Product Type",
                            id: "anK7jD",
                        })}
                        choices={productTypes}
                        value={data.productType?.id}
                        onChange={onProductTypeChange}
                        fetchChoices={fetchProductTypes}
                        data-test="product-type"
                        {...fetchMoreProductTypes}
                    />
                ) : (
                    <>
                        <Typography className={classes.label} variant="caption">
                            <FormattedMessage defaultMessage="Product Type" id="anK7jD" />
                        </Typography>

                        <Typography>{maybe(() => productType.name, "...")}</Typography>

                        <CardSpacer />

                        <Typography className={classes.label} variant="caption">
                            <FormattedMessage defaultMessage="Product Type" id="anK7jD" />
                        </Typography>

                        <Typography>
                            {maybe(
                                () =>
                                    productType.hasVariants
                                        ? intl.formatMessage({
                                              defaultMessage: "Configurable",
                                              id: "BBfN0m",
                                              description: "product is configurable",
                                          })
                                        : intl.formatMessage({
                                              defaultMessage: "Simple",
                                              id: "mp6KU/",
                                              description: "product is not configurable",
                                          }),
                                "..."
                            )}
                        </Typography>
                    </>
                )}

                <FormSpacer />

                <Hr />

                <FormSpacer />

                <SingleAutocompleteSelectField
                    displayValue={categoryInputDisplayValue}
                    error={!!formErrors.category}
                    helperText={getProductErrorMessage(formErrors.category, intl)}
                    disabled={disabled}
                    label={intl.formatMessage({
                        defaultMessage: "Category",
                        id: "ccXLVi",
                    })}
                    choices={disabled ? [] : categories}
                    name="category"
                    value={data.category}
                    onChange={onCategoryChange}
                    fetchChoices={fetchCategories}
                    data-test="category"
                    {...fetchMoreCategories}
                />

                <FormSpacer />

                <Hr />

                <FormSpacer />

                <MultiAutocompleteSelectField
                    displayValues={collectionsInputDisplayValue}
                    error={!!formErrors.collections}
                    label={intl.formatMessage({
                        defaultMessage: "Collections",
                        id: "ulh3kf",
                    })}
                    choices={disabled ? [] : collections}
                    name="collections"
                    value={data.collections}
                    helperText={
                        getProductErrorMessage(formErrors.collections, intl) ||
                        intl.formatMessage({
                            defaultMessage:
                                "*Optional. Adding product to collection helps users find it.",
                            id: "v+Pkm+",
                            description: "field is optional",
                        })
                    }
                    onChange={onCollectionChange}
                    fetchChoices={fetchCollections}
                    data-test="collections"
                    testId="collection"
                    {...fetchMoreCollections}
                />
            </CardContent>
        </Card>
    );
};

ProductOrganization.displayName = "ProductOrganization";

export default ProductOrganization;
