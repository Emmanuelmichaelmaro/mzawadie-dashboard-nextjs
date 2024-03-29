import {
    Card,
    CardContent,
    Checkbox,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Typography,
} from "@material-ui/core";
import { CardTitle } from "@mzawadie/components/CardTitle";
import Skeleton from "@mzawadie/components/Skeleton";
import { useUser } from "@mzawadie/pages/auth";
import { PermissionData } from "@mzawadie/pages/permissionGroups/components/PermissionGroupDetailsPage";
import { makeStyles } from "@saleor/macaw-ui";
import React from "react";
import { useIntl } from "react-intl";

const useStyles = makeStyles(
    (theme) => ({
        checkboxContainer: {
            marginTop: theme.spacing(),
        },
        hr: {
            backgroundColor: theme.palette.divider,
            border: "none",
            height: 1,
            marginBottom: 0,
            marginTop: 0,
        },
    }),
    { name: "AccountPermissions" }
);

interface AccountPermissionsProps {
    permissions: PermissionData[];
    permissionsExceeded: boolean;
    data: {
        hasFullAccess: boolean;
        permissions: string[];
    };
    disabled: boolean;
    description: string;
    errorMessage: string | undefined;
    fullAccessLabel: string;
    onChange: (event: React.ChangeEvent<any>, cb?: () => void) => void;
}

const AccountPermissions: React.FC<AccountPermissionsProps> = (props) => {
    const {
        data,
        disabled,
        permissions,
        permissionsExceeded,
        onChange,
        description,
        fullAccessLabel,
        errorMessage,
    } = props;

    const classes = useStyles(props);
    const intl = useIntl();
    const { user } = useUser();

    const handleFullAccessChange = () => {
        onChange({
            target: {
                name: "permissions",
                value: !data.hasFullAccess ? permissions.map((perm) => perm.code) : [],
            },
        } as any);
        onChange({
            target: {
                name: "hasFullAccess",
                value: !data.hasFullAccess,
            },
        } as any);
    };

    const handlePermissionChange = (key: string, value: boolean) => () => {
        onChange({
            target: {
                name: "permissions",
                value: !value
                    ? data.permissions.concat([key])
                    : data.permissions.filter((perm) => perm !== key),
            },
        } as any);
    };

    return (
        <Card>
            <CardTitle
                title={intl.formatMessage({
                    defaultMessage: "Permissions",
                    id: "Fbr4Vp",
                    description: "dialog header",
                })}
            />

            {permissionsExceeded && (
                <>
                    <CardContent>
                        <Typography variant="body2">
                            {intl.formatMessage({
                                defaultMessage:
                                    "This groups permissions exceeds your own. You are able only to manage permissions that you have.",
                                id: "MVU6ol",
                                description: "exceeded permissions description",
                            })}
                        </Typography>
                    </CardContent>

                    <hr className={classes.hr} />

                    <CardContent>
                        <Typography variant="body2">
                            {intl.formatMessage({
                                defaultMessage: "Available permissions",
                                id: "6cS4Rd",
                                description: "card section description",
                            })}
                        </Typography>

                        <List dense>
                            {user?.userPermissions?.map((perm) => (
                                <ListItem key={perm?.code}>
                                    <ListItemText primary={`- ${perm?.name}`} />
                                </ListItem>
                            ))}
                        </List>
                    </CardContent>
                </>
            )}

            {!permissionsExceeded && (
                <>
                    <CardContent>
                        <Typography variant="body2">{description}</Typography>

                        <ListItem role={undefined} dense button onClick={handleFullAccessChange}>
                            <ListItemIcon>
                                <Checkbox
                                    data-test-id="fullAccess"
                                    color="primary"
                                    edge="start"
                                    checked={data.hasFullAccess}
                                    disabled={disabled}
                                    tabIndex={-1}
                                    disableRipple
                                    inputProps={{ "aria-labelledby": "fullAccess" }}
                                />
                            </ListItemIcon>

                            <ListItemText primary={fullAccessLabel} />
                        </ListItem>
                    </CardContent>

                    {!data.hasFullAccess && (
                        <>
                            <hr className={classes.hr} />

                            <CardContent>
                                {permissions === undefined ? (
                                    <Skeleton />
                                ) : (
                                    permissions.map((perm) => (
                                        <ListItem
                                            key={perm.code}
                                            disabled={perm.disabled}
                                            role={undefined}
                                            dense
                                            button
                                            onClick={handlePermissionChange(
                                                perm.code,
                                                data.permissions.filter(
                                                    (userPerm) => userPerm === perm.code
                                                ).length === 1
                                            )}
                                        >
                                            <ListItemIcon>
                                                <Checkbox
                                                    color="primary"
                                                    edge="start"
                                                    checked={
                                                        data.permissions.filter(
                                                            (userPerm) => userPerm === perm.code
                                                        ).length === 1
                                                    }
                                                    tabIndex={-1}
                                                    disableRipple
                                                    name={perm.code}
                                                    inputProps={{ "aria-labelledby": perm.code }}
                                                />
                                            </ListItemIcon>

                                            <ListItemText
                                                id={perm.code}
                                                primary={perm.name.replace(/\./, "")}
                                                secondary={
                                                    perm.lastSource &&
                                                    intl.formatMessage({
                                                        defaultMessage:
                                                            "This group is last source of that permission",
                                                        id: "VmMDLN",
                                                        description: "permission list item description",
                                                    })
                                                }
                                            />
                                        </ListItem>
                                    ))
                                )}
                            </CardContent>
                        </>
                    )}

                    {!!errorMessage && (
                        <>
                            <hr className={classes.hr} />
                            <CardContent>
                                <Typography variant="body2" color="error">
                                    {errorMessage}
                                </Typography>
                            </CardContent>
                        </>
                    )}
                </>
            )}
        </Card>
    );
};

AccountPermissions.displayName = "AccountPermissions";

export default AccountPermissions;
