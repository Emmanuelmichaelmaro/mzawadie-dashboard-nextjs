import { SearchCollections_search_edges_node } from "@mzawadie/searches/types/SearchCollections";
import React from "react";
import { useIntl } from "react-intl";

import { AssignContainerDialog, AssignContainerDialogProps } from "../AssignContainerDialog";

interface AssignCollectionDialogProps
    extends Omit<AssignContainerDialogProps, "containers" | "title" | "search"> {
    collections: SearchCollections_search_edges_node[];
}

const AssignCollectionDialog: React.FC<AssignCollectionDialogProps> = ({ collections, ...rest }) => {
    const intl = useIntl();

    return (
        <AssignContainerDialog
            containers={collections}
            search={{
                label: intl.formatMessage({
                    defaultMessage: "Search Collection",
                    id: "r/MSdb",
                }),
                placeholder: intl.formatMessage({
                    defaultMessage: "Search by collection name, etc...",
                    id: "3sT9Qy",
                }),
            }}
            title={intl.formatMessage({
                defaultMessage: "Assign Collection",
                id: "5tMkmJ",
                description: "dialog header",
            })}
            {...rest}
        />
    );
};

AssignCollectionDialog.displayName = "AssignCollectionDialog";

export default AssignCollectionDialog;
