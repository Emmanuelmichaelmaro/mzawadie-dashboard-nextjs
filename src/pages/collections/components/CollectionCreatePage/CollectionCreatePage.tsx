// @ts-nocheck
import { Backlink } from "@mzawadie/components/Backlink";
import { CardSpacer } from "@mzawadie/components/CardSpacer";
import { ChannelsAvailabilityCard } from "@mzawadie/components/ChannelsAvailabilityCard";
import { Container } from "@mzawadie/components/Container";
import { Grid } from "@mzawadie/components/Grid";
import { Metadata } from "@mzawadie/components/Metadata";
import { PageHeader } from "@mzawadie/components/PageHeader";
import Savebar from "@mzawadie/components/Savebar";
import { SeoForm } from "@mzawadie/components/SeoForm";
import { sectionNames } from "@mzawadie/core";
import {
    CollectionChannelListingErrorFragment,
    CollectionErrorFragment,
    PermissionEnum,
} from "@mzawadie/graphql";
import { SubmitPromise } from "@mzawadie/hooks/useForm";
import useNavigator from "@mzawadie/hooks/useNavigator";
import { ChannelCollectionData } from "@mzawadie/pages/channels/utils";
import { collectionListUrl } from "@mzawadie/pages/collections/urls";
import { ConfirmButtonTransitionState } from "@saleor/macaw-ui";
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
    onChannelsChange,
    openChannelsModal,
    onSubmit,
}: CollectionCreatePageProps) => {
    const intl = useIntl();
    const navigate = useNavigator();

    return (
        <CollectionCreateForm
            onSubmit={onSubmit}
            currentChannels={currentChannels}
            setChannels={onChannelsChange}
            disabled={disabled}
        >
            {({ change, data, handlers, submit, isSaveDisabled }) => (
                <Container>
                    <Backlink href={collectionListUrl()}>
                        {intl.formatMessage(sectionNames.collections)}
                    </Backlink>

                    <PageHeader
                        title={intl.formatMessage({
                            id: "Fxa6xp",
                            defaultMessage: "Add Collection",
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
                                allowEmptySlug={true}
                                description={data.seoDescription}
                                disabled={disabled}
                                descriptionPlaceholder=""
                                helperText={intl.formatMessage({
                                    id: "Rj8LxK",
                                    defaultMessage:
                                        "Add search engine title and description to make this collection easier to find",
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
                                        id: "V8FhTt",
                                        defaultMessage: "Hidden",
                                        description: "collection label",
                                    }),

                                    visibleLabel: intl.formatMessage({
                                        id: "9vQR6c",
                                        defaultMessage: "Visible",
                                        description: "collection label",
                                    }),
                                }}
                                managePermissions={[PermissionEnum.MANAGE_PRODUCTS]}
                                errors={channelsErrors}
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
                        disabled={isSaveDisabled}
                        onCancel={() => navigate(collectionListUrl())}
                        onSubmit={submit}
                    />
                </Container>
            )}
        </CollectionCreateForm>
    );
};

CollectionCreatePage.displayName = "CollectionCreatePage";

export default CollectionCreatePage;
