// @ts-nocheck
import {
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
import BackButton from "@mzawadie/components/BackButton";
import { Checkbox } from "@mzawadie/components/Checkbox";
import { ConfirmButton } from "@mzawadie/components/ConfirmButton";
import { Form } from "@mzawadie/components/Form";
import FormSpacer from "@mzawadie/components/FormSpacer";
import Hr from "@mzawadie/components/Hr";
import { ResponsiveTable } from "@mzawadie/components/ResponsiveTable";
import { CountryWithCodeFragment } from "@mzawadie/graphql";
import { SubmitPromise } from "@mzawadie/hooks/useForm";
import useScrollableDialogStyle from "@mzawadie/styles/useScrollableDialogStyle";
import { ConfirmButtonTransitionState } from "@saleor/macaw-ui";
import { filter } from "fuzzaldrin";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { useStyles } from "./styles";

interface FormData {
    allCountries: boolean;
    countries: string[];
    query: string;
}

export interface DiscountCountrySelectDialogProps {
    confirmButtonState: ConfirmButtonTransitionState;
    countries: CountryWithCodeFragment[];
    initial: string[];
    open: boolean;
    onClose: () => void;
    onConfirm: (data: FormData) => SubmitPromise;
}

const DiscountCountrySelectDialog: React.FC<DiscountCountrySelectDialogProps> = (props) => {
    const { confirmButtonState, onClose, countries, open, initial, onConfirm } = props;
    const classes = useStyles(props);
    const scrollableDialogClasses = useScrollableDialogStyle();

    const intl = useIntl();

    const initialForm: FormData = {
        allCountries: true,
        countries: initial,
        query: "",
    };
    return (
        <Dialog onClose={onClose} open={open} fullWidth maxWidth="sm">
            <Form initial={initialForm} onSubmit={onConfirm} className={scrollableDialogClasses.form}>
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
                                    onChange={(event) =>
                                        change(event /* TO BE CHECKED: () => fetch(data.query)*/)
                                    }
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
                                <FormSpacer />
                                <Hr />
                                <FormSpacer />
                                <Typography variant="subtitle1">
                                    <FormattedMessage
                                        defaultMessage="Countries A to Z"
                                        id="wgA48T"
                                        description="country selection"
                                    />
                                </Typography>
                            </DialogContent>
                            <DialogContent className={scrollableDialogClasses.scrollArea}>
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
                                <BackButton onClick={onClose} />
                                <ConfirmButton transitionState={confirmButtonState} type="submit">
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
