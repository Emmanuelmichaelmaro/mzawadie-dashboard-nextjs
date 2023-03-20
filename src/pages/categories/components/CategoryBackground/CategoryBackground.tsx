// @ts-nocheck
import { Button, Card, CardContent, TextField } from "@material-ui/core";
import { CardTitle } from "@mzawadie/components/CardTitle";
import Hr from "@mzawadie/components/Hr";
import { ImageUpload } from "@mzawadie/components/ImageUpload";
import { MediaTile } from "@mzawadie/components/MediaTile";
import Skeleton from "@mzawadie/components/Skeleton";
import { commonMessages } from "@mzawadie/core";
import { CategoryDetailsFragment } from "@mzawadie/graphql";
import { makeStyles } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { CategoryUpdateData } from "../CategoryUpdatePage/form";

const useStyles = makeStyles(
    (theme) => ({
        fileField: {
            display: "none",
        },
        image: {
            height: "100%",
            objectFit: "contain",
            userSelect: "none",
            width: "100%",
        },
        imageContainer: {
            background: "#ffffff",
            border: "1px solid #eaeaea",
            borderRadius: theme.spacing(),
            height: 148,
            justifySelf: "start",
            overflow: "hidden",
            padding: theme.spacing(2),
            position: "relative",
            width: 148,
        },
    }),
    { name: "CategoryBackground" }
);

export interface CategoryBackgroundProps {
    data: CategoryUpdateData;
    image: CategoryDetailsFragment["backgroundImage"];
    onChange: (event: React.ChangeEvent<any>) => void;
    onImageDelete: () => void;
    onImageUpload: (file: File) => void;
}

const CategoryBackground: React.FC<CategoryBackgroundProps> = (props) => {
    const classes = useStyles(props);
    const intl = useIntl();
    const anchor = React.useRef<HTMLInputElement>();

    const { data, onImageUpload, image, onChange, onImageDelete } = props;

    const handleImageUploadButtonClick = () => anchor.current.click();

    return (
        <Card>
            <CardTitle
                title={intl.formatMessage({
                    defaultMessage: "Background Image (optional)",
                    id: "DP6b8U",
                    description: "section header",
                })}
                toolbar={
                    <>
                        <Button variant="text" color="primary" onClick={handleImageUploadButtonClick}>
                            <FormattedMessage {...commonMessages.uploadImage} />
                        </Button>
                        <input
                            className={classes.fileField}
                            id="fileUpload"
                            onChange={(event) => onImageUpload(event.target.files[0])}
                            type="file"
                            ref={anchor}
                            accept="image/*"
                        />
                    </>
                }
            />
            {image === undefined ? (
                <CardContent>
                    <div>
                        <div className={classes.imageContainer}>
                            <Skeleton />
                        </div>
                    </div>
                </CardContent>
            ) : image === null ? (
                <ImageUpload onImageUpload={(files) => onImageUpload(files[0])} />
            ) : (
                <CardContent>
                    <MediaTile media={image} onDelete={onImageDelete} />
                </CardContent>
            )}

            {image && (
                <>
                    <Hr />
                    <CardContent>
                        <TextField
                            name="backgroundImageAlt"
                            label={intl.formatMessage(commonMessages.description)}
                            helperText={intl.formatMessage({
                                defaultMessage: "(Optional)",
                                id: "0iMYc+",
                                description: "field is optional",
                            })}
                            value={data.backgroundImageAlt}
                            onChange={onChange}
                            fullWidth
                            multiline
                        />
                    </CardContent>
                </>
            )}
        </Card>
    );
};
CategoryBackground.displayName = "CategoryBackground";
export default CategoryBackground;
