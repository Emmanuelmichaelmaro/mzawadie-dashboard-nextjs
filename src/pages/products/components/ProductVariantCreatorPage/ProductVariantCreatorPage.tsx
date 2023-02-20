// @ts-nocheck
import { Button, Typography } from "@material-ui/core";
import { drawerWidthExpanded } from "@mzawadie/components/AppLayout/consts";
import Container from "@mzawadie/components/Container";
import Hr from "@mzawadie/components/Hr";
import { PageHeader } from "@mzawadie/components/PageHeader";
import { RefreshLimits_shop_limits } from "@mzawadie/components/Shop/types/RefreshLimits";
import useWizard from "@mzawadie/hooks/useWizard";
import { validatePrice } from "@mzawadie/pages/products/utils/validation";
import { ProductVariantBulkCreateInput } from "@mzawadie/types/globalTypes";
import { makeStyles } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage, IntlShape, useIntl } from "react-intl";

import ProductVariantCreatorContent, {
    ProductVariantCreatorContentProps,
} from "./ProductVariantCreatorContent";
import ProductVariantCreateTabs from "./ProductVariantCreatorTabs";
import { getVariantsNumber } from "./ProductVariantCreatorValues";
import { createInitialForm, ProductVariantCreateFormData } from "./form";
import reduceProductVariantCreateFormData, { ProductVariantCreateReducerActionType } from "./reducer";
import { ProductVariantCreatorStep } from "./types";

const useStyles = makeStyles(
    (theme) => ({
        button: {
            marginLeft: theme.spacing(2),
        },
        content: {
            overflowX: "visible",
            [theme.breakpoints.up("md")]: {
                position: "absolute",
                width: `calc(100vw - ${drawerWidthExpanded}px + ${theme.spacing(6)}px)`,
                maxWidth: `calc(${theme.breakpoints.width("lg")}px - ${theme.spacing(6)}px)`,
            },
        },
        description: {
            marginTop: theme.spacing(),
        },
        hr: {
            margin: theme.spacing(3, 0),
        },
    }),
    { name: "ProductVariantCreatePage" }
);

function canHitNext(
    step: ProductVariantCreatorStep,
    data: ProductVariantCreateFormData,
    variantsLeft: number | null
): boolean {
    switch (step) {
        case ProductVariantCreatorStep.values:
            return (
                data.attributes.every((attribute) => attribute.values.length > 0) &&
                (variantsLeft === null || getVariantsNumber(data) <= variantsLeft)
            );
        case ProductVariantCreatorStep.prices:
            if (data.price.mode === "all") {
                if (data.price.channels.some((channel) => validatePrice(channel.price))) {
                    return false;
                }
            } else if (data.price.mode === "attribute") {
                if (
                    !data.price.attribute ||
                    data.price.values.some(
                        (attribute) =>
                            attribute.value.length < data.price.channels.length ||
                            attribute.value.some((channel) => validatePrice(channel.price))
                    )
                ) {
                    return false;
                }
            }

            if (data.stock.mode === "attribute" && data.stock.attribute === "") {
                return false;
            }

            return true;
        case ProductVariantCreatorStep.summary:
            return !data.variants.some(
                (variant) =>
                    variant.sku === "" ||
                    variant.channelListings.some((channel) => validatePrice(channel.price))
            );

        default:
            return false;
    }
}

export interface ProductVariantCreatePageProps
    extends Omit<
        ProductVariantCreatorContentProps,
        "data" | "dispatchFormDataAction" | "step" | "variantsLeft" | "onStepClick"
    > {
    limits: RefreshLimits_shop_limits;
    onSubmit: (data: ProductVariantBulkCreateInput[]) => void;
}

// eslint-disable-next-line consistent-return
function getTitle(step: ProductVariantCreatorStep, intl: IntlShape): string {
    // eslint-disable-next-line default-case
    switch (step) {
        case ProductVariantCreatorStep.values:
            return intl.formatMessage({
                defaultMessage: "Choose Values",
                id: "NXpFlL",
                description: "product attribute values, page title",
            });
        case ProductVariantCreatorStep.prices:
            return intl.formatMessage({
                defaultMessage: "Price and SKUs",
                id: "7WEC+G",
                description: "page title",
            });
        case ProductVariantCreatorStep.summary:
            return intl.formatMessage({
                defaultMessage: "Summary",
                id: "g1WQlC",
                description: "page title",
            });
    }
}

