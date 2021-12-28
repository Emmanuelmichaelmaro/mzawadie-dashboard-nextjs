/* eslint-disable @typescript-eslint/no-misused-promises */
// @ts-nocheck
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TableBody,
    TableCell,
    TableRow,
    TextField,
    Typography,
} from "@material-ui/core";
import Checkbox from "@mzawadie/components/Checkbox";
import ConfirmButton, { ConfirmButtonTransitionState } from "@mzawadie/components/ConfirmButton";
import Form from "@mzawadie/components/Form";
import FormSpacer from "@mzawadie/components/FormSpacer";
import Hr from "@mzawadie/components/Hr";
import ResponsiveTable from "@mzawadie/components/ResponsiveTable";
// tslint:disable no-submodule-imports
import { ShopInfo_shop_countries } from "@mzawadie/components/Shop/types/ShopInfo";
import { buttonMessages } from "@mzawadie/core";
import { makeStyles } from "@saleor/macaw-ui";
import { filter } from "fuzzaldrin";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

interface FormData {
    allCountries: boolean;
    countries: string[];
    query: string;
}

export interface DiscountCountrySelectDialogProps {
    confirmButtonState: ConfirmButtonTransitionState;
    countries: ShopInfo_shop_countries[];
    initial: string[];
    open: boolean;
    onClose: () => void;
    onConfirm: (data: FormData) => void;
}

const useStyles = makeStyles(
    (theme) => ({
        checkboxCell: {
            paddingLeft: 0,
        },
        containerTitle: {
            padding: theme.spacing(1.25, 0),
        },
        container: {
            maxHeight: 500,
            paddingTop: 0,
            marginBottom: theme.spacing(3),
        },
        heading: {
            marginBottom: theme.spacing(1),
            marginTop: theme.spacing(2),
        },
        wideCell: {
            width: "100%",
        },
    }),
    { name: "DiscountCountrySelectDialog" }
);
const DiscountCountrySelectDialog: React.FC<DiscountCountrySelectDialogProps> = (props) => {
    const { confirmButtonState, onClose, countries, open, initial, onConfirm } = props;
    const classes = useStyles(props);

    const intl = useIntl();

    const initialForm: FormData = {
        allCountries: true,
        countries: initial,
        query: "",
    };
    return (
        <Dialog onClose={onClose} open={open} fullWidth maxWidth="sm">
            <Form initial={initialForm} onSubmit={onConfirm}>
                {({ data, change }) => {
                    const countrySelectionMap = countries.reduce((acc, country) => {
                        acc[country.code] = !!data.countries.find(
                            (selectedCountries) => selectedCountries === country.code
                        );
                        return acc;
                    }, {});

                    return (
                        <>
                            <DialogTitle>
                                <FormattedMessage
                                    defaultMessage="Assign Countries"
                                    id="cvVIV/"
                                    description="dialog header"
                                />
                            </DialogTitle>
                            <DialogContent>
                                <Typography>
                                    <FormattedMessage
                                        defaultMessage="Choose countries, you want voucher to be limited to, from the list below"
                                        id="dWK/Ck"
                                    />
                                </Typography>
                                <FormSpacer />
                                <TextField
                                    name="query"
                                    value={data.query}
                                    onChange={(event) => change(event, () => fetch(data.query))}
                                    label={intl.formatMessage({
                                        defaultMessage: "Filter Countries",
                                        id: "8EGagh",
                                        description: "search box label",
                                    })}
                                    placeholder={intl.formatMessage({
                                        defaultMessage: "Search by country name",
                                        id: "dGqEJ9",
                                        description: "search box placeholder",
                                    })}
                                    fullWidth
                                />
                            </DialogContent>
                            <Hr />

                            <DialogContent className={classes.containerTitle}>
                                <Typography className={classes.heading} variant="subtitle1">
                                    <FormattedMessage
                                        defaultMessage="Countries A to Z"
                                        id="wgA48T"
                                        description="country selection"
                                    />
                                </Typography>
                            </DialogContent>
                            <DialogContent className={classes.container}>
                                <ResponsiveTable>
                                    <TableBody>
                                        {filter(countries, data.query, {
                                            key: "country",
                                        }).map((country) => {
                                            const isChecked = countrySelectionMap[country.code];

                                            return (
                                                <TableRow key={country.code}>
                                                    <TableCell className={classes.wideCell}>
                                                        {country.country}
                                                    </TableCell>
                                                    <TableCell
                                                        padding="checkbox"
                                                        className={classes.checkboxCell}
                                                    >
                                                        <Checkbox
                                                            checked={isChecked}
                                                            onChange={() =>
                                                                isChecked
                                                                    ? change({
                                                                          target: {
                                                                              name: "countries" as keyof FormData,
                                                                              value: data.countries.filter(
                                                                                  (selectedCountries) =>
                                                                                      selectedCountries !==
                                                                                      country.code
                                                                              ),
                                                                          },
                                                                      } as any)
                                                                    : change({
                                                                          target: {
                                                                              name: "countries" as keyof FormData,
                                                                              value: [
                                                                                  ...data.countries,
                                                                                  country.code,
                                                                              ],
                                                                          },
                                                                      } as any)
                                                            }
                                                        />
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </ResponsiveTable>
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
                                    <FormattedMessage
                                        defaultMessage="Assign countries"
                                        id="zZCCqz"
                                        description="button"
                                    />
                                </ConfirmButton>
                            </DialogActions>
                        </>
                    );
                }}
            </Form>
        </Dialog>
    );
};

DiscountCountrySelectDialog.displayName = "DiscountCountrySelectDialog";

export default DiscountCountrySelectDialog;
