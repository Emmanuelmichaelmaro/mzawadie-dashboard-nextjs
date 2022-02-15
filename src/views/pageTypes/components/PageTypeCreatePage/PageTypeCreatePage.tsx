import { Typography } from "@material-ui/core";
import { ConfirmButtonTransitionState } from "@mzawadie/components/ConfirmButton";
import Container from "@mzawadie/components/Container";
import Form from "@mzawadie/components/Form";
import Grid from "@mzawadie/components/Grid";
import Hr from "@mzawadie/components/Hr";
import Metadata, { MetadataFormData } from "@mzawadie/components/Metadata";
import PageHeader from "@mzawadie/components/PageHeader";
import Savebar from "@mzawadie/components/Savebar";
import { commonMessages, sectionNames } from "@mzawadie/core";
import { PageErrorFragment } from "@mzawadie/fragments/types/PageErrorFragment";
import useMetadataChangeTrigger from "@mzawadie/utils/metadata/useMetadataChangeTrigger";
import { Backlink, makeStyles } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import PageTypeDetails from "../PageTypeDetails/PageTypeDetails";

export interface PageTypeForm extends MetadataFormData {
    name: string;
}

export interface PageTypeCreatePageProps {
    errors: PageErrorFragment[];
    disabled: boolean;
    saveButtonBarState: ConfirmButtonTransitionState;
    onBack: () => void;
    onSubmit: (data: PageTypeForm) => void;
}

const formInitialData: PageTypeForm = {
    metadata: [],
    name: "",
    privateMetadata: [],
};

const useStyles = makeStyles(
    (theme) => ({
        hr: {
            gridColumnEnd: "span 2",
            margin: theme.spacing(1, 0),
        },
    }),
    {
        name: "PageTypeCreatePage",
    }
);

const PageTypeCreatePage: React.FC<PageTypeCreatePageProps> = (props) => {
    const { disabled, errors, saveButtonBarState, onBack, onSubmit } = props;
    const classes = useStyles(props);
    const intl = useIntl();
    const { makeChangeHandler: makeMetadataChangeHandler } = useMetadataChangeTrigger();

    return (
        <Form initial={formInitialData} onSubmit={onSubmit} confirmLeave>
            {({ change, data, hasChanged, submit }) => {
                const changeMetadata = makeMetadataChangeHandler(change);

                return (
                    <Container>
                        <Backlink onClick={onBack}>
                            {intl.formatMessage(sectionNames.pageTypes)}
                        </Backlink>
                        <PageHeader
                            title={intl.formatMessage({
                                defaultMessage: "Create Page Type",
                                id: "caqRmN",
                                description: "header",
                            })}
                        />
                        <Grid variant="inverted">
                            <div>
                                <Typography>
                                    {intl.formatMessage(commonMessages.generalInformations)}
                                </Typography>
                                <Typography variant="body2">
                                    <FormattedMessage
                                        defaultMessage="These are general information about this Content Type."
                                        id="kZfIl/"
                                    />
                                </Typography>
                            </div>
                            <PageTypeDetails
                                data={data}
                                disabled={disabled}
                                errors={errors}
                                onChange={change}
                            />
                            <Hr className={classes.hr} />
                            <div>
                                <Typography>
                                    <FormattedMessage
                                        defaultMessage="Metadata"
                                        id="OVOU1z"
                                        description="section header"
                                    />
                                </Typography>
                            </div>
                            <Metadata data={data} onChange={changeMetadata} />
                            <div />
                        </Grid>
                        <Savebar
                            onCancel={onBack}
                            onSubmit={submit}
                            disabled={disabled || !hasChanged}
                            state={saveButtonBarState}
                        />
                    </Container>
                );
            }}
        </Form>
    );
};

PageTypeCreatePage.displayName = "PageTypeCreatePage";

export default PageTypeCreatePage;
