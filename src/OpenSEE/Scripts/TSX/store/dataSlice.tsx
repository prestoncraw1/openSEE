﻿//******************************************************************************************************
//  dataSlice.tsx - Gbtc
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
import { createSlice, createAsyncThunk, ThunkDispatch, createSelector, PayloadAction } from '@reduxjs/toolkit';
import { OpenSee } from '../global';
import _, { cloneDeep, uniq, findIndex } from 'lodash';
import { selectColor, selectUnit } from './settingSlice';
import { LoadOverlappingEvents } from './eventSlice';

declare var eventID: number;
declare var analyticHandle;

// #region [ Thunks ]

//Thunk to Create Plot
export const AddPlot = createAsyncThunk('Data/addPlot', async (arg: OpenSee.IGraphProps, thunkAPI) => {

    thunkAPI.dispatch(DataReducer.actions.AddKey(arg));

    let index = (thunkAPI.getState() as OpenSee.IRootState).Data.plotKeys.findIndex(item => item.DataType == arg.DataType && item.EventId == arg.EventId)

    if ((thunkAPI.getState() as OpenSee.IRootState).Data.loading[index])
        return;

    thunkAPI.dispatch(DataReducer.actions.SetLoading(arg));

    let handles = getData(arg, thunkAPI.dispatch, (thunkAPI.getState() as OpenSee.IRootState).Analytic);

    return await Promise.all(handles);
})

//Thunk to Add Data
const AddData = createAsyncThunk('Data/addData', (arg: { key: OpenSee.IGraphProps, data: OpenSee.iD3DataSeries[] }, thunkAPI) => {
    thunkAPI.dispatch(DataReducer.actions.AppendData({ ...arg, baseUnits: (thunkAPI.getState() as OpenSee.IRootState).Settings.Units }))
    return Promise.resolve();
})

//Thunk to update Time Limits
export const SetTimeLimit = createAsyncThunk('Data/setTimeLimit', (arg: { start: number, end: number }, thunkAPI) => {
    thunkAPI.dispatch(DataReducer.actions.UpdateTimeLimit({ ...arg, baseUnits: (thunkAPI.getState() as OpenSee.IRootState).Settings.Units }))
    return Promise.resolve();
})

//Thunk to Enable or Disable Trace
export const EnableTrace = createAsyncThunk('Data/EnableTrace', (arg: { key: OpenSee.IGraphProps, trace: number[], enabled: boolean }, thunkAPI) => {
    thunkAPI.dispatch(DataReducer.actions.UpdateTrace({ ...arg, baseUnits: (thunkAPI.getState() as OpenSee.IRootState).Settings.Units }))
    return Promise.resolve();
});

//Thunk to Reset Zoom
export const ResetZoom = createAsyncThunk('Data/Reset', (arg: { start: number, end: number }, thunkAPI) => {
    thunkAPI.dispatch(DataReducer.actions.UpdateTimeLimit({ ...arg, baseUnits: (thunkAPI.getState() as OpenSee.IRootState).Settings.Units }));

    (thunkAPI.getState() as OpenSee.IRootState).Data.plotKeys
        .forEach((graph) => {
            thunkAPI.dispatch(DataReducer.actions.UpdateYLimit({key: { DataType: graph.DataType, EventId: graph.EventId }, baseUnits: (thunkAPI.getState() as OpenSee.IRootState).Settings.Units }));
        });
    return Promise.resolve();
})

// Thunk to Set YLimits
export const SetYLimits = createAsyncThunk('Data/SetYLimits', (arg: { min: number, max: number, key: any }, thunkAPI) => {
    thunkAPI.dispatch(DataReducer.actions.UpdateYLimit({ ...arg, baseUnits: (thunkAPI.getState() as OpenSee.IRootState).Settings.Units }));

    return Promise.resolve();
})

//Thunk to set EventID
export const SetEventID = createAsyncThunk('Data/setEventID', (arg: number, thunkAPI) => {

    let oldData = (thunkAPI.getState() as OpenSee.IRootState).Data.plotKeys
    let oldTypes = oldData.map(item => item.DataType);
    oldData.forEach(item => thunkAPI.dispatch(DataReducer.actions.RemovePlot(item)));
    thunkAPI.dispatch(DataReducer.actions.UpdateEventId(arg))
    oldTypes.forEach(item => thunkAPI.dispatch(AddPlot({ DataType: item, EventId: arg })))

    thunkAPI.dispatch(LoadOverlappingEvents())

    return Promise.resolve();
})

// Thunk to set Analytic
export const SetAnalytic = createAsyncThunk('Data/setAnalytic', async (arg: OpenSee.Analytic, thunkAPI) => {

    
    // Remove any old Analytic
    let eventId = (thunkAPI.getState() as OpenSee.IRootState).Data.eventID
    let oldData = (thunkAPI.getState() as OpenSee.IRootState).Data.plotKeys.filter(item => item.DataType != 'Voltage' && item.DataType != 'Current' && item.DataType != 'Analogs' && item.DataType != 'Digitals' && item.DataType != 'TripCoil');
    oldData.forEach(item => thunkAPI.dispatch(DataReducer.actions.RemovePlot(item)));

    // Cancel any current Analytic in progress
    if (analyticHandle != undefined && analyticHandle.Abort != undefined)
        analyticHandle.Abort();

    thunkAPI.dispatch(DataReducer.actions.UpdateAnalytic(arg));

    if (arg == 'none')
        return Promise.resolve();

    //Add current Analytic
    thunkAPI.dispatch(DataReducer.actions.AddKey({ DataType: arg as OpenSee.graphType, EventId: eventId }));
    thunkAPI.dispatch(DataReducer.actions.SetLoading({ DataType: arg as OpenSee.graphType, EventId: eventId }));

    let handles = getData({ DataType: arg as OpenSee.graphType, EventId: eventId }, thunkAPI.dispatch, (thunkAPI.getState() as OpenSee.IRootState).Analytic);
    analyticHandle = handles[0];

    return await Promise.all(handles);
})

