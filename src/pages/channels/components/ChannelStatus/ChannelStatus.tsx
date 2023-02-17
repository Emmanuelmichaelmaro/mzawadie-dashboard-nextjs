import { Card, CardContent, Typography } from "@material-ui/core";
import { CardTitle } from "@mzawadie/components/CardTitle";
import { Button } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { useStyles } from "../styles";

export interface ChannelStatusProps {
    isActive: boolean;
    disabled: boolean;
    updateChannelStatus: () => void;
}

export const ChannelStatus: React.FC<ChannelStatusProps> = ({
    disabled,
    isActive,
    updateChannelStatus,
}) => {
    const intl = useIntl();
    const classes = useStyles({});

    return (
        <Card>
            <CardTitle
                title={intl.formatMessage({
                    defaultMessage: "Channel Status",
                    id: "TSJRiZ",
                    description: "channel status title",
                })}
            />

            <CardContent>
                <Typography variant="caption" className={classes.label}>
                    <FormattedMessage defaultMessage="Status" id="+tIkAe" description="status" />
                </Typography>

                <Typography>
                    {isActive ? (
                        <FormattedMessage defaultMessage="Active" id="QiN4hv" description="active" />
                    ) : (
                        <FormattedMessage
                            defaultMessage="Inactive"
                            id="X8qjg3"
                            description="inactive"
                        />
                    )}
                </Typography>

                <Button
                    className={classes.activeBtn}
                    disabled={disabled}
                    onClick={() => updateChannelStatus()}
                >
                    {isActive ? (
                        <FormattedMessage
                            defaultMessage="Deactivate"
                            id="MHVglr"
                            description="deactivate"
                        />
                    ) : (
                        <FormattedMessage
                            defaultMessage="Activate"
                            id="MQwT1W"
                            description="activate"
                        />
                    )}
                </Button>
            </CardContent>
        </Card>
    );
};

ChannelStatus.displayName = "ChannelStatus";

export default ChannelStatus;
