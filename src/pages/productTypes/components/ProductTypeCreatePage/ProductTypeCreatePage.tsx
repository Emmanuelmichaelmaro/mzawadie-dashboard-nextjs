// @ts-nocheck
import { Backlink } from "@mzawadie/components/Backlink";
import CardSpacer from "@mzawadie/components/CardSpacer";
import Container from "@mzawadie/components/Container";
import { Form } from "@mzawadie/components/Form";
import { Grid } from "@mzawadie/components/Grid";
import { Metadata, MetadataFormData } from "@mzawadie/components/Metadata";
import { PageHeader } from "@mzawadie/components/PageHeader";
import Savebar from "@mzawadie/components/Savebar";
import { sectionNames } from "@mzawadie/core";
import { UserError } from "@mzawadie/core";
import { ProductTypeDetailsQuery, ProductTypeKindEnum, WeightUnitsEnum } from "@mzawadie/graphql";
import { ChangeEvent, FormChange, SubmitPromise } from "@mzawadie/hooks/useForm";
import useNavigator from "@mzawadie/hooks/useNavigator";
import useStateFromProps from "@mzawadie/hooks/useStateFromProps";
import { makeProductTypeKindChangeHandler } from "@mzawadie/pages/productTypes/handlers";
import { productTypeListUrl } from "@mzawadie/pages/productTypes/urls";
import useMetadataChangeTrigger from "@mzawadie/utils/metadata/useMetadataChangeTrigger";
import { ConfirmButtonTransitionState } from "@saleor/macaw-ui";
import React from "react";
import { useIntl } from "react-intl";

import ProductTypeDetails from "../ProductTypeDetails/ProductTypeDetails";
import ProductTypeShipping from "../ProductTypeShipping/ProductTypeShipping";
import ProductTypeTaxes from "../ProductTypeTaxes/ProductTypeTaxes";

export interface ProductTypeForm extends MetadataFormData {
    name: string;
    kind: ProductTypeKindEnum;
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
    taxTypes: ProductTypeDetailsQuery["taxTypes"];
    kind: ProductTypeKindEnum;
    onChangeKind: (kind: ProductTypeKindEnum) => void;
    onSubmit: (data: ProductTypeForm) => SubmitPromise<any[]>;
}

const formInitialData: ProductTypeForm = {
    isShippingRequired: false,
    metadata: [],
    name: "",
    kind: ProductTypeKindEnum.NORMAL,
    privateMetadata: [],
    taxType: "",
    weight: 0,
};

function handleTaxTypeChange(
    event: ChangeEvent,
    taxTypes: ProductTypeDetailsQuery["taxTypes"],
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
    kind,
    onChangeKind,
    onSubmit,
}: ProductTypeCreatePageProps) => {
    const intl = useIntl();
    const navigate = useNavigator();

    const [taxTypeDisplayName, setTaxTypeDisplayName] = useStateFromProps("");
    const { makeChangeHandler: makeMetadataChangeHandler } = useMetadataChangeTrigger();

    const initialData = {
        ...formInitialData,
        kind: kind || formInitialData.kind,
    };

    return (
        <Form confirmLeave initial={initialData} onSubmit={onSubmit} disabled={disabled}>
            {({ change, data, isSaveDisabled, submit }) => {
                const changeMetadata = makeMetadataChangeHandler(change);

                const changeKind = makeProductTypeKindChangeHandler(change, onChangeKind);

                return (
                    <Container>
                        <Backlink href={productTypeListUrl()}>
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
                                    onKindChange={changeKind}
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
                            onCancel={() => navigate(productTypeListUrl())}
                            onSubmit={submit}
                            disabled={isSaveDisabled}
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
