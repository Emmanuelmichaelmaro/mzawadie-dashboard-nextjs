import { gql } from "@apollo/client";
import { appFragment } from "@mzawadie/fragments/apps";
import { webhooksFragment } from "@mzawadie/fragments/webhooks";
import makeQuery from "@mzawadie/hooks/makeQuery";

import { App, AppVariables } from "./types/App";
import { AppsInstallations } from "./types/AppsInstallations";
import { AppsList, AppsListVariables } from "./types/AppsList";

const appsList = gql`
    query AppsList(
        $before: String
        $after: String
        $first: Int
        $last: Int
        $sort: AppSortingInput
        $filter: AppFilterInput
    ) {
        apps(
            before: $before
            after: $after
            first: $first
            last: $last
            sortBy: $sort
            filter: $filter
        ) {
            pageInfo {
                hasNextPage
                hasPreviousPage
                startCursor
                endCursor
            }
            totalCount
            edges {
                node {
                    id
                    name
                    isActive
                    type
                }
            }
        }
    }
`;

const appsInProgressList = gql`
    query AppsInstallations {
        appsInstallations {
            status
            message
            appName
            manifestUrl
            id
        }
    }
`;

const appDetails = gql`
    ${appFragment}
    ${webhooksFragment}
    query App($id: ID!) {
        app(id: $id) {
            ...AppFragment
            aboutApp
            permissions {
                code
                name
            }
            dataPrivacy
            dataPrivacyUrl
        }
    }
`;

export const useAppsListQuery = makeQuery<AppsList, AppsListVariables>(appsList);

// eslint-disable-next-line @typescript-eslint/ban-types
export const useAppsInProgressListQuery = makeQuery<AppsInstallations, {}>(appsInProgressList);

export const useAppDetails = makeQuery<App, AppVariables>(appDetails);