//Thunk to Update Plot
export const UpdateAnalyticPlot = createAsyncThunk('Data/updatePlot', async (_, thunkAPI) => {

   
    let index = (thunkAPI.getState() as OpenSee.IRootState).Data.plotKeys.findIndex(item => item.DataType != 'Voltage' && item.DataType != 'Current' && item.DataType != 'Analogs' && item.DataType != 'Digitals' && item.DataType != 'TripCoil');
    if (index == -1)
        return;
    let key = (thunkAPI.getState() as OpenSee.IRootState).Data.plotKeys[index];

    //Remove existing Data
    thunkAPI.dispatch(DataReducer.actions.AddKey(key));

    // Cancel any current Analytic in progress
    if (analyticHandle != undefined && analyticHandle.Abort != undefined)
        analyticHandle.Abort();

    thunkAPI.dispatch(DataReducer.actions.SetLoading(key));

    let handles = getData(key, thunkAPI.dispatch, (thunkAPI.getState() as OpenSee.IRootState).Analytic);
    analyticHandle = handles[0];

    return await Promise.all(handles);
})
// #endregion




export const DataReducer = createSlice({
    name: 'Data',
    initialState: {
        startTime: 0 as number,
        endTime: 0 as number,
        hover: [0,0] as number[],
        mouseMode: 'none' as OpenSee.MouseMode,
        zoomMode: 'x' as OpenSee.ZoomMode,
        eventID: eventID as number,
        Analytic: 'none' as OpenSee.Analytic,

        plotKeys:[] as  OpenSee.IGraphProps[],
        data: [] as Array<OpenSee.iD3DataSeries>[],
        enabled: [] as Array<boolean>[],
        loading: [] as boolean[],
        activeUnits: [] as OpenSee.IActiveUnits[],
        yLimits: [] as [number, number][],
        autoLimits: [] as boolean[],
        selectedIndixes: [] as Array<number>[]
    } as OpenSee.IDataState,
    reducers: {
        RemovePlot: (state, action: PayloadAction<OpenSee.IGraphProps>) => {
            let index = state.plotKeys.findIndex(item => item.DataType == action.payload.DataType && item.EventId == action.payload.EventId)
            if (index > -1) {
                state.plotKeys.splice(index, 1);
                state.data.splice(index, 1);
                state.enabled.splice(index, 1);
                state.loading.splice(index, 1);
                state.activeUnits.splice(index, 1);
                state.yLimits.splice(index, 1);
                state.autoLimits.splice(index, 1);
                state.selectedIndixes.splice(index, 1);
            }
        },
        UpdateEventId: (state, action: PayloadAction<number>) => {
            state.eventID = action.payload;
        },
        SetLoading: (state, action: PayloadAction<OpenSee.IGraphProps>) => {
            let index = state.plotKeys.findIndex(item => item.DataType == action.payload.DataType && item.EventId == action.payload.EventId);
            state.loading[index] = true;
            return state;
        },
        UpdateAnalytic: (state, action: PayloadAction<OpenSee.Analytic>) => {
            state.Analytic = action.payload;
            return state;
        },
        AddKey: (state, action: PayloadAction<OpenSee.IGraphProps>) => {

            let index = state.plotKeys.findIndex(item => item.DataType == action.payload.DataType && item.EventId == action.payload.EventId)
            if (index > -1) {
                state.data[index] = [];
                state.selectedIndixes[index] = [];
                return state;
            }

            state.plotKeys.push(action.payload);
            state.data.push([]);
            state.enabled.push([]);
            state.loading.push(false);
            state.activeUnits.push({
                Voltage: 0, Current: 0, Angle: 0, VoltageperSecond: 0, CurrentperSecond: 0, Freq: 0, Impedance: 0,
                PowerP: 0, PowerQ: 0, PowerS: 0, PowerPf: 0, TCE: 0, Distance: 0, Unbalance: 0, THD: 0, });
            state.yLimits.push([0, 1]);
            state.autoLimits.push(true);
            state.selectedIndixes.push([]);
            
            return state;
        },
        AppendData: (state, action: PayloadAction<{ key: OpenSee.IGraphProps, data: Array<OpenSee.iD3DataSeries>, baseUnits: OpenSee.IUnitCollection }>) => {
            let index = state.plotKeys.findIndex(item => item.DataType == action.payload.key.DataType && item.EventId == action.payload.key.EventId)

            state.data[index] = [...state.data[index], ...action.payload.data]
            state.enabled[index] = [...state.enabled[index], ...action.payload.data.map(item => true)]

            state.activeUnits[index] = updateUnits(action.payload.baseUnits, state.data[index], state.startTime, state.endTime);

            if (state.autoLimits[index])
                state.yLimits[index] = recomputeYLimits(state.startTime, state.endTime, state.data[index].filter((item, i) => state.enabled[index][i]), action.payload.baseUnits, state.activeUnits[index]);

            return state
        },
        UpdateTimeLimit: (state, action: PayloadAction<{ start: number, end: number, baseUnits: OpenSee.IUnitCollection }> ) => {
            if (Math.abs(action.payload.start - action.payload.end) < 10)
                return state;

            state.startTime = action.payload.start;
            state.endTime = action.payload.end;

            //Update All Units and limits
            state.plotKeys 
                .forEach((graph, index) => {
                    state.activeUnits[index] = updateUnits(action.payload.baseUnits, state.data[index], state.startTime, state.endTime);
                    if (state.autoLimits[index])
                        state.yLimits[index] = recomputeYLimits(state.startTime, state.endTime, state.data[index].filter((item, i) => state.enabled[index][i]), action.payload.baseUnits, state.activeUnits[index]);
                });
            return state;

        },
        UpdateTrace: (state, action: PayloadAction<{ key: OpenSee.IGraphProps, trace: number[], enabled: boolean, baseUnits: OpenSee.IUnitCollection }>) => {
            let index = state.plotKeys.findIndex(item => item.DataType == action.payload.key.DataType && item.EventId == action.payload.key.EventId)

            action.payload.trace.forEach(i => state.enabled[index][i] = action.payload.enabled);

            if (state.autoLimits[index])
                state.yLimits[index] = recomputeYLimits(state.startTime, state.endTime, state.data[index].filter((item, i) => state.enabled[index][i]), action.payload.baseUnits, state.activeUnits[index]);
            return state
        },
        SetHover: (state, action: PayloadAction<{ t: number, y: number, snap: boolean }>) => {
            if (!action.payload.snap)
                state.hover = [action.payload.t, action.payload.y];
            else {
                let d = state.data.find((item,i) => !state.loading[i] && item.length > 0)[0];
                state.hover[1] = d.DataPoints[getIndex(action.payload.t, d.DataPoints)][0];
            }
            return state;
        },
        SelectPoint: (state, action: PayloadAction<[number, number]>) => {
            if (state.mouseMode == 'none')
                return state;
            if (state.mouseMode == 'zoom')
                // This case is handled locally in plot to avoid any confusion
                return state
            if (state.mouseMode == 'select') {
                // Only work those with main eventId for now
                state.selectedIndixes.forEach((item, index) => {
                    if (state.plotKeys[index].EventId != state.eventID)
                        return;
                    let dataIndex = getIndex(action.payload[0], state.data[index][0].DataPoints)
                    state.selectedIndixes[index].push(dataIndex);
                })
            }
        },
        SetMouseMode: (state, action: PayloadAction<OpenSee.MouseMode>) => {
            state.mouseMode = action.payload
        },
        SetZoomMode: (state, action: PayloadAction<OpenSee.ZoomMode>) => {
            state.zoomMode = action.payload
        },
        UpdateYLimit: (state, action: PayloadAction<{ key: OpenSee.IGraphProps, min?: number, max?: number, baseUnits: OpenSee.IUnitCollection }>) => {
            let index = state.plotKeys.findIndex(item => item.DataType == action.payload.key.DataType && item.EventId == action.payload.key.EventId)

            if (action.payload.min != undefined)
                state.autoLimits[index] = false;
            else
                state.autoLimits[index] = true;

            if (!state.autoLimits[index])
                state.yLimits[index] = [action.payload.min, action.payload.max];

            state.activeUnits[index] = updateUnits(action.payload.baseUnits, state.data[index], state.startTime, state.endTime);

            if (state.autoLimits[index])
                state.yLimits[index] = recomputeYLimits(state.startTime, state.endTime, state.data[index].filter((item, i) => state.enabled[index][i]), action.payload.baseUnits, state.activeUnits[index]);
        },
        ClearSelectPoints: (state) => {
            state.selectedIndixes.forEach((_, i) => state.selectedIndixes[i] = []);
        },
        RemoveSelectPoints: (state, action: PayloadAction<number>) => {
            state.selectedIndixes.forEach((_, i) => state.selectedIndixes[i].slice(action.payload,1));
        }
    },
    extraReducers: (builder) => {
        builder.addCase(AddPlot.pending, (state, action) => {
            let index = state.plotKeys.findIndex(item => item.DataType == action.meta.arg.DataType && item.EventId == action.meta.arg.EventId)
            if (index > -1)
                state.loading[index] = true
            return state
        });
        builder.addCase(AddPlot.fulfilled, (state, action) => {
            let index = state.plotKeys.findIndex(item => item.DataType == action.meta.arg.DataType && item.EventId == action.meta.arg.EventId)
            state.loading[index] = false
            return state
        });
        builder.addCase(SetAnalytic.fulfilled, (state, action) => {
            let index = state.plotKeys.findIndex(item => item.DataType == (action.meta.arg as OpenSee.graphType))
            state.loading[index] = false
            return state
        });
    }

});


