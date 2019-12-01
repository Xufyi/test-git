import * as MutationTypes from './mutation-types'

export default {
  [MutationTypes.WINDOW_WIDTH_CHANGE]:function (state,v) {
    state.windowWidth = v;
  },
  [MutationTypes.WINDOW_HEIGHT_CHANGE]:function (state,v) {
    state.windowHeight = v;
  },
  [MutationTypes.NAV_SHOW_CHANGE]:function (state,v) {
    state.showNavFlag = v;
  },

}
