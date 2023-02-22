/* eslint-disable react/no-array-index-key */
// @ts-nocheck
import { Typography } from "@material-ui/core";
import { ReorderAction } from "@mzawadie/core";
import { makeStyles } from "@saleor/macaw-ui";
import React from "react";
import { SortableContainerProps } from "react-sortable-hoc";

import Skeleton from "../Skeleton";
import SortableChip from "../SortableChip";
import SortableContainer from "./SortableContainer";

const useStyles = makeStyles(
    (theme) => ({
        chip: {
            background: theme.palette.background.paper,
            color: theme.palette.primary.dark,
            marginBottom: theme.spacing(1),
        },
        errorText: {
            color: theme.palette.error.light,
        },
    }),
    {
        name: "SortableChipsField",
    }
);

export interface SortableChipsFieldValueType {
    label: string;
    value: string;
}

export interface SortableChipsFieldProps extends SortableContainerProps {
    loading?: boolean;
    values: SortableChipsFieldValueType[];
    error?: boolean;
    helperText?: string;
    onValueDelete: (id: string) => void;
    onValueReorder: ReorderAction;
}

const SortableChipsField: React.FC<SortableChipsFieldProps> = (props) => {
    const { loading, values, error, helperText, onValueDelete, onValueReorder } = props;
    const classes = useStyles(props);

    return (
        <SortableContainer axis="xy" lockAxis="xy" useDragHandle onSortEnd={onValueReorder}>
            <div>
                {loading ? (
                    <Skeleton />
                ) : (
                    values.map((value, valueIndex) => (
                        <SortableChip
                            className={classes.chip}
                            key={valueIndex}
                            index={valueIndex}
                            label={value.label}
                            onClose={() => onValueDelete(value.value)}
                        />
                    ))
                )}

                {error && (
                    <Typography variant="caption" className={classes.errorText}>
                        {helperText}
                    </Typography>
                )}
            </div>
        </SortableContainer>
    );
};

SortableChipsField.displayName = "SortableChipsField";

export default SortableChipsField;
