/* eslint-disable react-hooks/exhaustive-deps,react/no-array-index-key */
// @ts-nocheck
import emptyMetadata from "@assets/images/empty-metadata.svg";
import {
    Button,
    Card,
    CardActions,
    CardContent,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from "@material-ui/core";
import ToggleIcon from "@material-ui/icons/ArrowDropDown";
import DeleteIcon from "@material-ui/icons/Delete";
import { FormChange } from "@mzawadie/hooks/useForm";
import { MetadataInput } from "@mzawadie/types/globalTypes";
import React, { useEffect } from "react";
import SVG from "react-inlinesvg";
import { FormattedMessage, useIntl } from "react-intl";

import CardTitle from "../CardTitle";
import Skeleton from "../Skeleton";
import useStyles from "./styles";
import { EventDataAction, EventDataField } from "./types";

export interface MetadataCardProps {
    data: MetadataInput[];
    isPrivate: boolean;
    onChange: FormChange;
}

export const nameSeparator = ":";
export const nameInputPrefix = EventDataField.name;
export const valueInputPrefix = EventDataField.value;

const MetadataCard: React.FC<MetadataCardProps> = ({ data, isPrivate, onChange }) => {
    const intl = useIntl();
    const loaded = React.useRef(false);
    const [expanded, setExpanded] = React.useState(true);
    const classes = useStyles({});

    useEffect(() => {
        if (data !== undefined) {
            loaded.current = true;
            if (data.length > 0) {
                setExpanded(false);
            }
        }
    }, [data === undefined]);

    return (
        <Card data-test="metadataEditor" data-test-is-private={isPrivate} data-test-expanded={expanded}>
            <CardTitle
                title={
                    isPrivate
                        ? intl.formatMessage({
                              defaultMessage: "Private Metadata",
                              id: "ETHnjq",
                              description: "header",
                          })
                        : intl.formatMessage({
                              defaultMessage: "Metadata",
                              id: "VcI+Zh",
                              description: "header",
                          })
                }
            />
            {data === undefined ? (
                <CardContent>
                    <Skeleton />
                </CardContent>
            ) : (
                <>
                    <CardContent className={classes.content}>
                        {data.length > 0 && (
                            <div className={classes.togglable}>
                                <Typography color="textSecondary" variant="body2">
                                    <FormattedMessage
                                        defaultMessage="{number,plural,one{{number} Field} other{{number} Fields}}"
                                        id="cSbZKV"
                                        description="number of metadata fields in model"
                                        values={{
                                            number: data.length,
                                        }}
                                    />
                                </Typography>
                                <IconButton data-test="expand" onClick={() => setExpanded(!expanded)}>
                                    <ToggleIcon />
                                </IconButton>
                            </div>
                        )}
                    </CardContent>
                    {expanded && (
                        <>
                            {data.length === 0 ? (
                                <div className={classes.emptyContainer}>
                                    <SVG className={classes.emptyImage} src={emptyMetadata} />
                                    <Typography color="textSecondary">
                                        {isPrivate ? (
                                            <FormattedMessage
                                                defaultMessage="There is no private metadata created for this element."
                                                id="CqestX"
                                                description="empty metadata text"
                                            />
                                        ) : (
                                            <FormattedMessage
                                                defaultMessage="There is no metadata created for this element."
                                                id="MEajfd"
                                                description="empty metadata text"
                                            />
                                        )}
                                    </Typography>
                                    <Typography color="textSecondary">
                                        <FormattedMessage
                                            defaultMessage="Use the button below to add new metadata field"
                                            id="BM+zfY"
                                            description="empty metadata text"
                                        />
                                    </Typography>
                                </div>
                            ) : (
                                <Table className={classes.table}>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell className={classes.colNameHeader}>
                                                <FormattedMessage
                                                    defaultMessage="Field"
                                                    id="nudPsY"
                                                    description="metadata field name, header"
                                                />
                                            </TableCell>
                                            <TableCell className={classes.colValue}>
                                                <FormattedMessage
                                                    defaultMessage="Value"
                                                    id="LkuDEb"
                                                    description="metadata field value, header"
                                                />
                                            </TableCell>
                                            <TableCell className={classes.colActionHeader}>
                                                <FormattedMessage
                                                    defaultMessage="Actions"
                                                    id="nEixpu"
                                                    description="table action"
                                                />
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {data.map((field, fieldIndex) => (
                                            <TableRow data-test="field" key={fieldIndex}>
                                                <TableCell className={classes.colName}>
                                                    <TextField
                                                        InputProps={{
                                                            classes: {
                                                                input: classes.nameInput,
                                                            },
                                                        }}
                                                        name={`${nameInputPrefix}${nameSeparator}${fieldIndex}`}
                                                        fullWidth
                                                        onChange={onChange}
                                                        value={field.key}
                                                    />
                                                </TableCell>
                                                <TableCell className={classes.colValue}>
                                                    <TextField
                                                        InputProps={{
                                                            classes: {
                                                                root: classes.input,
                                                            },
                                                        }}
                                                        multiline
                                                        name={`${valueInputPrefix}${nameSeparator}${fieldIndex}`}
                                                        fullWidth
                                                        onChange={onChange}
                                                        value={field.value}
                                                    />
                                                </TableCell>
                                                <TableCell className={classes.colAction}>
                                                    <IconButton
                                                        color="primary"
                                                        data-test="deleteField"
                                                        data-test-id={fieldIndex}
                                                        onClick={() =>
                                                            onChange({
                                                                target: {
                                                                    name: EventDataAction.delete,
                                                                    value: fieldIndex,
                                                                },
                                                            })
                                                        }
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
                            <CardActions>
                                <Button
                                    color="primary"
                                    data-test="addField"
                                    onClick={() =>
                                        onChange({
                                            target: {
                                                name: EventDataAction.add,
                                                value: null,
                                            },
                                        })
                                    }
                                >
                                    <FormattedMessage
                                        defaultMessage="Add Field"
                                        id="GiDxS4"
                                        description="add metadata field,button"
                                    />
                                </Button>
                            </CardActions>
                        </>
                    )}
                </>
            )}
        </Card>
    );
};

MetadataCard.displayName = "MetadataCard";

export default MetadataCard;
