import CardSpacer from "@mzawadie/components/CardSpacer";
import MultiAutocompleteSelectField, {
    MultiAutocompleteChoiceType,
} from "@mzawadie/components/MultiAutocompleteSelectField";
import { FetchMoreProps, SearchProps } from "@mzawadie/core";
import { FormChange } from "@mzawadie/hooks/useForm";
import React from "react";
import { useIntl, defineMessages, FormattedMessage } from "react-intl";

const messages = defineMessages({
    subtitle: {
        defaultMessage:
            "Select warehouse from which you will ship products for this shipping zone. This warehouse address will also be used to calculate taxes.",
        id: "wjKYSU",
        description: "WarehousesSection subtitle",
    },
    selectFieldAddText: {
        defaultMessage: "Add New Warehouse",
        id: "n25d+d",
        description: "WarehousesSection select field add text",
    },
    selectFieldLabel: {
        defaultMessage: "Warehouse",
        description: "WarehousesSection select field label",
        id: "PV0SQd",
    },
    selectFieldPlaceholder: {
        defaultMessage: "Select Warehouse",
        id: "/cow4T",
        description: "WarehousesSection select field placeholder",
    },
});

interface WarehousesSectionProps extends FetchMoreProps, SearchProps {
    displayValues: MultiAutocompleteChoiceType[];
    choices: MultiAutocompleteChoiceType[];
    onChange: FormChange;
    onAdd: () => void;
    selectedWarehouses: string[];
}

const WarehousesSection: React.FC<WarehousesSectionProps> = ({
    onAdd,
    onSearchChange,
    onChange,
    onFetchMore,
    displayValues,
    choices,
    selectedWarehouses,
    hasMore,
    loading,
}) => {
    const intl = useIntl();

    return (
        <>
            <FormattedMessage {...messages.subtitle} />
            <CardSpacer />
            <MultiAutocompleteSelectField
                add={{
                    label: intl.formatMessage(messages.selectFieldAddText),
                    onClick: onAdd,
                }}
                testId="warehouses"
                choices={choices}
                displayValues={displayValues}
                fetchChoices={onSearchChange}
                hasMore={hasMore}
                label={intl.formatMessage(messages.selectFieldLabel)}
                loading={loading}
                name="warehouses"
                onChange={onChange}
                onFetchMore={onFetchMore}
                placeholder={intl.formatMessage(messages.selectFieldPlaceholder)}
                value={selectedWarehouses}
            />
        </>
    );
};

export default WarehousesSection;
