import { Dialog, DialogActions, DialogContent, DialogTitle } from "@material-ui/core";
import { AddressEdit } from "@mzawadie/components/AddressEdit";
import BackButton from "@mzawadie/components/BackButton";
import { ConfirmButton } from "@mzawadie/components/ConfirmButton";
import { Form } from "@mzawadie/components/Form";
import { ShopInfo_shop_countries } from "@mzawadie/components/Shop/types/ShopInfo";
import { buttonMessages } from "@mzawadie/core";
import { AccountErrorFragment } from "@mzawadie/fragments/types/AccountErrorFragment";
import useAddressValidation from "@mzawadie/hooks/useAddressValidation";
import { useModalDialogErrors } from "@mzawadie/hooks/useModalDialogErrors";
import useStateFromProps from "@mzawadie/hooks/useStateFromProps";
import { AddressInput } from "@mzawadie/types/globalTypes";
import createSingleAutocompleteSelectHandler from "@mzawadie/utils/handlers/singleAutocompleteSelectChangeHandler";
import { mapCountriesToChoices } from "@mzawadie/utils/maps";
import { ConfirmButtonTransitionState, makeStyles } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage } from "react-intl";

import { AddressTypeInput } from "../../types";
import { CustomerAddresses_user_addresses } from "../../types/CustomerAddresses";

export interface CustomerAddressDialogProps {
    address: CustomerAddresses_user_addresses;
    confirmButtonState: ConfirmButtonTransitionState;
    countries: ShopInfo_shop_countries[];
    errors: AccountErrorFragment[];
    open: boolean;
    variant: "create" | "edit";
    onClose: () => void;
    onConfirm: (data: AddressInput) => void;
}

const useStyles = makeStyles(
    {
        overflow: {
            overflowY: "visible",
        },
    },
    { name: "CustomerAddressDialog" }
);

const CustomerAddressDialog: React.FC<CustomerAddressDialogProps> = ({
    address,
    confirmButtonState,
    countries,
    errors,
    open,
    variant,
    onClose,
    onConfirm,
}) => {
    const classes = useStyles();
    const [countryDisplayName, setCountryDisplayName] = useStateFromProps(
        address?.country.country || ""
    );
    const { errors: validationErrors, submit: handleSubmit } = useAddressValidation(onConfirm);
    const dialogErrors = useModalDialogErrors([...errors, ...validationErrors], open);

    const initialForm: AddressTypeInput = {
        city: address?.city || "",
        cityArea: address?.cityArea || "",
        companyName: address?.companyName || "",
        country: address?.country.code || "",
        countryArea: address?.countryArea || "",
        firstName: address?.firstName || "",
        lastName: address?.lastName || "",
        phone: address?.phone || "",
        postalCode: address?.postalCode || "",
        streetAddress1: address?.streetAddress1 || "",
        streetAddress2: address?.streetAddress2 || "",
    };

    const countryChoices = mapCountriesToChoices(countries || []);

    return (
        <Dialog
            onClose={onClose}
            open={open}
            classes={{ paper: classes.overflow }}
            fullWidth
            maxWidth="sm"
        >
            <Form initial={initialForm} onSubmit={handleSubmit}>
                {({ change, data }) => {
                    const handleCountrySelect = createSingleAutocompleteSelectHandler(
                        change,
                        setCountryDisplayName,
                        countryChoices
                    );

                    return (
                        <>
                            <DialogTitle>
                                {variant === "create" ? (
                                    <FormattedMessage
                                        defaultMessage="Add Address"
                                        id="W0kQd+"
                                        description="dialog title"
                                    />
                                ) : (
                                    <FormattedMessage
                                        defaultMessage="Edit Address"
                                        id="gQGUsN"
                                        description="dialog title"
                                    />
                                )}
                            </DialogTitle>

                            <DialogContent className={classes.overflow}>
                                <AddressEdit
                                    countries={countryChoices}
                                    data={data}
                                    countryDisplayValue={countryDisplayName}
                                    errors={dialogErrors}
                                    onChange={change}
                                    onCountryChange={handleCountrySelect}
                                />
                            </DialogContent>

                            <DialogActions>
                                <BackButton onClick={onClose} />
                                <ConfirmButton
                                    transitionState={confirmButtonState}
                                    type="submit"
                                    data-test-id="submit"
                                >
                                    <FormattedMessage {...buttonMessages.save} />
                                </ConfirmButton>
                            </DialogActions>
                        </>
                    );
                }}
            </Form>
        </Dialog>
    );
};

CustomerAddressDialog.displayName = "CustomerAddressDialog";

export default CustomerAddressDialog;
