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
import { Checkbox } from "@mzawadie/components/Checkbox";
import { ConfirmButton, ConfirmButtonTransitionState } from "@mzawadie/components/ConfirmButton";
import { Form } from "@mzawadie/components/Form";
import FormSpacer from "@mzawadie/components/FormSpacer";
import Hr from "@mzawadie/components/Hr";
import { ResponsiveTable } from "@mzawadie/components/ResponsiveTable";
import { buttonMessages } from "@mzawadie/core";
import { CountryWithCodeFragment } from "@mzawadie/graphql";
import { makeStyles } from "@saleor/macaw-ui";
import { filter } from "fuzzaldrin";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

interface FormData {
    countries: string[];
    query: string;
    restOfTheWorld: boolean;
}

export interface ShippingZoneCountriesAssignDialogProps {
    confirmButtonState: ConfirmButtonTransitionState;
    countries: CountryWithCodeFragment[];
    initial: string[];
    isDefault: boolean;
    open: boolean;
    onClose: () => void;
    onConfirm: (data: FormData) => void;
}

const useStyles = makeStyles(
    (theme) => ({
        checkboxCell: {
            paddingLeft: 0,
        },
        heading: {
            marginBottom: theme.spacing(2),
            marginTop: theme.spacing(2),
        },
        container: {
            padding: theme.spacing(1.25, 0),
        },
        scrollAreaContainer: {
            maxHeight: 400,
            padding: theme.spacing(1.25, 0),
            marginBottom: theme.spacing(3),
        },
        table: {
            border: `1px solid ${theme.palette.grey[200]}`,
        },
        wideCell: {
            width: "100%",
        },
    }),
    { name: "ShippingZoneCountriesAssignDialog" }
);
const ShippingZoneCountriesAssignDialog: React.FC<ShippingZoneCountriesAssignDialogProps> = (props) => {
    const { confirmButtonState, isDefault, onClose, countries, open, initial, onConfirm } = props;

    const classes = useStyles(props);
    const intl = useIntl();

    const initialForm: FormData = {
        countries: initial,
        query: "",
        restOfTheWorld: isDefault,
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
                                        defaultMessage="Choose countries you want to add to shipping zone from list below"
                                        id="WDTCZi"
                                    />
                                </Typography>
                                <FormSpacer />
                                <TextField
                                    name="query"
                                    value={data.query}
                                    onChange={(event) => change(event, () => fetch(data.query))}
                                    label={intl.formatMessage({
                                        defaultMessage: "Search Countries",
                                        id: "jBmHIr",
                                    })}
                                    placeholder={intl.formatMessage({
                                        defaultMessage: "Search by country name",
                                        id: "Im+6VU",
                                    })}
                                    fullWidth
                                />
                            </DialogContent>
                            <Hr />

                            <DialogContent className={classes.container}>
                                <Typography className={classes.heading} variant="subtitle1">
                                    <FormattedMessage defaultMessage="Quick Pick" id="HPEyPj" />
                                </Typography>
                                <ResponsiveTable className={classes.table}>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell className={classes.wideCell}>
                                                <FormattedMessage
                                                    defaultMessage="Rest of the World"
                                                    id="jKMIbC"
                                                />
                                                <Typography variant="caption">
                                                    <FormattedMessage
                                                        defaultMessage="If selected, this will add all of the countries not selected to other shipping zones"
                                                        id="6Sxp1x"
                                                    />
                                                </Typography>
                                            </TableCell>
                                            <TableCell
                                                padding="checkbox"
                                                className={classes.checkboxCell}
                                            >
                                                <Checkbox
                                                    checked={data.restOfTheWorld}
                                                    onChange={() =>
                                                        change({
                                                            target: {
                                                                name: "restOfTheWorld" as keyof FormData,
                                                                value: !data.restOfTheWorld,
                                                            },
                                                        } as any)
                                                    }
                                                />
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </ResponsiveTable>
                            </DialogContent>

                            <DialogContent className={classes.container}>
                                <Typography className={classes.heading} variant="subtitle1">
                                    <FormattedMessage
                                        defaultMessage="Countries A to Z"
                                        id="wgA48T"
                                        description="country selection"
                                    />
                                </Typography>
                            </DialogContent>

                            <DialogContent className={classes.scrollAreaContainer}>
                                <ResponsiveTable className={classes.table}>
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
ShippingZoneCountriesAssignDialog.displayName = "ShippingZoneCountriesAssignDialog";
export default ShippingZoneCountriesAssignDialog;
