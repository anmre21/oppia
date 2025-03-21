// Copyright 2019 The Oppia Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview Component for the RatioExpressionInput short response.
 *
 * IMPORTANT NOTE: The naming convention for customization args that are passed
 * into the directive is: the name of the parameter, followed by 'With',
 * followed by the name of the arg.
 */

import { Component, Input, OnInit } from '@angular/core';
import { downgradeComponent } from '@angular/upgrade/static';
import { HtmlEscaperService } from 'services/html-escaper.service';
import { Ratio } from 'domain/objects/ratio.model';
import { RatioInputAnswer } from 'interactions/answer-defs';

@Component({
  selector: 'oppia-short-response-ratio-expression-input',
  templateUrl: './ratio-expression-input-short-response.component.html',
  styleUrls: []
})
export class ShortResponseRatioExpressionInputComponent implements OnInit {
  // These properties are initialized using Angular lifecycle hooks
  // and we need to do non-null assertion. For more information, see
  // https://github.com/oppia/oppia/wiki/Guide-on-defining-types#ts-7-1
  @Input() answer!: string;
  responses: string;

  constructor(private htmlEscaperService: HtmlEscaperService) {}

  ngOnInit(): void {
    const answer: RatioInputAnswer = this.htmlEscaperService.escapedJsonToObj(
      this.answer
    ) as RatioInputAnswer;

    this.responses = Ratio.fromList(answer).toAnswerString();
  }
}

angular.module('oppia').directive(
  'oppiaShortResponseRatioExpressionInput', downgradeComponent({
    component: ShortResponseRatioExpressionInputComponent
  }) as angular.IDirectiveFactory);
