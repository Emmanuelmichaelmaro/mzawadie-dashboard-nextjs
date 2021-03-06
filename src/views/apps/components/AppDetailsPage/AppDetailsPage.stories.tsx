// @ts-nocheck
import { storiesOf } from "@storybook/react";
import React from "react";

import { Decorator } from "../../../../../.storybook/decorators";
import { appDetails } from "../../fixtures";
import AppDetailsPage, { AppDetailsPageProps } from "./AppDetailsPage";

const props: AppDetailsPageProps = {
    data: appDetails,
    loading: false,
    navigateToAppSettings: () => undefined,
    onAppActivateOpen: () => undefined,
    onAppDeactivateOpen: () => undefined,
    onBack: () => undefined,
};

storiesOf("Views / Apps / App details", module)
    .addDecorator(Decorator)
    .add("default", () => <AppDetailsPage {...props} />)
    .add("loading", () => <AppDetailsPage {...props} loading />);
