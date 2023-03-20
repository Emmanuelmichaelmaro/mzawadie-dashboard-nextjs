// @ts-nocheck
import { Typography } from "@material-ui/core";
import Container from "@mzawadie/components/Container";
import { Form } from "@mzawadie/components/Form";
import { Grid } from "@mzawadie/components/Grid";
import { PageHeader } from "@mzawadie/components/PageHeader";
import Savebar from "@mzawadie/components/Savebar";
import { sectionNames } from "@mzawadie/core";
import {
    GiftCardSettingsExpiryTypeEnum,
    TimePeriodTypeEnum,
    useGiftCardSettingsQuery,
    useGiftCardSettingsUpdateMutation,
} from "@mzawadie/graphql";
import useNavigator from "@mzawadie/hooks/useNavigator";
import { getFormErrors } from "@mzawadie/utils/errors";
import { Backlink } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { giftCardsListPath } from "../../urls";
import { GiftCardExpirySettingsCard } from "./GiftCardExpirySettingsCard";
import { giftCardExpirySettingsCard as expirySettingsMessages } from "./GiftCardExpirySettingsCard/messages";
import { giftCardSettingsPageMessages as messages } from "./messages";
import { GiftCardSettingsFormData } from "./types";
import { getGiftCardSettingsInputData } from "./utils";

const GiftCardSettingsPage: React.FC = () => {
    const intl = useIntl();

    const navigate = useNavigator();

    const { data, loading } = useGiftCardSettingsQuery();

    const settingsData = data?.giftCardSettings;

    const initialData: GiftCardSettingsFormData = {
        expiryPeriodActive: settingsData?.expiryType === GiftCardSettingsExpiryTypeEnum.EXPIRY_PERIOD,
        expiryPeriodType: settingsData?.expiryPeriod?.type || TimePeriodTypeEnum.YEAR,
        expiryPeriodAmount: settingsData?.expiryPeriod?.amount || 1,
    };

    const [updateGiftCardSettings, updateGiftCardSettingsOpts] = useGiftCardSettingsUpdateMutation({});

    const navigateBack = () => navigate(giftCardsListPath);

    const handleSubmit = (formData: GiftCardSettingsFormData) => {
        updateGiftCardSettings({
            variables: {
                input: getGiftCardSettingsInputData(formData),
            },
        });
    };

    const formLoading = loading || updateGiftCardSettingsOpts?.loading;

    const apiErrors = updateGiftCardSettingsOpts?.data?.giftCardSettingsUpdate?.errors;

    const formErrors = getFormErrors(["expiryPeriod"], apiErrors);

    return (
        <Container>
            <Backlink onClick={navigateBack}>{intl.formatMessage(sectionNames.giftCards)}</Backlink>
            <PageHeader preview title={intl.formatMessage(messages.title)} underline />
            <Form initial={initialData} onSubmit={handleSubmit}>
                {({ data: formData, submit, hasChanged, change }) => (
                    <Grid variant="inverted">
                        <div>
                            <Typography>
                                <FormattedMessage
                                    {...expirySettingsMessages.expiryDateSectionDescription}
                                />
                            </Typography>
                        </div>
                        <GiftCardExpirySettingsCard
                            data={formData}
                            disabled={formLoading}
                            onChange={change}
                            errors={formErrors}
                        />
                        <Savebar
                            onCancel={navigateBack}
                            onSubmit={submit}
                            disabled={formLoading || !hasChanged}
                            state={updateGiftCardSettingsOpts?.status}
                        />
                    </Grid>
                )}
            </Form>
        </Container>
    );
};

export default GiftCardSettingsPage;
