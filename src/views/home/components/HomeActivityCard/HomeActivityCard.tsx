import { Card, List, ListItem, ListItemText, Typography } from "@material-ui/core";
import CardTitle from "@mzawadie/components/CardTitle";
import DateTime from "@mzawadie/components/Date";
import Skeleton from "@mzawadie/components/Skeleton";
import { renderCollection } from "@mzawadie/core";
import { Home_activities_edges_node } from "@mzawadie/views/home/types/Home";
import { makeStyles } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { getActivityMessage } from "./activityMessages";

const useStyles = makeStyles(
    {
        loadingProducts: {
            paddingBottom: "10px",
            paddingTop: "10px",
        },
        noProducts: {
            paddingBottom: "16px",
            paddingTop: "16px",
        },
    },
    { name: "HomeActivityCard" }
);

interface HomeActivityCardProps {
    activities: Home_activities_edges_node[];
    testId?: string;
}

const HomeActivityCard: React.FC<HomeActivityCardProps> = (props) => {
    const { activities, testId } = props;
    const classes = useStyles(props);

    const intl = useIntl();

    return (
        <Card data-test-id={testId}>
            <CardTitle
                title={intl.formatMessage({
                    defaultMessage: "Activity",
                    description: "header",
                    id: "BXkF8Z",
                })}
            />

            <List dense>
                {renderCollection(
                    activities,
                    (activity, activityId) => (
                        <ListItem key={activityId}>
                            {activity ? (
                                <ListItemText
                                    primary={
                                        <Typography>{getActivityMessage(activity, intl)}</Typography>
                                    }
                                    secondary={<DateTime date={activity.date} />}
                                />
                            ) : (
                                <ListItemText className={classes.loadingProducts}>
                                    <Typography>
                                        <Skeleton />
                                    </Typography>
                                </ListItemText>
                            )}
                        </ListItem>
                    ),
                    () => (
                        <ListItem className={classes.noProducts}>
                            <ListItemText
                                primary={
                                    <Typography>
                                        <FormattedMessage
                                            defaultMessage="No activities found"
                                            id="wWTUrM"
                                        />
                                    </Typography>
                                }
                            />
                        </ListItem>
                    )
                )}
            </List>
        </Card>
    );
};

HomeActivityCard.displayName = "HomeActivityCard";

export default HomeActivityCard;