export const { SetHover, SetMouseMode, SelectPoint, SetZoomMode, RemoveSelectPoints, ClearSelectPoints, RemovePlot } = DataReducer.actions;
export default DataReducer.reducer;

// #endregion

// #region [ Individual Selectors ]
export const selectData = (key: OpenSee.IGraphProps) => { return (state: OpenSee.IRootState) => state.Data.data.find((item, index) => state.Data.plotKeys[index].DataType == key.DataType && state.Data.plotKeys[index].EventId == key.EventId); }
export const selectLoading = (key: OpenSee.IGraphProps) => { return (state: OpenSee.IRootState) => state.Data.loading.find((item, index) => state.Data.plotKeys[index].DataType == key.DataType && state.Data.plotKeys[index].EventId == key.EventId); }
export const selectEnabled = (key: OpenSee.IGraphProps) => { return (state: OpenSee.IRootState) => state.Data.enabled.find((item, index) => state.Data.plotKeys[index].DataType == key.DataType && state.Data.plotKeys[index].EventId == key.EventId); }
export const selectYLimits = (key: OpenSee.IGraphProps) => { return (state: OpenSee.IRootState) => state.Data.yLimits.find((item, index) => state.Data.plotKeys[index].DataType == key.DataType && state.Data.plotKeys[index].EventId == key.EventId); }


