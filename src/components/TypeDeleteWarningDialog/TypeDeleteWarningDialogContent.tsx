/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { CardContent, Typography } from "@material-ui/core";
import CardSpacer from "@mzawadie/components/CardSpacer";
import ConfirmButton from "@mzawadie/components/ConfirmButton";
import ControlledCheckbox from "@mzawadie/components/ControlledCheckbox";
import DeleteButton from "@mzawadie/components/DeleteButton";
import useNavigator from "@mzawadie/hooks/useNavigator";
import HorizontalSpacer from "@mzawadie/views/apps/components/HorizontalSpacer";
import React, { ChangeEvent, useState } from "react";
import { MessageDescriptor, useIntl } from "react-intl";

import { useTypeDeleteWarningDialogStyles as useStyles } from "./styles";

interface TypeDeleteWarningDialogContentProps {
    singleItemSelectedName?: string;
    viewAssignedItemsButtonLabel: MessageDescriptor;
    description: MessageDescriptor | undefined;
    consentLabel: MessageDescriptor | undefined;
    viewAssignedItemsUrl: string;
    hasAssignedItems: boolean;
    assignedItemsCount: number | undefined;
    onDelete: () => void;
    // temporary, until we add filters to pages list - SALEOR-3279
    showViewAssignedItemsButton?: boolean;
}

const TypeDeleteWarningDialogContent: React.FC<TypeDeleteWarningDialogContentProps> = ({
    description,
    consentLabel,
    viewAssignedItemsUrl,
    viewAssignedItemsButtonLabel,
    singleItemSelectedName,
    hasAssignedItems,
    assignedItemsCount,
    onDelete,
    showViewAssignedItemsButton,
}) => {
    const classes = useStyles({});
    const intl = useIntl();
    const navigate = useNavigator();

    const [isConsentChecked, setIsConsentChecked] = useState(false);

    const handleConsentChange = ({ target }: ChangeEvent<any>) => setIsConsentChecked(target.value);

    const handleViewAssignedItems = () => navigate(viewAssignedItemsUrl);

    const isDisbled = hasAssignedItems ? !isConsentChecked : false;

    const shouldShowViewAssignedItemsButton = showViewAssignedItemsButton && hasAssignedItems;

    return (
        <CardContent>
            <Typography>
                {intl.formatMessage(description as MessageDescriptor, {
                    typeName: singleItemSelectedName,
                    assignedItemsCount,
                    b: (...chunks) => <b>{chunks}</b>,
                })}
            </Typography>
            <CardSpacer />
            {consentLabel && (
                <ControlledCheckbox
                    name="delete-assigned-items-consent"
                    checked={isConsentChecked}
                    onChange={handleConsentChange}
                    label={
                        <Typography className={classes.consentLabel}>
                            {intl.formatMessage(consentLabel)}
                        </Typography>
                    }
                />
            )}
            <CardSpacer />
            <div className={classes.buttonsSection}>
                {shouldShowViewAssignedItemsButton && (
                    <>
                        <ConfirmButton onClick={handleViewAssignedItems} transitionState="default">
                            {intl.formatMessage(viewAssignedItemsButtonLabel)}
                        </ConfirmButton>
                        <HorizontalSpacer spacing={3} />
                    </>
                )}
                <DeleteButton onClick={onDelete} disabled={isDisbled} />
            </div>
        </CardContent>
    );
};

export default TypeDeleteWarningDialogContent;
