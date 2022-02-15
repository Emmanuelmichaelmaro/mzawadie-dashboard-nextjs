// @ts-nocheck
import { Card, CardContent, Typography } from "@material-ui/core";
import CardTitle from "@mzawadie/components/CardTitle";
import SingleAutocompleteSelectField, {
    SingleAutocompleteChoiceType,
} from "@mzawadie/components/SingleAutocompleteSelectField";
import { FetchMoreProps } from "@mzawadie/core";
import { PageErrorFragment } from "@mzawadie/fragments/types/PageErrorFragment";
import { PageTypeFragment } from "@mzawadie/fragments/types/PageTypeFragment";
import { FormChange } from "@mzawadie/hooks/useForm";
import { getFormErrors } from "@mzawadie/utils/errors";
import getPageErrorMessage from "@mzawadie/utils/errors/page";
import { makeStyles } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { PageFormData } from "../PageDetailsPage/form";

export interface PageOrganizeContentProps {
    canChangeType: boolean;
    data: PageFormData;
    pageType?: PageTypeFragment;
    pageTypeInputDisplayValue?: string;
    errors: PageErrorFragment[];
    disabled: boolean;
    pageTypes: SingleAutocompleteChoiceType[];
    onPageTypeChange?: FormChange;
    fetchPageTypes?: (data: string) => void;
    fetchMorePageTypes?: FetchMoreProps;
}

const useStyles = makeStyles(
    (theme) => ({
        label: {
            marginBottom: theme.spacing(0.5),
        },
    }),
    { name: "PageOrganizeContent" }
);

const PageOrganizeContent: React.FC<PageOrganizeContentProps> = (props) => {
    const {
        canChangeType,
        data,
        pageType,
        pageTypeInputDisplayValue,
        errors,
        disabled,
        pageTypes,
        onPageTypeChange,
        fetchPageTypes,
        fetchMorePageTypes,
    } = props;

    const classes = useStyles(props);
    const intl = useIntl();

    const formErrors = getFormErrors(["pageType"], errors);

    return (
        <Card>
            <CardTitle
                title={intl.formatMessage({
                    defaultMessage: "Organize Content",
                    id: "jU9GPX",
                    description: "section header",
                })}
            />
            <CardContent>
                {canChangeType ? (
                    <SingleAutocompleteSelectField
                        data-test-id="pageTypesAutocompleteSelect"
                        disabled={disabled}
                        displayValue={pageTypeInputDisplayValue}
                        label={intl.formatMessage({
                            defaultMessage: "Select content type",
                            id: "W5SK5c",
                        })}
                        error={!!formErrors.pageType}
                        helperText={getPageErrorMessage(formErrors.pageType, intl)}
                        name={"pageType" as keyof PageFormData}
                        onChange={onPageTypeChange}
                        value={data.pageType?.id}
                        choices={pageTypes}
                        InputProps={{
                            autoComplete: "off",
                        }}
                        fetchChoices={fetchPageTypes}
                        {...fetchMorePageTypes}
                    />
                ) : (
                    <>
                        <Typography className={classes.label} variant="caption">
                            <FormattedMessage defaultMessage="Content type" id="ufD5Jr" />
                        </Typography>
                        <Typography>{pageType?.name}</Typography>
                    </>
                )}
            </CardContent>
        </Card>
    );
};

PageOrganizeContent.displayName = "PageOrganizeContent";

export default PageOrganizeContent;
