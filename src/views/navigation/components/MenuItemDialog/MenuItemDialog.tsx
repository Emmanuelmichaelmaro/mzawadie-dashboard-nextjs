// @ts-nocheck
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Typography,
} from "@material-ui/core";
import AutocompleteSelectMenu from "@mzawadie/components/AutocompleteSelectMenu";
import ConfirmButton, { ConfirmButtonTransitionState } from "@mzawadie/components/ConfirmButton";
import FormSpacer from "@mzawadie/components/FormSpacer";
import { buttonMessages, sectionNames } from "@mzawadie/core";
import { MenuErrorFragment } from "@mzawadie/fragments/types/MenuErrorFragment";
import useModalDialogErrors from "@mzawadie/hooks/useModalDialogErrors";
import useModalDialogOpen from "@mzawadie/hooks/useModalDialogOpen";
import useStateFromProps from "@mzawadie/hooks/useStateFromProps";
import { getFieldError, getFormErrors } from "@mzawadie/utils/errors";
import getMenuErrorMessage from "@mzawadie/utils/errors/menu";
import { getMenuItemByValue, IMenu } from "@mzawadie/utils/menu";
import { SearchCategories_search_edges_node } from "@mzawadie/views/searches/types/SearchCategories";
import { SearchCollections_search_edges_node } from "@mzawadie/views/searches/types/SearchCollections";
import { SearchPages_search_edges_node } from "@mzawadie/views/searches/types/SearchPages";
import isUrl from "is-url";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

export type MenuItemType = "category" | "collection" | "link" | "page";
export interface MenuItemData {
    id: string;
    type: MenuItemType;
}

export interface MenuItemDialogFormData extends MenuItemData {
    name: string;
}

export interface MenuItemDialogProps {
    confirmButtonState: ConfirmButtonTransitionState;
    disabled: boolean;
    errors: MenuErrorFragment[];
    initial?: MenuItemDialogFormData;
    initialDisplayValue?: string;
    loading: boolean;
    open: boolean;
    collections: SearchCollections_search_edges_node[];
    categories: SearchCategories_search_edges_node[];
    pages: SearchPages_search_edges_node[];
    onClose: () => void;
    onSubmit: (data: MenuItemDialogFormData) => void;
    onQueryChange: (query: string) => void;
}

const defaultInitial: MenuItemDialogFormData = {
    id: "",
    name: "",
    type: "category",
};

function getMenuItemData(value: string): MenuItemData {
    const [type, ...idParts] = value.split(":");
    return {
        id: idParts.join(":"),
        type: type as MenuItemType,
    };
}

function getDisplayValue(menu: IMenu, value: string): string {
    const menuItemData = getMenuItemData(value);
    if (menuItemData.type === "link") {
        return menuItemData.id;
    }
    return getMenuItemByValue(menu, value).label.toString();
}

