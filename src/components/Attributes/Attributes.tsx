import { Card, CardContent, IconButton, Typography } from "@material-ui/core";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import { CardTitle, Hr } from "@mzawadie/components";
import { FetchMoreProps } from "@mzawadie/core";
import {
    AttributeValueFragment,
    PageErrorWithAttributesFragment,
    ProductErrorWithAttributesFragment,
    AttributeEntityTypeEnum,
    AttributeInputTypeEnum,
    MeasurementUnitsEnum,
} from "@mzawadie/graphql";
import { FormsetAtomicData } from "@mzawadie/hooks";
import { AttributeReference } from "@mzawadie/pages/attributes/utils/data";
import { makeStyles } from "@saleor/macaw-ui";
import classNames from "classnames";
import React from "react";
import { defineMessages, FormattedMessage, useIntl } from "react-intl";

import AttributeRow, { AttributeRowHandlers } from "./AttributeRow";
import { VariantAttributeScope } from "./types";

export interface AttributeInputData {
    inputType: AttributeInputTypeEnum;
    entityType?: AttributeEntityTypeEnum;
    unit?: MeasurementUnitsEnum | null;
    variantAttributeScope?: VariantAttributeScope;
    isRequired: boolean;
    values: AttributeValueFragment[];
    selectedValues?: AttributeValueFragment[];
    references?: AttributeReference[];
}

export type AttributeInput = FormsetAtomicData<AttributeInputData, string[]>;
export type AttributeFileInput = FormsetAtomicData<AttributeInputData, File[]>;
export interface AttributesProps extends AttributeRowHandlers {
    attributes: AttributeInput[];
    attributeValues: AttributeValueFragment[];
    fetchAttributeValues: (query: string, attributeId: string) => void;
    fetchMoreAttributeValues: FetchMoreProps;
    onAttributeSelectBlur: () => void;
    disabled: boolean;
    loading: boolean;
    errors: Array<ProductErrorWithAttributesFragment | PageErrorWithAttributesFragment>;
    title?: React.ReactNode;
    entityId?: string;
}

const useStyles = makeStyles(
    (theme) => ({
        attributeSection: {
            "&:last-of-type": {
                paddingBottom: 0,
            },
            padding: theme.spacing(2, 0),
        },
        attributeSectionLabel: {
            alignItems: "center",
            display: "flex",
        },
        card: {
            overflow: "visible",
        },
        cardContent: {
            "&:last-child": {
                paddingBottom: theme.spacing(1),
            },
            paddingTop: theme.spacing(1),
        },
        expansionBar: {
            display: "flex",
        },
        expansionBarButton: {
            marginBottom: theme.spacing(1),
        },
        expansionBarButtonIcon: {
            transition: `${theme.transitions.duration.short}ms`,
        },
        expansionBarLabel: {
            color: theme.palette.text.disabled,
            fontSize: 14,
        },
        expansionBarLabelContainer: {
            alignItems: "center",
            display: "flex",
            flex: 1,
        },
        rotate: {
            transform: "rotate(180deg)",
        },
        uploadFileButton: {
            float: "right",
        },
        uploadFileContent: {
            color: theme.palette.primary.main,
            float: "right",
            fontSize: theme.typography.body1.fontSize,
        },
    }),
    { name: "Attributes" }
);

const messages = defineMessages({
    attributesNumber: {
        defaultMessage: "{number} Attributes",
        id: "z0gGP+",
        description: "number of attributes",
    },
    header: {
        defaultMessage: "Attributes",
        id: "3ukd9/",
        description: "attributes, section header",
    },
});

const Attributes: React.FC<AttributesProps> = ({
    attributes,
    attributeValues,
    errors,
    title,
    onAttributeSelectBlur,
    entityId = "_defaultId",
    ...props
}) => {
    const intl = useIntl();
    const classes = useStyles({});

    const [expanded, setExpansionStatus] = React.useState(true);

    const toggleExpansion = () => setExpansionStatus(!expanded);

    return (
        <Card className={classes.card}>
            <CardTitle title={title || intl.formatMessage(messages.header)} />

            <CardContent className={classes.cardContent}>
                <div className={classes.expansionBar}>
                    <div className={classes.expansionBarLabelContainer}>
                        <Typography className={classes.expansionBarLabel} variant="caption">
                            <FormattedMessage
                                {...messages.attributesNumber}
                                values={{
                                    number: attributes.length,
                                }}
                            />
                        </Typography>
                    </div>

                    <IconButton
                        className={classes.expansionBarButton}
                        onClick={toggleExpansion}
                        data-test="attributes-expand"
                    >
                        <ArrowDropDownIcon
                            className={classNames(classes.expansionBarButtonIcon, {
                                [classes.rotate]: expanded,
                            })}
                        />
                    </IconButton>
                </div>

                {expanded && attributes.length > 0 && (
                    <>
                        <Hr />

                        {attributes.map((attribute, attributeIndex) => {
                            const error = errors.find((err) => err.attributes?.includes(attribute.id));

                            return (
                                <React.Fragment key={attribute.id}>
                                    {attributeIndex > 0 && <Hr />}

                                    <AttributeRow
                                        entityId={entityId}
                                        attribute={attribute}
                                        attributeValues={attributeValues}
                                        error={error}
                                        onAttributeSelectBlur={onAttributeSelectBlur}
                                        {...props}
                                    />
                                </React.Fragment>
                            );
                        })}
                    </>
                )}
            </CardContent>
        </Card>
    );
};

Attributes.displayName = "Attributes";

export default Attributes;
