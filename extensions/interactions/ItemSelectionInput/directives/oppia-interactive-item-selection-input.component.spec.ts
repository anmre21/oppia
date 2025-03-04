// Copyright 2021 The Oppia Authors. All Rights Reserved.
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
 * @fileoverview Unit tests for the ItemSelectionInput interaction.
 */

import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { InteractiveItemSelectionInputComponent } from './oppia-interactive-item-selection-input.component';
import { BrowserCheckerService } from 'domain/utilities/browser-checker.service';
import { CurrentInteractionService } from 'pages/exploration-player-page/services/current-interaction.service';
import { InteractionAttributesExtractorService } from 'interactions/interaction-attributes-extractor.service';
import { MockTranslatePipe } from 'tests/unit-test-utils';

describe('oppiaInteractiveItemSelectionInput', function() {
  let component: InteractiveItemSelectionInputComponent;
  let fixture: ComponentFixture<InteractiveItemSelectionInputComponent>;
  let browserCheckerService: BrowserCheckerService;
  let currentInteractionService: CurrentInteractionService;

  class MockInteractionAttributesExtractorService {
    getValuesFromAttributes(interactionId, attributes) {
      return {
        choices: {
          value: JSON.parse(attributes.choicesWithValue)
        },
        maxAllowableSelectionCount: {
          value: JSON.parse(attributes.maxAllowableSelectionCountWithValue)
        },
        minAllowableSelectionCount: {
          value: JSON.parse(attributes.minAllowableSelectionCountWithValue)
        }
      };
    }
  }

  class MockCurrentInteractionService {
    onSubmit(answer, rulesService) {}
    registerCurrentInteraction(submitAnswerFn, validateExpressionFn) {
      submitAnswerFn();
      validateExpressionFn();
    }
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        InteractiveItemSelectionInputComponent,
        MockTranslatePipe
      ],
      providers: [
        {
          provide: InteractionAttributesExtractorService,
          useClass: MockInteractionAttributesExtractorService
        },
        {
          provide: CurrentInteractionService,
          useClass: MockCurrentInteractionService
        },
        BrowserCheckerService
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    browserCheckerService = TestBed.inject(BrowserCheckerService);
    currentInteractionService = TestBed.inject(CurrentInteractionService);
    fixture = TestBed.createComponent(InteractiveItemSelectionInputComponent);
    component = fixture.componentInstance;
  });

  describe('when only one choice is allowed to be selected', () => {
    beforeEach(() => {
      component.choicesWithValue = '[' +
        '{' +
        '    "html": "choice 1",' +
        '    "contentId": "ca_choices_1"' +
        '},' +
        '{' +
        '    "html": "choice 2",' +
        '    "contentId": "ca_choices_2"' +
        '},' +
        '{' +
        '    "html": "choice 3",' +
        '    "contentId": "ca_choices_3"' +
        '}' +
    ']';
      component.maxAllowableSelectionCountWithValue = '1';
      component.minAllowableSelectionCountWithValue = '1';
    });

    it('should initialise component when user adds interaction', () => {
      component.ngOnInit();

      expect(component.choices).toEqual([
        'choice 1', 'choice 2', 'choice 3'
      ]);
      expect(component.userSelections).toEqual({
        'choice 1': false,
        'choice 2': false,
        'choice 3': false
      });
      expect(component.maxAllowableSelectionCount).toBe(1);
      expect(component.minAllowableSelectionCount).toBe(1);
      expect(component.displayCheckboxes).toBeFalse();
      expect(component.preventAdditionalSelections).toBeFalse();
      expect(component.notEnoughSelections).toBeTrue();
    });

    it('should deselect previously selected option and select the option' +
    ' checked by the user', () => {
      let dummyMouseEvent = new MouseEvent('Mouse');
      spyOn(browserCheckerService, 'isMobileDevice').and.returnValue(false);
      spyOn(document, 'querySelector')
        .withArgs('button.multiple-choice-option.selected').and.returnValue({
          // This throws "Type '{ add: () => void; remove: () => void; }'
          // is missing the following properties from type 'DOMTokenList':
          // length, value, contains, item, and 4 more". We need to suppress
          // this error because typescript expects more
          // properties than just one add and remove.
          // We need only add and remove for testing purposes.
          // @ts-expect-error
          classList: {
            add: () => {
              return;
            },
            remove: () => {
              return;
            },
            contains: (text) => {
              return true;
            }
          }
        });
      spyOnProperty(dummyMouseEvent, 'currentTarget').and.returnValue(
        {
          classList: {
            add: () => {
              return;
            },
            remove: () => {
              return;
            },
            contains: (text) => {
              return true;
            }
          }

        }
      );
      spyOn(currentInteractionService, 'onSubmit').and.callThrough();
      spyOn(component, 'submitAnswer').and.callThrough();
      component.ngOnInit();
      component.userSelections = {
        'choice 2': true
      };

      component.submitMultipleChoiceAnswer(dummyMouseEvent, 0);

      expect(component.userSelections).toEqual({
        'choice 1': true,
      });
      expect(component.submitAnswer).toHaveBeenCalledTimes(2);
      expect(currentInteractionService.onSubmit).toHaveBeenCalledTimes(2);
    });

    it('should not submit answer when user click an option if user is using a' +
    ' mobile', () => {
      let dummyMouseEvent = new MouseEvent('Mouse');
      spyOn(browserCheckerService, 'isMobileDevice').and.returnValue(true);
      spyOn(document, 'querySelector')
        .withArgs('button.multiple-choice-option.selected').and.returnValue({
          // This throws "Type '{ add: () => void; remove: () => void; }'
          // is missing the following properties from type 'DOMTokenList':
          // length, value, contains, item, and 4 more". We need to suppress
          // this error because typescript expects more
          // properties than just one add and remove.
          // We need only add and remove for testing purposes.
          // @ts-expect-error
          classList: {
            add: () => {
              return;
            },
            remove: () => {
              return;
            },
            contains: (text) => {
              return true;
            }
          }
        });
      spyOnProperty(dummyMouseEvent, 'currentTarget').and.returnValue(
        {
          classList: {
            add: () => {
              return;
            },
            remove: () => {
              return;
            },
            contains: (text) => {
              return true;
            }
          }

        }
      );
      spyOn(currentInteractionService, 'onSubmit').and.callThrough();
      spyOn(component, 'submitAnswer').and.callThrough();
      component.ngOnInit();
      component.userSelections = {
        'choice 2': true
      };

      component.submitMultipleChoiceAnswer(dummyMouseEvent, 0);

      expect(component.userSelections).toEqual({
        'choice 1': true,
      });
      expect(component.submitAnswer).toHaveBeenCalledTimes(1);
      expect(currentInteractionService.onSubmit).toHaveBeenCalledTimes(1);
    });
  });

  describe('when multiple choices are allowed to be selected', () => {
    beforeEach(() => {
      component.choicesWithValue = '[' +
        '{' +
        '    "html": "choice 1",' +
        '    "contentId": "ca_choices_1"' +
        '},' +
        '{' +
        '    "html": "choice 2",' +
        '    "contentId": "ca_choices_2"' +
        '},' +
        '{' +
        '    "html": "choice 3",' +
        '    "contentId": "ca_choices_3"' +
        '}' +
    ']';
      component.maxAllowableSelectionCountWithValue = '2';
      component.minAllowableSelectionCountWithValue = '1';
    });

    it('should initialise component when user adds interaction', () => {
      component.ngOnInit();
      expect(component.choices).toEqual([
        'choice 1', 'choice 2', 'choice 3'
      ]);
      expect(component.userSelections).toEqual({
        'choice 1': false,
        'choice 2': false,
        'choice 3': false
      });
      expect(component.maxAllowableSelectionCount).toBe(2);
      expect(component.minAllowableSelectionCount).toBe(1);
      expect(component.displayCheckboxes).toBeTrue();
      expect(component.preventAdditionalSelections).toBeFalse();
      expect(component.notEnoughSelections).toBeTrue();
    });

    it('should toggle checkbox when user clicks checkbox', () => {
      component.ngOnInit();
      component.userSelections = {
        'choice 1': true,
        'choice 2': false,
        'choice 3': false
      };
      expect(component.selectionCount).toBeUndefined();
      expect(component.newQuestion).toBeUndefined();
      expect(component.preventAdditionalSelections).toBeFalse();
      expect(component.notEnoughSelections).toBeTrue();

      component.onToggleCheckbox();

      expect(component.newQuestion).toBe(false);
      expect(component.selectionCount).toBe(1);
      // The preventAdditionalSelections is set to true when the
      // maxAllowableSelectionCount is reached. Therefore we test to
      // ensure preventAdditionalSelections is false because the count has
      // not been reached.
      expect(component.preventAdditionalSelections).toBeFalse();
      expect(component.notEnoughSelections).toBeFalse();
    });

    it('should prevent users from selecting more options when' +
    ' \'maxAllowableSelectionCount\' has been reached', () => {
      component.ngOnInit();
      component.userSelections = {
        'choice 1': true,
        'choice 2': true,
        'choice 3': false
      };
      expect(component.selectionCount).toBeUndefined();
      expect(component.preventAdditionalSelections).toBeFalse();
      expect(component.notEnoughSelections).toBeTrue();

      component.onToggleCheckbox();

      expect(component.selectionCount).toBe(2);
      expect(component.preventAdditionalSelections).toBeTrue();
      expect(component.notEnoughSelections).toBeFalse();
    });
  });
});
