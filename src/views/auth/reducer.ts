import { User } from "@mzawadie/fragments/types/User";

export type MzawadieStateReducerActionType = "login" | "logout";

export interface MzawadieAuthStateAction {
    payload: Partial<{
        user: User;
    }>;
    type: MzawadieStateReducerActionType;
}

export interface MzawadieAuthInitialState {
    loading: boolean | undefined;
    isLoggedIn: boolean | undefined;
    user: User | undefined;
}

export const initialState: MzawadieAuthInitialState = {
    loading: false,
    isLoggedIn: false,
    user: undefined,
};

const reducer = (previousState: MzawadieAuthInitialState, action: MzawadieAuthStateAction) => {
    switch (action.type) {
        case "login":
            return loadUserData(previousState, action.payload.user);

        case "logout":
            return removeUserData(previousState, action.payload.user);

        default:
            return previousState;
    }
};

const loadUserData = (previousState: MzawadieAuthInitialState, payload: User | undefined) => {
    return {
        ...previousState,
        isLoggedIn: true,
        user: payload,
        loading: false,
    };
};

const removeUserData = (previousState: MzawadieAuthInitialState, payload: User | undefined) => {
    return {
        ...previousState,
        isLoggedIn: false,
        user: payload,
        loading: false,
    };
};

export default reducer;
