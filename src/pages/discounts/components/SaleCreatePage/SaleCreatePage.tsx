// @ts-nocheck
import CardSpacer from "@mzawadie/components/CardSpacer";
import { ChannelsAvailabilityCard } from "@mzawadie/components/ChannelsAvailabilityCard";
import { ConfirmButtonTransitionState } from "@mzawadie/components/ConfirmButton";
import Container from "@mzawadie/components/Container";
import { Form } from "@mzawadie/components/Form";
import { Grid } from "@mzawadie/components/Grid";
import { Metadata, MetadataFormData } from "@mzawadie/components/Metadata";
import { PageHeader } from "@mzawadie/components/PageHeader";
import Savebar from "@mzawadie/components/Savebar";
import { sectionNames } from "@mzawadie/core";
import { DiscountErrorFragment } from "@mzawadie/fragments/types/DiscountErrorFragment";
import { ChannelSaleData } from "@mzawadie/pages/channels/utils";
import { createSaleChannelsChangeHandler } from "@mzawadie/pages/discounts/handlers";
import { validatePrice } from "@mzawadie/pages/products/utils/validation";
import { PermissionEnum, SaleType as SaleTypeEnum } from "@mzawadie/types/globalTypes";
import useMetadataChangeTrigger from "@mzawadie/utils/metadata/useMetadataChangeTrigger";
import { Backlink } from "@saleor/macaw-ui";
import React from "react";
import { useIntl } from "react-intl";

import { DiscountDates } from "../DiscountDates";
import { SaleInfo } from "../SaleInfo";
import { SaleType } from "../SaleType";
import { SaleValue } from "../SaleValue";

export interface FormData extends MetadataFormData {
    channelListings: ChannelSaleData[];
    endDate: string;
    endTime: string;
    hasEndDate: boolean;
    name: string;
    startDate: string;
    startTime: string;
    type: SaleTypeEnum;
    value: string;
}

export interface SaleCreatePageProps {
    allChannelsCount: number;
    channelListings: ChannelSaleData[];
    disabled: boolean;
    errors: DiscountErrorFragment[];
    saveButtonBarState: ConfirmButtonTransitionState;
    onBack: () => void;
    onChannelsChange: (data: ChannelSaleData[]) => void;
    openChannelsModal: () => void;
    onSubmit: (data: FormData) => void;
}

const SaleCreatePage: React.FC<SaleCreatePageProps> = ({
    allChannelsCount,
    channelListings = [],
    disabled,
    errors,
    onChannelsChange,
    onSubmit,
    openChannelsModal,
    saveButtonBarState,
    onBack,
}) => {
    const intl = useIntl();
    const { makeChangeHandler: makeMetadataChangeHandler } = useMetadataChangeTrigger();

    const initialForm: FormData = {
        channelListings,
        endDate: "",
        endTime: "",
        hasEndDate: false,
        name: "",
        startDate: "",
        startTime: "",
        type: SaleTypeEnum.FIXED,
        value: "",
        metadata: [],
        privateMetadata: [],
    };
    return (
        <Form initial={initialForm} onSubmit={onSubmit}>
            {({ change, data, hasChanged, submit, triggerChange }) => {
                const handleChannelChange = createSaleChannelsChangeHandler(
                    data.channelListings,
                    onChannelsChange,
                    triggerChange
                );
                const formDisabled = data.channelListings?.some((channel) =>
                    validatePrice(channel?.discountValue)
                );
                const changeMetadata = makeMetadataChangeHandler(change);

                return (
                    <Container>
                        <Backlink onClick={onBack}>{intl.formatMessage(sectionNames.sales)}</Backlink>
                        <PageHeader
                            title={intl.formatMessage({
                                defaultMessage: "Create Sale",
                                id: "2E1xZ0",
                                description: "page header",
                            })}
                        />
                        <Grid>
                            <div>
                                <SaleInfo
                                    data={data}
                                    disabled={disabled}
                                    errors={errors}
                                    onChange={change}
                                />
                                <CardSpacer />
                                <SaleType data={data} disabled={disabled} onChange={change} />
                                <CardSpacer />
                                <SaleValue
                                    data={data}
                                    disabled={disabled}
                                    errors={errors}
                                    onChange={handleChannelChange}
                                />
                                <CardSpacer />
                                <DiscountDates
                                    data={data}
                                    disabled={disabled}
                                    errors={errors}
                                    onChange={change}
                                />
                            </div>
                            <div>
                                <ChannelsAvailabilityCard
                                    managePermissions={[PermissionEnum.MANAGE_DISCOUNTS]}
                                    selectedChannelsCount={data.channelListings.length}
                                    allChannelsCount={allChannelsCount}
                                    channelsList={data.channelListings.map((channel) => ({
                                        id: channel.id,
                                        name: channel.name,
                                    }))}
                                    disabled={disabled}
                                    openModal={openChannelsModal}
                                />
                            </div>
                            <Metadata data={data} onChange={changeMetadata} />
                        </Grid>
                        <Savebar
                            disabled={disabled || formDisabled || !hasChanged}
                            onCancel={onBack}
                            onSubmit={submit}
                            state={saveButtonBarState}
                        />
                    </Container>
                );
            }}
        </Form>
    );
};

SaleCreatePage.displayName = "SaleCreatePage";

export default SaleCreatePage;
