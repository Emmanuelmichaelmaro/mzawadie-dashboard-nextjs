// @ts-nocheck
import { storiesOf } from "@storybook/react";
import React from "react";

import { Decorator } from "../../../../../.storybook/decorators";
import { appDetails } from "../../fixtures";
import AppDetailsSettingsPage, { AppDetailsSettingsPageProps } from "./AppDetailsSettingsPage";

const props: AppDetailsSettingsPageProps = {
    backendHost: "host",
    data: appDetails,
    navigateToDashboard: () => undefined,
    onBack: () => undefined,
    onError: () => undefined,
};

storiesOf("Views / Apps / App details settings", module)
    .addDecorator(Decorator)
    .add("default", () => <AppDetailsSettingsPage {...props} />);
