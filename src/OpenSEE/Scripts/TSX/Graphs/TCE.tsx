﻿//******************************************************************************************************
//  TCE.tsx - Gbtc
//
//  Copyright © 2019, Grid Protection Alliance.  All Rights Reserved.
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
//  08/20/2019 - Christoph Lackner
//       Generated original version of source code.
//  01/20/2020 - Christoph Lackner
//       Switched to D3.
//
//******************************************************************************************************

import * as React  from 'react';
import OpenSEEService from '../../TS/Services/OpenSEE';
import D3LineChartBase, { D3LineChartBaseProps } from './../Graphs/D3LineChartBase';
import { cloneDeep } from "lodash";

export interface TCEChartProps extends D3LineChartBaseProps { }


export default class TCE extends React.Component<D3LineChartBaseProps, any>{
    openSEEService: OpenSEEService;
    props: TCEChartProps
    constructor(props) {
        super(props);
        this.openSEEService = new OpenSEEService();
    }

    componentWillUnmount() {
        if (this.state.eventDataHandle !== undefined) {
            this.state.eventDataHandle.forEach(item => {
                if (item.abort !== undefined)
                    item.abort();
            })
            this.setState({ eventDataHandle: undefined });
        }
       
    }


    getData(props: D3LineChartBaseProps, baseCtrl: D3LineChartBase, ctrl: TCE): void {
        
        const eventDataHandle = ctrl.openSEEService.getWaveformTCEData(props.eventId).then(data => {
            if (data == null) return;

            baseCtrl.addData(data, baseCtrl, true);


            if (this.props.endTime == 0) this.props.stateSetter({ graphEndTime: this.props.endTime });
            if (this.props.startTime == 0) this.props.stateSetter({ graphStartTime: this.props.startTime });

        });
        this.setState((props, state) => {
            if (state.evendDataHandle == undefined)
                return { eventDataHandle: [eventDataHandle] }
            else {
                let tmp = state.eventDataHandle;
                tmp.push(eventDataHandle);
                return { eventDataHandle: tmp }
            }
        });

        this.props.compareEvents.forEach(evtID => {
            const compareDataHandle = ctrl.openSEEService.getWaveformTCEData(evtID).then(data => {
                setTimeout(() => {
                    if (data == null) return;
                    baseCtrl.addData(data, baseCtrl);
                }, 200);
            });

            this.setState((props, state) => {
                if (state.evendDataHandle == undefined)
                    return { eventDataHandle: [compareDataHandle] }
                else {
                    let tmp = state.eventDataHandle;
                    tmp.push(compareDataHandle);
                    return { eventDataHandle: tmp }
                }
            });

        })
        
    }
   
    setYLimits(ymin: number, ymax: number, auto: boolean) {
        let lim = cloneDeep(this.props.yLimits);
        lim.min = ymin;
        lim.max = ymax;
        lim.auto = auto;

        this.props.stateSetter({ tceLimits: lim });

    }

    render() {
        return <D3LineChartBase
            legendKey="TCE"
            openSEEServiceFunction={this.openSEEService.getWaveformTCEData}
            getData={(props, ctrl) => this.getData(props, ctrl, this)}
            eventId={this.props.eventId}
            height={this.props.height}
            width={this.props.width}
            stateSetter={this.props.stateSetter}
            options={this.props.options}
            startTime={this.props.startTime}
            endTime={this.props.endTime}
            hover={this.props.hover}
            fftWindow={this.props.fftWindow}
            fftStartTime={this.props.fftStartTime}
            unitSettings={this.props.unitSettings}
            colorSettings={this.props.colorSettings}
            zoomMode={this.props.zoomMode}
            mouseMode={this.props.mouseMode}
            yLimits={{ ...this.props.yLimits, setter: this.setYLimits.bind(this) }}
            compareEvents={this.props.compareEvents}
            tableSetter={this.props.tableSetter}
            activeUnitSetter={this.props.activeUnitSetter}
            getPointSetter={this.props.getPointSetter}
        />
    }

}