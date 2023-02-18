// @ts-nocheck
import { CardSpacer } from "@mzawadie/components/CardSpacer";
import { ChannelsAvailabilityCard } from "@mzawadie/components/ChannelsAvailabilityCard";
import { Container } from "@mzawadie/components/Container";
import { Grid } from "@mzawadie/components/Grid";
import Metadata from "@mzawadie/components/Metadata/Metadata";
import { PageHeader } from "@mzawadie/components/PageHeader";
import Savebar from "@mzawadie/components/Savebar";
import { SeoForm } from "@mzawadie/components/SeoForm";
import { sectionNames, ChannelProps, ListActions, PageListProps } from "@mzawadie/core";
import { CollectionChannelListingErrorFragment } from "@mzawadie/fragments/types/CollectionChannelListingErrorFragment";
import { CollectionErrorFragment } from "@mzawadie/fragments/types/CollectionErrorFragment";
import { SubmitPromise } from "@mzawadie/hooks/useForm";
import { ChannelCollectionData } from "@mzawadie/pages/channels/utils";
import { PermissionEnum } from "@mzawadie/types/globalTypes";
import { ConfirmButtonTransitionState, Backlink } from "@saleor/macaw-ui";
import React from "react";
import { useIntl } from "react-intl";

import { CollectionDetails_collection } from "../../types/CollectionDetails";
import CollectionDetails from "../CollectionDetails/CollectionDetails";
import { CollectionImage } from "../CollectionImage/CollectionImage";
import CollectionProducts from "../CollectionProducts/CollectionProducts";
import CollectionUpdateForm, { CollectionUpdateData } from "./form";

export interface CollectionDetailsPageProps extends PageListProps, ListActions, ChannelProps {
    channelsCount: number;
    channelsErrors: CollectionChannelListingErrorFragment[];
    collection: CollectionDetails_collection;
    currentChannels: ChannelCollectionData[];
    errors: CollectionErrorFragment[];
    hasChannelChanged: boolean;
    saveButtonBarState: ConfirmButtonTransitionState;
    onBack: () => void;
    onCollectionRemove: () => void;
    onImageDelete: () => void;
    onImageUpload: (file: File) => void;
    onProductUnassign: (id: string, event: React.MouseEvent<any>) => void;
    onSubmit: (data: CollectionUpdateData) => SubmitPromise;
    onChannelsChange: (data: ChannelCollectionData[]) => void;
    openChannelsModal: () => void;
}

const CollectionDetailsPage: React.FC<CollectionDetailsPageProps> = ({
    channelsCount,
    channelsErrors,
    collection,
    currentChannels = [],
    disabled,
    errors,
    hasChannelChanged,
    saveButtonBarState,
    selectedChannelId,
    onBack,
    onCollectionRemove,
    onImageDelete,
    onImageUpload,
    onSubmit,
    onChannelsChange,
    openChannelsModal,
    ...collectionProductsProps
}: CollectionDetailsPageProps) => {
    const intl = useIntl();

    return (
        <CollectionUpdateForm
            collection={collection}
            currentChannels={currentChannels}
            setChannels={onChannelsChange}
            onSubmit={onSubmit}
        >
            {({ change, data, handlers, hasChanged, submit }) => (
                <Container>
                    <Backlink onClick={onBack}>{intl.formatMessage(sectionNames.collections)}</Backlink>
                    <PageHeader title={collection?.name} />
                    <Grid>
                        <div>
                            <CollectionDetails
                                data={data}
                                disabled={disabled}
                                errors={errors}
                                onChange={change}
                                onDescriptionChange={handlers.changeDescription}
                            />
                            <CardSpacer />
                            <CollectionImage
                                data={data}
                                image={collection?.backgroundImage}
                                onImageDelete={onImageDelete}
                                onImageUpload={onImageUpload}
                                onChange={change}
                            />
                            <CardSpacer />
                            <Metadata data={data} onChange={handlers.changeMetadata} />
                            <CardSpacer />
                            <CollectionProducts
                                disabled={disabled}
                                collection={collection}
                                {...collectionProductsProps}
                            />
                            <CardSpacer />
                            <SeoForm
                                description={data.seoDescription}
                                disabled={disabled}
                                descriptionPlaceholder=""
                                helperText={intl.formatMessage({
                                    defaultMessage:
                                        "Add search engine title and description to make this collection easier to find",
                                    id: "Rj8LxK",
                                })}
                                errors={errors}
                                slug={data.slug}
                                slugPlaceholder={data.name}
                                title={data.seoTitle}
                                titlePlaceholder={collection?.name}
                                onChange={change}
                            />
                        </div>
                        <div>
                            <div>
                                <ChannelsAvailabilityCard
                                    managePermissions={[PermissionEnum.MANAGE_PRODUCTS]}
                                    messages={{
                                        hiddenLabel: intl.formatMessage({
                                            defaultMessage: "Hidden",
                                            id: "V8FhTt",
                                            description: "collection label",
                                        }),

                                        visibleLabel: intl.formatMessage({
                                            defaultMessage: "Visible",
                                            id: "9vQR6c",
                                            description: "collection label",
                                        }),
                                    }}
                                    errors={channelsErrors}
                                    selectedChannelsCount={data.channelListings.length}
                                    allChannelsCount={channelsCount}
                                    channels={data.channelListings}
                                    disabled={disabled}
                                    onChange={handlers.changeChannels}
                                    openModal={openChannelsModal}
                                />
                            </div>
                        </div>
                    </Grid>
                    <Savebar
                        state={saveButtonBarState}
                        disabled={disabled || (!hasChanged && !hasChannelChanged)}
                        onCancel={onBack}
                        onDelete={onCollectionRemove}
                        onSubmit={submit}
                    />
                </Container>
            )}
        </CollectionUpdateForm>
    );
};

CollectionDetailsPage.displayName = "CollectionDetailsPage";

export default CollectionDetailsPage;
