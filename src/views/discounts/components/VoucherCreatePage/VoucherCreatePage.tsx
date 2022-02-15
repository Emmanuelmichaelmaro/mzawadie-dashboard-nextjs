import CardSpacer from "@mzawadie/components/CardSpacer";
import ChannelsAvailabilityCard from "@mzawadie/components/ChannelsAvailabilityCard";
import { ConfirmButtonTransitionState } from "@mzawadie/components/ConfirmButton";
import Container from "@mzawadie/components/Container";
import Form from "@mzawadie/components/Form";
import Grid from "@mzawadie/components/Grid";
import Metadata, { MetadataFormData } from "@mzawadie/components/Metadata";
import PageHeader from "@mzawadie/components/PageHeader";
import Savebar from "@mzawadie/components/Savebar";
import { sectionNames } from "@mzawadie/core";
import { DiscountErrorFragment } from "@mzawadie/fragments/types/DiscountErrorFragment";
import { PermissionEnum, VoucherTypeEnum } from "@mzawadie/types/globalTypes";
import useMetadataChangeTrigger from "@mzawadie/utils/metadata/useMetadataChangeTrigger";
import { ChannelVoucherData } from "@mzawadie/views/channels/utils";
import {
    createChannelsChangeHandler,
    createDiscountTypeChangeHandler,
} from "@mzawadie/views/discounts/handlers";
import { validatePrice } from "@mzawadie/views/products/utils/validation";
import { Backlink } from "@saleor/macaw-ui";
import React from "react";
import { useIntl } from "react-intl";

import { DiscountTypeEnum, RequirementsPicker } from "../../types";
import VoucherDates from "../VoucherDates";
import VoucherInfo from "../VoucherInfo";
import VoucherLimits from "../VoucherLimits";
import VoucherRequirements from "../VoucherRequirements";
import VoucherTypes from "../VoucherTypes";
import VoucherValue from "../VoucherValue";

export interface FormData extends MetadataFormData {
    applyOncePerCustomer: boolean;
    applyOncePerOrder: boolean;
    onlyForStaff: boolean;
    channelListings: ChannelVoucherData[];
    code: string;
    discountType: DiscountTypeEnum;
    endDate: string;
    endTime: string;
    hasEndDate: boolean;
    hasUsageLimit: boolean;
    minCheckoutItemsQuantity: string;
    requirementsPicker: RequirementsPicker;
    startDate: string;
    startTime: string;
    type: VoucherTypeEnum;
    usageLimit: string;
    value: number;
}

export interface VoucherCreatePageProps {
    allChannelsCount: number;
    channelListings: ChannelVoucherData[];
    hasChannelChanged: boolean;
    disabled: boolean;
    errors: DiscountErrorFragment[];
    saveButtonBarState: ConfirmButtonTransitionState;
    onBack: () => void;
    onChannelsChange: (data: ChannelVoucherData[]) => void;
    openChannelsModal: () => void;
    onSubmit: (data: FormData) => void;
}

const VoucherCreatePage: React.FC<VoucherCreatePageProps> = ({
    allChannelsCount,
    channelListings = [],
    disabled,
    errors,
    saveButtonBarState,
    onBack,
    onChannelsChange,
    onSubmit,
    hasChannelChanged,
    openChannelsModal,
}) => {
    const intl = useIntl();
    const { makeChangeHandler: makeMetadataChangeHandler } = useMetadataChangeTrigger();

    const initialForm: FormData = {
        applyOncePerCustomer: false,
        applyOncePerOrder: false,
        onlyForStaff: false,
        channelListings,
        code: "",
        discountType: DiscountTypeEnum.VALUE_FIXED,
        endDate: "",
        endTime: "",
        hasEndDate: false,
        hasUsageLimit: false,
        minCheckoutItemsQuantity: "0",
        requirementsPicker: RequirementsPicker.NONE,
        startDate: "",
        startTime: "",
        type: VoucherTypeEnum.ENTIRE_ORDER,
        usageLimit: "0",
        value: 0,
        metadata: [],
        privateMetadata: [],
    };

    return (
        <Form initial={initialForm} onSubmit={onSubmit}>
            {({ change, data, hasChanged, submit, triggerChange }) => {
                const handleDiscountTypeChange = createDiscountTypeChangeHandler(change);
                const handleChannelChange = createChannelsChangeHandler(
                    data.channelListings,
                    onChannelsChange,
                    triggerChange
                );
                const formDisabled =
                    data.discountType.toString() !== "SHIPPING" &&
                    data.channelListings?.some(
                        (channel) =>
                            validatePrice(channel.discountValue) ||
                            (data.requirementsPicker === RequirementsPicker.ORDER &&
                                validatePrice(channel.minSpent))
                    );
                const changeMetadata = makeMetadataChangeHandler(change);

                return (
                    <Container>
                        <Backlink onClick={onBack}>
                            {intl.formatMessage(sectionNames.vouchers)}
                        </Backlink>
                        <PageHeader
                            title={intl.formatMessage({
                                defaultMessage: "Create Voucher",
                                id: "PsclSa",
                                description: "page header",
                            })}
                        />
                        <Grid>
                            <div>
                                <VoucherInfo
                                    data={data}
                                    errors={errors}
                                    disabled={disabled}
                                    onChange={(event) => handleDiscountTypeChange(data, event)}
                                    variant="create"
                                />
                                <CardSpacer />
                                <VoucherTypes
                                    data={data}
                                    disabled={disabled}
                                    errors={errors}
                                    onChange={change}
                                />
                                {data.discountType.toString() !== "SHIPPING" ? (
                                    <>
                                        <CardSpacer />
                                        <VoucherValue
                                            data={data}
                                            disabled={disabled}
                                            errors={errors}
                                            onChannelChange={handleChannelChange}
                                            onChange={change}
                                            variant="create"
                                        />
                                    </>
                                ) : null}
                                <CardSpacer />
                                <VoucherRequirements
                                    data={data}
                                    disabled={disabled}
                                    errors={errors}
                                    onChannelChange={handleChannelChange}
                                    onChange={change}
                                />
                                <CardSpacer />
                                <VoucherLimits
                                    data={data}
                                    disabled={disabled}
                                    errors={errors}
                                    onChange={change}
                                />
                                <CardSpacer />
                                <VoucherDates
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
                            disabled={disabled || formDisabled || (!hasChanged && !hasChannelChanged)}
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
VoucherCreatePage.displayName = "VoucherCreatePage";
export default VoucherCreatePage;
