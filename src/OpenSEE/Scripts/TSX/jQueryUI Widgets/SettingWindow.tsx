﻿//******************************************************************************************************
//  SettingWindow.tsx - Gbtc
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
//  06/08/2020 - C. Lackner
//       Generated original version of source code.
//
//******************************************************************************************************

import * as React from 'react';
import { style } from "typestyle"
import { clone, cloneDeep } from 'lodash';
import { BlockPicker } from 'react-color';

// styles
const outerDiv: React.CSSProperties = {
    fontSize: '12px',
    marginLeft: 'auto',
    marginRight: 'auto',
    padding: '0em',
    zIndex: 1000,
    boxShadow: '4px 4px 2px #888888',
    border: '2px solid black',
    position: 'absolute',
    top: '0',
    left: 0,
    display: 'none',
    backgroundColor: 'white',
    width: 700,
    height: 340
};

const handle = style({
    width: '100%',
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

export interface Colors {
    Va: string,
    Vb: string,
    Vc: string,
    Ia: string,
    Ib: string,
    Ic: string,
    Ires: string,
    random: string
}

export type UnitSetting = {
    current: Unit,
    options: Array<Unit>
}

export interface GraphUnits {
    Time: UnitSetting,
    Voltage: UnitSetting,
    Current: UnitSetting,
    Angle: UnitSetting,
    TCE: UnitSetting,
}
export type Unit = {
    Label: string,
    Short: string,
    Factor: number
}


export interface SettingWindowProps {
    stateSetter: Function,
    showV: boolean,
    showI: boolean,
    unitSetting: GraphUnits,
    colorSetting: Colors,

    showTCE: boolean,
    showdigitals: boolean,
    showAnalogs: boolean,
    showAnalytics: string,
}

export default class SettingWindow extends React.Component<any, any>{
    props: SettingWindowProps;
   
    constructor(props) {
        super(props);
    }


    componentDidMount() {
        ($("#settings") as any).draggable({ scroll: false, handle: '#settingshandle', containment: '#chartpanel' });
    }


    
    render() {
        
        return (
            <div id="settings" className="ui-widget-content" style={outerDiv}>
                <div id="settingshandle" className={handle}></div>
                <div id="phasorchart" style={{ width: '696px', height: '300px', zIndex: 1001, overflowY: 'scroll' }}>
                    <div className="accordion" id="panelSettings">
                        <div className="card">
                            <div className="card-header" id="headingUnit">
                                <h2 className="mb-0">
                                    <button className="btn btn-link btn-block text-left" type="button" data-toggle="collapse" data-target="#collapseUnit" aria-expanded="true" aria-controls="collapseVoltage">
                                        Plot Units
                                    </button>
                                </h2>
                            </div> 
                        
                            <div id="collapseUnit" className="collapse show" aria-labelledby="headingUnit" data-parent="#panelSettings">
                                <div className="card-body">
                                    <div className="container">
                                        {this.props.showV ?
                                            <div className="row">
                                                <div className="col">
                                                    {SelectUnit("Time", this.props.unitSetting.Time.current, this.props.unitSetting.Time.options, (op: Unit) => {
                                                        let settings = cloneDeep(this.props.unitSetting)
                                                        settings.Time.current = op;
                                                        this.props.stateSetter({ plotUnits: settings })
                                                    })}
                                                </div>
                                                <div className="col">
                                                    {SelectUnit("Voltage", this.props.unitSetting.Voltage.current, this.props.unitSetting.Voltage.options, (op: Unit) => {
                                                        let settings = cloneDeep(this.props.unitSetting)
                                                        settings.Voltage.current = op;
                                                        this.props.stateSetter({ plotUnits: settings })
                                                    })}
                                                </div>
                                                <div className="col">
                                                    {SelectUnit("Phase", this.props.unitSetting.Angle.current, this.props.unitSetting.Angle.options, (op: Unit) => {
                                                        let settings = cloneDeep(this.props.unitSetting)
                                                        settings.Angle.current = op;
                                                        this.props.stateSetter({ plotUnits: settings })
                                                    })}
                                            </div>
                                            </div> : null}
                                        {this.props.showI ?
                                            <div className="row">
                                                <div className="col">
                                                    {SelectUnit("Time", this.props.unitSetting.Time.current, this.props.unitSetting.Time.options, (op: Unit) => {
                                                        let settings = cloneDeep(this.props.unitSetting)
                                                        settings.Time.current = op;
                                                        this.props.stateSetter({ plotUnits: settings })
                                                    })}
                                                </div>
                                                <div className="col">
                                                    {SelectUnit("Current", this.props.unitSetting.Current.current, this.props.unitSetting.Current.options, (op: Unit) => {
                                                        let settings = cloneDeep(this.props.unitSetting)
                                                        settings.Current.current = op;
                                                        this.props.stateSetter({ plotUnits: settings })
                                                    })}
                                                </div>
                                                <div className="col">
                                                    {SelectUnit("Phase", this.props.unitSetting.Angle.current, this.props.unitSetting.Angle.options, (op: Unit) => {
                                                        let settings = cloneDeep(this.props.unitSetting)
                                                        settings.Angle.current = op;
                                                        this.props.stateSetter({ plotUnits: settings })
                                                    })}
                                                </div>
                                            </div> : null}
                                    </div>

                                </div>
                            </div> 
                        </div> 

                        <div className="card">
                            <div className="card-header" id="headingTwo">
                                <h2 className="mb-0">
                                    <button className="btn btn-link btn-block text-left collapsed" type="button" data-toggle="collapse" data-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                                        Plot Colors
                                    </button>
                                </h2>
                            </div>
                            <div id="collapseTwo" className="collapse" aria-labelledby="headingTwo" data-parent="#panelSettings">
                                <div className="card-body">
                                    <div className="container">
                                        {this.props.showV ?
                                            <div className="row">
                                                <div className="col">
                                                    <ColorButton label={"VAN/VAB"} color={this.props.colorSetting.Va} statesetter={(color) => { let col = cloneDeep(this.props.colorSetting); col.Va = color; this.props.stateSetter({ plotColors: col }); }} />
                                                </div>
                                                <div className="col">
                                                    <ColorButton label={"VBN/VBC"} color={this.props.colorSetting.Vb} statesetter={(color) => { let col = cloneDeep(this.props.colorSetting); col.Vb = color; this.props.stateSetter({ plotColors: col }); }} />
                                                </div>
                                                <div className="col">
                                                    <ColorButton label={"VCN/VCA"} color={this.props.colorSetting.Vc} statesetter={(color) => { let col = cloneDeep(this.props.colorSetting); col.Vc = color; this.props.stateSetter({ plotColors: col }); }} />
                                                </div>
                                            </div> : null}
                                        {this.props.showI ?
                                            <div className="row">
                                                <div className="col">
                                                    <ColorButton label={"IAN"} color={this.props.colorSetting.Ia} statesetter={(color) => { let col = cloneDeep(this.props.colorSetting); col.Ia = color; this.props.stateSetter({ plotColors: col }); }} />
                                                </div>
                                                <div className="col">
                                                    <ColorButton label={"IBN"} color={this.props.colorSetting.Ib} statesetter={(color) => { let col = cloneDeep(this.props.colorSetting); col.Ib = color; this.props.stateSetter({ plotColors: col }); }} />
                                                </div>
                                                <div className="col">
                                                    <ColorButton label={"ICN"} color={this.props.colorSetting.Ic} statesetter={(color) => { let col = cloneDeep(this.props.colorSetting); col.Ic = color; this.props.stateSetter({ plotColors: col }); }} />
                                                </div>
                                                <div className="col">
                                                    <ColorButton label={"IRES"} color={this.props.colorSetting.Ires} statesetter={(color) => { let col = cloneDeep(this.props.colorSetting); col.Ires = color; this.props.stateSetter({ plotColors: col }); }} />
                                                </div>
                                            </div> : null}
                                    </div>                                
                                </div>
                            </div>
                        </div>
                    </div>
                    
                </div>
                <button className={closeButton} onClick={() => {
                    $('#settings').hide();
                }}>X</button>

            </div>
        );
    }
}

const SelectUnit = (label: string, current: Unit, options: Array<Unit>, setter: (option: Unit) => void) => {

    let entries = options.map((option, index) => <a key={"option-" + index} className="dropdown-item" onClick={() => setter(option)}> {option.Label} </a>)

    return (
        <div className="btn-group dropright" style={{ margin: ' 5px 10px 5px 10px' }}>
            <button type="button" className="btn btn-secondary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                {label + " [" + current.Short + "]"}
            </button>
            <div className="dropdown-menu">
                {entries}
          </div>
        </div>
    );
}

class ColorButton extends React.Component {
    props: { label: string, statesetter: Function, color:string };

    state = {
        displayColorPicker: false,
    };

    handleClick = () => {
        this.setState({ displayColorPicker: !this.state.displayColorPicker })
    };

    handleClose = () => {
        this.setState({ displayColorPicker: false })
    };

    updateColor = (color, event) => {
        this.props.statesetter(color.hex);
    };

    render() {
        const popover: React.CSSProperties =
        {
            position: "absolute",
            zIndex: 1010,
        }
        const cover: React.CSSProperties =
        {
            position: 'fixed',
            top: '0px',
            right: '0px',
            bottom: '0px',
            left: '0px',
        }
        return (
            <div style={{ margin: ' 5px 10px 5px 10px' }}>
                <button className="btn btn-primary" onClick={this.handleClick} style={{ backgroundColor:  this.props.color }}>{this.props.label}</button>
                {this.state.displayColorPicker ? <div style={popover}>
                    <div style={cover} onClick={this.handleClose} />
                    <div style={{ position: 'fixed' }}>
                        <BlockPicker onChangeComplete={this.updateColor} color={this.props.color} />
                    </div>
                </div> : null}
            </div>
        )
    }
}