export const selectStartTime = (state: OpenSee.IRootState) => state.Data.startTime;
export const selectEndTime = (state: OpenSee.IRootState) => state.Data.endTime;
export const selectHover = (state: OpenSee.IRootState) => state.Data.hover
export const selectMouseMode = (state: OpenSee.IRootState) => state.Data.mouseMode
export const selectZoomMode = (state: OpenSee.IRootState) => state.Data.zoomMode

export const selectEventID = (state: OpenSee.IRootState) => state.Data.eventID
export const selectAnalytic = (state: OpenSee.IRootState) => state.Data.Analytic;


export const selectListGraphs = createSelector((state: OpenSee.IRootState) => state.Data.plotKeys, (state: OpenSee.IRootState) => state.Data.eventID, (state: OpenSee.IRootState) => state.Settings.SinglePlot, (keys, eventId, singlePlot) => {
    if (singlePlot)
        return keys.filter(item => item.EventId == eventId);
    return keys;
})

//For SettingsWindow
export const selectGraphTypes = createSelector((state: OpenSee.IRootState) => state.Data.plotKeys, (state: OpenSee.IRootState) => state.Data.eventID, (keys, eventId) => {
    let graphs = uniq(keys.map(item => item.DataType));
    return graphs.map(item => { return { DataType: item, EventId: eventId} as OpenSee.IGraphProps })
});

// For tooltip
export const selectHoverPoints = createSelector(selectUnit, selectEventID, selectHover, (state: OpenSee.IRootState) => state.Data.data, (state: OpenSee.IRootState) => state.Data.plotKeys, (state: OpenSee.IRootState) => state.Data.enabled,
    (state: OpenSee.IRootState) => state.Data.activeUnits,
    (baseUnit, eventID, hover, data, keys, enabled, activeUnits) => {
        let result: OpenSee.IPoint[] = [];

        data.forEach((item, index) => {
            if (keys[index].EventId != eventID)
                return;
            if (item.length == 0)
                return;
            let dataIndex = getIndex(hover[0], item[0].DataPoints);
            if (isNaN(dataIndex))
                return;
            result = result.concat(...item.filter((d, i) => enabled[index][i]).map(d => {
                return { Color: d.Color, Unit: baseUnit[d.Unit].options[activeUnits[index][d.Unit]], Value: (dataIndex > (d.DataPoints.length -1) ? NaN : d.DataPoints[dataIndex][1]), Name: GetDisplayName(d, keys[index].DataType) }
            }))
    })
    return result;
});

// for Tooltip with Delta
export const selectDeltaHoverPoints = createSelector(selectUnit, selectEventID, selectHover, (state: OpenSee.IRootState) => state.Data.data, (state: OpenSee.IRootState) => state.Data.plotKeys, (state: OpenSee.IRootState) => state.Data.enabled,
    (state: OpenSee.IRootState) => state.Data.selectedIndixes, (state: OpenSee.IRootState) => state.Data.activeUnits,
    (baseUnit, eventID, hover, data, keys, enabled, selectedData, activeUnits) => {
        let result: OpenSee.IPoint[] = [];
        data.forEach((item, index) => {
            if (keys[index].EventId != eventID)
                return;
            if (item.length == 0)
                return;
            let dataIndex = getIndex(hover[0], item[0].DataPoints);
            if (isNaN(dataIndex))
                return;
            result = result.concat(...item.filter((d, i) => enabled[index][i]).map(d => {
                return {
                    Color: d.Color,
                    Unit: baseUnit[d.Unit].options[activeUnits[index][d.Unit]],
                    Value: (dataIndex > (d.DataPoints.length -1 ) ? NaN : d.DataPoints[dataIndex][1]),
                    Name: GetDisplayName(d, keys[index].DataType),
                    PrevValue: (selectedData[index].length > 0 ? ((selectedData[index][selectedData[index].length] - 1) > d.DataPoints.length? NaN : d.DataPoints[selectedData[index][selectedData[index].length - 1]][1]) : NaN)
                }

            }))
        })
    return result;
});

