import { Button, Typography } from "@material-ui/core";
import { buttonMessages } from "@mzawadie/core";
import { makeStyles } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage } from "react-intl";

const useStyles = makeStyles(
    (theme) => ({
        container: {
            alignItems: "center",
            display: "flex",
            justifyContent: "space-between",
            padding: theme.spacing(1, 3),
        },
        clear: {
            marginRight: theme.spacing(1),
        },
        label: {
            fontWeight: 600,
        },
    }),
    { name: "FilterContentHeader" }
);

interface FilterContentHeaderProps {
    onClear: () => void;
}

const FilterContentHeader: React.FC<FilterContentHeaderProps> = ({ onClear }: any) => {
    const classes = useStyles({});

    return (
        <div className={classes.container}>
            <Typography className={classes.label}>
                <FormattedMessage defaultMessage="Filters" id="zSOvI0" />
            </Typography>

            <div>
                <Button data-test="clear" className={classes.clear} onClick={onClear}>
                    <FormattedMessage {...buttonMessages.clear} />
                </Button>
                <Button data-test="submit" color="primary" variant="contained" type="submit">
                    <FormattedMessage {...buttonMessages.done} />
                </Button>
            </div>
        </div>
    );
};

export default FilterContentHeader;
