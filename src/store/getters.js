export default {
  pageWidth: state => {
    return state.windowWidth-(state.showNavFlag?260:50)-48;
  }
}