// For vector
export const selectVPhases = createSelector(selectUnit, selectEventID, selectHover, (state: OpenSee.IRootState) => state.Data.data, (state: OpenSee.IRootState) => state.Data.plotKeys, (state: OpenSee.IRootState) => state.Data.enabled,
    (state: OpenSee.IRootState) => state.Data.activeUnits,
    (baseUnit, eventID, hover, data, keys, enabled, activeUnits) => {
        let index = keys.findIndex(item => item.DataType == 'Voltage' && item.EventId == eventID);

        if (index == -1)
            return [];
        let asset = uniq(data[index].filter((item, i) => enabled[index][i]).map(item => item.LegendGroup));
        let phase = uniq(data[index].filter((item, i) => enabled[index][i]).map(item => item.LegendVertical));

        if (data[index].length == 0)
            return []

        let pointIndex = getIndex(hover[0], data[index][0].DataPoints);
        if (isNaN(pointIndex))
            return [];

        let result: OpenSee.IVector[] = [];

        asset.forEach(a => {
            phase.forEach(p => {
                if (!data[index].some((item, i) => (item.LegendGroup == a && item.LegendVertical == p && enabled[index][i])))
                    return

                let d = data[index].filter((item, i) => (item.LegendGroup == a && item.LegendVertical == p));
                let phaseChannel = d.find(item => item.LegendHorizontal == 'Ph');
                let magnitudeChannel = d.find(item => item.LegendHorizontal == 'Pk');

                if (phaseChannel == undefined || magnitudeChannel == undefined)
                    return;

                let phase = (pointIndex > (phaseChannel.DataPoints.length - 1) ? NaN : phaseChannel.DataPoints[pointIndex][1]);
                let mag = (pointIndex > (magnitudeChannel.DataPoints.length -1)? NaN : magnitudeChannel.DataPoints[pointIndex][1]);
                result.push({
                    Color: phaseChannel.Color,
                    Unit: baseUnit.Voltage.options[activeUnits[index].Voltage],
                    PhaseUnit: baseUnit.Angle.options[activeUnits[index].Angle],
                    Phase: p,
                    Asset: a,
                    Magnitude: mag,
                    Angle: phase
                });

            })
        })

        return result;

})
export const selectIPhases = createSelector(selectUnit, selectEventID, selectHover, (state: OpenSee.IRootState) => state.Data.data, (state: OpenSee.IRootState) => state.Data.plotKeys, (state: OpenSee.IRootState) => state.Data.enabled,
    (state: OpenSee.IRootState) => state.Data.activeUnits,
    (baseUnit, eventID, hover, data, keys, enabled, activeUnits) => {
        let index = keys.findIndex(item => item.DataType == 'Current' && item.EventId == eventID);

        if (index == -1)
            return [];
        let asset = uniq(data[index].filter((item, i) => enabled[index][i]).map(item => item.LegendGroup));
        let phase = uniq(data[index].filter((item, i) => enabled[index][i]).map(item => item.LegendVertical));

        if (data[index].length == 0)
            return []

        let pointIndex = getIndex(hover[0], data[index][0].DataPoints);
        if (isNaN(pointIndex))
            return [];

        let result: OpenSee.IVector[] = [];

        asset.forEach(a => {
            phase.forEach(p => {
                if (!data[index].some((item, i) => (item.LegendGroup == a && item.LegendVertical == p && enabled[index][i])))
                    return

                let d = data[index].filter((item, i) => (item.LegendGroup == a && item.LegendVertical == p));
                let phaseChannel = d.find(item => item.LegendHorizontal == 'Ph');
                let magnitudeChannel = d.find(item => item.LegendHorizontal == 'Pk');

                if (phaseChannel == undefined || magnitudeChannel == undefined)
                    return;

                let phase = (pointIndex > (phaseChannel.DataPoints.length - 1) ? NaN : phaseChannel.DataPoints[pointIndex][1]);
                let mag = (pointIndex > (magnitudeChannel.DataPoints.length - 1) ? NaN : magnitudeChannel.DataPoints[pointIndex][1]);
                result.push({
                    Color: phaseChannel.Color,
                    Unit: baseUnit.Current.options[activeUnits[index].Voltage],
                    PhaseUnit: baseUnit.Angle.options[activeUnits[index].Angle],
                    Phase: p,
                    Asset: a,
                    Magnitude: mag,
                    Angle: phase
                });

            })
        })

        return result;

    })

// For Accumulated Point widget
export const selectSelectedPoints = createSelector(selectUnit, selectEventID, (state: OpenSee.IRootState) => state.Data.data, (state: OpenSee.IRootState) => state.Data.selectedIndixes,
    (state: OpenSee.IRootState) => state.Data.activeUnits, (state: OpenSee.IRootState) => state.Data.plotKeys, (state: OpenSee.IRootState) => state.Data.enabled,
    (baseUnit, eventID, data, selectedData, activeUnits, keys, enabled) => {
        let result: OpenSee.IPointCollection[] = [];

        data.forEach((item, index) => {
            if (keys[index].EventId != eventID)
                return;
            if (keys[index].DataType != 'Voltage' && keys[index].DataType != 'Current')
                return;
            if (item.length == 0)
                return;
            result = result.concat(...item.filter((d, i) => enabled[index][i]).map(d => {
                return {
                    Group: d.LegendGroup,
                    Name: (keys[index].DataType == 'Voltage' ? 'V ' : 'I ') + d.LegendVertical + d.LegendHorizontal,
                    Unit: baseUnit[d.Unit].options[activeUnits[index][d.Unit]],
                    Value: selectedData[index].map(j => d.DataPoints[j])
                }

            }))

        })
        return result;
})


//Export Loading States:
export const selectLoadVoltages = createSelector((state: OpenSee.IRootState) => state.Data.loading, (state: OpenSee.IRootState) => state.Data.plotKeys, (loading, plotKeys) => {
    return (loading.filter((item, index) => plotKeys[index].DataType == 'Voltage' && item).length > 0)
})

export const selectLoadCurrents = createSelector((state: OpenSee.IRootState) => state.Data.loading, (state: OpenSee.IRootState) => state.Data.plotKeys, (loading, plotKeys) => {
    return (loading.filter((item, index) => plotKeys[index].DataType == 'Current' && item).length > 0)
})

export const selectLoadAnalogs = createSelector((state: OpenSee.IRootState) => state.Data.loading, (state: OpenSee.IRootState) => state.Data.plotKeys, (loading, plotKeys) => {
    return (loading.filter((item, index) => plotKeys[index].DataType == 'Analogs' && item).length > 0)
})

