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

import { Component, Inject, Input, OnDestroy, TemplateRef, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
    ControllerServiceReferencingComponent,
    SetEnableControllerServiceDialogRequest,
    SelectOption,
    TextTipInput
} from '../../../../state/shared';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { AsyncPipe, NgTemplateOutlet } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { PropertyTable } from '../../property-table/property-table.component';
import { ControllerServiceApi } from '../controller-service-api/controller-service-api.component';
import { ControllerServiceReferences } from '../controller-service-references/controller-service-references.component';
import { NifiSpinnerDirective } from '../../spinner/nifi-spinner.directive';
import { TextTip } from '../../tooltips/text-tip/text-tip.component';
import { NifiTooltipDirective } from '../../tooltips/nifi-tooltip.directive';
import {
    controllerServiceActionScopes,
    ControllerServiceState,
    SetEnableRequest,
    SetEnableStep
} from '../../../../state/contoller-service-state';
import { Store } from '@ngrx/store';
import {
    resetEnableControllerServiceState,
    setControllerService,
    stopPollingControllerService,
    submitEnableRequest
} from '../../../../state/contoller-service-state/controller-service-state.actions';
import {
    selectControllerService,
    selectControllerServiceSetEnableRequest
} from '../../../../state/contoller-service-state/controller-service-state.selectors';

@Component({
    selector: 'enable-controller-service',
    standalone: true,
    templateUrl: './enable-controller-service.component.html',
    imports: [
        ReactiveFormsModule,
        MatDialogModule,
        MatInputModule,
        MatCheckboxModule,
        MatButtonModule,
        MatTabsModule,
        MatOptionModule,
        MatSelectModule,
        PropertyTable,
        ControllerServiceApi,
        ControllerServiceReferences,
        AsyncPipe,
        NifiSpinnerDirective,
        NifiTooltipDirective,
        NgTemplateOutlet
    ],
    styleUrls: ['./enable-controller-service.component.scss']
})
export class EnableControllerService implements OnDestroy {
    @Input() goToReferencingComponent!: (component: ControllerServiceReferencingComponent) => void;

    protected readonly TextTip = TextTip;
    protected readonly SetEnableStep = SetEnableStep;
    protected readonly controllerServiceActionScopes: SelectOption[] = controllerServiceActionScopes;

    enableRequest$ = this.store.select(selectControllerServiceSetEnableRequest);
    controllerService$ = this.store.select(selectControllerService);

    enableControllerServiceForm: FormGroup;

    @ViewChild('stepComplete') stepComplete!: TemplateRef<any>;
    @ViewChild('stepError') stepError!: TemplateRef<any>;
    @ViewChild('stepInProgress') stepInProgress!: TemplateRef<any>;
    @ViewChild('stepNotStarted') stepNotStarted!: TemplateRef<any>;

    constructor(
        @Inject(MAT_DIALOG_DATA) public request: SetEnableControllerServiceDialogRequest,
        private store: Store<ControllerServiceState>,
        private formBuilder: FormBuilder
    ) {
        // build the form
        this.enableControllerServiceForm = this.formBuilder.group({
            scope: new FormControl(controllerServiceActionScopes[0].value, Validators.required)
        });

        this.store.dispatch(
            setControllerService({
                request: {
                    controllerService: request.controllerService
                }
            })
        );
    }

    getSelectOptionTipData(option: SelectOption): TextTipInput {
        return {
            // @ts-ignore
            text: option.description
        };
    }

    submitForm() {
        this.store.dispatch(
            submitEnableRequest({
                request: {
                    scope: this.enableControllerServiceForm.get('scope')?.value
                }
            })
        );
    }

    getTemplateForStep(step: SetEnableStep, enableRequest: SetEnableRequest): TemplateRef<any> {
        if (enableRequest.currentStep > step) {
            return this.stepComplete;
        } else {
            if (enableRequest.error?.step === step) {
                return this.stepError;
            }

            if (enableRequest.currentStep === step) {
                return this.stepInProgress;
            }

            return this.stepNotStarted;
        }
    }

    cancelClicked(): void {
        this.store.dispatch(stopPollingControllerService());
    }

    ngOnDestroy(): void {
        this.store.dispatch(resetEnableControllerServiceState());
    }
}
