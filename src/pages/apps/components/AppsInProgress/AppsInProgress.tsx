import {
    Card,
    CircularProgress as Progress,
    TableBody,
    TableCell,
    TableRow,
    Tooltip,
    Typography,
} from "@material-ui/core";
import ErrorIcon from "@material-ui/icons/Error";
import { CardTitle } from "@mzawadie/components/CardTitle";
import { renderCollection, stopPropagation } from "@mzawadie/core";
import { JobStatusEnum } from "@mzawadie/types/globalTypes";
import { DeleteIcon, ResponsiveTable, Button, IconButton } from "@saleor/macaw-ui";
import classNames from "classnames";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { useStyles } from "../../styles";
import { AppsInstallations_appsInstallations } from "../../types/AppsInstallations";

export interface AppsInProgressProps {
    appsList: AppsInstallations_appsInstallations[];
    disabled: boolean;
    onAppInstallRetry: (id: string) => void;
    onRemove: (id: string) => void;
}

const AppsInProgress: React.FC<AppsInProgressProps> = ({
    appsList,
    disabled,
    onAppInstallRetry,
    onRemove,
    ...props
}) => {
    const intl = useIntl();
    const classes = useStyles(props);

    return (
        <Card>
            <CardTitle
                title={intl.formatMessage({
                    defaultMessage: "Ongoing Installations",
                    id: "nIrjSR",
                    description: "section header",
                })}
            />

            <ResponsiveTable>
                <TableBody>
                    {renderCollection(appsList, ({ status, appName, id, message }) => (
                        <TableRow key={id} className={classes.tableRow}>
                            <TableCell className={classes.colName}>
                                <span data-tc="name">{appName}</span>
                            </TableCell>

                            {status === JobStatusEnum.PENDING && (
                                <TableCell
                                    className={classNames(classes.colAction, classes.colInstallAction)}
                                >
                                    <Typography variant="body2" className={classes.text}>
                                        <FormattedMessage
                                            defaultMessage="Installing app..."
                                            id="1qRwgQ"
                                            description="app installation"
                                        />
                                    </Typography>
                                    <div className={classes.colSpinner}>
                                        <Progress size={20} />
                                    </div>
                                </TableCell>
                            )}

                            {status === JobStatusEnum.FAILED && (
                                <TableCell
                                    className={classNames(classes.colAction, classes.colInstallAction)}
                                >
                                    <Typography variant="body2" className={classes.error}>
                                        <FormattedMessage
                                            defaultMessage="There was a problem during installation"
                                            id="JufWFT"
                                            description="app installation error"
                                        />
                                        <Tooltip
                                            title={<Typography variant="body2">{message}</Typography>}
                                            classes={{
                                                tooltip: classes.customTooltip,
                                            }}
                                        >
                                            <ErrorIcon />
                                        </Tooltip>
                                    </Typography>

                                    <Button onClick={() => onAppInstallRetry(id)}>
                                        <FormattedMessage
                                            defaultMessage="Retry"
                                            id="+c/f61"
                                            description="retry installation"
                                        />
                                    </Button>

                                    <IconButton
                                        variant="secondary"
                                        color="primary"
                                        onClick={stopPropagation(() => onRemove(id))}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            )}
                        </TableRow>
                    ))}
                </TableBody>
            </ResponsiveTable>
        </Card>
    );
};

AppsInProgress.displayName = "AppsInProgress";

export default AppsInProgress;