export const selectLoadDigitals = createSelector((state: OpenSee.IRootState) => state.Data.loading, (state: OpenSee.IRootState) => state.Data.plotKeys, (loading, plotKeys) => {
    return (loading.filter((item, index) => plotKeys[index].DataType == 'Digitals' && item).length > 0)
})

export const selectLoadTCE = createSelector((state: OpenSee.IRootState) => state.Data.loading, (state: OpenSee.IRootState) => state.Data.plotKeys, (loading, plotKeys) => {
    return (loading.filter((item, index) => plotKeys[index].DataType == 'TripCoil' && item).length > 0)
})

// #endregion

// #region [ Async Functions ]

//This Function Grabs the Data for this Graph - Note that cases with multiple Event ID's need to be treated seperatly at the end
function getData(key: OpenSee.IGraphProps, dispatch: any, options: OpenSee.IAnalyticStore): Array<JQuery.jqXHR<any>> {
    let result = [];
    switch (key.DataType) {

        case ('Current'):
        case ('Voltage'):
            let handlePOW = $.ajax({
                type: "GET",
                url: `${homePath}api/OpenSEE/GetData?eventId=${key.EventId}` +
                    `&type=${key.DataType}` +
                    `&dataType=Time`,
                contentType: "application/json; charset=utf-8",
                dataType: 'json',
                cache: true,
                async: true
            });
            let handleFreq = $.ajax({
                type: "GET",
                url: `${homePath}api/OpenSEE/GetData?eventId=${key.EventId}` +
                    `&type=${key.DataType}` +
                    `&dataType=Freq`,
                contentType: "application/json; charset=utf-8",
                dataType: 'json',
                cache: true,
                async: true
            });

            handleFreq.then((data) => { dispatch(AddData({ key: key, data: data.Data })) })
            handlePOW.then((data) => { dispatch(AddData({ key: key, data: data.Data })) })

            result.push(handleFreq);
            result.push(handlePOW);
            break;
        case ('Analogs'):
            let breakerAnalogsDataHandle = $.ajax({
                type: "GET",
                url: `${homePath}api/OpenSEE/GetAnalogsData?eventId=${key.EventId}`,
                contentType: "application/json; charset=utf-8",
                dataType: 'json',
                cache: true,
                async: true
            });

            breakerAnalogsDataHandle.then((data) => { dispatch(AddData({ key: key, data: data.Data })) })
            result.push(breakerAnalogsDataHandle);
            break;
        case ('Digitals'):
            let breakerDigitalsDataHandle = $.ajax({
                type: "GET",
                url: `${homePath}api/OpenSEE/GetBreakerData?eventId=${key.EventId}`,
                contentType: "application/json; charset=utf-8",
                dataType: 'json',
                cache: true,
                async: true
            });

            breakerDigitalsDataHandle.then((data) => { dispatch(AddData({ key: key, data: data.Data })) })
            result.push(breakerDigitalsDataHandle);
            break;
        case ('TripCoil'):
            let waveformTCEDataHandle = $.ajax({
                type: "GET",
                url: `${homePath}api/OpenSEE/GetData?eventId=${key.EventId}` +
                    `&type=TripCoilCurrent` +
                    `&dataType=Time`,
                contentType: "application/json; charset=utf-8",
                dataType: 'json',
                cache: true,
                async: true
            });

            waveformTCEDataHandle.then((data) => { dispatch(AddData({ key: key, data: data.Data })) })
            result.push(waveformTCEDataHandle);
            break;
        case ('FirstDerivative'):
            let derivativeDataHandle = $.ajax({
                type: "GET",
                url: `${homePath}api/Analytic/GetFirstDerivativeData?eventId=${key.EventId}`,
                contentType: "application/json; charset=utf-8",
                dataType: 'json',
                cache: true,
                async: true
            });
            derivativeDataHandle.then((data) => { dispatch(AddData({ key: key, data: data.Data })) })
            result.push(derivativeDataHandle);
            break
        case ('ClippedWaveforms'):
            let clippedWaveformDataHandle = $.ajax({
                type: "GET",
                url: `${homePath}api/Analytic/GetClippedWaveformsData?eventId=${key.EventId}`,
                contentType: "application/json; charset=utf-8",
                dataType: 'json',
                cache: true,
                async: true
            });
            clippedWaveformDataHandle.then((data) => { dispatch(AddData({ key: key, data: data.Data })) })
            result.push(clippedWaveformDataHandle);
            break
        case ('Frequency'):
            let freqencyAnalyticDataHandle = $.ajax({
                type: "GET",
                url: `${homePath}api/Analytic/GetFrequencyData?eventId=${key.EventId}`,
                contentType: "application/json; charset=utf-8",
                dataType: 'json',
                cache: true,
                async: true
            });
            freqencyAnalyticDataHandle.then((data) => { dispatch(AddData({ key: key, data: data.Data })) })
            result.push(freqencyAnalyticDataHandle);
            break
        case ('HighPassFilter'):
            let highPassFilterDataHandle = $.ajax({
                type: "GET",
                url: `${homePath}api/Analytic/GetHighPassFilterData?eventId=${key.EventId}` +
                    `&filter=${options.HPFOrder}`,
                contentType: "application/json; charset=utf-8",
                dataType: 'json',
                cache: true,
                async: true
            });
            highPassFilterDataHandle.then((data) => { dispatch(AddData({ key: key, data: data.Data })) })
            result.push(highPassFilterDataHandle);
            break
        case ('LowPassFilter'):
            let lowPassFilterDataHandle = $.ajax({
                type: "GET",
                url: `${homePath}api/Analytic/GetLowPassFilterData?eventId=${key.EventId}` +
                    `&filter=${options.LPFOrder}`,
                contentType: "application/json; charset=utf-8",
                dataType: 'json',
                cache: true,
                async: true
            });
            lowPassFilterDataHandle.then((data) => { dispatch(AddData({ key: key, data: data.Data })) })
            result.push(lowPassFilterDataHandle);
            break

        case ('Impedance'):
            let impedanceDataHandle = $.ajax({
                type: "GET",
                url: `${homePath}api/Analytic/GetImpedanceData?eventId=${key.EventId}`,
                contentType: "application/json; charset=utf-8",
                dataType: 'json',
                cache: true,
                async: true
            });

            impedanceDataHandle.then((data) => { dispatch(AddData({ key: key, data: data.Data })) })
            result.push(impedanceDataHandle);
            break
        case ('Power'):
            let powerDataHandle = $.ajax({
                type: "GET",
                url: `${homePath}api/Analytic/GetPowerData?eventId=${key.EventId}`,
                contentType: "application/json; charset=utf-8",
                dataType: 'json',
                cache: true,
                async: true
            });
            powerDataHandle.then((data) => { dispatch(AddData({ key: key, data: data.Data })) })
            result.push(powerDataHandle);
            break
        case ('MissingVoltage'):
            let missingVoltageDataHandle = $.ajax({
                type: "GET",
                url: `${homePath}api/Analytic/GetMissingVoltageData?eventId=${key.EventId}`,
                contentType: "application/json; charset=utf-8",
                dataType: 'json',
                cache: true,
                async: true
            });
            missingVoltageDataHandle.then((data) => { dispatch(AddData({ key: key, data: data.Data })) })
            result.push(missingVoltageDataHandle);
            break
        case ('OverlappingWave'):
            let overlappingWaveformDataHandle = $.ajax({
                type: "GET",
                url: `${homePath}api/Analytic/GetOverlappingWaveformData?eventId=${key.EventId}`,
                contentType: "application/json; charset=utf-8",
                dataType: 'json',
                cache: true,
                async: true
            });

            overlappingWaveformDataHandle.then((data) => { dispatch(AddData({ key: key, data: data.Data })) })
            result.push(overlappingWaveformDataHandle);
            break
        case ('Rectifier'):
            let rectifierDataHandle = $.ajax({
                type: "GET",
                url: `${homePath}api/Analytic/GetRectifierData?eventId=${key.EventId}` +
                    `&Trc=${options.Trc}`,
                contentType: "application/json; charset=utf-8",
                dataType: 'json',
                cache: true,
                async: true
            });
            rectifierDataHandle.then((data) => { dispatch(AddData({ key: key, data: data.Data })) })
            result.push(rectifierDataHandle);
            break
        case ('RapidVoltage'):
            let rapidVoltageChangeDataHandle = $.ajax({
                type: "GET",
                url: `${homePath}api/Analytic/GetRapidVoltageChangeData?eventId=${key.EventId}`,
                contentType: "application/json; charset=utf-8",
                dataType: 'json',
                cache: true,
                async: true
            });
            rapidVoltageChangeDataHandle.then((data) => { dispatch(AddData({ key: key, data: data.Data })) })
            result.push(rapidVoltageChangeDataHandle);
            break
        case ('RemoveCurrent'):
            let removeCurrentDataHandle = $.ajax({
                type: "GET",
                url: `${homePath}api/Analytic/GetRemoveCurrentData?eventId=${key.EventId}`,
                contentType: "application/json; charset=utf-8",
                dataType: 'json',
                cache: true,
                async: true
            });
            removeCurrentDataHandle.then((data) => { dispatch(AddData({ key: key, data: data.Data })) })
            result.push(removeCurrentDataHandle);
            break
        case ('Harmonic'):
            let specifiedHarmonicDataHandle = $.ajax({
                type: "GET",
                url: `${homePath}api/Analytic/GetSpecifiedHarmonicData?eventId=${key.EventId}` +
                    `&specifiedHarmonic=${options.Harmonic}`,
                contentType: "application/json; charset=utf-8",
                dataType: 'json',
                cache: true,
                async: true
            });
            specifiedHarmonicDataHandle.then((data) => { dispatch(AddData({ key: key, data: data.Data })) })
            result.push(specifiedHarmonicDataHandle);
            break
        case ('SymetricComp'):
            let symmetricalComponentsDataHandle = $.ajax({
                type: "GET",
                url: `${homePath}api/Analytic/GetSymmetricalComponentsData?eventId=${key.EventId}}`,
                contentType: "application/json; charset=utf-8",
                dataType: 'json',
                cache: true,
                async: true
            });
            symmetricalComponentsDataHandle.then((data) => { dispatch(AddData({ key: key, data: data.Data })) })
            result.push(symmetricalComponentsDataHandle);
            break
        case ('THD'):
            let thdDataHandle = $.ajax({
                type: "GET",
                url: `${homePath}api/Analytic/GetTHDData?eventId=${key.EventId}}`,
                contentType: "application/json; charset=utf-8",
                dataType: 'json',
                cache: true,
                async: true
            });
            thdDataHandle.then((data) => { dispatch(AddData({ key: key, data: data.Data })) })
            result.push(thdDataHandle);
            break
        case ('Unbalance'):
            let unbalanceDataHandle = $.ajax({
                type: "GET",
                url: `${homePath}api/Analytic/GetUnbalanceData?eventId=${key.EventId}}`,
                contentType: "application/json; charset=utf-8",
                dataType: 'json',
                cache: true,
                async: true
            });
            unbalanceDataHandle.then((data) => { dispatch(AddData({ key: key, data: data.Data })) })
            result.push(unbalanceDataHandle);
            break
        case ('FaultDistance'):
            let faultDistanceDataHandle = $.ajax({
                type: "GET",
                url: `${homePath}api/Analytic/GetFaultDistanceData?eventId=${key.EventId}}`,
                contentType: "application/json; charset=utf-8",
                dataType: 'json',
                cache: true,
                async: true
            });
            faultDistanceDataHandle.then((data) => { dispatch(AddData({ key: key, data: data.Data })) })
            result.push(faultDistanceDataHandle);
            break
        case ('Restrike'):
            let breakerRestrikeDataHandle = $.ajax({
                type: "GET",
                url: `${homePath}api/Analytic/GetBreakerRestrikeData?eventId=${key.EventId}}`,
                contentType: "application/json; charset=utf-8",
                dataType: 'json',
                cache: true,
                async: true
            });
            breakerRestrikeDataHandle.then((data) => { dispatch(AddData({ key: key, data: data.Data })) })
            result.push(breakerRestrikeDataHandle);
            break
        default:
            return []
            break;
    }


    return result;
}

