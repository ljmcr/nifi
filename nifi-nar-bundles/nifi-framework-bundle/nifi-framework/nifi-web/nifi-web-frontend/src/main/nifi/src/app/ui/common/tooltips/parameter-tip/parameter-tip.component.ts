/*
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Component, Input } from '@angular/core';

import { Parameter, ParameterTipInput } from '../../../../state/shared';
import { NiFiCommon } from '../../../../service/nifi-common.service';
import { ControllerServiceApi } from '../../controller-service/controller-service-api/controller-service-api.component';

@Component({
    selector: 'parameter-tip',
    standalone: true,
    templateUrl: './parameter-tip.component.html',
    imports: [ControllerServiceApi],
    styleUrls: ['./parameter-tip.component.scss']
})
export class ParameterTip {
    @Input() left = 0;
    @Input() bottom = 0;
    @Input() data: ParameterTipInput | null = null;

    constructor(private nifiCommon: NiFiCommon) {}

    hasDescription(parameter: Parameter): boolean {
        return !this.nifiCommon.isBlank(parameter.description);
    }
}
