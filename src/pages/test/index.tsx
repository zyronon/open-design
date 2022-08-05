import {connect} from "react-redux";
import Test from "./Test";

const mapState = (state: any) => {
  return state.canvas
}
export default connect(mapState)(Test)