const MenuItemDialog: React.FC<MenuItemDialogProps> = ({
    confirmButtonState,
    disabled,
    errors: apiErrors,
    initial,
    initialDisplayValue,
    loading,
    onClose,
    onSubmit,
    onQueryChange,
    open,
    categories,
    collections,
    pages,
}) => {
    const intl = useIntl();
    const errors = useModalDialogErrors(apiErrors, open);
    const [displayValue, setDisplayValue] = React.useState(initialDisplayValue || "");
    const [data, setData] = useStateFromProps<MenuItemDialogFormData>(initial || defaultInitial);
    const [url, setUrl] = React.useState<string | undefined>(undefined);

    // Reset input state after closing dialog
    useModalDialogOpen(open, {
        onClose: () => {
            setData(initial || defaultInitial);
            setDisplayValue(initialDisplayValue);
            setUrl(undefined);
        },
    });

    // Refresh initial display value if changed
    React.useEffect(() => setDisplayValue(initialDisplayValue), [initialDisplayValue]);

    const mutationErrors = errors.filter((err) => err.field === null);
    const formErrors = getFormErrors(["name"], errors);
    const testIds = ["category", "collection", "page", "url"];
    const idError = ["category", "collection", "page", "url"]
        .map((field) => getFieldError(errors, field))
        .reduce((acc, err) => acc || err);

    let options: IMenu = [];

    if (categories.length > 0) {
        options = [
            ...options,
            {
                children: categories.map((category) => ({
                    children: [],
                    data: {},
                    label: category.name,
                    value: `category:${category.id}`,
                })),
                data: {},
                label: intl.formatMessage(sectionNames.categories),
            },
        ];
    }

    if (collections.length > 0) {
        options = [
            ...options,
            {
                children: collections.map((collection) => ({
                    children: [],
                    data: {},
                    label: collection.name,
                    value: `collection:${collection.id}`,
                })),
                data: {},
                label: intl.formatMessage(sectionNames.collections),
            },
        ];
    }

    if (pages.length > 0) {
        options = [
            ...options,
            {
                children: pages.map((page) => ({
                    children: [],
                    data: {},
                    label: page.title,
                    value: `page:${page.id}`,
                })),
                data: {},
                label: intl.formatMessage(sectionNames.pages),
            },
        ];
    }

    if (url) {
        options = [
            {
                children: [],
                data: {},
                label: (
                    <FormattedMessage
                        defaultMessage="Link to: {url}"
                        description="add link to navigation"
                        id="fzDI3A"
                        values={{
                            url: <strong>{url}</strong>,
                        }}
                    />
                ),
                value: `link:${url}`,
            },
        ];
    }

    const handleQueryChange = (query: string) => {
        if (isUrl(query)) {
            setUrl(query);
        } else if (isUrl(`http://${query}`)) {
            setUrl(`http://${query}`);
        } else if (url) {
            setUrl(undefined);
        }
        onQueryChange(query);
    };

    const handleSelectChange = (event: React.ChangeEvent<any>) => {
        const { value } = event.target;
        const menuItemData = getMenuItemData(value);

        setData((value) => ({
            ...value,
            ...menuItemData,
        }));
        setDisplayValue(getDisplayValue(options, value));
    };

    const handleSubmit = () => onSubmit(data);

    return (
        <Dialog
            onClose={onClose}
            open={open}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                style: { overflowY: "visible" },
            }}
        >
            <DialogTitle>
                {initial
                    ? intl.formatMessage({
                          defaultMessage: "Edit Item",
                          description: "edit menu item, header",
                          id: "KKQUMK",
                      })
                    : intl.formatMessage({
                          defaultMessage: "Add Item",
                          description: "create new menu item, header",
                          id: "H3Uirw",
                      })}
            </DialogTitle>
            <DialogContent style={{ overflowY: "visible" }}>
                <TextField
                    disabled={disabled}
                    label={intl.formatMessage({
                        defaultMessage: "Name",
                        description: "menu item name",
                        id: "0Vyr8h",
                    })}
                    fullWidth
                    value={data.name}
                    onChange={(event) =>
                        setData((value) => ({
                            ...value,
                            name: event.target.value,
                        }))
                    }
                    name="name"
                    error={!!formErrors.name}
                    helperText={getMenuErrorMessage(formErrors.name, intl)}
                />
                <FormSpacer />
                <AutocompleteSelectMenu
                    disabled={disabled}
                    onChange={handleSelectChange}
                    name="id"
                    label={intl.formatMessage({
                        defaultMessage: "Link",
                        description: "label",
                        id: "Urh2N3",
                    })}
                    displayValue={displayValue}
                    loading={loading}
                    options={options}
                    testIds={testIds}
                    error={!!idError}
                    helperText={getMenuErrorMessage(idError, intl)}
                    placeholder={intl.formatMessage({
                        defaultMessage: "Start typing to begin search...",
                        id: "28GZnc",
                    })}
                    onInputChange={handleQueryChange}
                />
                {mutationErrors.length > 0 && (
                    <>
                        <FormSpacer />
                        {mutationErrors.map((err) => (
                            <Typography key={err.code} color="error">
                                {getMenuErrorMessage(err, intl)}
                            </Typography>
                        ))}
                    </>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>
                    <FormattedMessage {...buttonMessages.back} />
                </Button>
                <ConfirmButton
                    data-test="submit"
                    transitionState={confirmButtonState}
                    color="primary"
                    variant="contained"
                    onClick={handleSubmit}
                >
                    <FormattedMessage {...buttonMessages.confirm} />
                </ConfirmButton>
            </DialogActions>
        </Dialog>
    );
};
MenuItemDialog.displayName = "MenuItemDialog";
export default MenuItemDialog;
