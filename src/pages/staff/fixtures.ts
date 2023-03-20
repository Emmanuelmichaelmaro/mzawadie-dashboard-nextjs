// @ts-nocheck
import avatarImage from "@assets/images/avatars/avatar1.png";
import { permissions, RelayToFlat } from "@mzawadie/core";
import { StaffListQuery, StaffMemberDetailsFragment } from "@mzawadie/graphql";

export const staffMembers: RelayToFlat<StaffListQuery["staffUsers"]> = [
    {
        avatar: {
            __typename: "Image" as const,
            url: avatarImage,
        },
        email: "admin@example.com",
        firstName: "Chris",
        id: "VXNlcjoyMQ==",
        isActive: true,
        lastName: "Cooper",
    },
    {
        avatar: {
            __typename: "Image" as const,
            url: avatarImage,
        },
        email: "admin@example.com",
        firstName: "Jacob",
        id: "VXNlcjoyMQ==",
        isActive: false,
        lastName: "Smith",
    },
    {
        avatar: {
            __typename: "Image" as const,
            url: avatarImage,
        },
        email: "admin@example.com",
        firstName: "Jacob",
        id: "VXNlcjoyMQ==",
        isActive: true,
        lastName: "Smith",
    },
    {
        avatar: {
            __typename: "Image" as const,
            url: avatarImage,
        },
        email: "admin@example.com",
        firstName: "Jacob",
        id: "VXNlcjoyMQ==",
        isActive: true,
        lastName: "Smith",
    },
    {
        avatar: {
            __typename: "Image" as const,
            url: avatarImage,
        },
        email: "admin@example.com",
        firstName: "Jacob",
        id: "VXNlcjoyMQ==",
        isActive: true,
        lastName: "Smith",
    },
    {
        avatar: {
            __typename: "Image" as const,
            url: avatarImage,
        },
        email: "admin@example.com",
        firstName: "Jacob",
        id: "VXNlcjoyMQ==",
        isActive: true,
        lastName: "Smith",
    },
    {
        avatar: {
            __typename: "Image" as const,
            url: avatarImage,
        },
        email: "admin@example.com",
        firstName: "Jacob",
        id: "VXNlcjoyMQ==",
        isActive: false,
        lastName: "Smith",
    },
    {
        avatar: {
            __typename: "Image" as const,
            url: avatarImage,
        },
        email: "admin@example.com",
        firstName: "Jacob",
        id: "VXNlcjoyMQ==",
        isActive: true,
        lastName: "Smith",
    },
    {
        avatar: {
            __typename: "Image" as const,
            url: avatarImage,
        },
        email: "admin@example.com",
        firstName: "Jacob",
        id: "VXNlcjoyMQ==",
        isActive: true,
        lastName: "Smith",
    },
    {
        avatar: {
            __typename: "Image" as const,
            url: avatarImage,
        },
        email: "admin@example.com",
        firstName: "Jacob",
        id: "VXNlcjoyMQ==",
        isActive: false,
        lastName: "Smith",
    },
    {
        avatar: {
            __typename: "Image" as const,
            url: avatarImage,
        },
        email: "admin@example.com",
        firstName: "Jacob",
        id: "VXNlcjoyMQ==",
        isActive: false,
        lastName: "Smith",
    },
    {
        avatar: {
            __typename: "Image" as const,
            url: avatarImage,
        },
        email: "admin@example.com",
        firstName: "Jacob",
        id: "VXNlcjoyMQ==",
        isActive: true,
        lastName: "Smith",
    },
].map((staffMember) => ({ __typename: "User" as const, ...staffMember }));
export const staffMember: StaffMemberDetailsFragment = {
    __typename: "User",
    avatar: { __typename: "Image" as const, url: avatarImage },
    email: "admin@example.com",
    firstName: "Jacob",
    id: "VXNlcjoyMQ==",
    isActive: true,
    lastName: "Smith",
    permissionGroups: [],
    userPermissions: permissions.map((p) => ({
        ...p,
        __typename: "UserPermission",
    })),
};
