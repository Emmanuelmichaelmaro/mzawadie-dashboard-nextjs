// @ts-nocheck
import { Card, TableCell, TableRow, Tooltip } from "@material-ui/core";
import HelpOutline from "@material-ui/icons/HelpOutline";
import { CardTitle } from "@mzawadie/components/CardTitle";
import { Checkbox } from "@mzawadie/components/Checkbox";
import { ResponsiveTable } from "@mzawadie/components/ResponsiveTable";
import Skeleton from "@mzawadie/components/Skeleton";
import { SortableTableBody, SortableTableRow } from "@mzawadie/components/SortableTable";
import { TableHead } from "@mzawadie/components/TableHead";
import { maybe, renderCollection, stopPropagation, ListActions, ReorderAction } from "@mzawadie/core";
import { ProductAttributeType } from "@mzawadie/types/globalTypes";
import { Button, DeleteIcon, IconButton, makeStyles } from "@saleor/macaw-ui";
import capitalize from "lodash/capitalize";
import React, { useEffect } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import {
    ProductTypeDetails_productType_assignedVariantAttributes,
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
        colName: {
            width: 200,
        },
        colSlug: {
            width: 200,
        },
        colVariant: {
            width: 150,
        },
        colVariantContent: {
            display: "flex",
            alignItems: "center",
        },
        colVariantDisabled: {
            fill: "#28234A",
            fillOpacity: 0.6,
            "&:hover": {
                fillOpacity: 1,
            },
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

interface ProductTypeVariantAttributesProps extends ListActions {
    assignedVariantAttributes: ProductTypeDetails_productType_assignedVariantAttributes[];
    disabled: boolean;
    type: string;
    testId?: string;
    selectedVariantAttributes: string[];
    onAttributeAssign: (type: ProductAttributeType) => void;
    onAttributeClick: (id: string) => void;
    onAttributeReorder: ReorderAction;
    onAttributeUnassign: (id: string) => void;
    onAttributeVariantSelection?: (isActive: boolean) => void;
    setSelectedVariantAttributes?: (data: string[]) => void;
}

function handleContainerAssign(
    variantID: string,
    isSelected: boolean,
    selectedAttributes: string[],
    setSelectedAttributes: (data: string[]) => void
) {
    if (isSelected) {
        setSelectedAttributes(
            selectedAttributes.filter((selectedContainer) => selectedContainer !== variantID)
        );
    } else {
        setSelectedAttributes([...selectedAttributes, variantID]);
    }
}

const numberOfColumns = 6;

const ProductTypeVariantAttributes: React.FC<ProductTypeVariantAttributesProps> = (props) => {
    const {
        assignedVariantAttributes,
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
        onAttributeVariantSelection,
        setSelectedVariantAttributes,
        selectedVariantAttributes,
    } = props;
    const classes = useStyles(props);

    const intl = useIntl();

    useEffect(() => {
        // Populate initial selection - populated inside this component to preserve it's state between data reloads
        setSelectedVariantAttributes(
            assignedVariantAttributes
                .map((elem) => (elem.variantSelection ? elem.attribute.id : undefined))
                .filter(Boolean) || []
        );
    }, []);

    return (
        <Card data-test-id="variant-attributes">
            <CardTitle
                title={intl.formatMessage({
                    defaultMessage: "Variant Attributes",
                    id: "skEK/i",
                    description: "section header",
                })}
                toolbar={
                    <Button
                        data-test-id={testId}
                        variant="tertiary"
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
                    <col className={classes.colVariant} />
                    <col className={classes.colAction} />
                </colgroup>
                {assignedVariantAttributes?.length > 0 && (
                    <TableHead
                        colSpan={numberOfColumns}
                        disabled={disabled}
                        dragRows
                        selected={selected}
                        items={
                            assignedVariantAttributes as unknown as ProductTypeDetails_productType_variantAttributes[]
                        }
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
                        <TableCell className={classes.colName}>
                            <FormattedMessage
                                defaultMessage="Variant Selection"
                                id="4k9rMQ"
                                description="variant attribute checkbox"
                            />
                        </TableCell>
                        <TableCell />
                    </TableHead>
                )}
                <SortableTableBody onSortEnd={onAttributeReorder}>
                    {renderCollection(
                        assignedVariantAttributes,
                        (assignedVariantAttribute, attributeIndex) => {
                            const { attribute } = assignedVariantAttribute;
                            const isVariantSelected = assignedVariantAttribute
                                ? isChecked(attribute.id)
                                : false;
                            const isSelected = !!selectedVariantAttributes.find(
                                (selectedAttribute) => selectedAttribute === attribute.id
                            );
                            const variantSelectionDisabled = ![
                                "DROPDOWN",
                                "BOOLEAN",
                                "SWATCH",
                                "NUMERIC",
                            ].includes(attribute.inputType);
                            const readableAttributeInputType = capitalize(
                                attribute.inputType.split("_").join(" ")
                            );

                            return (
                                <SortableTableRow
                                    selected={isVariantSelected}
                                    className={!!attribute ? classes.link : undefined}
                                    hover={!!attribute}
                                    onClick={
                                        !!attribute ? () => onAttributeClick(attribute.id) : undefined
                                    }
                                    key={maybe(() => attribute.id)}
                                    index={attributeIndex || 0}
                                    data-test-id={`id-${+maybe(() => attribute.id)}`}
                                >
                                    <TableCell padding="checkbox">
                                        <Checkbox
                                            checked={isVariantSelected}
                                            disabled={disabled}
                                            disableClickPropagation
                                            onChange={() => toggle(attribute.id)}
                                        />
                                    </TableCell>
                                    <TableCell className={classes.colName} data-test-id="name">
                                        {attribute.name ?? <Skeleton />}
                                    </TableCell>
                                    <TableCell className={classes.colSlug} data-test-id="slug">
                                        {maybe(() => attribute.slug) ? attribute.slug : <Skeleton />}
                                    </TableCell>
                                    <TableCell
                                        className={classes.colVariant}
                                        data-test-id="variant-selection"
                                    >
                                        <div className={classes.colVariantContent}>
                                            <Checkbox
                                                data-test-id="variant-selection-checkbox"
                                                checked={isSelected}
                                                disabled={disabled || variantSelectionDisabled}
                                                disableClickPropagation
                                                onChange={() => {
                                                    onAttributeVariantSelection(true);
                                                    handleContainerAssign(
                                                        attribute.id,
                                                        isSelected,
                                                        selectedVariantAttributes,
                                                        setSelectedVariantAttributes
                                                    );
                                                }}
                                            />
                                            {!!variantSelectionDisabled && (
                                                <Tooltip
                                                    title={
                                                        <FormattedMessage
                                                            defaultMessage="{inputType} attributes cannot be used as variant selection attributes."
                                                            id="vlLyvk"
                                                            values={{
                                                                inputType: readableAttributeInputType,
                                                            }}
                                                        />
                                                    }
                                                >
                                                    <HelpOutline
                                                        className={classes.colVariantDisabled}
                                                    />
                                                </Tooltip>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className={classes.colAction}>
                                        <IconButton
                                            data-test-id="delete-icon"
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

ProductTypeVariantAttributes.displayName = "ProductTypeVariantAttributes";

export default ProductTypeVariantAttributes;