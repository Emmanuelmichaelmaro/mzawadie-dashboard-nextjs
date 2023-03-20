/* eslint-disable react/no-array-index-key */
import {
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TableBody,
    TableCell,
    TableRow,
    TextField,
    Typography,
} from "@material-ui/core";
import { Checkbox } from "@mzawadie/components/Checkbox";
import { ConfirmButton, ConfirmButtonTransitionState } from "@mzawadie/components/ConfirmButton";
import { ResponsiveTable } from "@mzawadie/components/ResponsiveTable";
import { FetchMoreProps, buttonMessages, maybe, renderCollection } from "@mzawadie/core";
import { AvailableAttributeFragment } from "@mzawadie/graphql";
import useElementScroll, { isScrolledToBottom } from "@mzawadie/hooks/useElementScroll";
import { useModalDialogErrors } from "@mzawadie/hooks/useModalDialogErrors";
import { useModalDialogOpen } from "@mzawadie/hooks/useModalDialogOpen";
import useSearchQuery from "@mzawadie/hooks/useSearchQuery";
import { makeStyles } from "@saleor/macaw-ui";
import classNames from "classnames";
import React from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { FormattedMessage, useIntl } from "react-intl";

const useStyles = makeStyles(
    (theme) => ({
        actions: {
            boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
        },
        checkboxCell: {
            paddingLeft: 0,
        },
        dropShadow: {
            boxShadow: `0px -5px 10px 0px ${theme.palette.divider}`,
        },
        loadMoreLoaderContainer: {
            alignItems: "center",
            display: "flex",
            height: theme.spacing(3),
            justifyContent: "center",
        },
        searchArea: {
            marginBottom: theme.spacing(3),
            overflowY: "hidden",
            paddingBottom: theme.spacing(6),
        },
        scrollArea: {
            overflowY: "scroll",
            paddingTop: 0,
            marginBottom: theme.spacing(3),
        },
        wideCell: {
            width: "100%",
        },
    }),
    { name: "AssignAttributeDialog" }
);

export interface AssignAttributeDialogProps extends FetchMoreProps {
    confirmButtonState: ConfirmButtonTransitionState;
    errors: string[];
    open: boolean;
    attributes: AvailableAttributeFragment[];
    selected: string[];
    onClose: () => void;
    onFetch: (query: string) => void;
    onOpen: () => void;
    onSubmit: () => void;
    onToggle: (id: string) => void;
}

const scrollableTargetId = "assignAttributeScrollableDialog";

const AssignAttributeDialog: React.FC<AssignAttributeDialogProps> = ({
    attributes,
    confirmButtonState,
    errors: apiErrors,
    hasMore,
    loading,
    open,
    selected,
    onClose,
    onFetch,
    onFetchMore,
    onOpen,
    onSubmit,
    onToggle,
}: AssignAttributeDialogProps) => {
    const intl = useIntl();
    const classes = useStyles({});
    const [query, onQueryChange, resetQuery] = useSearchQuery(onFetch);
    const errors = useModalDialogErrors(apiErrors, open);
    const anchor = React.useRef(null);
    const position = useElementScroll(anchor);

    useModalDialogOpen(open, {
        onClose: resetQuery,
        onOpen,
    });

    return (
        <Dialog onClose={onClose} open={open} fullWidth maxWidth="sm">
            <DialogTitle>
                <FormattedMessage
                    defaultMessage="Assign Attribute"
                    id="QM9P8G"
                    description="dialog header"
                />
            </DialogTitle>
            <DialogContent className={classes.searchArea}>
                <TextField
                    name="query"
                    value={query}
                    onChange={onQueryChange}
                    label={intl.formatMessage({
                        defaultMessage: "Search Attributes",
                        id: "mYs7O2",
                    })}
                    placeholder={intl.formatMessage({
                        defaultMessage: "Search by attribute name",
                        id: "9kzAW9",
                    })}
                    fullWidth
                    InputProps={{
                        autoComplete: "off",
                        endAdornment: loading && <CircularProgress size={16} />,
                    }}
                />
            </DialogContent>
            <DialogContent className={classes.scrollArea} ref={anchor} id={scrollableTargetId}>
                <InfiniteScroll
                    dataLength={attributes?.length}
                    next={onFetchMore}
                    hasMore={hasMore}
                    scrollThreshold="100px"
                    loader={
                        <div className={classes.loadMoreLoaderContainer}>
                            <CircularProgress size={16} />
                        </div>
                    }
                    scrollableTarget={scrollableTargetId}
                >
                    <ResponsiveTable key="table">
                        <TableBody>
                            {renderCollection(
                                attributes,
                                (attribute) => {
                                    if (!attribute) {
                                        return null;
                                    }
                                    const isChecked = !!selected.find(
                                        (selectedAttribute) => selectedAttribute === attribute.id
                                    );

                                    return (
                                        <TableRow key={maybe(() => attribute.id)}>
                                            <TableCell
                                                padding="checkbox"
                                                className={classes.checkboxCell}
                                            >
                                                <Checkbox
                                                    checked={isChecked}
                                                    onChange={() => onToggle(attribute.id)}
                                                />
                                            </TableCell>
                                            <TableCell className={classes.wideCell}>
                                                {attribute.name}
                                                <Typography variant="caption">
                                                    {attribute.slug}
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    );
                                },
                                () =>
                                    !loading && (
                                        <TableRow>
                                            <TableCell colSpan={2}>
                                                <FormattedMessage
                                                    defaultMessage="No results found"
                                                    id="hX5PAb"
                                                />
                                            </TableCell>
                                        </TableRow>
                                    )
                            )}
                        </TableBody>
                    </ResponsiveTable>
                </InfiniteScroll>
            </DialogContent>
            {errors.length > 0 && (
                <DialogContent>
                    {errors.map((error, errorIndex) => (
                        <DialogContentText color="error" key={errorIndex}>
                            {error}
                        </DialogContentText>
                    ))}
                </DialogContent>
            )}
            <DialogActions
                className={classNames(classes.actions, {
                    [classes.dropShadow]: !isScrolledToBottom(anchor, position),
                })}
            >
                <Button onClick={onClose}>
                    <FormattedMessage {...buttonMessages.back} />
                </Button>
                <ConfirmButton
                    transitionState={confirmButtonState}
                    color="primary"
                    variant="contained"
                    type="submit"
                    onClick={onSubmit}
                >
                    <FormattedMessage
                        defaultMessage="Assign attributes"
                        id="Oyu9jL"
                        description="button"
                    />
                </ConfirmButton>
            </DialogActions>
        </Dialog>
    );
};

AssignAttributeDialog.displayName = "AssignAttributeDialog";

export default AssignAttributeDialog;
