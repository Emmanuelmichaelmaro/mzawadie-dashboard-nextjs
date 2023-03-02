import { Card, CardContent, Typography } from "@material-ui/core";
import { CardTitle } from "@mzawadie/components/CardTitle";
import ControlledCheckbox from "@mzawadie/components/ControlledCheckbox";
import FormSpacer from "@mzawadie/components/FormSpacer";
import Hr from "@mzawadie/components/Hr";
import { commonMessages } from "@mzawadie/core";
import { PluginErrorFragment } from "@mzawadie/fragments/types/PluginErrorFragment";
import { PluginErrorCode } from "@mzawadie/types/globalTypes";
import getPluginErrorMessage from "@mzawadie/utils/errors/plugins";
import { makeStyles } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { PluginDetailsPageFormData } from "../PluginsDetailsPage";

interface PluginInfoProps {
    data: PluginDetailsPageFormData;
    description: string;
    errors: PluginErrorFragment[];
    name: string;
    onChange: (event: React.ChangeEvent<any>) => void;
}

const useStyles = makeStyles(
    () => ({
        status: {
            paddingTop: 20,
        },
        title: {
            fontSize: 14,
            paddingTop: 10,
        },
    }),
    { name: "PluginInfo" }
);

const PluginInfo: React.FC<PluginInfoProps> = ({ data, description, errors, name, onChange }) => {
    const classes = useStyles({});
    const intl = useIntl();

    const misconfiguredError = errors.find((err) => err.code === PluginErrorCode.PLUGIN_MISCONFIGURED);

    return (
        <Card>
            <CardTitle
                title={intl.formatMessage({
                    defaultMessage: "Plugin Information and Status",
                    id: "w424P4",
                    description: "section header",
                })}
            />
            <CardContent>
                <Typography className={classes.title} variant="h6">
                    {intl.formatMessage({
                        defaultMessage: "Plugin Name",
                        id: "IUeGzv",
                        description: "plugin name",
                    })}
                </Typography>
                <Typography>{name}</Typography>
                {description && (
                    <>
                        <Typography className={classes.title} variant="h6">
                            <FormattedMessage {...commonMessages.description} />
                        </Typography>
                        <Typography>{description}</Typography>
                    </>
                )}
                <FormSpacer />
                <Hr />
                <Typography className={classes.status}>
                    {intl.formatMessage({
                        defaultMessage: "Status",
                        id: "bL/Wrc",
                        description: "plugin status",
                    })}
                </Typography>
                <ControlledCheckbox
                    name={"active" as keyof PluginDetailsPageFormData}
                    label={intl.formatMessage({
                        defaultMessage: "Set plugin as Active",
                        id: "ITdIcx",
                    })}
                    checked={data.active}
                    onChange={onChange}
                />
                {misconfiguredError && (
                    <Typography color="error">
                        {getPluginErrorMessage(misconfiguredError, intl)}
                    </Typography>
                )}
            </CardContent>
        </Card>
    );
};

PluginInfo.displayName = "PluginInfo";

export default PluginInfo;
