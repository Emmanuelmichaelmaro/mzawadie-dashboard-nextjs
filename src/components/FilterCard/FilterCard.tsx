/* eslint-disable react/prop-types */
import { Card, CardContent, CardHeader, IconButton } from "@material-ui/core";
import RefreshIcon from "@material-ui/icons/Refresh";
import React from "react";
import { useIntl } from "react-intl";

export interface FilterCardProps {
    handleClear(): any;
}

const FilterCard: React.FC<FilterCardProps> = ({ children, handleClear }) => {
    const intl = useIntl();

    return (
        <Card>
            <form>
                <CardHeader
                    action={
                        <IconButton onClick={handleClear}>
                            <RefreshIcon />
                        </IconButton>
                    }
                    title={intl.formatMessage({
                        defaultMessage: "Filters",
                        id: "zSOvI0",
                    })}
                />

                <CardContent>{children}</CardContent>
            </form>
        </Card>
    );
};

FilterCard.displayName = "FilterCard";

export default FilterCard;
