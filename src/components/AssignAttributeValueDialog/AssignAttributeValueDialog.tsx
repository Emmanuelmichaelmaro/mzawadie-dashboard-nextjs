import { AttributeReference } from "@mzawadie/pages/attributes/utils/data";
import React from "react";
import { defineMessages, useIntl } from "react-intl";

import { AssignContainerDialog, AssignContainerDialogProps } from "../AssignContainerDialog";

const messages = defineMessages({
    header: {
        defaultMessage: "Assign Attribute Value",
        id: "GUlwXU",
        description: "dialog header",
    },
    searchLabel: {
        defaultMessage: "Search Attribute Value",
        id: "RoKOQJ",
        description: "label",
    },
    searchPlaceholder: {
        defaultMessage: "Search by value name, etc...",
        id: "NsgWhZ",
        description: "placeholder",
    },
});

interface AssignAttributeValueDialogProps
    extends Omit<AssignContainerDialogProps, "containers" | "title" | "search" | "confirmButtonState"> {
    attributeValues: AttributeReference[];
}

const AssignAttributeValueDialog: React.FC<AssignAttributeValueDialogProps> = ({
    attributeValues,
    ...rest
}) => {
    const intl = useIntl();

    return (
        <AssignContainerDialog
            containers={attributeValues.map((value) => ({
                id: value.value,
                name: value.label,
            }))}
            search={{
                label: intl.formatMessage(messages.searchLabel),
                placeholder: intl.formatMessage(messages.searchPlaceholder),
            }}
            title={intl.formatMessage(messages.header)}
            confirmButtonState="default"
            {...rest}
        />
    );
};

AssignAttributeValueDialog.displayName = "AssignAttributeValueDialog";

export default AssignAttributeValueDialog;
