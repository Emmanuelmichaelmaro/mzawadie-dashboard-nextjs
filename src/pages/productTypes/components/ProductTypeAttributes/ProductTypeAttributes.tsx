// @ts-nocheck
import { Card, TableCell, TableRow } from "@material-ui/core";
import { CardTitle } from "@mzawadie/components/CardTitle";
import { Checkbox } from "@mzawadie/components/Checkbox";
import { ResponsiveTable } from "@mzawadie/components/ResponsiveTable";
import Skeleton from "@mzawadie/components/Skeleton";
import { SortableTableBody, SortableTableRow } from "@mzawadie/components/SortableTable";
import { TableHead } from "@mzawadie/components/TableHead";
import { ListActions, ReorderAction, maybe, renderCollection, stopPropagation } from "@mzawadie/core";
import { ProductAttributeType } from "@mzawadie/types/globalTypes";
import { Button, DeleteIcon, IconButton, makeStyles } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import {
    ProductTypeDetails_productType_productAttributes,
    ProductTypeDetails_productType_variantAttributes,
} from "../../types/ProductTypeDetails";

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
    { name: "ProductTypeAttributes" }
);

interface ProductTypeAttributesProps extends ListActions {
    attributes:
        | ProductTypeDetails_productType_productAttributes[]
        | ProductTypeDetails_productType_variantAttributes[];
    disabled: boolean;
    type: string;
    testId?: string;
    onAttributeAssign: (type: ProductAttributeType) => void;
    onAttributeClick: (id: string) => void;
    onAttributeReorder: ReorderAction;
    onAttributeUnassign: (id: string) => void;
}

const numberOfColumns = 5;

const ProductTypeAttributes: React.FC<ProductTypeAttributesProps> = (props) => {
    const {
        attributes,

        disabled,
        isChecked,
        selected,
        toggle,
        toggleAll,
        toolbar,
        type,
        testId,
        onAttributeAssign,
        onAttributeClick,
        onAttributeReorder,
        onAttributeUnassign,
    } = props;
    const classes = useStyles(props);

    const intl = useIntl();

    return (
        <Card
            data-test={
                type === ProductAttributeType.PRODUCT ? "product-attributes" : "variant-attributes"
            }
        >
            <CardTitle
                title={
                    type === ProductAttributeType.PRODUCT
                        ? intl.formatMessage({
                              defaultMessage: "Product Attributes",
                              id: "9scTQ0",
                              description: "section header",
                          })
                        : intl.formatMessage({
                              defaultMessage: "Variant Attributes",
                              id: "skEK/i",
                              description: "section header",
                          })
                }
                toolbar={
                    <Button
                        data-test-id={testId}
                        color="primary"
                        variant="text"
                        onClick={() => onAttributeAssign(ProductAttributeType[type])}
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
                                    key={maybe(() => attribute?.id)}
                                    index={attributeIndex || 0}
                                    data-test="id"
                                    data-test-id={maybe(() => attribute?.id)}
                                >
                                    <TableCell padding="checkbox">
                                        <Checkbox
                                            checked={isSelected}
                                            disabled={disabled}
                                            disableClickPropagation
                                            onChange={() => toggle(attribute?.id)}
                                        />
                                    </TableCell>
                                    <TableCell className={classes.colName} data-test="name">
                                        {maybe(() => attribute?.name) ? attribute?.name : <Skeleton />}
                                    </TableCell>
                                    <TableCell className={classes.colSlug} data-test="slug">
                                        {maybe(() => attribute?.slug) ? attribute?.slug : <Skeleton />}
                                    </TableCell>
                                    <TableCell className={classes.colAction}>
                                        <IconButton
                                            onClick={stopPropagation(() =>
                                                onAttributeUnassign(attribute?.id)
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

ProductTypeAttributes.displayName = "ProductTypeAttributes";

export default ProductTypeAttributes;
