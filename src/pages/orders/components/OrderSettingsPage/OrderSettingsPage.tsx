// @ts-nocheck
import { Typography } from "@material-ui/core";
import { Backlink } from "@mzawadie/components/Backlink";
import Container from "@mzawadie/components/Container";
import { Grid } from "@mzawadie/components/Grid";
import { PageHeader } from "@mzawadie/components/PageHeader";
import Savebar from "@mzawadie/components/Savebar";
import { sectionNames } from "@mzawadie/core";
import { OrderSettingsFragment, ShopOrderSettingsFragment } from "@mzawadie/graphql";
import { SubmitPromise } from "@mzawadie/hooks/useForm";
import useNavigator from "@mzawadie/hooks/useNavigator";
import { orderListUrl } from "@mzawadie/pages/orders/urls";
import { ConfirmButtonTransitionState } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { OrderFulfillmentSettings } from "../OrderFulfillmentSettings";
import OrderSettings from "../OrderSettings/OrderSettings";
import OrderSettingsForm from "./form";
import { OrderSettingsFormData } from "./types";

export interface OrderSettingsPageProps {
    orderSettings: OrderSettingsFragment;
    shop: ShopOrderSettingsFragment;
    disabled: boolean;
    saveButtonBarState: ConfirmButtonTransitionState;
    onSubmit: (data: OrderSettingsFormData) => SubmitPromise;
}

const OrderSettingsPage: React.FC<OrderSettingsPageProps> = (props) => {
    const { orderSettings, shop, disabled, saveButtonBarState, onSubmit } = props;

    const intl = useIntl();

    const navigate = useNavigator();

    return (
        <OrderSettingsForm
            orderSettings={orderSettings}
            shop={shop}
            onSubmit={onSubmit}
            disabled={disabled}
        >
            {({ data, submit, change, isSaveDisabled }) => (
                <Container>
                    <Backlink href={orderListUrl()}>{intl.formatMessage(sectionNames.orders)}</Backlink>

                    <PageHeader
                        title={intl.formatMessage({
                            id: "Vu9nol",
                            defaultMessage: "Order settings",
                            description: "header",
                        })}
                        underline={true}
                    />

                    <Grid variant="inverted">
                        <div>
                            <Typography>
                                <FormattedMessage id="yuiyES" defaultMessage="General Settings" />
                            </Typography>
                        </div>

                        <OrderSettings data={data} disabled={disabled} onChange={change} />

                        <div />

                        <OrderFulfillmentSettings data={data} disabled={disabled} onChange={change} />
                    </Grid>

                    <Savebar
                        onCancel={() => navigate(orderListUrl())}
                        onSubmit={submit}
                        disabled={isSaveDisabled}
                        state={saveButtonBarState}
                    />
                </Container>
            )}
        </OrderSettingsForm>
    );
};

OrderSettingsPage.displayName = "OrderSettingsPage";

export default OrderSettingsPage;
