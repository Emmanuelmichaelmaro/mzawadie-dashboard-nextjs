import { Card } from "@material-ui/core";
import { CardTitle } from "@mzawadie/components/CardTitle";
import { sectionNames } from "@mzawadie/core";
import React from "react";
import { useIntl } from "react-intl";

import PluginDetailsChannelsCardContent, {
    PluginDetailsChannelsCardProps,
} from "./PluginDetailsChannelsCardContent";

const PluginDetailsChannelsCard: React.FC<PluginDetailsChannelsCardProps> = (props) => {
    const intl = useIntl();

    return (
        <Card>
            <CardTitle title={intl.formatMessage(sectionNames.channels)} />
            <PluginDetailsChannelsCardContent {...props} />
        </Card>
    );
};

export default PluginDetailsChannelsCard;