// eslint-disable-next-line consistent-return
function getDescription(step: ProductVariantCreatorStep, intl: IntlShape): string {
    // eslint-disable-next-line default-case
    switch (step) {
        case ProductVariantCreatorStep.values:
            return intl.formatMessage({
                defaultMessage:
                    "Selected values will be used to create variants for the configurable product.",
                id: "ClFzoD",
            });
        case ProductVariantCreatorStep.prices:
            return intl.formatMessage({
                defaultMessage:
                    "Based on your selections we will create 8 products. Use this step to customize price and stocks for your new products.",
                id: "iigydN",
            });
        case ProductVariantCreatorStep.summary:
            return intl.formatMessage({
                defaultMessage:
                    "Here is the summary of variants that will be created. You can change prices, stocks an SKU for each one created.",
                id: "rHXF43",
            });
    }
}

const ProductVariantCreatePage: React.FC<ProductVariantCreatePageProps> = (props) => {
    const { attributes, channelListings, errors, limits, onSubmit, warehouses, ...contentProps } =
        props;

    const classes = useStyles(props);

    const intl = useIntl();

    const [wizardData, dispatchFormDataAction] = React.useReducer(
        reduceProductVariantCreateFormData,
        createInitialForm(attributes, channelListings, warehouses)
    );

    const [step, { next: nextStep, prev: prevStep, set: setStep }] =
        useWizard<ProductVariantCreatorStep>(
            ProductVariantCreatorStep.values,
            [
                ProductVariantCreatorStep.values,
                ProductVariantCreatorStep.prices,
                ProductVariantCreatorStep.summary,
            ],
            {
                onTransition: (_, nextStep) => {
                    if (nextStep === ProductVariantCreatorStep.summary) {
                        dispatchFormDataAction({
                            type: ProductVariantCreateReducerActionType.reload,
                        });
                    }
                },
            }
        );

    const reloadForm = () =>
        dispatchFormDataAction({
            reload: {
                data: createInitialForm(attributes, channelListings, warehouses),
            },
            type: ProductVariantCreateReducerActionType.reload,
        });

    React.useEffect(reloadForm, [attributes.length, warehouses.length]);

    const variantsLeft = limits?.allowedUsage.productVariants
        ? limits.allowedUsage.productVariants - limits.currentUsage.productVariants
        : null;

    return (
        <Container>
            <ProductVariantCreateTabs step={step} onStepClick={setStep} />

            <PageHeader
                title={
                    <>
                        {getTitle(step, intl)}

                        <Typography className={classes.description} variant="body2">
                            {getDescription(step, intl)}
                        </Typography>
                    </>
                }
            >
                {step !== ProductVariantCreatorStep.values && (
                    <Button className={classes.button} color="primary" onClick={prevStep}>
                        <FormattedMessage
                            defaultMessage="Previous"
                            id="esg2wu"
                            description="previous step, button"
                        />
                    </Button>
                )}

                {step !== ProductVariantCreatorStep.summary ? (
                    <Button
                        data-test-id="next-step"
                        className={classes.button}
                        color="primary"
                        disabled={!canHitNext(step, wizardData, variantsLeft)}
                        variant="contained"
                        onClick={nextStep}
                    >
                        <FormattedMessage defaultMessage="Next" id="+bFHzi" description="button" />
                    </Button>
                ) : (
                    <Button
                        className={classes.button}
                        color="primary"
                        disabled={!canHitNext(step, wizardData, variantsLeft)}
                        variant="contained"
                        onClick={() => onSubmit(wizardData.variants)}
                    >
                        <FormattedMessage
                            defaultMessage="Create"
                            id="Q3j++G"
                            description="create multiple variants, button"
                        />
                    </Button>
                )}
            </PageHeader>

            <Hr className={classes.hr} />

            <div className={classes.content}>
                <ProductVariantCreatorContent
                    {...contentProps}
                    attributes={attributes}
                    channelListings={channelListings}
                    data={wizardData}
                    dispatchFormDataAction={dispatchFormDataAction}
                    errors={errors}
                    variantsLeft={variantsLeft}
                    step={step}
                    warehouses={warehouses}
                />
            </div>
        </Container>
    );
};

ProductVariantCreatePage.displayName = "ProductVariantCreatePage";

export default ProductVariantCreatePage;
