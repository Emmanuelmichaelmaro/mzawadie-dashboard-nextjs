// @ts-nocheck
import { DialogContentText } from "@material-ui/core";
import { ActionDialog } from "@mzawadie/components/ActionDialog";
import { WindowTitle } from "@mzawadie/components/WindowTitle";
import { commonMessages, extractMutationErrors } from "@mzawadie/core";
import { PluginConfigurationExtendedFragment_configuration } from "@mzawadie/fragments/types/PluginConfigurationExtendedFragment";
import useNavigator from "@mzawadie/hooks/useNavigator";
import { useNotifier } from "@mzawadie/hooks/useNotifier";
import useStateFromProps from "@mzawadie/hooks/useStateFromProps";
import { ConfigurationItemInput } from "@mzawadie/types/globalTypes";
import createDialogActionHandlers from "@mzawadie/utils/handlers/dialogActionHandlers";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { PluginSecretFieldDialog } from "../components/PluginSecretFieldDialog";
import { PluginsDetailsPage, PluginDetailsPageFormData } from "../components/PluginsDetailsPage";
import { TypedPluginUpdate } from "../mutations";
import { usePluginDetails } from "../queries";
import { PluginUpdate } from "../types/PluginUpdate";
import { pluginListUrl, pluginUrl, PluginUrlDialog, PluginUrlQueryParams } from "../urls";
import { isSecretField } from "../utils";
import { isPluginGlobal, getConfigByChannelId } from "./utils";

export interface PluginsDetailsProps {
    id: string;
    params: PluginUrlQueryParams;
}

export function getConfigurationInput(
    config: PluginConfigurationExtendedFragment_configuration[] | null,
    input: ConfigurationItemInput[] | null
): ConfigurationItemInput[] | null {
    if (config === null || input === null) {
        return null;
    }

    return input
        .filter((field) => !isSecretField(config, field.name))
        .map((field) => ({
            name: field.name,
            value: field.value.toString(),
        }));
}

export const PluginsDetails: React.FC<PluginsDetailsProps> = ({ id, params }) => {
    const navigate = useNavigator();
    const notify = useNotifier();
    const intl = useIntl();

    const { data: pluginData, loading } = usePluginDetails({
        displayLoader: true,
        variables: { id },
    });

    const plugin = pluginData?.plugin;

    const initialSelectedChannelValue =
        plugin && !isPluginGlobal(plugin.globalConfiguration)
            ? plugin.channelConfigurations[0].channel.id
            : null;

    const [selectedChannelId, setSelectedChannelId] = useStateFromProps(initialSelectedChannelValue);

    const selectedConfig = isPluginGlobal(plugin?.globalConfiguration)
        ? plugin?.globalConfiguration
        : plugin?.channelConfigurations.find(getConfigByChannelId(selectedChannelId));

    const [openModal, closeModal] = createDialogActionHandlers<PluginUrlDialog, PluginUrlQueryParams>(
        navigate,
        (params) => pluginUrl(id, params),
        params
    );

    const handleUpdate = (data: PluginUpdate) => {
        if (data.pluginUpdate?.errors.length === 0) {
            notify({
                status: "success",
                text: intl.formatMessage(commonMessages.savedChanges),
            });
            closeModal();
        }
    };

    return (
        <TypedPluginUpdate onCompleted={handleUpdate}>
            {(pluginUpdate, pluginUpdateOpts) => {
                const formErrors = pluginUpdateOpts.data?.pluginUpdate?.errors || [];

                const handleFieldUpdate = (value: string) =>
                    pluginUpdate({
                        variables: {
                            channelId: selectedChannelId,
                            id,
                            input: {
                                configuration: [
                                    {
                                        name: params.id,
                                        value,
                                    },
                                ],
                            },
                        },
                    });

                const handleSubmit = async (formData: PluginDetailsPageFormData) =>
                    extractMutationErrors(
                        pluginUpdate({
                            variables: {
                                channelId: selectedChannelId,
                                id,
                                input: {
                                    active: formData.active,
                                    configuration: getConfigurationInput(
                                        selectedConfig?.configuration,
                                        formData.configuration
                                    ),
                                },
                            },
                        })
                    );

                return (
                    <>
                        <WindowTitle title={plugin?.name} />
                        <PluginsDetailsPage
                            disabled={loading}
                            errors={formErrors}
                            saveButtonBarState={!params.action ? pluginUpdateOpts.status : "default"}
                            plugin={plugin}
                            onBack={() => navigate(pluginListUrl())}
                            onClear={(id) =>
                                openModal("clear", {
                                    id,
                                })
                            }
                            onEdit={(id) =>
                                openModal("edit", {
                                    id,
                                })
                            }
                            onSubmit={handleSubmit}
                            selectedConfig={selectedConfig}
                            setSelectedChannelId={setSelectedChannelId}
                        />

                        {selectedConfig && (
                            <>
                                <ActionDialog
                                    confirmButtonState={
                                        !!params.action ? pluginUpdateOpts.status : "default"
                                    }
                                    onClose={closeModal}
                                    open={params.action === "clear" && !!params.id}
                                    title={intl.formatMessage({
                                        defaultMessage: "Authorization Field Delete",
                                        id: "N6lfS/",
                                        description: "header",
                                    })}
                                    onConfirm={() => handleFieldUpdate(null)}
                                >
                                    <DialogContentText>
                                        <FormattedMessage
                                            defaultMessage="The plugin may stop working after this field is cleared. Are you sure you want to proceed?"
                                            id="JRfJD9"
                                        />
                                    </DialogContentText>
                                </ActionDialog>

                                <PluginSecretFieldDialog
                                    confirmButtonState={
                                        !!params.action ? pluginUpdateOpts.status : "default"
                                    }
                                    field={selectedConfig?.configuration.find(
                                        (field) => field.name === params.id
                                    )}
                                    onClose={closeModal}
                                    onConfirm={(formData) => handleFieldUpdate(formData.value)}
                                    open={params.action === "edit" && !!params.id}
                                />
                            </>
                        )}
                    </>
                );
            }}
        </TypedPluginUpdate>
    );
};

PluginsDetails.displayName = "PluginsDetails";

export default PluginsDetails;
