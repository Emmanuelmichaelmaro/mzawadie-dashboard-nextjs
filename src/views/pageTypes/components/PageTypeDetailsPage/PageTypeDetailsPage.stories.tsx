// @ts-nocheck
import { listActionsProps } from "@mzawadie/core";
import { PageErrorCode } from "@mzawadie/types/globalTypes";
import { storiesOf } from "@storybook/react";
import React from "react";

import PageTypeDetailsPage, { PageTypeDetailsPageProps } from ".";
import { Decorator } from "../../../../../.storybook/decorators";
import { pageType } from "../../fixtures";

const props: Omit<PageTypeDetailsPageProps, "classes"> = {
    attributeList: listActionsProps,
    disabled: false,
    errors: [],
    onAttributeAdd: () => undefined,
    onAttributeClick: () => undefined,
    onAttributeReorder: () => undefined,
    onAttributeUnassign: () => undefined,
    onBack: () => undefined,
    onDelete: () => undefined,
    onSubmit: () => undefined,
    pageTitle: pageType.name,
    pageType,
    saveButtonBarState: "default",
};

storiesOf("Views / Page types / Page type details", module)
    .addDecorator(Decorator)
    .add("default", () => <PageTypeDetailsPage {...props} />)
    .add("loading", () => (
        <PageTypeDetailsPage {...props} disabled pageTitle={undefined} pageType={undefined} />
    ))
    .add("no attributes", () => (
        <PageTypeDetailsPage
            {...props}
            pageType={{
                ...pageType,
                attributes: [],
            }}
        />
    ))
    .add("form errors", () => (
        <PageTypeDetailsPage
            {...props}
            errors={[
                {
                    code: PageErrorCode.REQUIRED,
                    field: "name",
                },
            ].map((err) => ({
                __typename: "PageError",
                ...err,
            }))}
        />
    ));
