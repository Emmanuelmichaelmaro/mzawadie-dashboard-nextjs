// @ts-nocheck
import { Card, CardContent, TextField } from "@material-ui/core";
import CardTitle from "@mzawadie/components/CardTitle";
import { commonMessages } from "@mzawadie/core";
import { PageErrorFragment } from "@mzawadie/fragments/types/PageErrorFragment";
import { getFormErrors } from "@mzawadie/utils/errors";
import getPageErrorMessage from "@mzawadie/utils/errors/page";
import React from "react";
import { useIntl } from "react-intl";

interface PageTypeDetailsProps {
    data?: {
        name: string;
    };
    disabled: boolean;
    errors: PageErrorFragment[];
    onChange: (event: React.ChangeEvent<any>) => void;
}

const PageTypeDetails: React.FC<PageTypeDetailsProps> = (props) => {
    const { data, disabled, errors, onChange } = props;
    const intl = useIntl();

    const formErrors = getFormErrors(["name"], errors);

    return (
        <Card>
            <CardTitle title={intl.formatMessage(commonMessages.generalInformations)} />

            <CardContent>
                <TextField
                    disabled={disabled}
                    fullWidth
                    error={!!formErrors.name}
                    helperText={getPageErrorMessage(formErrors.name, intl)}
                    label={intl.formatMessage({
                        defaultMessage: "Content Type Name",
                        id: "jWna9Q",
                    })}
                    name="name"
                    onChange={onChange}
                    value={data.name}
                />
            </CardContent>
        </Card>
    );
};

PageTypeDetails.defaultProps = {
    // eslint-disable-next-line react/default-props-match-prop-types
    errors: [],
};

PageTypeDetails.displayName = "PageTypeDetails";

export default PageTypeDetails;
