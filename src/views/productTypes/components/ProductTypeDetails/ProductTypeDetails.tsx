import { Card, CardContent, TextField } from "@material-ui/core";
import CardTitle from "@mzawadie/components/CardTitle";
import { UserError, commonMessages } from "@mzawadie/core";
import { getFieldError } from "@mzawadie/utils/errors";
import { makeStyles } from "@saleor/macaw-ui";
import React from "react";
import { useIntl } from "react-intl";

const useStyles = makeStyles(
    {
        root: {
            overflow: "visible",
        },
    },
    { name: "ProductTypeDetails" }
);

interface ProductTypeDetailsProps {
    data?: {
        name: string;
    };
    disabled: boolean;
    errors: UserError[];
    onChange: (event: React.ChangeEvent<any>) => void;
}

const ProductTypeDetails: React.FC<ProductTypeDetailsProps> = (props) => {
    const { data, disabled, errors, onChange } = props;
    const classes = useStyles(props);

    const intl = useIntl();

    return (
        <Card className={classes.root}>
            <CardTitle title={intl.formatMessage(commonMessages.generalInformations)} />
            <CardContent>
                <TextField
                    disabled={disabled}
                    error={!!getFieldError(errors, "name")}
                    fullWidth
                    helperText={getFieldError(errors, "name")?.message}
                    label={intl.formatMessage({
                        defaultMessage: "Product Type Name",
                        id: "Na3A0w",
                    })}
                    name="name"
                    onChange={onChange}
                    value={data?.name}
                />
            </CardContent>
        </Card>
    );
};

ProductTypeDetails.displayName = "ProductTypeDetails";

export default ProductTypeDetails;
