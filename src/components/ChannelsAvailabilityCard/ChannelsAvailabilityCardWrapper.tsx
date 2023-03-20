// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { Button, Card, CardContent, Typography } from "@material-ui/core";
import { CardTitle } from "@mzawadie/components/CardTitle";
import Hr from "@mzawadie/components/Hr";
import RequirePermissions from "@mzawadie/components/RequirePermissions";
import { PermissionEnum } from "@mzawadie/graphql";
import { useUser } from "@mzawadie/pages/auth";
import React from "react";
import { useIntl } from "react-intl";

import { useStyles } from "./styles";

export interface ChannelsAvailabilityWrapperProps {
    selectedChannelsCount: number;
    allChannelsCount: number;
    children: React.ReactNode;
    managePermissions: PermissionEnum[];
    openModal: () => void;
}

export const ChannelsAvailabilityWrapper: React.FC<ChannelsAvailabilityWrapperProps> = (props) => {
    const { selectedChannelsCount, allChannelsCount, children, managePermissions, openModal } = props;
    const intl = useIntl();
    const classes = useStyles({});
    const { user } = useUser();
    const channelsAvailabilityText = intl.formatMessage(
        {
            defaultMessage:
                "Available at {selectedChannelsCount} out of {allChannelsCount, plural, one {# channel} other {# channels}}",
            id: "vY2lpx",

            description: "channels availability text",
        },
        {
            allChannelsCount,
            selectedChannelsCount,
        }
    );

    return (
        <>
            <Card>
                <CardTitle
                    title={intl.formatMessage({
                        defaultMessage: "Availability",
                        id: "5A6/2C",
                        description: "section header",
                    })}
                    toolbar={
                        <RequirePermissions
                            userPermissions={user?.userPermissions || []}
                            requiredPermissions={managePermissions}
                        >
                            <Button
                                color="primary"
                                onClick={openModal}
                                data-test-id="channels-availiability-manage-button"
                            >
                                {intl.formatMessage({
                                    defaultMessage: "Manage",
                                    id: "2i81/P",
                                    description: "section header button",
                                })}
                            </Button>
                        </RequirePermissions>
                    }
                />
                <CardContent className={classes.card}>
                    {!!channelsAvailabilityText && (
                        <>
                            <Typography className={classes.channelInfo}>
                                {channelsAvailabilityText}
                            </Typography>
                            <Hr className={classes.hr} />
                        </>
                    )}
                    {children}
                </CardContent>
            </Card>
        </>
    );
};

export default ChannelsAvailabilityWrapper;
