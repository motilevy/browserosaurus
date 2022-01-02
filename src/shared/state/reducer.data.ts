import { createReducer } from '@reduxjs/toolkit'

import type { AppId } from '../../config/apps'
import { CARROT_URL } from '../../config/CONSTANTS'
import {
  availableUpdate,
  downloadedUpdate,
  downloadingUpdate,
  gotDefaultBrowserStatus,
  installedAppsRetrieved,
  openedUrl,
  receivedRendererStartupSignal,
} from '../../main/state/actions'
import {
  clickedDonate,
  pressedKey,
  startedPicker,
} from '../../renderers/picker/state/actions'
import {
  clickedTabButton,
  confirmedReset,
  startedPrefs,
} from '../../renderers/prefs/state/actions'
import { gotKeyLayoutMap } from '../../renderers/shared/state/actions'
import { backspaceUrlParse } from '../utils/backspace-url-parse'

export type PrefsTab = 'about' | 'apps' | 'general'

export interface Data {
  version: string
  updateStatus: 'available' | 'downloaded' | 'downloading' | 'no-update'
  isDefaultProtocolClient: boolean
  url: string
  pickerStarted: boolean
  prefsStarted: boolean
  prefsTab: PrefsTab
  installedApps: AppId[]
  keyCodeMap: Record<string, string>
}

export const defaultData: Data = {
  version: '',
  updateStatus: 'no-update',
  isDefaultProtocolClient: true,
  url: '',
  pickerStarted: false,
  prefsStarted: false,
  prefsTab: 'general',
  installedApps: [],
  keyCodeMap: {},
}

export const data = createReducer<Data>(defaultData, (builder) =>
  builder
    .addCase(receivedRendererStartupSignal, (_, action) => action.payload.data)

    .addCase(confirmedReset, () => defaultData)

    .addCase(installedAppsRetrieved, (state, action) => {
      state.installedApps = action.payload
    })

    .addCase(startedPicker, (state) => {
      state.pickerStarted = true
    })

    .addCase(startedPrefs, (state) => {
      state.prefsStarted = true
    })

    // Pressed key in picker window
    .addCase(pressedKey, (state, action) => {
      if (action.payload.physicalKey === 'Backspace') {
        state.url = backspaceUrlParse(state.url)
      }
    })

    .addCase(gotDefaultBrowserStatus, (state, action) => {
      state.isDefaultProtocolClient = action.payload
    })

    .addCase(availableUpdate, (state) => {
      state.updateStatus = 'available'
    })

    .addCase(downloadingUpdate, (state) => {
      state.updateStatus = 'downloading'
    })

    .addCase(downloadedUpdate, (state) => {
      state.updateStatus = 'downloaded'
    })

    .addCase(openedUrl, (state, action) => {
      state.url = action.payload
    })

    .addCase(clickedDonate, (state) => {
      state.url = CARROT_URL
    })

    .addCase(clickedTabButton, (state, action) => {
      state.prefsTab = action.payload
    })

    .addCase(gotKeyLayoutMap, (state, action) => {
      state.keyCodeMap = action.payload
    }),
)
