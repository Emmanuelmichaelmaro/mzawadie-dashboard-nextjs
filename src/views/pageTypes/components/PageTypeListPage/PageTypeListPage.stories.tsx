// @ts-nocheck
import {
    listActionsProps,
    pageListProps,
    searchPageProps,
    sortPageProps,
    tabPageProps,
} from "@mzawadie/core";
import { PageTypeListUrlSortField } from "@mzawadie/views/pageTypes/urls";
import { storiesOf } from "@storybook/react";
import React from "react";

import PageTypeListPage, { PageTypeListPageProps } from ".";
import { Decorator } from "../../../../../.storybook/decorators";
import { pageTypes } from "../../fixtures";

const props: PageTypeListPageProps = {
    ...listActionsProps,
    ...pageListProps.default,
    ...searchPageProps,
    ...sortPageProps,
    sort: {
        ...sortPageProps.sort,
        sort: PageTypeListUrlSortField.name,
    },
    ...tabPageProps,
    onBack: () => undefined,
    pageTypes,
};

storiesOf("Views / Page types / Page types list", module)
    .addDecorator(Decorator)
    .add("default", () => <PageTypeListPage {...props} />)
    .add("loading", () => <PageTypeListPage {...props} disabled pageTypes={undefined} />)
    .add("no data", () => <PageTypeListPage {...props} pageTypes={[]} />);
