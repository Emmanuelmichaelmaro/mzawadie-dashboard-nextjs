// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import DefaultPhotoUrl from "@assets/images/avatars/avatar12.png";
import { FormControlLabel, Switch } from "@material-ui/core";
import { getUserInitials, getUserName } from "@mzawadie/core";
import { UserFragment } from "@mzawadie/graphql";
import { makeStyles, UserChipMenu, UserChipMenuItem } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

const useStyles = makeStyles(
    () => ({
        switch: {
            "&&:hover": {
                background: "transparent",
            },
        },
    }),
    {
        name: "UserChip",
    }
);

export interface UserChipProperties {
    isDarkThemeEnabled: boolean;
    user: UserFragment;
    onLogout: () => void;
    onProfileClick: () => void;
    onThemeToggle: () => void;
}

const UserChip: React.FC<UserChipProperties> = ({
    isDarkThemeEnabled,
    user,
    onLogout,
    onProfileClick,
    onThemeToggle,
}) => {
    const classes = useStyles({});
    const intl = useIntl();

    return (
        <UserChipMenu
            initials={getUserInitials(user)}
            name={getUserName(user, true)}
            avatar={user && user.avatar !== null ? user.avatar?.url : DefaultPhotoUrl}
        >
            <UserChipMenuItem onClick={onProfileClick} data-test="accountSettingsButton">
                <FormattedMessage defaultMessage="Account Settings" id="X8+Lpa" description="button" />
            </UserChipMenuItem>

            <UserChipMenuItem onClick={onLogout} data-test="logOutButton">
                <FormattedMessage defaultMessage="Log out" id="qLbse5" description="button" />
            </UserChipMenuItem>

            <UserChipMenuItem leaveOpen data-test="themeSwitch" data-test-is-dark={isDarkThemeEnabled}>
                <FormControlLabel
                    control={
                        <Switch
                            classes={{
                                switchBase: classes.switch,
                            }}
                            checked={isDarkThemeEnabled}
                            color="primary"
                            disableRipple
                        />
                    }
                    label={intl.formatMessage({
                        defaultMessage: "Enable Dark Mode",
                        id: "2r4cTE",
                        description: "button",
                    })}
                    onChange={onThemeToggle}
                />
            </UserChipMenuItem>
        </UserChipMenu>
    );
};

UserChip.displayName = "UserChip";

export default UserChip;
