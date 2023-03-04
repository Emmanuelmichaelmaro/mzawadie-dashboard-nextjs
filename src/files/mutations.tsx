import { gql } from "@apollo/client";
import { uploadErrorFragment } from "@mzawadie/fragments/errors";
import { fileFragment } from "@mzawadie/fragments/file";
import makeMutation from "@mzawadie/hooks/graphql/makeMutation";

import { FileUpload, FileUploadVariables } from "./types/FileUpload";

const fileUploadMutation = gql`
    ${fileFragment}
    ${uploadErrorFragment}
    mutation FileUpload($file: Upload!) {
        fileUpload(file: $file) {
            uploadedFile {
                ...FileFragment
            }
            errors {
                ...UploadErrorFragment
            }
        }
    }
`;
export const useFileUploadMutation = makeMutation<FileUpload, FileUploadVariables>(fileUploadMutation);
