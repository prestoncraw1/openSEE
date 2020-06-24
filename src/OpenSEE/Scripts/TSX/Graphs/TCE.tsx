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
import * as moment from 'moment';
import { cloneDeep } from "lodash";

export interface TCEChartProps extends D3LineChartBaseProps { yAxisLimits: any }


export default class TCE extends React.Component<D3LineChartBaseProps, any>{
    openSEEService: OpenSEEService;
    props: TCEChartProps
    constructor(props) {
        super(props);
        this.openSEEService = new OpenSEEService();
    }

    componentWillUnmount() {
        if (this.state.eventDataHandle !== undefined && this.state.eventDataHandle.abort !== undefined) {
            this.state.eventDataHandle.abort();
            this.setState({ eventDataHandle: undefined });
        }
       
    }


    getData(props: D3LineChartBaseProps, baseCtrl: D3LineChartBase, ctrl: TCE): void {

        var eventDataHandle = ctrl.openSEEService.getWaveformTCEData(props.eventId).then(data => {
            var dataSet = baseCtrl.state.dataSet;
            baseCtrl.addData(data, baseCtrl)


            if (this.props.endTime == 0) this.props.stateSetter({ graphEndTime: this.props.endTime });
            if (this.props.startTime == 0) this.props.stateSetter({ graphStartTime: this.props.startTime });
        });

        this.setState({ eventDataHandle: eventDataHandle });
        
    }
   
    setYLimits(ymin: number, ymax: number, auto: boolean) {
        let lim = cloneDeep(this.props.yAxisLimits);
        lim.TCE.min = ymin;
        lim.TCE.max = ymax;
        lim.TCE.auto = auto;

        this.props.stateSetter({ yLimits: lim });

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
            pointTable={this.props.pointTable}
            unitSettings={this.props.unitSettings}
            colorSettings={this.props.colorSettings}
            zoomMode={this.props.zoomMode}
            mouseMode={"zoom"}
            yLimits={{
                min: this.props.yAxisLimits.Voltage.min,
                max: this.props.yAxisLimits.Voltage.max,
                auto: this.props.yAxisLimits.Voltage.auto,
                setter: this.setYLimits.bind(this)
            }}
        />
    }

}