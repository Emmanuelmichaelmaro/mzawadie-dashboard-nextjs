import { Button, Card, CardActions, CardContent } from "@material-ui/core";
import CardTitle from "@mzawadie/components/CardTitle";
import ControlledCheckbox from "@mzawadie/components/ControlledCheckbox";
import FormSpacer from "@mzawadie/components/FormSpacer";
import Hr from "@mzawadie/components/Hr";
import { sectionNames } from "@mzawadie/core";
import { makeStyles } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { FormData } from "../CountryListPage";

interface TaxConfigurationProps {
    data: FormData;
    disabled: boolean;
    onChange: (event: React.ChangeEvent<any>) => void;
    onTaxFetch: () => void;
}

const useStyles = makeStyles(
    {
        content: {
            paddingBottom: 0,
        },
    },
    { name: "TaxConfiguration" }
);

export const TaxConfiguration: React.FC<TaxConfigurationProps> = (props) => {
    const { data, disabled, onChange, onTaxFetch } = props;

    const classes = useStyles(props);
    const intl = useIntl();

    return (
        <Card>
            <CardTitle title={intl.formatMessage(sectionNames.configuration)} />
            <CardContent className={classes.content}>
                <ControlledCheckbox
                    name={"includeTax" as keyof FormData}
                    label={intl.formatMessage({
                        defaultMessage: "All products prices are entered with tax included",
                        id: "4EuJKs",
                    })}
                    checked={data.includeTax}
                    onChange={onChange}
                    disabled={disabled}
                />
                <FormSpacer />
                <ControlledCheckbox
                    name={"showGross" as keyof FormData}
                    label={intl.formatMessage({
                        defaultMessage: "Show gross prices to customers in the storefront",
                        id: "98isC5",
                    })}
                    checked={data.showGross}
                    onChange={onChange}
                    disabled={disabled}
                />
                <FormSpacer />
                <ControlledCheckbox
                    name={"chargeTaxesOnShipping" as keyof FormData}
                    label={intl.formatMessage({
                        defaultMessage: "Charge taxes on shipping rates",
                        id: "FNKhkx",
                    })}
                    checked={data.chargeTaxesOnShipping}
                    onChange={onChange}
                    disabled={disabled}
                />
                <FormSpacer />
            </CardContent>
            <Hr />
            <CardActions>
                <Button disabled={disabled} onClick={onTaxFetch} color="primary">
                    <FormattedMessage defaultMessage="Fetch taxes" id="+OV+Gj" description="button" />
                </Button>
            </CardActions>
        </Card>
    );
};

export default TaxConfiguration;
