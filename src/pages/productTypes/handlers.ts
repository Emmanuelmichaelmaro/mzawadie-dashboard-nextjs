import { ProductTypeKindEnum } from "@mzawadie/graphql";
import { FormChange } from "@mzawadie/hooks/useForm";

export const makeProductTypeKindChangeHandler =
    (onChange: FormChange, onKindChange: (kind: ProductTypeKindEnum) => void) =>
    (event: React.ChangeEvent<any>) => {
        const kind = event.target.value as ProductTypeKindEnum;
        onKindChange(kind);
        onChange(event);
    };
