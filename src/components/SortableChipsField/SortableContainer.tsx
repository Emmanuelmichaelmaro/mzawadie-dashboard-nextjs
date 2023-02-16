/* eslint-disable @typescript-eslint/no-unsafe-return */
import { SortableContainer as SortableContainerHoc } from "react-sortable-hoc";

const SortableContainer = SortableContainerHoc(({ children }: any) => children);

export default SortableContainer;
