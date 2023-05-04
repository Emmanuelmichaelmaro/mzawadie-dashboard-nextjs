// @ts-nocheck
import { Card, TableBody, TableCell, TableHead, TableRow } from "@material-ui/core";
import { Backlink } from "@mzawadie/components/Backlink";
import { Container } from "@mzawadie/components/Container";
import { Grid } from "@mzawadie/components/Grid";
import { PageHeader } from "@mzawadie/components/PageHeader";
import { ResponsiveTable } from "@mzawadie/components/ResponsiveTable";
import Skeleton from "@mzawadie/components/Skeleton";
import { sectionNames } from "@mzawadie/core";
import { maybe, renderCollection } from "@mzawadie/core";
import { CountryListQuery } from "@mzawadie/graphql";
import { countryListUrl } from "@mzawadie/pages/taxes/urls";
import { makeStyles } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

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
    taxCategories: CountryListQuery["shop"]["countries"][0]["vat"]["reducedRates"];
}

const CountryTaxesPage: React.FC<CountryTaxesPageProps> = (props) => {
    const { countryName, taxCategories } = props;

    const classes = useStyles(props);
    
    const intl = useIntl();

    return (
        <Container>
            <Backlink href={countryListUrl}>{intl.formatMessage(sectionNames.taxes)}</Backlink>
            
            <PageHeader
                title={
                    countryName
                        ? intl.formatMessage(
                              {
                                  id: "QHB48n",
                                  defaultMessage: "Tax Rates in {countryName}",
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
                                        <FormattedMessage id="ccXLVi" defaultMessage="Category" />
                                    </TableCell>
                    
                                    <TableCell>
                                        <FormattedMessage id="la9cZ4" defaultMessage="Tax Rate" />
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
                                                    () => taxCategory?.rate,
                                                    <Skeleton />
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ),
                                    () => (
                                        <TableRow>
                                            <TableCell colSpan={2}>
                                                <FormattedMessage
                                                    id="Ubath+"
                                                    defaultMessage="No reduced tax categories found"
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
