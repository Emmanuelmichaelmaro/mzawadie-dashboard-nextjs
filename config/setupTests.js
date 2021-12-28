import Adapter from "@wojtekmaj/enzyme-adapter-react-17";
import Enzyme from "enzyme";

// Configure Enzyme with React 17 adapter
Enzyme.configure({ adapter: new Adapter() });
