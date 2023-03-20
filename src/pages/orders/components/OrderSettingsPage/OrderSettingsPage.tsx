import { Typography } from "@material-ui/core";
import Container from "@mzawadie/components/Container";
import { Grid } from "@mzawadie/components/Grid";
import { PageHeader } from "@mzawadie/components/PageHeader";
import Savebar from "@mzawadie/components/Savebar";
import { sectionNames } from "@mzawadie/core";
import { OrderSettingsFragment, ShopOrderSettingsFragment } from "@mzawadie/graphql";
import { SubmitPromise } from "@mzawadie/hooks/useForm";
import { ConfirmButtonTransitionState, Backlink } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { OrderFulfillmentSettings } from "../OrderFulfillmentSettings";
import { OrderSettings } from "../OrderSettings";
import OrderSettingsForm from "./form";
import { OrderSettingsFormData } from "./types";

export interface OrderSettingsPageProps {
    orderSettings: OrderSettingsFragment;
    shop: ShopOrderSettingsFragment;
    disabled: boolean;
    saveButtonBarState: ConfirmButtonTransitionState;
    onBack: () => void;
    onSubmit: (data: OrderSettingsFormData) => SubmitPromise;
}

const OrderSettingsPage: React.FC<OrderSettingsPageProps> = (props) => {
    const { orderSettings, shop, disabled, saveButtonBarState, onBack, onSubmit } = props;

    const intl = useIntl();

    return (
        <OrderSettingsForm orderSettings={orderSettings} shop={shop} onSubmit={onSubmit}>
            {({ data, submit, hasChanged, change }) => (
                <Container>
                    <Backlink onClick={onBack}>{intl.formatMessage(sectionNames.orders)}</Backlink>

                    <PageHeader
                        title={intl.formatMessage({
                            defaultMessage: "Order settings",
                            id: "Vu9nol",
                            description: "header",
                        })}
                        underline
                    />

                    <Grid variant="inverted">
                        <div>
                            <Typography>
                                <FormattedMessage defaultMessage="General Settings" id="yuiyES" />
                            </Typography>
                        </div>

                        <OrderSettings data={data} disabled={disabled} onChange={change} />

                        <div />

                        <OrderFulfillmentSettings data={data} disabled={disabled} onChange={change} />
                    </Grid>

                    <Savebar
                        onCancel={onBack}
                        onSubmit={submit}
                        disabled={disabled || !hasChanged}
                        state={saveButtonBarState}
                    />
                </Container>
            )}
        </OrderSettingsForm>
    );
};

OrderSettingsPage.displayName = "OrderSettingsPage";

export default OrderSettingsPage;
