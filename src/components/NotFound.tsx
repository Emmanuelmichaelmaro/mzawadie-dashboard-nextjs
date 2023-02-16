import { NotFoundPage } from "@mzawadie/components";
import { useNavigator } from "@mzawadie/hooks";
import React from "react";

export const NotFound: React.FC = () => {
    const navigate = useNavigator();

    return <NotFoundPage onBack={() => navigate("/")} />;
};

export default NotFound;
