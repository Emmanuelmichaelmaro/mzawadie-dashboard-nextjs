// @ts-nocheck
import { Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@material-ui/core";
import { ConfirmButton } from "@mzawadie/components/ConfirmButton";
import { makeCreatorSteps, Step } from "@mzawadie/components/CreatorSteps";
import { MultiAutocompleteChoiceType } from "@mzawadie/components/MultiAutocompleteSelectField";
import { buttonMessages, DialogProps, FetchMoreProps, RelayToFlat } from "@mzawadie/core";
import {
    ChannelFragment,
    SearchAttributesQuery,
    WarehouseFragment,
    ExportErrorFragment,
    ExportProductsInput,
} from "@mzawadie/graphql";
import useForm, { FormChange } from "@mzawadie/hooks/useForm";
import { useModalDialogErrors } from "@mzawadie/hooks/useModalDialogErrors";
import { useModalDialogOpen } from "@mzawadie/hooks/useModalDialogOpen";
import useWizard from "@mzawadie/hooks/useWizard";
import getExportErrorMessage from "@mzawadie/utils/errors/export";
import { toggle } from "@mzawadie/utils/lists";
import { mapNodeToChoice } from "@mzawadie/utils/maps";
import { Button, ConfirmButtonTransitionState } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import ExportDialogSettings, { ExportItemsQuantity } from "./ExportDialogSettings";
import ProductExportDialogInfo, {
    attributeNamePrefix,
    warehouseNamePrefix,
} from "./ProductExportDialogInfo";
import { productExportDialogMessages as messages } from "./messages";
import { exportSettingsInitialFormData } from "./types";

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
    ...exportSettingsInitialFormData,
};

const ProductExportSteps = makeCreatorSteps<ProductExportStep>();

export interface ProductExportDialogProps extends DialogProps, FetchMoreProps {
    attributes: RelayToFlat<SearchAttributesQuery["search"]>;
    channels: ChannelFragment[];
    confirmButtonState: ConfirmButtonTransitionState;
    errors: ExportErrorFragment[];
    productQuantity: ExportItemsQuantity;
    selectedProducts: number;
    warehouses: WarehouseFragment[];
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

    const exportScopeLabels = {
        allItems: intl.formatMessage(
            {
                defaultMessage: "All products ({number})",
                id: "xtUXnK",
                description: "export all items to csv file",
            },
            {
                number: productQuantity.all || "...",
            }
        ),
        selectedItems: intl.formatMessage(
            {
                defaultMessage: "Selected products ({number})",
                id: "qEZ463",
                description: "export selected items to csv file",
            },
            {
                number: selectedProducts,
            }
        ),
    };

    return (
        <Dialog onClose={onClose} open={open} maxWidth="sm" fullWidth>
            <>
                <DialogTitle>
                    <FormattedMessage {...messages.title} />
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
                        <ExportDialogSettings
                            data={data}
                            errors={dialogErrors}
                            onChange={change}
                            itemsQuantity={productQuantity}
                            selectedItems={selectedProducts}
                            exportScopeLabels={exportScopeLabels}
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
                        <Button
                            variant="secondary"
                            color="text"
                            onClick={onClose}
                            data-test-id="cancel"
                        >
                            <FormattedMessage {...buttonMessages.cancel} />
                        </Button>
                    )}

                    {step === ProductExportStep.SETTINGS && (
                        <Button variant="secondary" color="text" onClick={prev} data-test-id="back">
                            <FormattedMessage {...buttonMessages.back} />
                        </Button>
                    )}

                    {step === ProductExportStep.INFO && (
                        <Button variant="primary" onClick={next} data-test-id="next">
                            <FormattedMessage {...buttonMessages.nextStep} />
                        </Button>
                    )}

                    {step === ProductExportStep.SETTINGS && (
                        <ConfirmButton
                            transitionState={confirmButtonState}
                            type="submit"
                            data-test-id="submit"
                            onClick={submit}
                        >
                            <FormattedMessage {...messages.confirmButtonLabel} />
                        </ConfirmButton>
                    )}
                </DialogActions>
            </>
        </Dialog>
    );
};

ProductExportDialog.displayName = "ProductExportDialog";

export default ProductExportDialog;
