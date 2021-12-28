// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { Button, IconButton, Typography } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import { commonMessages } from "@mzawadie/core";
import { FileFragment } from "@mzawadie/fragments/types/FileFragment";
import { makeStyles } from "@saleor/macaw-ui";
import React from "react";
import { useIntl } from "react-intl";

import Skeleton from "../Skeleton";

export interface FileChoiceType {
    label: string;
    value: string;
    file?: FileFragment | null;
}

export interface FileUploadFieldProps {
    inputProps?: React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;
    className?: string;
    disabled: boolean;
    loading: boolean;
    file: FileChoiceType;
    error?: boolean;
    helperText?: string;
    onFileUpload: (file: File) => void;
    onFileDelete: () => void;
}

const useStyles = makeStyles(
    (theme) => ({
        errorText: {
            color: theme.palette.error.light,
        },
        fileField: {
            display: "none",
        },
        fileUrl: {
            color: theme.palette.primary.main,
            textDecoration: "none",
        },
        uploadFileContent: {
            alignItems: "center",
            color: theme.palette.primary.main,
            display: "flex",
            fontSize: theme.typography.body1.fontSize,
        },
        uploadFileName: {
            minWidth: "6rem",
        },
    }),
    { name: "FileUploadField" }
);

const FileUploadField: React.FC<FileUploadFieldProps> = (props) => {
    const {
        loading,
        disabled,
        file,
        className,
        error,
        helperText,
        onFileUpload,
        onFileDelete,
        inputProps,
    } = props;
    const classes = useStyles({});
    const intl = useIntl();

    const fileInputAnchor = React.createRef<HTMLInputElement>();
    const clickFileInput = () => fileInputAnchor?.current?.click();

    const handleFileDelete = () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        fileInputAnchor?.current?.value === "";
        onFileDelete();
    };

    React.useEffect(() => {
        if (!file.value) {
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            fileInputAnchor?.current?.value === "";
        }
    }, [file, fileInputAnchor]);

    return (
        <>
            <div className={className}>
                {file.label ? (
                    <div className={classes.uploadFileContent}>
                        <div className={classes.uploadFileName}>
                            {loading ? (
                                <Skeleton />
                            ) : (
                                <a href={file.file?.url} target="blank" className={classes.fileUrl}>
                                    {file.label}
                                </a>
                            )}
                        </div>

                        <IconButton
                            color="primary"
                            onClick={handleFileDelete}
                            disabled={disabled || loading}
                            data-test="button-delete-file"
                        >
                            <DeleteIcon />
                        </IconButton>
                    </div>
                ) : (
                    <div>
                        <Button
                            onClick={clickFileInput}
                            disabled={disabled || loading}
                            variant="outlined"
                            color="primary"
                            data-test="button-upload-file"
                        >
                            {intl.formatMessage(commonMessages.chooseFile)}
                        </Button>
                    </div>
                )}

                {error && (
                    <Typography variant="caption" className={classes.errorText}>
                        {helperText}
                    </Typography>
                )}
            </div>

            <input
                className={classes.fileField}
                id="fileUpload"
                onChange={(event) => onFileUpload(event?.target?.files[0])}
                type="file"
                data-test="upload-file-input"
                ref={fileInputAnchor}
                {...inputProps}
            />
        </>
    );
};

FileUploadField.displayName = "FileUploadField";

export default FileUploadField;
