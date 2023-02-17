import { Card, CardContent, TextField } from "@material-ui/core";
import { CardTitle } from "@mzawadie/components/CardTitle";
import ControlledCheckbox from "@mzawadie/components/ControlledCheckbox";
import FormSpacer from "@mzawadie/components/FormSpacer";
import { SingleSelectField } from "@mzawadie/components/SingleSelectField";
import { commonMessages } from "@mzawadie/core";
import { AttributeErrorFragment } from "@mzawadie/fragments/types/AttributeErrorFragment";
import { UseFormResult } from "@mzawadie/hooks/useForm";
import { NumericUnits } from "@mzawadie/pages/attributes/components/AttributeDetails/NumericUnits";
import { AttributeEntityTypeEnum, AttributeInputTypeEnum } from "@mzawadie/types/globalTypes";
import { getFormErrors } from "@mzawadie/utils/errors";
import getAttributeErrorMessage from "@mzawadie/utils/errors/attribute";
import { makeStyles } from "@saleor/macaw-ui";
import React from "react";
import { defineMessages, useIntl } from "react-intl";
import slugify from "slugify";

import { getAttributeSlugErrorMessage } from "../../errors";
import { AttributePageFormData } from "../AttributePage";
import { inputTypeMessages, messages } from "./messages";

const entityTypeMessages = defineMessages({
    page: {
        defaultMessage: "Pages",
        id: "Iafyt5",
        description: "page attribute entity type",
    },
    product: {
        defaultMessage: "Products",
        id: "5TUpjG",
        description: "product attribute entity type",
    },
});

const useStyles = makeStyles(
    (theme) => ({
        inputTypeSection: {
            columnGap: theme.spacing(2),
            display: "flex",
            [theme.breakpoints.down("md")]: {
                flexFlow: "wrap",
                rowGap: theme.spacing(3),
            },
        },
    }),
    { name: "AttributeDetails" }
);

export interface AttributeDetailsProps
    extends Pick<
        UseFormResult<AttributePageFormData>,
        "set" | "setError" | "data" | "clearErrors" | "errors"
    > {
    canChangeType: boolean;
    disabled: boolean;
    apiErrors: AttributeErrorFragment[];
    onChange: (event: React.ChangeEvent<any>) => void;
}

const AttributeDetails: React.FC<AttributeDetailsProps> = (props) => {
    const { canChangeType, errors, clearErrors, setError, data, disabled, apiErrors, onChange, set } =
        props;
    const classes = useStyles(props);
    const intl = useIntl();
    const inputTypeChoices = [
        {
            label: intl.formatMessage(inputTypeMessages.dropdown),
            value: AttributeInputTypeEnum.DROPDOWN,
        },
        {
            label: intl.formatMessage(inputTypeMessages.multiselect),
            value: AttributeInputTypeEnum.MULTISELECT,
        },
        {
            label: intl.formatMessage(inputTypeMessages.file),
            value: AttributeInputTypeEnum.FILE,
        },
        {
            label: intl.formatMessage(inputTypeMessages.references),
            value: AttributeInputTypeEnum.REFERENCE,
        },
        {
            label: intl.formatMessage(inputTypeMessages.text),
            value: AttributeInputTypeEnum.RICH_TEXT,
        },
        {
            label: intl.formatMessage(inputTypeMessages.numeric),
            value: AttributeInputTypeEnum.NUMERIC,
        },
        {
            label: intl.formatMessage(inputTypeMessages.boolean),
            value: AttributeInputTypeEnum.BOOLEAN,
        },
        {
            label: intl.formatMessage(inputTypeMessages.date),
            value: AttributeInputTypeEnum.DATE,
        },
        {
            label: intl.formatMessage(inputTypeMessages.dateTime),
            value: AttributeInputTypeEnum.DATE_TIME,
        },
    ];
    const entityTypeChoices = [
        {
            label: intl.formatMessage(entityTypeMessages.page),
            value: AttributeEntityTypeEnum.PAGE,
        },
        {
            label: intl.formatMessage(entityTypeMessages.product),
            value: AttributeEntityTypeEnum.PRODUCT,
        },
    ];

    const formApiErrors = getFormErrors(["name", "slug", "inputType", "entityType", "unit"], apiErrors);

    return (
        <Card>
            <CardTitle title={intl.formatMessage(commonMessages.generalInformations)} />
            <CardContent>
                <TextField
                    disabled={disabled}
                    error={!!formApiErrors.name}
                    label={intl.formatMessage(messages.attributeLabel)}
                    name={"name" as keyof AttributePageFormData}
                    fullWidth
                    helperText={getAttributeErrorMessage(formApiErrors.name, intl)}
                    value={data.name}
                    onChange={onChange}
                />
                <FormSpacer />
                <TextField
                    disabled={disabled}
                    error={!!formApiErrors.slug}
                    label={intl.formatMessage(messages.attributeSlug)}
                    name={"slug" as keyof AttributePageFormData}
                    placeholder={slugify(data.name).toLowerCase()}
                    fullWidth
                    helperText={
                        getAttributeSlugErrorMessage(formApiErrors.slug, intl) ||
                        intl.formatMessage(messages.attributeSlugHelperText)
                    }
                    value={data.slug}
                    onChange={onChange}
                />
                <FormSpacer />
                <div className={classes.inputTypeSection}>
                    <SingleSelectField
                        choices={inputTypeChoices}
                        disabled={disabled || !canChangeType}
                        error={!!formApiErrors.inputType}
                        hint={getAttributeErrorMessage(formApiErrors.inputType, intl)}
                        label={intl.formatMessage(messages.inputType)}
                        name="inputType"
                        onChange={onChange}
                        value={data.inputType}
                    />
                    {data.inputType === AttributeInputTypeEnum.REFERENCE && (
                        <SingleSelectField
                            choices={entityTypeChoices}
                            disabled={disabled || !canChangeType}
                            error={!!formApiErrors.entityType}
                            hint={getAttributeErrorMessage(formApiErrors.entityType, intl)}
                            label={intl.formatMessage(messages.entityType)}
                            name="entityType"
                            onChange={onChange}
                            value={data.entityType}
                        />
                    )}
                </div>
                <FormSpacer />
                <ControlledCheckbox
                    name={"valueRequired" as keyof AttributePageFormData}
                    label={intl.formatMessage(messages.valueRequired)}
                    checked={data.valueRequired}
                    onChange={onChange}
                    disabled={disabled}
                />
                {data.inputType === AttributeInputTypeEnum.NUMERIC && (
                    <NumericUnits
                        data={data}
                        errors={errors}
                        disabled={disabled}
                        clearErrors={clearErrors}
                        setError={setError}
                        set={set}
                    />
                )}
            </CardContent>
        </Card>
    );
};

AttributeDetails.displayName = "AttributeDetails";

export default AttributeDetails;
