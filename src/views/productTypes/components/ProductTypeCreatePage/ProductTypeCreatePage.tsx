// @ts-nocheck
import CardSpacer from "@mzawadie/components/CardSpacer";
import { ConfirmButtonTransitionState } from "@mzawadie/components/ConfirmButton";
import Container from "@mzawadie/components/Container";
import Form from "@mzawadie/components/Form";
import Grid from "@mzawadie/components/Grid";
import Metadata, { MetadataFormData } from "@mzawadie/components/Metadata";
import PageHeader from "@mzawadie/components/PageHeader";
import Savebar from "@mzawadie/components/Savebar";
import { UserError, sectionNames } from "@mzawadie/core";
import { ChangeEvent, FormChange } from "@mzawadie/hooks/useForm";
import useStateFromProps from "@mzawadie/hooks/useStateFromProps";
import { WeightUnitsEnum } from "@mzawadie/types/globalTypes";
import useMetadataChangeTrigger from "@mzawadie/utils/metadata/useMetadataChangeTrigger";
import { ProductTypeDetails_taxTypes } from "@mzawadie/views/productTypes/types/ProductTypeDetails";
import { Backlink } from "@saleor/macaw-ui";
import React from "react";
import { useIntl } from "react-intl";

import ProductTypeDetails from "../ProductTypeDetails/ProductTypeDetails";
import ProductTypeShipping from "../ProductTypeShipping/ProductTypeShipping";
import ProductTypeTaxes from "../ProductTypeTaxes/ProductTypeTaxes";

export interface ProductTypeForm extends MetadataFormData {
    name: string;
    isShippingRequired: boolean;
    taxType: string;
    weight: number;
}

export interface ProductTypeCreatePageProps {
    errors: UserError[];
    defaultWeightUnit: WeightUnitsEnum;
    disabled: boolean;
    pageTitle: string;
    saveButtonBarState: ConfirmButtonTransitionState;
    taxTypes: ProductTypeDetails_taxTypes[];
    onBack: () => void;
    onSubmit: (data: ProductTypeForm) => void;
}

const formInitialData: ProductTypeForm = {
    isShippingRequired: false,
    metadata: [],
    name: "",
    privateMetadata: [],
    taxType: "",
    weight: 0,
};

function handleTaxTypeChange(
    event: ChangeEvent,
    taxTypes: ProductTypeDetails_taxTypes[],
    formChange: FormChange,
    displayChange: (name: string) => void
) {
    formChange(event);
    displayChange(taxTypes.find((taxType) => taxType.taxCode === event.target.value).description);
}

const ProductTypeCreatePage: React.FC<ProductTypeCreatePageProps> = ({
    defaultWeightUnit,
    disabled,
    errors,
    pageTitle,
    saveButtonBarState,
    taxTypes,
    onBack,
    onSubmit,
}: ProductTypeCreatePageProps) => {
    const intl = useIntl();
    const [taxTypeDisplayName, setTaxTypeDisplayName] = useStateFromProps("");
    const { makeChangeHandler: makeMetadataChangeHandler } = useMetadataChangeTrigger();

    return (
        <Form initial={formInitialData} onSubmit={onSubmit} confirmLeave>
            {({ change, data, hasChanged, submit }) => {
                const changeMetadata = makeMetadataChangeHandler(change);

                return (
                    <Container>
                        <Backlink onClick={onBack}>
                            {intl.formatMessage(sectionNames.productTypes)}
                        </Backlink>
                        <PageHeader title={pageTitle} />
                        <Grid>
                            <div>
                                <ProductTypeDetails
                                    data={data}
                                    disabled={disabled}
                                    errors={errors}
                                    onChange={change}
                                />
                                <CardSpacer />
                                <ProductTypeTaxes
                                    disabled={disabled}
                                    data={data}
                                    taxTypes={taxTypes}
                                    taxTypeDisplayName={taxTypeDisplayName}
                                    onChange={(event) =>
                                        handleTaxTypeChange(
                                            event,
                                            taxTypes,
                                            change,
                                            setTaxTypeDisplayName
                                        )
                                    }
                                />
                                <CardSpacer />
                                <Metadata data={data} onChange={changeMetadata} />
                            </div>
                            <div>
                                <ProductTypeShipping
                                    disabled={disabled}
                                    data={data}
                                    weightUnit={defaultWeightUnit}
                                    onChange={change}
                                />
                            </div>
                        </Grid>
                        <Savebar
                            onCancel={onBack}
                            onSubmit={submit}
                            disabled={disabled || !hasChanged}
                            state={saveButtonBarState}
                        />
                    </Container>
                );
            }}
        </Form>
    );
};

ProductTypeCreatePage.displayName = "ProductTypeCreatePage";

export default ProductTypeCreatePage;
