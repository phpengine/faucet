import { configureStore } from "@reduxjs/toolkit"
import thunk from "redux-thunk"
import { SUBSTRATE_ADDRESS_PATTERN } from "./constants"

const DUMP = "DUMP"

export function dump(props) {
  return { type: DUMP, ...props }
}

export function fund(substrateAddress) {
  return async function (dispatch) {
    if (!SUBSTRATE_ADDRESS_PATTERN.test(substrateAddress)) return
    dispatch(dump({ dots: true }))
    let res
    try {
      res = await fetch(`${process.env.REACT_APP_API_URL}/${substrateAddress}`)
    } catch (err) {
      console.error(err)
      res = { status: 419 }
    }
    if (res.status !== 202) {
      dispatch(
        dump({
          modalTitle: "❌ error",
          modalText: `note that requests are rate limited to 1 per ${
            parseInt(process.env.REACT_APP_BLACKLIST_SECONDS) / 3600
          }h and ip`
        })
      )
    } else {
      dispatch(
        dump({
          modalTitle: "💎 success",
          modalText: `just minted ${process.env.REACT_APP_AMOUNT}T0RN to ${substrateAddress}`
        })
      )
    }
    dispatch(dump({ dots: false }))
  }
}

export const store = configureStore({
  reducer(state = {}, { type, ...props }) {
    switch (type) {
      case DUMP:
        return { ...state, ...props }
      default:
        return state
    }
  },
  middleware: [thunk]
})
