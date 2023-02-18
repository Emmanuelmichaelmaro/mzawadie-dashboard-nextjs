// @ts-nocheck
import { CardSpacer } from "@mzawadie/components/CardSpacer";
import { ChannelsAvailabilityCard } from "@mzawadie/components/ChannelsAvailabilityCard";
import { Container } from "@mzawadie/components/Container";
import { Grid } from "@mzawadie/components/Grid";
import { Metadata } from "@mzawadie/components/Metadata";
import { PageHeader } from "@mzawadie/components/PageHeader";
import Savebar from "@mzawadie/components/Savebar";
import { SeoForm } from "@mzawadie/components/SeoForm";
import { sectionNames } from "@mzawadie/core";
import { CollectionChannelListingErrorFragment } from "@mzawadie/fragments/types/CollectionChannelListingErrorFragment";
import { CollectionErrorFragment } from "@mzawadie/fragments/types/CollectionErrorFragment";
import { SubmitPromise } from "@mzawadie/hooks/useForm";
import { ChannelCollectionData } from "@mzawadie/pages/channels/utils";
import { PermissionEnum } from "@mzawadie/types/globalTypes";
import { ConfirmButtonTransitionState, Backlink } from "@saleor/macaw-ui";
import React from "react";
import { useIntl } from "react-intl";

import CollectionDetails from "../CollectionDetails/CollectionDetails";
import { CollectionImage } from "../CollectionImage/CollectionImage";
import CollectionCreateForm, { CollectionCreateData } from "./form";

export interface CollectionCreatePageProps {
    channelsCount: number;
    channelsErrors: CollectionChannelListingErrorFragment[];
    currentChannels: ChannelCollectionData[];
    disabled: boolean;
    errors: CollectionErrorFragment[];
    saveButtonBarState: ConfirmButtonTransitionState;
    onBack: () => void;
    onSubmit: (data: CollectionCreateData) => SubmitPromise;
    onChannelsChange: (data: ChannelCollectionData[]) => void;
    openChannelsModal: () => void;
}

const CollectionCreatePage: React.FC<CollectionCreatePageProps> = ({
    channelsCount,
    channelsErrors,
    currentChannels = [],
    disabled,
    errors,
    saveButtonBarState,
    onBack,
    onChannelsChange,
    openChannelsModal,
    onSubmit,
}: CollectionCreatePageProps) => {
    const intl = useIntl();

    return (
        <CollectionCreateForm
            onSubmit={onSubmit}
            currentChannels={currentChannels}
            setChannels={onChannelsChange}
        >
            {({ change, data, handlers, hasChanged, submit }) => (
                <Container>
                    <Backlink onClick={onBack}>{intl.formatMessage(sectionNames.collections)}</Backlink>
                    <PageHeader
                        title={intl.formatMessage({
                            defaultMessage: "Add Collection",
                            id: "Fxa6xp",
                            description: "page header",
                        })}
                    />
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
                                image={
                                    data.backgroundImage.url
                                        ? {
                                              __typename: "Image",
                                              alt: data.backgroundImageAlt,
                                              url: data.backgroundImage.url,
                                          }
                                        : null
                                }
                                onImageDelete={() =>
                                    change({
                                        target: {
                                            name: "backgroundImage",
                                            value: {
                                                url: null,
                                                value: null,
                                            },
                                        },
                                    } as any)
                                }
                                onImageUpload={(file) =>
                                    change({
                                        target: {
                                            name: "backgroundImage",
                                            value: {
                                                url: URL.createObjectURL(file),
                                                value: file,
                                            },
                                        },
                                    } as any)
                                }
                                onChange={change}
                                data={data}
                            />
                            <CardSpacer />
                            <SeoForm
                                allowEmptySlug
                                description={data.seoDescription}
                                disabled={disabled}
                                descriptionPlaceholder=""
                                helperText={intl.formatMessage({
                                    defaultMessage:
                                        "Add search engine title and description to make this collection easier to find",
                                    id: "Rj8LxK",
                                })}
                                slug={data.slug}
                                slugPlaceholder={data.name}
                                title={data.seoTitle}
                                titlePlaceholder={data.name}
                                onChange={change}
                            />
                            <CardSpacer />
                            <Metadata data={data} onChange={handlers.changeMetadata} />
                        </div>
                        <div>
                            <ChannelsAvailabilityCard
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
                                managePermissions={[PermissionEnum.MANAGE_PRODUCTS]}
                                errors={channelsErrors}
                                selectedChannelsCount={data.channelListings.length}
                                allChannelsCount={channelsCount}
                                channels={data.channelListings}
                                disabled={disabled}
                                onChange={handlers.changeChannels}
                                openModal={openChannelsModal}
                            />
                        </div>
                    </Grid>
                    <Savebar
                        state={saveButtonBarState}
                        disabled={disabled || !hasChanged}
                        onCancel={onBack}
                        onSubmit={submit}
                    />
                </Container>
            )}
        </CollectionCreateForm>
    );
};

CollectionCreatePage.displayName = "CollectionCreatePage";

export default CollectionCreatePage;
