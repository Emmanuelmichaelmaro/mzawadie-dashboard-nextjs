import { buttonMessages } from "@mzawadie/core";
import { Button, ButtonProps } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage } from "react-intl";

const BackButton: React.FC<ButtonProps> = (props) => (
    <Button data-test-id="back" variant="secondary" color="text" {...props}>
        <FormattedMessage {...buttonMessages.back} />
    </Button>
);

BackButton.displayName = "BackButton";

export default BackButton;
