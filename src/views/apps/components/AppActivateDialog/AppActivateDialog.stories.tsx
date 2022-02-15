// @ts-nocheck
import { storiesOf } from "@storybook/react";
import React from "react";

import { Decorator } from "../../../../../.storybook/decorators";
import AppActivateDialog, { AppActivateDialogProps } from "./AppActivateDialog";

const props: AppActivateDialogProps = {
    confirmButtonState: "default",
    name: "App",
    onClose: () => undefined,
    onConfirm: () => undefined,
    open: true,
};

storiesOf("Views / Apps / Activate app", module)
    .addDecorator(Decorator)
    .add("default", () => <AppActivateDialog {...props} />)
    .add("unnamed app", () => <AppActivateDialog {...props} name={null} />);