// #endregion

// #region [ Helper Functions ]

//This Function Recomputes y Limits based on X limits for all states
function recomputeYLimits(start: number, end: number, data: Array<OpenSee.iD3DataSeries>, baseUnit: OpenSee.IUnitCollection, activeUnits: OpenSee.IActiveUnits): [number, number] {

    let limitedData = data.map((item,index) => {
        let indexStart = getIndex(start, item.DataPoints);
        let indexEnd = getIndex(end, item.DataPoints);

        let factor = baseUnit[item.Unit].options[activeUnits[item.Unit]].factor;

        return item.DataPoints.slice(indexStart, indexEnd).map(p => [p[0], p[1] * factor]).filter(p => !isNaN(p[1]) && isFinite(p[1]));
    });

    let yMin = Math.min(...limitedData.map(item => Math.min(...item.map(p => p[1]))))
    let yMax = Math.max(...limitedData.map(item => Math.max(...item.map(p => p[1]))))
    return [yMin, yMax];
    
}

//function that finds the index of a corrsponding t
function getIndex(t: number, data: Array<[number, number]>): number {
    if (data.length < 2)
        return NaN;
    let dP = data[1][0] - data[0][0];

    if (t < data[0][0])
        return 0;

    if (t > data[data.length - 1][0])
        return (data.length - 1);
    let deltaT = t - data[0][0];

    return Math.floor(deltaT / dP);

}

