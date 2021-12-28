// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Typography,
} from "@material-ui/core";
import ConfirmButton, { ConfirmButtonTransitionState } from "@mzawadie/components/ConfirmButton";
import makeCreatorSteps, { Step } from "@mzawadie/components/CreatorSteps";
import { MultiAutocompleteChoiceType } from "@mzawadie/components/MultiAutocompleteSelectField";
import { buttonMessages, DialogProps, FetchMoreProps } from "@mzawadie/core";
import { ChannelFragment } from "@mzawadie/fragments/types/ChannelFragment";
import { ExportErrorFragment } from "@mzawadie/fragments/types/ExportErrorFragment";
import useForm, { FormChange } from "@mzawadie/hooks/useForm";
import useModalDialogErrors from "@mzawadie/hooks/useModalDialogErrors";
import useModalDialogOpen from "@mzawadie/hooks/useModalDialogOpen";
import useWizard from "@mzawadie/hooks/useWizard";
import { ExportProductsInput, ExportScope, FileTypesEnum } from "@mzawadie/types/globalTypes";
import getExportErrorMessage from "@mzawadie/utils/errors/export";
import { toggle } from "@mzawadie/utils/lists";
import { mapNodeToChoice } from "@mzawadie/utils/maps";
import { SearchAttributes_search_edges_node } from "@mzawadie/views/searches/types/SearchAttributes";
import { WarehouseList_warehouses_edges_node } from "@mzawadie/views/warehouses/types/WarehouseList";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import ProductExportDialogInfo, {
    attributeNamePrefix,
    warehouseNamePrefix,
} from "./ProductExportDialogInfo";
import ProductExportDialogSettings, { ProductQuantity } from "./ProductExportDialogSettings";

export enum ProductExportStep {
    INFO,
    SETTINGS,
}

function useSteps(): Array<Step<ProductExportStep>> {
    const intl = useIntl();

    return [
        {
            label: intl.formatMessage({
                defaultMessage: "Information exported",
                id: "/68iG8",
                description: "product export to csv file, header",
            }),
            value: ProductExportStep.INFO,
        },
        {
            label: intl.formatMessage({
                defaultMessage: "Export Settings",
                id: "ki7Mr8",
                description: "product export to csv file, header",
            }),
            value: ProductExportStep.SETTINGS,
        },
    ];
}

const initialForm: ExportProductsInput = {
    exportInfo: {
        attributes: [],
        channels: [],
        fields: [],
        warehouses: [],
    },
    fileType: FileTypesEnum.CSV,
    scope: ExportScope.ALL,
};

const ProductExportSteps = makeCreatorSteps<ProductExportStep>();

export interface ProductExportDialogProps extends DialogProps, FetchMoreProps {
    attributes: SearchAttributes_search_edges_node[];
    channels: ChannelFragment[];
    confirmButtonState: ConfirmButtonTransitionState;
    errors: ExportErrorFragment[];
    productQuantity: ProductQuantity;
    selectedProducts: number;
    warehouses: WarehouseList_warehouses_edges_node[];
    onFetch: (query: string) => void;
    onSubmit: (data: ExportProductsInput) => void;
}

