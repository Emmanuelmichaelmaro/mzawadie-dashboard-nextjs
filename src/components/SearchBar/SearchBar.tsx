/* eslint-disable react/no-array-index-key */
import { Button } from "@material-ui/core";
import { SearchPageProps, TabPageProps } from "@mzawadie/core";
import { makeStyles } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { FilterTabs, FilterTab } from "../TableFilter";
import SearchInput from "./SearchInput";

export interface SearchBarProps extends SearchPageProps, TabPageProps {
    allTabLabel: string;
    searchPlaceholder: string;
}

const useStyles = makeStyles(
    (theme) => ({
        root: {
            borderBottom: `1px solid ${theme.palette.divider}`,
            display: "flex",
            flexWrap: "wrap",
            padding: theme.spacing(1, 3),
        },
        tabActionButton: {
            marginLeft: theme.spacing(2),
            paddingLeft: theme.spacing(3),
            paddingRight: theme.spacing(3),
        },
    }),
    {
        name: "SearchBar",
    }
);

const SearchBar: React.FC<SearchBarProps> = (props) => {
    const {
        allTabLabel,
        currentTab,
        initialSearch,
        onSearchChange,
        searchPlaceholder,
        tabs,
        onAll,
        onTabChange,
        onTabDelete,
        onTabSave,
    } = props;

    const classes = useStyles(props);
    const intl = useIntl();

    const isCustom = currentTab === tabs.length + 1;
    const displayTabAction = isCustom ? "save" : currentTab === 0 ? null : "delete";

    return (
        <>
            <FilterTabs currentTab={currentTab}>
                <FilterTab label={allTabLabel} onClick={onAll} />
                {tabs.map((tab, tabIndex) => (
                    <FilterTab onClick={() => onTabChange(tabIndex + 1)} label={tab} key={tabIndex} />
                ))}
                {isCustom && (
                    <FilterTab
                        onClick={() => undefined}
                        label={intl.formatMessage({
                            defaultMessage: "Custom Filter",
                            id: "qIgdO6",
                        })}
                    />
                )}
            </FilterTabs>
            <div className={classes.root}>
                <SearchInput
                    initialSearch={initialSearch}
                    placeholder={searchPlaceholder}
                    onSearchChange={onSearchChange}
                />
                {displayTabAction &&
                    (displayTabAction === "save" ? (
                        <Button className={classes.tabActionButton} color="primary" onClick={onTabSave}>
                            <FormattedMessage
                                defaultMessage="Save Search"
                                id="DEa1T1"
                                description="button"
                            />
                        </Button>
                    ) : (
                        displayTabAction === "delete" && (
                            <Button
                                className={classes.tabActionButton}
                                color="primary"
                                onClick={onTabDelete}
                            >
                                <FormattedMessage
                                    defaultMessage="Delete Search"
                                    id="QCwBUI"
                                    description="button"
                                />
                            </Button>
                        )
                    ))}
            </div>
        </>
    );
};

SearchBar.displayName = "SearchBar";

export default SearchBar;
