// @ts-nocheck
import { Button } from "@material-ui/core";
import { FilterProps } from "@mzawadie/core";
import { makeStyles } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { Filter } from "../Filter";
import { FilterErrorMessages, IFilter } from "../Filter/types";
import { SearchBarProps } from "../SearchBar";
import SearchInput from "../SearchBar/SearchInput";
import { FilterTabs, FilterTab } from "../TableFilter";

export interface FilterBarProps<TKeys extends string = string>
    extends FilterProps<TKeys>,
        SearchBarProps {
    errorMessages?: FilterErrorMessages<TKeys>;
    filterStructure: IFilter<TKeys>;
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
        name: "FilterBar",
    }
);

const FilterBar: React.FC<FilterBarProps> = (props) => {
    const {
        allTabLabel,
        currencySymbol,
        filterStructure,
        currentTab,
        initialSearch,
        searchPlaceholder,
        tabs,
        onAll,
        onSearchChange,
        onFilterChange,
        onFilterAttributeFocus,
        onTabChange,
        onTabDelete,
        onTabSave,
        errorMessages,
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
                    // eslint-disable-next-line react/no-array-index-key
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
                <Filter
                    errorMessages={errorMessages}
                    menu={filterStructure}
                    currencySymbol={currencySymbol}
                    onFilterAdd={onFilterChange}
                    onFilterAttributeFocus={onFilterAttributeFocus}
                />
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

FilterBar.displayName = "FilterBar";

export default FilterBar;
