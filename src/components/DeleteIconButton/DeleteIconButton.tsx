import { IconButton, IconButtonProps } from "@material-ui/core";
import TrashIcon from "@mzawadie/icons/Trash";
import React from "react";

const DeleteIconButton: React.FC<IconButtonProps> = ({ onClick }) => (
    <IconButton color="primary" onClick={onClick}>
        <TrashIcon />
    </IconButton>
);

export default DeleteIconButton;
