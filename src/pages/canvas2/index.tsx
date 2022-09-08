import {connect} from "react-redux";
import Canvas from "./Canvas";

const mapState = (state: any) => {
  return state.canvas
}
export default connect(mapState)(Canvas)