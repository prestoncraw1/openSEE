﻿//******************************************************************************************************
//  settingSlice.tsx - Gbtc
//
//  Copyright © 2020, Grid Protection Alliance.  All Rights Reserved.
//
//  Licensed to the Grid Protection Alliance (GPA) under one or more contributor license agreements. See
//  the NOTICE file distributed with this work for additional information regarding copyright ownership.
//  The GPA licenses this file to you under the MIT License (MIT), the "License"; you may not use this
//  file except in compliance with the License. You may obtain a copy of the License at:
//
//      http://opensource.org/licenses/MIT
//
//  Unless agreed to in writing, the subject software distributed under the License is distributed on an
//  "AS-IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. Refer to the
//  License for the specific language governing permissions and limitations.
//
//  Code Modification History:
//  ----------------------------------------------------------------------------------------------------
//  11/01/2020 - C. Lackner
//       Generated original version of source code.
//
//******************************************************************************************************
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { OpenSee } from '../global';
import _ from 'lodash';
import { defaultSettings } from '../defaults';
import { createSelector } from 'reselect'

export const SettingsReducer = createSlice({
    name: 'Settings',
    initialState: {
        Units: {} as OpenSee.IUnitCollection,
        Colors: {} as OpenSee.IColorCollection,
        TimeUnit: {} as OpenSee.IUnitSetting,
        SnapToPoint: false as boolean,
        SinglePlot: true as boolean
    } as OpenSee.ISettingsState,
    reducers: {
        LoadSettings: (state) => {
            state.Units = defaultSettings.Units;
            state.Colors = defaultSettings.Colors;
            state.TimeUnit = defaultSettings.TimeUnit;
            state.SnapToPoint = defaultSettings.snapToPoint;
            state.SinglePlot = defaultSettings.singlePoint;
            return state
        },
        SetColor: (state, action: PayloadAction<{ color: OpenSee.Color, value: string }>) => {
            state.Colors[action.payload.color] = action.payload.value
            SaveSettings(state);
        },
        SetUnit: (state, action: PayloadAction<{ unit: OpenSee.Unit, value: number }>) => {
            state.Units[action.payload.unit].current = action.payload.value
            SaveSettings(state);
        },
        SetTimeUnit: (state, action: PayloadAction<number>) => {
            state.TimeUnit.current = action.payload
            SaveSettings(state);
        },
        SetSnapToPoint: (state, action: PayloadAction<boolean>) => {
            state.SnapToPoint = action.payload;
            SaveSettings(state);
        },
        SetSinglePlot: (state, action: PayloadAction<boolean>) => {
            state.SinglePlot = action.payload;
            SaveSettings(state);
        }
    },
    extraReducers: (builder) => {


    }

});

export const { LoadSettings, SetColor, SetUnit, SetTimeUnit, SetSnapToPoint, SetSinglePlot } = SettingsReducer.actions;
export default SettingsReducer.reducer;

// #endregion

// #region [ Selectors ]
export const selectColor = (state: OpenSee.IRootState) => state.Settings.Colors;
export const selectUnit = (state: OpenSee.IRootState) => state.Settings.Units;

export const selectActiveUnit = (key: OpenSee.IGraphProps) => createSelector(selectUnit, (state: OpenSee.IRootState) => state.Data.plotKeys, (state: OpenSee.IRootState) => state.Data.activeUnits, (baseUnits, data, activeUnits) => {
    let result = {};
        let index = data.findIndex(item => item.DataType == key.DataType && item.EventId == key.EventId);
        Object.keys(baseUnits).forEach(u => result[u] = baseUnits[u].options[activeUnits[index][u]]);
        return result
    }
);
export const selectTimeUnit = (state: OpenSee.IRootState) => state.Settings.TimeUnit;
export const selectSnap = (state: OpenSee.IRootState) => state.Settings.SnapToPoint
export const selectEventOverlay = (state: OpenSee.IRootState) => state.Settings.SinglePlot
// #endregion

// #region [ Async Functions ]
function SaveSettings(state: OpenSee.ISettingsState) { }

// #endregion
