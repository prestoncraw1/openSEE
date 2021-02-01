﻿//******************************************************************************************************
//  ChartIcons.tsx - Gbtc
//
//  Copyright © 2021, Grid Protection Alliance.  All Rights Reserved.
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
//  02/01/2021 - C. Lackner
//       Generated original version of source code
//
//******************************************************************************************************


import * as React from 'react';
import styled, { keyframes, css } from "styled-components";


const spin = keyframes`
 0% { transform: rotate(0deg); }
 100% { transform: rotate(360deg); }
`;

const Icon = styled.div`
	animation: ${spin} 1s linear infinite;
	border: 10px solid #f3f3f3;
	border-Top: 10px solid #555;
	border-Radius: 50%;
	width: 50px;
	height: 50px
`;

export const LoadingIcon = (props: {}) => {
	return <div style={{ width: '100%', height: '100%' }} >
		<div style={{ width: '200px', margin: 'auto' }} >
			<Icon />
			<span>Loading...</span>
		</div>
	</div>
}

export const NoDataIcon = (props: {}) => {
	return <div style={{ width: '100%', height: '100%' }} >
		<div style={{ width: '250px', margin: 'auto' }} >
			<div>
				<i className="fa fa-exclamation-triangle fa-5x"></i>
			</div>
			<span>No Data Available</span>
		</div>
	</div>
}