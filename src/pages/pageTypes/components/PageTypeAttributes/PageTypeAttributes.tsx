// @ts-nocheck
import { Button, Card, IconButton, TableCell, TableRow } from "@material-ui/core";
import { CardTitle } from "@mzawadie/components/CardTitle";
import { Checkbox } from "@mzawadie/components/Checkbox";
import { ResponsiveTable } from "@mzawadie/components/ResponsiveTable";
import Skeleton from "@mzawadie/components/Skeleton";
import { SortableTableBody, SortableTableRow } from "@mzawadie/components/SortableTable";
import { TableHead } from "@mzawadie/components/TableHead";
import { renderCollection, stopPropagation, ListActions, ReorderAction } from "@mzawadie/core";
import { PageTypeDetails_pageType_attributes } from "@mzawadie/pages/pageTypes/types/PageTypeDetails";
import { AttributeTypeEnum } from "@mzawadie/types/globalTypes";
import { DeleteIcon, makeStyles } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

const useStyles = makeStyles(
    {
        colAction: {
            "&:last-child": {
                paddingRight: 0,
            },
            width: 80,
        },
        colGrab: {
            width: 60,
        },
        colName: {},
        colSlug: {
            width: 300,
        },
        link: {
            cursor: "pointer",
        },
        textLeft: {
            textAlign: "left",
        },
    },
    { name: "PageTypeAttributes" }
);

interface PageTypeAttributesProps extends ListActions {
    attributes: PageTypeDetails_pageType_attributes[];
    disabled: boolean;
    type: string;
    onAttributeAssign: (type: AttributeTypeEnum) => void;
    onAttributeClick: (id: string) => void;
    onAttributeReorder: ReorderAction;
    onAttributeUnassign: (id: string) => void;
}

const numberOfColumns = 5;

const PageTypeAttributes: React.FC<PageTypeAttributesProps> = (props) => {
    const {
        attributes,
        disabled,
        isChecked,
        selected,
        toggle,
        toggleAll,
        toolbar,
        type,
        onAttributeAssign,
        onAttributeClick,
        onAttributeReorder,
        onAttributeUnassign,
    } = props;
    const classes = useStyles(props);

    const intl = useIntl();

    return (
        <Card data-test="page-attributes">
            <CardTitle
                title={intl.formatMessage({
                    defaultMessage: "Content Attributes",
                    id: "iQxjow",
                    description: "section header",
                })}
                toolbar={
                    <Button
                        color="primary"
                        variant="text"
                        onClick={() => onAttributeAssign(AttributeTypeEnum[type])}
                        data-test-id="assignAttributes"
                    >
                        <FormattedMessage
                            defaultMessage="Assign attribute"
                            id="uxPpRx"
                            description="button"
                        />
                    </Button>
                }
            />
            <ResponsiveTable>
                <colgroup>
                    <col className={classes.colGrab} />
                    <col />
                    <col className={classes.colName} />
                    <col className={classes.colSlug} />
                    <col className={classes.colAction} />
                </colgroup>
                {attributes?.length > 0 && (
                    <TableHead
                        colSpan={numberOfColumns}
                        disabled={disabled}
                        dragRows
                        selected={selected}
                        items={attributes}
                        toggleAll={toggleAll}
                        toolbar={toolbar}
                    >
                        <TableCell className={classes.colName}>
                            <FormattedMessage defaultMessage="Attribute name" id="kTr2o8" />
                        </TableCell>
                        <TableCell className={classes.colName}>
                            <FormattedMessage
                                defaultMessage="Slug"
                                id="nf3XSt"
                                description="attribute internal name"
                            />
                        </TableCell>
                        <TableCell />
                    </TableHead>
                )}
                <SortableTableBody onSortEnd={onAttributeReorder}>
                    {renderCollection(
                        attributes,
                        (attribute, attributeIndex) => {
                            const isSelected = attribute ? isChecked(attribute.id) : false;

                            return (
                                <SortableTableRow
                                    selected={isSelected}
                                    className={attribute ? classes.link : undefined}
                                    hover={!!attribute}
                                    onClick={
                                        attribute ? () => onAttributeClick(attribute.id) : undefined
                                    }
                                    key={attribute?.id}
                                    index={attributeIndex || 0}
                                    data-test="id"
                                    data-test-id={attribute?.id}
                                >
                                    <TableCell padding="checkbox">
                                        <Checkbox
                                            checked={isSelected}
                                            disabled={disabled}
                                            disableClickPropagation
                                            onChange={() => toggle(attribute.id)}
                                        />
                                    </TableCell>
                                    <TableCell className={classes.colName} data-test="name">
                                        {attribute?.name || <Skeleton />}
                                    </TableCell>
                                    <TableCell className={classes.colSlug} data-test="slug">
                                        {attribute?.slug || <Skeleton />}
                                    </TableCell>
                                    <TableCell className={classes.colAction}>
                                        <IconButton
                                            onClick={stopPropagation(() =>
                                                onAttributeUnassign(attribute.id)
                                            )}
                                        >
                                            <DeleteIcon color="primary" />
                                        </IconButton>
                                    </TableCell>
                                </SortableTableRow>
                            );
                        },
                        () => (
                            <TableRow>
                                <TableCell colSpan={numberOfColumns}>
                                    <FormattedMessage
                                        defaultMessage="No attributes found"
                                        id="ztQgD8"
                                    />
                                </TableCell>
                            </TableRow>
                        )
                    )}
                </SortableTableBody>
            </ResponsiveTable>
        </Card>
    );
};

PageTypeAttributes.displayName = "PageTypeAttributes";

export default PageTypeAttributes;
