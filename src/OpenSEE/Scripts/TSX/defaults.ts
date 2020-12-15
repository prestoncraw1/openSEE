﻿//******************************************************************************************************
//  defaults.d.ts - Gbtc
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
//  Type definitions for openSEE.tsx
//
//  Code Modification History:
//  ----------------------------------------------------------------------------------------------------
//  09/29/2020 - C. Lackner
//       Generated original version of source code.
//
//******************************************************************************************************
import { OpenSee } from './global';
//This Contains the default Settings for Unit, Color etc


// Default Settings
export const defaultSettings = {
    snapToPoint: false,
    singlePoint: true,
    Colors: {
        Va: "#A30000",
        Vb: "#0029A3",
        Vc: "#007A29",
        Vn: "#d3d3d3",
        Vab: "#A30000",
        Vbc: "#0029A3",
        Vca: "#007A29",
        Ia: "#FF0000",
        Ib: "#0066CC",
        Ic: "#33CC33",
        Ires: "#d3d3d3",
        In: "#d3d3d3",
        random: "#4287f5",
        freqAll: "#edc240",
        freqVa: "#A30000",
        freqVb: "#0029A3",
        freqVc: "#007A29",
        Ra: "#A30000",
        Xa: "#0029A3",
        Za: "#007A29",
        Rb: "#A30000",
        Xb: "#0029A3",
        Zb: "#007A29",
        Rc: "#A30000",
        Xc: "#0029A3",
        Zc: "#007A29",
        Pa: "#A30000",
        Qa: "#0029A3",
        Sa: "#007A29",
        Pb: "#A30000",
        Qb: "#0029A3",
        Sb: "#007A29",
        Pc: "#A30000",
        Qc: "#0029A3",
        Sc: "#007A29",
        Pt: "#A30000",
        Qt: "#0029A3",
        St: "#007A29",
        Pfa: "#A30000",
        Pfb: "#0029A3",
        Pfc: "#007A29",
        VS0: "#A30000",
        VS1: "#0029A3",
        VS2: "#007A29",
        IS0: "#A30000",
        IS1: "#0029A3",
        IS2: "#007A29",
        Vdc: "#0029A3",
        Idc: "#007A29",
        faultDistSimple: "#edc240",
        faultDistReact: "#afd8f8",
        faultDistTakagi: "#cb4b4b",
        faultDistModTakagi: "#4da74d",
        faultDistNovosel: "#9440ed",
        faultDistDoubleEnd: "#BD9B33",
    } as OpenSee.IColorCollection,
    Units: {
        Voltage: {
            current: 4, options: [
                { label: "Volt", short: "V", factor: 1 },
                { label: "kiloVolt", short: "kV", factor: 0.001 },
                { label: "milliVolt", short: "mV", factor: 1000 },
                { label: "per Unit", short: "pu", factor: 0 },
                { label: "auto", short: "auto", factor: 0 }
            ]
        },
        Angle: {
            current: 0, options: [
                { label: "degree", short: "deg", factor: 1 },
                { label: "radians", short: "rad", factor: 0.0174532925 }
            ]
        },
        Current: {
            current: 4,
            options: [
                { label: "Amps", short: "A", factor: 1 },
                { label: "kiloAmps", short: "kA", factor: 0.001 },
                { label: "milliAmps", short: "mA", factor: 1000 },
                { label: "Per Unit", short: "pu", factor: 0 },
                { label: "auto", short: "auto", factor: 0 }
            ]
        },
        VoltageperSecond: {
            current: 4,
            options: [
                { label: "Volt per sec", short: "V/s", factor: 1 },
                { label: "kiloVolts per sec", short: "kV/s", factor: 0.001 },
                { label: "milliVolts per sec", short: "mV/s", factor: 1000 },
                { label: "Per Unit", short: "pu/s", factor: 0 },
                { label: "auto", short: "auto", factor: 0 }
            ]
        },
        CurrentperSecond: {
            current: 4,
            options: [
                { label: "Amps per sec", short: "A/s", factor: 1 },
                { label: "kiloAmps per sec", short: "kA/s", factor: 0.001 },
                { label: "milliAmps per sec", short: "mA/s", factor: 1000 },
                { label: "Per Unit", short: "pu/s", factor: 0 },
                { label: "auto", short: "auto", factor: 0 }
            ]
        },
        Freq: {
            current:4,
            options: [
                { label: "Hertz", short: "Hz", factor: 1 },
                { label: "milliHertz", short: "mHz", factor: 1000 },
                { label: "kiloHertz", short: "kHz", factor: 0.001 },
                { label: "Per Unit", short: "pu", factor: 0 },
                { label: "auto", short: "auto", factor: 0 }
            ]
        },
        Impedance: {
            current: 5,
            options: [
                { label: "Ohms", short: "Ohm", factor: 1 },
                { label: "kiloOhms", short: "kOhm", factor: 0.001 },
                { label: "milliOhms", short: "mOhm", factor: 1000 },
                { label: "Per Unit", short: "pu", factor: 0 },
                { label: "auto", short: "auto", factor: 0 }
            ]
        },
        PowerP: {
            current: 5,
            options: [
                { label: "Watt", short: "W", factor: 1000000 },
                { label: "Mega Watt", short: "MW", factor: 1 },
                { label: "Kilo Watt", short: "kW", factor: 1000 },
                { label: "Per Unit", short: "pu", factor: 0 },
                { label: "auto", short: "auto", factor: 0 }
            ]
        },
        PowerQ: {
            current: 5,
            options: [
                { label: "Volt-Amps Reactive", short: "VAR", factor: 1000000 },
                { label: "Mega Volt-Amps Reactive", short: "MVAR", factor: 1 },
                { label: "Kilo Volt-Amps Reactive", short: "kVAR", factor: 1000 },
                { label: "Per Unit", short: "pu", factor: 0 },
                { label: "auto", short: "auto", factor: 0 }
            ]
        },
        PowerS: {
            current: 5,
            options: [
                { label: "Volt-Amps", short: "VA", factor: 1000000 },
                { label: "Mega Volt-Amps", short: "MVA", factor: 1 },
                { label: "Kilo Volt-Amps", short: "kVA", factor: 1000 },
                { label: "Per Unit", short: "pu", factor: 0 },
                { label: "auto", short: "auto", factor: 0 }
            ]
        },
        PowerPf: {
            current: 0,
            options: [
                { label: "", short: "pf", factor: 1 }
            ]
        },

        TCE: {
            current: 4,
            options: [
                { label: "Amps", short: "A", factor: 1 },
                { label: "kiloAmps", short: "kA", factor: 0.001 },
                { label: "milliAmps", short: "mA", factor: 1000 },
                { label: "Per Unit", short: "pu", factor: 0 },
                { label: "auto", short: "auto", factor: 0 }
            ]
        },

        Distance: {
            current: 1,
            options: [
                { label: "kilometers", short: "km", factor: 1.60934 },
                { label: "miles", short: "mile", factor: 1 },
            ]
        },

        Unbalance: {
            current: 1,
            options: [
                { label: "Percent", short: "%", factor: 100 },
                { label: "Ratio", short: "Unbalance", factor: 1 }
            ]
        },
        THD: {
            current: 1,
            options: [
                { label: "Percent", short: "%", factor: 100 },
                { label: "Ratio", short: "THD", factor: 1 }
            ]
        },


    } as OpenSee.IUnitCollection,
    TimeUnit: {
        current: 5, options: [
            { label: "seconds", short: "s", factor: 0 },
            { label: "minutes", short: "min", factor: 0 },
            { label: "milliseconds", short: "ms", factor: 0 },
            { label: "milliseconds since event", short: "ms since event", factor: 0 },
            { label: "cycles since event", short: "cycles", factor: 0 },
            { label: "auto", short: "auto", factor: 0 }
        ]
    },


}