//function that Updates the Current Units if they are on auto
function updateUnits(baseUnits: OpenSee.IUnitCollection, data: Array<OpenSee.iD3DataSeries>, startTime: number, endTime: number): OpenSee.IActiveUnits  {
    let result = mapUnits(baseUnits);
    let relevantUnits = _.uniq(data.map(item => item.Unit));

    relevantUnits.forEach(unit => {
        if (baseUnits[unit].options[result[unit]].short != 'auto')
            return;

        let relevantData = data.filter(d => d.Unit == unit).map(d => {
            let startIndex = getIndex(startTime, d.DataPoints);
            let endIndex = getIndex(endTime, d.DataPoints);
            return d.DataPoints.slice(startIndex, endIndex);
        })
        let min = Math.min(...relevantData.map(d => Math.min(...d.map(p => p[1]))));
        let max = Math.max(...relevantData.map(d => Math.max(...d.map(p => p[1]))));

        let autoFactor = 0.000001
        if (Math.max(max, min) < 1)
            autoFactor = 1000
        else if (Math.max(max, min) < 1000)
            autoFactor = 1
        else if (Math.max(max, min) < 1000000)
            autoFactor = 0.001

        //Logic to move on to next if We can not find that Factor
        if (baseUnits[unit].options.findIndex(item => item.factor == autoFactor) >= 0)
            result[unit] = baseUnits[unit].options.findIndex(item => item.factor == autoFactor)
        else {
            //Unable to find Factor try moving one down/up
            if (autoFactor < 1)
                autoFactor = autoFactor * 1000
            else
                autoFactor = 1

            if (baseUnits[unit].options.findIndex(item => item.factor == autoFactor) >= 0)
                result[unit] = baseUnits[unit].options.findIndex(item => item.factor == autoFactor)
            else
                result[unit] = baseUnits[unit].options.findIndex(item => item.factor != 0)
        }

    })

    return result;
}

// function returns current units as IActiveUnits
function mapUnits(units: OpenSee.IUnitCollection): OpenSee.IActiveUnits {
    let result = {};
    Object.keys(units).forEach(key => { result[key] = units[key].current });
    return result as OpenSee.IActiveUnits; 
}

// Functioon that gets a Tooltip Display Name
function GetDisplayName(d: OpenSee.iD3DataSeries, type: OpenSee.graphType) {
    if (type == 'Voltage' || type == 'Current')
        return d.LegendGroup + (type == 'Voltage' ? ' V ' : ' I ') + d.LegendVertical + ' ' + d.LegendHorizontal;
    else
        return type + ' Needs to change'

}

// #endregion