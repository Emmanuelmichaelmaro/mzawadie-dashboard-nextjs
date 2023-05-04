// @ts-nocheck
import { FormControlLabel, Radio, RadioGroup } from "@material-ui/core";
import { AddressEdit } from "@mzawadie/components/AddressEdit";
import CardSpacer from "@mzawadie/components/CardSpacer";
import FormSpacer from "@mzawadie/components/FormSpacer";
import { SingleAutocompleteChoiceType } from "@mzawadie/components/SingleAutocompleteSelectField";
import Skeleton from "@mzawadie/components/Skeleton";
import { AccountErrorFragment, AddressFragment, OrderErrorFragment } from "@mzawadie/graphql";
import { FormChange } from "@mzawadie/hooks/useForm";
import { CustomerAddressChoiceCard } from "@mzawadie/pages/customers/components/CustomerAddressChoiceCard";
import { AddressTypeInput } from "@mzawadie/pages/customers/types";
import React from "react";
import { useIntl } from "react-intl";

import { getById } from "../OrderReturnPage/utils";
import { AddressInputOptionEnum } from "./form";
import { addressEditMessages } from "./messages";
import { useStyles } from "./styles";

export interface OrderCustomerAddressEditProps {
    loading: boolean;
    customerAddresses: AddressFragment[];
    countryChoices: SingleAutocompleteChoiceType[];
    addressInputOption: AddressInputOptionEnum;
    addressInputName: string;
    onChangeAddressInputOption: FormChange;
    selectedCustomerAddressId: string;
    formAddress: AddressTypeInput;
    formAddressCountryDisplayName: string;
    formErrors: Array<AccountErrorFragment | OrderErrorFragment>;
    onChangeFormAddress: (event: React.ChangeEvent<any>) => void;
    onChangeFormAddressCountry: (event: React.ChangeEvent<any>) => void;
    onEdit?: () => void;
    showCard?: boolean;
}

const OrderCustomerAddressEdit: React.FC<OrderCustomerAddressEditProps> = (props) => {
    const {
        loading,
        customerAddresses,
        countryChoices,
        addressInputOption,
        addressInputName,
        onChangeAddressInputOption,
        selectedCustomerAddressId,
        formAddress,
        formAddressCountryDisplayName,
        formErrors,
        onChangeFormAddress,
        onChangeFormAddressCountry,
        onEdit,
        showCard = true,
    } = props;

    const classes = useStyles(props);
    const intl = useIntl();

    if (loading) {
        return <Skeleton />;
    }

    if (!customerAddresses.length) {
        return (
            <AddressEdit
                countries={countryChoices}
                countryDisplayValue={formAddressCountryDisplayName}
                data={formAddress}
                errors={formErrors}
                onChange={onChangeFormAddress}
                onCountryChange={onChangeFormAddressCountry}
            />
        );
    }

    return (
        <RadioGroup
            className={classes.container}
            value={addressInputOption}
            name={addressInputName}
            onChange={(event) => onChangeAddressInputOption(event)}
        >
            <FormControlLabel
                value={AddressInputOptionEnum.CUSTOMER_ADDRESS}
                control={
                    <Radio
                        color="primary"
                        data-test-id={addressInputOption + AddressInputOptionEnum.CUSTOMER_ADDRESS}
                    />
                }
                label={intl.formatMessage(addressEditMessages.customerAddress)}
                className={classes.optionLabel}
            />

            {addressInputOption === AddressInputOptionEnum.CUSTOMER_ADDRESS && showCard && (
                <>
                    <CardSpacer />
                    <CustomerAddressChoiceCard
                        address={customerAddresses.find(getById(selectedCustomerAddressId))}
                        editable
                        onEditClick={onEdit}
                    />
                    <FormSpacer />
                </>
            )}

            <FormControlLabel
                value={AddressInputOptionEnum.NEW_ADDRESS}
                control={
                    <Radio
                        color="primary"
                        data-test-id={addressInputOption + AddressInputOptionEnum.NEW_ADDRESS}
                    />
                }
                label={intl.formatMessage(addressEditMessages.newAddress)}
                className={classes.optionLabel}
            />

            {addressInputOption === AddressInputOptionEnum.NEW_ADDRESS && (
                <AddressEdit
                    countries={countryChoices}
                    countryDisplayValue={formAddressCountryDisplayName}
                    data={formAddress}
                    errors={formErrors}
                    onChange={onChangeFormAddress}
                    onCountryChange={onChangeFormAddressCountry}
                />
            )}
        </RadioGroup>
    );
};

OrderCustomerAddressEdit.displayName = "OrderCustomerAddressEdit";

export default OrderCustomerAddressEdit;
