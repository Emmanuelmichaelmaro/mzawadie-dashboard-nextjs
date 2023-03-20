// @ts-nocheck
import CardSpacer from "@mzawadie/components/CardSpacer";
import { ChannelsAvailabilityCard } from "@mzawadie/components/ChannelsAvailabilityCard";
import Container from "@mzawadie/components/Container";
import { Form } from "@mzawadie/components/Form";
import { Grid } from "@mzawadie/components/Grid";
import { Metadata } from "@mzawadie/components/Metadata";
import { PageHeader } from "@mzawadie/components/PageHeader";
import Savebar from "@mzawadie/components/Savebar";
import { sectionNames } from "@mzawadie/core";
import { DiscountErrorFragment, PermissionEnum, VoucherTypeEnum } from "@mzawadie/graphql";
import { SubmitPromise } from "@mzawadie/hooks/useForm";
import { ChannelVoucherData } from "@mzawadie/pages/channels/utils";
import {
    createChannelsChangeHandler,
    createDiscountTypeChangeHandler,
} from "@mzawadie/pages/discounts/handlers";
import { VOUCHER_CREATE_FORM_ID } from "@mzawadie/pages/discounts/views/VoucherCreate/types";
import { validatePrice } from "@mzawadie/pages/products/utils/validation";
import useMetadataChangeTrigger from "@mzawadie/utils/metadata/useMetadataChangeTrigger";
import { ConfirmButtonTransitionState, Backlink } from "@saleor/macaw-ui";
import React from "react";
import { useIntl } from "react-intl";

import { DiscountTypeEnum, RequirementsPicker } from "../../types";
import { VoucherDates } from "../VoucherDates";
import { VoucherDetailsPageFormData } from "../VoucherDetailsPage";
import { VoucherInfo } from "../VoucherInfo";
import { VoucherLimits } from "../VoucherLimits";
import { VoucherRequirements } from "../VoucherRequirements";
import { VoucherTypes } from "../VoucherTypes";
import { VoucherValue } from "../VoucherValue";

export interface FormData extends VoucherDetailsPageFormData {
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
    onSubmit: (data: FormData) => SubmitPromise;
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
        usageLimit: 1,
        used: 0,
        value: 0,
        metadata: [],
        privateMetadata: [],
    };

    return (
        <Form confirmLeave initial={initialForm} onSubmit={onSubmit} formId={VOUCHER_CREATE_FORM_ID}>
            {({ change, data, hasChanged, submit, triggerChange, set }) => {
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
                                    initialUsageLimit={initialForm.usageLimit}
                                    disabled={disabled}
                                    errors={errors}
                                    onChange={change}
                                    setData={set}
                                    isNewVoucher
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
