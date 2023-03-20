import { FileFragment } from "@mzawadie/graphql";

export const UPLOADED_FILE: FileFragment = {
    __typename: "File",
    contentType: "image/png",
    url: "some_url_to_image.png",
};
