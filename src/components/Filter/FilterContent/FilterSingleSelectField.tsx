/* eslint-disable react/prop-types */
import React from "react";
import { useIntl } from "react-intl";

import { FilterType } from "..";
import FormSpacer from "../../FormSpacer";
import SingleSelectField from "../../SingleSelectField/SingleSelectField";
import { FilterFieldBaseProps, getIsFilterMultipleChoices, useCommonStyles } from "./utils";

type FilterSingleSelectFieldProps = FilterFieldBaseProps<string>;

export const FilterSingleSelectField: React.FC<FilterSingleSelectFieldProps> = ({
    filter,
    onFilterPropertyChange,
}) => {
    const classes = useCommonStyles({});
    const intl = useIntl();

    return (
        <>
            <SingleSelectField
                data-test="filterRangeTypeChoice"
                choices={getIsFilterMultipleChoices(intl)}
                value={filter.multiple ? FilterType.MULTIPLE : FilterType.SINGULAR}
                InputProps={{
                    classes: {
                        input: classes.input,
                    },
                }}
                onChange={(event: any) =>
                    onFilterPropertyChange({
                        payload: {
                            name: filter.name,
                            update: {
                                multiple: event.target.value === FilterType.MULTIPLE,
                            },
                        },
                        type: "set-property",
                    })
                }
            />
            <FormSpacer />
        </>
    );
};
