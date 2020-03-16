﻿//******************************************************************************************************
//  Tooltip.tsx - Gbtc
//
//  Copyright © 2018, Grid Protection Alliance.  All Rights Reserved.
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
//  05/14/2018 - Billy Ernest
//       Generated original version of source code.
//
//******************************************************************************************************

import * as React from 'react';
import { style } from "typestyle"
import { iD3DataPoint } from '../Graphs/D3LineChartBase';
import moment = require('moment');

// styles
const outerDiv: React.CSSProperties = {
    minWidth : '200px',
    maxWidth: '400px',
    fontSize: '12px',
    marginLeft: 'auto',
    marginRight: 'auto',
    overflowY: 'auto',
    padding: '0em',
    zIndex: 1000,
    boxShadow: '4px 4px 2px #888888',
    border: '2px solid black',
    position: 'absolute',
    top: '0',
    left: 0,
    display: 'none',
    backgroundColor: 'white'
};

const handle = style({
    width: '100 %',
    height: '20px',
    backgroundColor: '#808080',
    cursor: 'move',
    padding: '0em'
});

const closeButton = style({
    background: 'firebrick',
    color: 'white',
    position: 'absolute',
    top: 0,
    right: 0,
    width: '20px',
    height: '20px',
    textAlign: 'center',
    verticalAlign: 'middle',
    padding: 0,
    border: 0,
    $nest: {
        "&:hover": {
            background: 'orangered'
        }
    }
});

export interface TooltipProps {
    data: Array<iD3DataPoint>,
    hover: number,
    callback: Function
}

declare var window: Window;

export default class Tooltip extends React.Component<any, any>{
    props: TooltipProps;
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        var ctrl = this;
        ($('#unifiedtooltip') as any).draggable({ scroll: false, handle: '#unifiedtooltiphandle', containment: 'document' });
    }

    render() {
        let TS = moment(this.props.hover);
        if (this.props.data.length > 0)
            TS = moment(this.props.data[0].Time);

        //var subsecond = ("0000000" + (this.props.hover * 10000 % 10000000)).slice(-7);
        //var format = ($.plot as any).formatDate(($.plot as any).dateGenerator(this.props.hover, { timezone: "utc" }), "%Y-%m-%d %H:%M:%S") + "." + subsecond;
        var rows = [];

        this.props.data.forEach((data,i) => {
            if (data.Enabled)
                rows.push(Row(data,i));
        });


        return (
            <div id="unifiedtooltip" className="ui-widget-content" style={outerDiv}>
                <div id="unifiedtooltiphandle" className={handle}></div>
                <div id="unifiedtooltipcontent" >
                    <div style={{ textAlign: 'center' }} >
                        <b>{TS.utc().format("MM-DD-YYYY HH:mm:ss.SSSSSS")}</b>
                        <br />
                        <table className="table">
                            <tbody style={{ display: 'block', overflowY: 'scroll', maxHeight: window.innerHeight * 0.9 }}>
                                {rows}
                            </tbody>
                        </table>
                    </div>
                </div>
                <button className={closeButton} onClick={() => {
                    this.props.callback({ tooltipButtonText: "Show Tooltip" });
                    $('#unifiedtooltip').hide();
                    //$('.legendCheckbox').hide();
                }}>X</button>
            </div>
        );
    }
}

const Row = (row: iD3DataPoint, key: number) => {
    return (
        <tr key={key}>
            <td className="dot" style={{ background: row.Color, width: '12px' }}>&nbsp;&nbsp;&nbsp;</td>
            <td style={{ textAlign: 'left' }}><b>{row.ChartLabel}</b></td>
            <td style={{ textAlign: "right" }}><b>{(row.Value).toFixed(2)} {row.XaxisLabel}</b></td>
        </tr>
    );
}

