// @ts-nocheck
import { storiesOf } from "@storybook/react";
import React from "react";

import { Decorator } from "../../../../../.storybook/decorators";
import AppInProgressDeleteDialog, { AppInProgressDeleteDialogProps } from "./AppInProgressDeleteDialog";

const props: AppInProgressDeleteDialogProps = {
    confirmButtonState: "default",
    name: "App",
    onClose: () => undefined,
    onConfirm: () => undefined,
    open: true,
};

storiesOf("Views / Apps / Delete app failed installation", module)
    .addDecorator(Decorator)
    .add("default", () => <AppInProgressDeleteDialog {...props} />)
    .add("unnamed app", () => <AppInProgressDeleteDialog {...props} name={null} />);