const ProductExportDialog: React.FC<ProductExportDialogProps> = ({
    attributes,
    channels,
    confirmButtonState,
    errors,
    productQuantity,
    onClose,
    onSubmit,
    open,
    selectedProducts,
    warehouses,
    ...fetchMoreProps
}) => {
    const [step, { next, prev, set: setStep }] = useWizard(ProductExportStep.INFO, [
        ProductExportStep.INFO,
        ProductExportStep.SETTINGS,
    ]);
    const steps = useSteps();
    const dialogErrors = useModalDialogErrors(errors, open);
    const notFormErrors = dialogErrors.filter((err) => !err.field);
    const intl = useIntl();
    const [selectedAttributes, setSelectedAttributes] = React.useState<MultiAutocompleteChoiceType[]>(
        []
    );
    const [selectedChannels, setSelectedChannels] = React.useState([]);
    const { change, data, reset, submit } = useForm(initialForm, onSubmit);

    useModalDialogOpen(open, {
        onClose: () => {
            reset();
            setStep(ProductExportStep.INFO);
        },
    });

    const attributeChoices = mapNodeToChoice(attributes);
    const warehouseChoices = mapNodeToChoice(warehouses);

    const handleAttributeSelect: FormChange = (event) => {
        const id = event.target.name.substr(attributeNamePrefix.length);

        change({
            target: {
                name: "exportInfo",
                value: {
                    ...data.exportInfo,
                    attributes: toggle(id, data.exportInfo.attributes, (a, b) => a === b),
                },
            },
        });

        const choice = attributeChoices.find((choice) => choice.value === id);

        setSelectedAttributes(toggle(choice, selectedAttributes, (a, b) => a.value === b.value));
    };

    const handleChannelSelect = (option: ChannelFragment) => {
        change({
            target: {
                name: "exportInfo",
                value: {
                    ...data.exportInfo,
                    channels: toggle(option.id, data.exportInfo.channels, (a, b) => a === b),
                },
            },
        });
        const choice = channels.find((choice) => choice.id === option.id);

        setSelectedChannels(toggle(choice, selectedChannels, (a, b) => a.id === b.id));
    };

    const handleToggleAllChannels = (items: ChannelFragment[], selected: number) => {
        setSelectedChannels(selected === items.length ? [] : channels);

        change({
            target: {
                name: "exportInfo",
                value: {
                    ...data.exportInfo,
                    channels: selected === items.length ? [] : channels.map((channel) => channel.id),
                },
            },
        });
    };

    const handleWarehouseSelect: FormChange = (event) =>
        change({
            target: {
                name: "exportInfo",
                value: {
                    ...data.exportInfo,
                    warehouses: toggle(
                        event.target.name.substr(warehouseNamePrefix.length),
                        data.exportInfo.warehouses,
                        (a, b) => a === b
                    ),
                },
            },
        });

    const handleToggleAllWarehouses: FormChange = () =>
        change({
            target: {
                name: "exportInfo",
                value: {
                    ...data.exportInfo,
                    warehouses:
                        data.exportInfo.warehouses.length === warehouses.length
                            ? []
                            : warehouses.map((warehouse) => warehouse.id),
                },
            },
        });

    return (
        <Dialog onClose={onClose} open={open} maxWidth="sm" fullWidth>
            <>
                <DialogTitle>
                    <FormattedMessage
                        defaultMessage="Export Information"
                        id="xkjRu5"
                        description="export products to csv file, dialog header"
                    />
                </DialogTitle>
                <DialogContent>
                    <ProductExportSteps currentStep={step} steps={steps} onStepClick={setStep} />
                    {step === ProductExportStep.INFO && (
                        <ProductExportDialogInfo
                            attributes={attributeChoices}
                            channels={channels}
                            data={data}
                            selectedChannels={selectedChannels}
                            selectedAttributes={selectedAttributes}
                            onAttrtibuteSelect={handleAttributeSelect}
                            onWarehouseSelect={handleWarehouseSelect}
                            onChange={change}
                            warehouses={warehouseChoices}
                            onChannelSelect={handleChannelSelect}
                            onSelectAllChannels={handleToggleAllChannels}
                            onSelectAllWarehouses={handleToggleAllWarehouses}
                            {...fetchMoreProps}
                        />
                    )}
                    {step === ProductExportStep.SETTINGS && (
                        <ProductExportDialogSettings
                            data={data}
                            errors={dialogErrors}
                            productQuantity={productQuantity}
                            selectedProducts={selectedProducts}
                            onChange={change}
                        />
                    )}
                </DialogContent>

                {notFormErrors.length > 0 && (
                    <DialogContent>
                        {notFormErrors.map((err) => (
                            <Typography color="error" key={err.field + err.code}>
                                {getExportErrorMessage(err, intl)}
                            </Typography>
                        ))}
                    </DialogContent>
                )}

                <DialogActions>
                    {step === ProductExportStep.INFO && (
                        <Button onClick={onClose} data-test="cancel">
                            <FormattedMessage {...buttonMessages.cancel} />
                        </Button>
                    )}
                    {step === ProductExportStep.SETTINGS && (
                        <Button onClick={prev} data-test="back">
                            <FormattedMessage {...buttonMessages.back} />
                        </Button>
                    )}
                    {step === ProductExportStep.INFO && (
                        <Button color="primary" variant="contained" onClick={next} data-test="next">
                            <FormattedMessage {...buttonMessages.nextStep} />
                        </Button>
                    )}
                    {step === ProductExportStep.SETTINGS && (
                        <ConfirmButton
                            transitionState={confirmButtonState}
                            variant="contained"
                            type="submit"
                            data-test="submit"
                            onClick={submit}
                        >
                            <FormattedMessage
                                defaultMessage="export products"
                                id="oOFrUd"
                                description="export products to csv file, button"
                            />
                        </ConfirmButton>
                    )}
                </DialogActions>
            </>
        </Dialog>
    );
};

ProductExportDialog.displayName = "ProductExportDialog";

export default ProductExportDialog;
