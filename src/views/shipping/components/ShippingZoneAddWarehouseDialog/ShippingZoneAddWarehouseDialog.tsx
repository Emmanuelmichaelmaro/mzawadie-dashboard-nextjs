import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
} from "@material-ui/core";
import CompanyAddressForm from "@mzawadie/components/CompanyAddressInput/CompanyAddressForm";
import ConfirmButton, { ConfirmButtonTransitionState } from "@mzawadie/components/ConfirmButton";
import Form from "@mzawadie/components/Form";
import FormSpacer from "@mzawadie/components/FormSpacer";
import Hr from "@mzawadie/components/Hr";
import { ShopInfo_shop_countries } from "@mzawadie/components/Shop/types/ShopInfo";
import { buttonMessages, DialogProps } from "@mzawadie/core";
import { WarehouseErrorFragment } from "@mzawadie/fragments/types/WarehouseErrorFragment";
import useAddressValidation from "@mzawadie/hooks/useAddressValidation";
import useModalDialogErrors from "@mzawadie/hooks/useModalDialogErrors";
import useModalDialogOpen from "@mzawadie/hooks/useModalDialogOpen";
import useStateFromProps from "@mzawadie/hooks/useStateFromProps";
import createSingleAutocompleteSelectHandler from "@mzawadie/utils/handlers/singleAutocompleteSelectChangeHandler";
import { mapCountriesToChoices } from "@mzawadie/utils/maps";
import { AddressTypeInput } from "@mzawadie/views/customers/types";
import { makeStyles } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

export interface ShippingZoneAddWarehouseDialogSubmitData extends AddressTypeInput {
    name: string;
}
export interface ShippingZoneAddWarehouseDialogProps extends DialogProps {
    confirmButtonState: ConfirmButtonTransitionState;
    countries: ShopInfo_shop_countries[];
    disabled: boolean;
    errors: WarehouseErrorFragment[];
    onSubmit: (data: ShippingZoneAddWarehouseDialogSubmitData) => void;
}

const initialForm: ShippingZoneAddWarehouseDialogSubmitData = {
    city: "",
    cityArea: "",
    companyName: "",
    country: "",
    countryArea: "",
    firstName: "",
    lastName: "",
    name: "",
    phone: "",
    postalCode: "",
    streetAddress1: "",
    streetAddress2: "",
};

const useStyles = makeStyles(
    {
        overflow: {
            overflowY: "visible",
        },
    },
    {
        name: "ShippingZoneAddWarehouseDialog",
    }
);

const ShippingZoneAddWarehouseDialog: React.FC<ShippingZoneAddWarehouseDialogProps> = ({
    confirmButtonState,
    countries,
    disabled,
    errors: apiErrors,
    open,
    onClose,
    onSubmit,
}) => {
    const classes = useStyles({});
    const [countryDisplayName, setCountryDisplayName] = useStateFromProps("");
    const { errors: validationErrors, submit: handleSubmit } = useAddressValidation(onSubmit);
    const errors = useModalDialogErrors([...apiErrors, ...validationErrors], open);
    useModalDialogOpen(open, {});
    const intl = useIntl();

    const countryChoices = mapCountriesToChoices(countries);

    return (
        <Dialog
            classes={{ paper: classes.overflow }}
            onClose={onClose}
            open={open}
            fullWidth
            maxWidth="sm"
        >
            <DialogTitle>
                <FormattedMessage
                    defaultMessage="Create New Warehouse"
                    id="yzYXW/"
                    description="header, dialog"
                />
            </DialogTitle>
            <Form initial={initialForm} onSubmit={handleSubmit}>
                {({ change, data }) => {
                    const handleCountrySelect = createSingleAutocompleteSelectHandler(
                        change,
                        setCountryDisplayName,
                        countryChoices
                    );

                    return (
                        <>
                            <DialogContent className={classes.overflow}>
                                <TextField
                                    fullWidth
                                    label={intl.formatMessage({
                                        defaultMessage: "Warehouse Name",
                                        id: "llBnr+",
                                    })}
                                    name="name"
                                    value={data.name}
                                    onChange={change}
                                />
                                <FormSpacer />
                                <Hr />
                                <FormSpacer />
                                <CompanyAddressForm
                                    countries={countryChoices}
                                    data={data}
                                    disabled={disabled}
                                    displayCountry={countryDisplayName}
                                    errors={errors}
                                    onChange={change}
                                    onCountryChange={handleCountrySelect}
                                />
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={onClose}>
                                    <FormattedMessage {...buttonMessages.back} />
                                </Button>
                                <ConfirmButton
                                    transitionState={confirmButtonState}
                                    color="primary"
                                    variant="contained"
                                    type="submit"
                                >
                                    <FormattedMessage {...buttonMessages.create} />
                                </ConfirmButton>
                            </DialogActions>
                        </>
                    );
                }}
            </Form>
        </Dialog>
    );
};

ShippingZoneAddWarehouseDialog.displayName = "ShippingZoneAddWarehouseDialog";
export default ShippingZoneAddWarehouseDialog;
