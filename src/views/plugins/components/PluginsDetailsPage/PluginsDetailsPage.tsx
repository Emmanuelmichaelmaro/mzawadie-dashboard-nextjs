/* eslint-disable array-callback-return */
// @ts-nocheck
import CardSpacer from "@mzawadie/components/CardSpacer";
import { ConfirmButtonTransitionState } from "@mzawadie/components/ConfirmButton";
import Container from "@mzawadie/components/Container";
import Form from "@mzawadie/components/Form";
import Grid from "@mzawadie/components/Grid";
import PageHeader from "@mzawadie/components/PageHeader";
import Savebar from "@mzawadie/components/Savebar";
import { sectionNames, getStringOrPlaceholder } from "@mzawadie/core";
import { PluginErrorFragment } from "@mzawadie/fragments/types/PluginErrorFragment";
import { ChangeEvent } from "@mzawadie/hooks/useForm";
import { ConfigurationItemInput } from "@mzawadie/types/globalTypes";
import { isSecretField } from "@mzawadie/views/plugins/utils";
import { Backlink } from "@saleor/macaw-ui";
import React from "react";
import { useIntl } from "react-intl";

import { Plugin_plugin } from "../../types/Plugin";
import PluginAuthorization from "../PluginAuthorization";
import PluginDetailsChannelsCard from "../PluginDetailsChannelsCard";
import PluginInfo from "../PluginInfo";
import PluginSettings from "../PluginSettings";
import { PluginConfiguration } from "./types";

export interface PluginDetailsPageFormData {
    active: boolean;
    configuration: ConfigurationItemInput[];
}

export interface PluginsDetailsPageProps {
    disabled: boolean;
    errors: PluginErrorFragment[];
    plugin?: Plugin_plugin;
    saveButtonBarState: ConfirmButtonTransitionState;
    onBack: () => void;
    onClear: (field: string) => void;
    onEdit: (field: string) => void;
    onSubmit: (data: PluginDetailsPageFormData) => void;
    selectedConfig?: PluginConfiguration;
    setSelectedChannelId: (channelId: string) => void;
}

const PluginsDetailsPage: React.FC<PluginsDetailsPageProps> = ({
    disabled,
    errors,
    plugin,
    saveButtonBarState,
    onBack,
    onClear,
    onEdit,
    onSubmit,
    selectedConfig,
    setSelectedChannelId,
}) => {
    const intl = useIntl();

    const initialFormData = (): PluginDetailsPageFormData => ({
        active: selectedConfig?.active,
        configuration: selectedConfig?.configuration
            ?.filter((field) => !isSecretField(selectedConfig?.configuration || [], field.name))
            .map((field) => ({
                ...field,
                value: field.value || "",
            })),
    });

    const selectedChannelId = selectedConfig?.channel?.id;

    return (
        <Form initial={initialFormData()} onSubmit={onSubmit} key={selectedChannelId}>
            {({ data, hasChanged, submit, set }) => {
                const onChange = (event: ChangeEvent) => {
                    const { name, value } = event.target;
                    const newData = {
                        active: name === "active" ? value : data.active,
                        configuration: data.configuration,
                    };

                    if (newData.configuration) {
                        newData.configuration.map((item) => {
                            if (item.name === name) {
                                item.value = value;
                            }
                        });

                        selectedConfig.configuration.map((item) => {
                            if (item.name === name) {
                                item.value = value;
                            }
                        });
                    }

                    set(newData);
                };
                return (
                    <Container>
                        <Backlink onClick={onBack}>{intl.formatMessage(sectionNames.plugins)}</Backlink>
                        <PageHeader
                            title={intl.formatMessage(
                                {
                                    defaultMessage: "{pluginName} Details",
                                    id: "EtGDeK",
                                    description: "header",
                                },
                                {
                                    pluginName: getStringOrPlaceholder(plugin?.name),
                                }
                            )}
                        />
                        <Grid variant="inverted">
                            <div>
                                <PluginDetailsChannelsCard
                                    plugin={plugin}
                                    selectedChannelId={selectedChannelId}
                                    setSelectedChannelId={setSelectedChannelId}
                                />
                            </div>
                            <div>
                                <PluginInfo
                                    data={data}
                                    description={plugin?.description || ""}
                                    errors={errors}
                                    name={plugin?.name || ""}
                                    onChange={onChange}
                                />
                                <CardSpacer />
                                {data.configuration && (
                                    <div>
                                        <PluginSettings
                                            data={data}
                                            fields={selectedConfig?.configuration || []}
                                            errors={errors}
                                            disabled={disabled}
                                            onChange={onChange}
                                        />
                                        {selectedConfig?.configuration.some((field) =>
                                            isSecretField(selectedConfig?.configuration, field.name)
                                        ) && (
                                            <>
                                                <CardSpacer />
                                                <PluginAuthorization
                                                    fields={selectedConfig?.configuration}
                                                    onClear={onClear}
                                                    onEdit={onEdit}
                                                />
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>
                        </Grid>
                        <Savebar
                            disabled={disabled || !hasChanged}
                            state={saveButtonBarState}
                            onCancel={onBack}
                            onSubmit={submit}
                        />
                    </Container>
                );
            }}
        </Form>
    );
};

export default PluginsDetailsPage;
