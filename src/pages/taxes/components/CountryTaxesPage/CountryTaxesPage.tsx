// @ts-nocheck
import { Card, TableBody, TableCell, TableHead, TableRow } from "@material-ui/core";
import { Container } from "@mzawadie/components/Container";
import { Grid } from "@mzawadie/components/Grid";
import { PageHeader } from "@mzawadie/components/PageHeader";
import { ResponsiveTable } from "@mzawadie/components/ResponsiveTable";
import Skeleton from "@mzawadie/components/Skeleton";
import { sectionNames, maybe, renderCollection } from "@mzawadie/core";
import { Backlink, makeStyles } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { CountryList_shop_countries_vat_reducedRates } from "../../types/CountryList";

const useStyles = makeStyles(
    {
        wideColumn: {
            width: "80%",
        },
    },
    { name: "CountryTaxesPage" }
);

export interface CountryTaxesPageProps {
    countryName: string;
    taxCategories: CountryList_shop_countries_vat_reducedRates[];
    onBack: () => void;
}

const CountryTaxesPage: React.FC<CountryTaxesPageProps> = (props) => {
    const { countryName, taxCategories, onBack } = props;

    const classes = useStyles(props);
    const intl = useIntl();

    return (
        <Container>
            <Backlink onClick={onBack}>{intl.formatMessage(sectionNames.taxes)}</Backlink>
            <PageHeader
                title={
                    countryName
                        ? intl.formatMessage(
                              {
                                  defaultMessage: "Tax Rates in {countryName}",
                                  id: "QHB48n",
                                  description: "header",
                              },
                              {
                                  countryName,
                              }
                          )
                        : undefined
                }
            />
            <Grid>
                <div>
                    <Card>
                        <ResponsiveTable>
                            <TableHead>
                                <TableRow>
                                    <TableCell className={classes.wideColumn}>
                                        <FormattedMessage defaultMessage="Category" id="ccXLVi" />
                                    </TableCell>
                                    <TableCell>
                                        <FormattedMessage defaultMessage="Tax Rate" id="la9cZ4" />
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {renderCollection(
                                    taxCategories,
                                    (taxCategory) => (
                                        <TableRow key={taxCategory ? taxCategory.rateType : "skeleton"}>
                                            <TableCell>
                                                {taxCategory?.rateType ?? <Skeleton />}
                                            </TableCell>
                                            <TableCell>
                                                {maybe<React.ReactNode>(
                                                    () => taxCategory.rate,
                                                    <Skeleton />
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ),
                                    () => (
                                        <TableRow>
                                            <TableCell colSpan={2}>
                                                <FormattedMessage
                                                    defaultMessage="No reduced tax categories found"
                                                    id="Ubath+"
                                                />
                                            </TableCell>
                                        </TableRow>
                                    )
                                )}
                            </TableBody>
                        </ResponsiveTable>
                    </Card>
                </div>
            </Grid>
        </Container>
    );
};

CountryTaxesPage.displayName = "CountryTaxesPage";

export default CountryTaxesPage;
