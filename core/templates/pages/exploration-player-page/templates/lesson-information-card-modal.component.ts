// Copyright 2022 The Oppia Authors. All Rights Reserved.
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
 * @fileoverview Component for lesson information card modal.
 */

import { Component } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmOrCancelModal } from 'components/common-layout-directives/common-elements/confirm-or-cancel-modal.component';
import { StateCard } from 'domain/state_card/state-card.model';
import { StoryPlaythrough } from 'domain/story_viewer/story-playthrough.model';
import { StoryViewerBackendApiService } from 'domain/story_viewer/story-viewer-backend-api.service';
import { LearnerExplorationSummaryBackendDict } from
  'domain/summary/learner-exploration-summary.model';
import { UrlService } from 'services/contextual/url.service';
import { I18nLanguageCodeService, TranslationKeyType } from
  'services/i18n-language-code.service';

 @Component({
   selector: 'oppia-lesson-information-card-modal',
   templateUrl: './lesson-information-card-modal.component.html'
 })
export class LessonInformationCardModalComponent extends ConfirmOrCancelModal {
  // These properties below are initialized using Angular lifecycle hooks
  // where we need to do non-null assertion. For more information see
  // https://github.com/oppia/oppia/wiki/Guide-on-defining-types#ts-7-1
  storyTitleTranslationKey!: string;
  storyPlaythroughObject!: StoryPlaythrough;
  storyId!: string;
  storyTitle: string = '';
  topicUrlFragment: string;
  classroomUrlFragment: string;
  storyUrlFragment: string;
  expTitleTranslationKey!: string;
  expDescTranslationKey!: string;
  displayedCard!: StateCard;
  explorationId!: string;
  expTitle!: string;
  expDesc!: string;
  contributorNames!: string[];
  storyTitleIsPresent!: boolean;
  chapterTitle!: string;
  chapterDesc!: string;
  chapterNumber!: string;
  checkpointCount!: number;
  expInfo: LearnerExplorationSummaryBackendDict;
  completedWidth!: number;
  separatorArray: number[] = [];


  constructor(
    private ngbModal: NgbModal,
    private ngbActiveModal: NgbActiveModal,
    private urlService: UrlService,
    private i18nLanguageCodeService: I18nLanguageCodeService,
    private storyViewerBackendApiService: StoryViewerBackendApiService,
  ) {
    super(ngbActiveModal);
  }

  ngOnInit(): void {
    this.explorationId = this.expInfo.id;
    this.expTitle = this.expInfo.title;
    this.expDesc = this.expInfo.objective;
    this.storyId = this.urlService.getUrlParams().story_id;
    this.storyTitleIsPresent = !!this.storyId;

    this.storyTitleTranslationKey = (
      this.i18nLanguageCodeService
        .getStoryTranslationKey(
          this.storyId, TranslationKeyType.TITLE));

    this.expTitleTranslationKey = (
      this.i18nLanguageCodeService.
        getExplorationTranslationKey(
          this.explorationId, TranslationKeyType.TITLE)
    );
    this.expDescTranslationKey = (
      this.i18nLanguageCodeService.
        getExplorationTranslationKey(
          this.explorationId, TranslationKeyType.DESCRIPTION)
    );

    if (this.storyTitleIsPresent) {
      this.topicUrlFragment = (
        this.urlService.getTopicUrlFragmentFromLearnerUrl());
      this.classroomUrlFragment = (
        this.urlService.getClassroomUrlFragmentFromLearnerUrl());
      this.storyUrlFragment = (
        this.urlService.getStoryUrlFragmentFromLearnerUrl());

      this.storyViewerBackendApiService.fetchStoryDataAsync(
        this.topicUrlFragment,
        this.classroomUrlFragment,
        this.storyUrlFragment).then(
        (storyDataDict) => {
          this.storyTitle = storyDataDict.title;
        });
    }

    // Rendering the separators in the progress bar requires
    // the number of separators.The purpose of separatorArray
    // is to provide the number of checkpoints in the template file.
    this.separatorArray = new Array(this.checkpointCount);
  }

  isHackyStoryTitleTranslationDisplayed(): boolean {
    return (
      this.i18nLanguageCodeService.isHackyTranslationAvailable(
        this.storyTitleTranslationKey
      ) && !this.i18nLanguageCodeService.isCurrentLanguageEnglish()
    );
  }

  isHackyExpTitleTranslationDisplayed(): boolean {
    return (
      this.i18nLanguageCodeService.isHackyTranslationAvailable(
        this.expTitleTranslationKey
      ) && !this.i18nLanguageCodeService.isCurrentLanguageEnglish()
    );
  }

  isHackyExpDescTranslationDisplayed(): boolean {
    return (
      this.i18nLanguageCodeService.isHackyTranslationAvailable(
        this.expDescTranslationKey
      ) && !this.i18nLanguageCodeService.isCurrentLanguageEnglish()
    );
  }
}
