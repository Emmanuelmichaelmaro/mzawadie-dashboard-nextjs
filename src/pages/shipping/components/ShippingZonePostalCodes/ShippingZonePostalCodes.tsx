// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import {
    Button,
    Card,
    CardContent,
    IconButton,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography,
} from "@material-ui/core";
import { CardTitle } from "@mzawadie/components/CardTitle";
import { RadioGroupField } from "@mzawadie/components/RadioGroupField";
import { ResponsiveTable } from "@mzawadie/components/ResponsiveTable";
import Skeleton from "@mzawadie/components/Skeleton";
import { renderCollection } from "@mzawadie/core";
import { ShippingMethodTypeFragment_postalCodeRules } from "@mzawadie/fragments/types/ShippingMethodTypeFragment";
import ArrowDropdown from "@mzawadie/icons/ArrowDropdown";
import { PostalCodeRuleInclusionTypeEnum } from "@mzawadie/types/globalTypes";
import { DeleteIcon, makeStyles } from "@saleor/macaw-ui";
import classNames from "classnames";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

export interface ShippingZonePostalCodesProps {
    disabled: boolean;
    initialExpanded?: boolean;
    postalCodes: ShippingMethodTypeFragment_postalCodeRules[] | undefined;
    onPostalCodeInclusionChange: (inclusion: PostalCodeRuleInclusionTypeEnum) => void;
    onPostalCodeDelete: (code: ShippingMethodTypeFragment_postalCodeRules) => void;
    onPostalCodeRangeAdd: () => void;
}

const useStyles = makeStyles(
    (theme) => ({
        arrow: {
            transition: theme.transitions.create("transform"),
        },
        arrowRotate: {
            transform: "scale(-1)",
        },
        colAction: {
            width: 80,
        },
        colCode: {},
        option: {
            marginBottom: theme.spacing(2),
            width: 400,
        },
        radioContainer: {
            paddingBottom: 0,
        },
        skeleton: {
            width: 80,
        },
    }),
    {
        name: "ShippingZonePostalCodes",
    }
);

const ShippingZonePostalCodes: React.FC<ShippingZonePostalCodesProps> = ({
    disabled,
    initialExpanded = true,
    postalCodes,
    onPostalCodeDelete,
    onPostalCodeInclusionChange,
    onPostalCodeRangeAdd,
}) => {
    const [expanded, setExpanded] = React.useState(initialExpanded);
    const [inclusionType, setInclusionType] = React.useState(null);
    const intl = useIntl();
    const classes = useStyles({});

    const getInclusionType = () => {
        if (inclusionType) {
            return inclusionType;
        }
        return postalCodes[0]?.inclusionType || PostalCodeRuleInclusionTypeEnum.EXCLUDE;
    };

    const onInclusionRadioChange = (event: React.ChangeEvent<any>) => {
        const { value } = event.target;
        setInclusionType(value);
        onPostalCodeInclusionChange(value);
    };

    const getPostalCodeRangeLabel = (postalCodeRange: ShippingMethodFragment_postalCodeRules) => {
        if (!postalCodeRange?.start) {
            return <Skeleton />;
        }
        if (postalCodeRange?.end) {
            return `${postalCodeRange.start} - ${postalCodeRange.end}`;
        }
        return postalCodeRange.start;
    };

    return (
        <Card>
            <CardTitle
                title={intl.formatMessage({
                    defaultMessage: "Postal codes",
                    id: "FcTTvh",
                    description: "postal codes, header",
                })}
                toolbar={
                    <Button
                        color="primary"
                        onClick={onPostalCodeRangeAdd}
                        data-test="add-postal-code-range"
                    >
                        <FormattedMessage
                            defaultMessage="Add postal code range"
                            id="1lk/oS"
                            description="button"
                        />
                    </Button>
                }
            />
            <CardContent className={classNames(classes.radioContainer)}>
                <RadioGroupField
                    alignTop
                    choices={[
                        {
                            label: (
                                <div className={classes.option}>
                                    <Typography variant="body1">
                                        <FormattedMessage
                                            defaultMessage="Exclude postal codes"
                                            id="YpLVVc"
                                            description="action"
                                        />
                                    </Typography>
                                    <Typography color="textSecondary" variant="caption">
                                        <FormattedMessage
                                            defaultMessage="Added postal codes will be excluded from using this delivery methods. If none are added all postal codes will be able to use that shipping rate"
                                            id="ju8zHP"
                                        />
                                    </Typography>
                                </div>
                            ),
                            value: PostalCodeRuleInclusionTypeEnum.EXCLUDE,
                        },
                        {
                            label: (
                                <div className={classes.option}>
                                    <Typography variant="body1">
                                        <FormattedMessage
                                            defaultMessage="Include postal codes"
                                            id="7qsOwa"
                                            description="action"
                                        />
                                    </Typography>
                                    <Typography color="textSecondary" variant="caption">
                                        <FormattedMessage
                                            defaultMessage="Only added postal codes will be able to use this shipping rate"
                                            id="/Zee1r"
                                        />
                                    </Typography>
                                </div>
                            ),
                            value: PostalCodeRuleInclusionTypeEnum.INCLUDE,
                        },
                    ]}
                    name="includePostalCodes"
                    value={getInclusionType()}
                    onChange={onInclusionRadioChange}
                />
            </CardContent>
            <ResponsiveTable>
                <colgroup>
                    <col />
                    <col className={classes.colAction} />
                </colgroup>
                <TableHead>
                    <TableRow>
                        <TableCell>
                            {postalCodes === undefined ? (
                                <Skeleton className={classes.skeleton} />
                            ) : (
                                <Typography variant="caption">
                                    <FormattedMessage
                                        defaultMessage="{number} postal code ranges"
                                        id="ud0w8h"
                                        description="number of postal code ranges"
                                        values={{
                                            number: postalCodes.length,
                                        }}
                                    />
                                </Typography>
                            )}
                        </TableCell>
                        <TableCell>
                            <IconButton onClick={() => setExpanded(!expanded)}>
                                <ArrowDropdown
                                    className={classNames(classes.arrow, {
                                        [classes.arrowRotate]: expanded,
                                    })}
                                />
                            </IconButton>
                        </TableCell>
                    </TableRow>
                </TableHead>
                {expanded && (
                    <TableBody>
                        {renderCollection(
                            postalCodes,
                            (postalCodeRange) => (
                                <TableRow key={postalCodeRange?.id}>
                                    <TableCell>{getPostalCodeRangeLabel(postalCodeRange)}</TableCell>
                                    <TableCell>
                                        <IconButton
                                            disabled={disabled}
                                            color="primary"
                                            onClick={() => onPostalCodeDelete(postalCodeRange)}
                                            data-test="delete-postal-code"
                                            data-test-id={postalCodeRange?.id}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ),
                            () => (
                                <TableRow>
                                    <TableCell colSpan={2}>
                                        <Typography color="textSecondary">
                                            <FormattedMessage
                                                defaultMessage="This shipping rate has no postal codes assigned"
                                                id="Pyjarj"
                                            />
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            )
                        )}
                    </TableBody>
                )}
            </ResponsiveTable>
        </Card>
    );
};

ShippingZonePostalCodes.displayName = "ShippingZonePostalCodes";
export default ShippingZonePostalCodes;
