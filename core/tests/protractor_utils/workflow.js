// Copyright 2014 The Oppia Authors. All Rights Reserved.
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
 * @fileoverview Utilities for exploration creation, publication ect. when
 * carrrying out end-to-end testing with protractor.
 */

var forms = require('./forms.js');
var path = require('path');
var waitFor = require('./waitFor.js');
var action = require('./action.js');
var CreatorDashboardPage = require('./CreatorDashboardPage.js');
var ExplorationEditorPage = require('./ExplorationEditorPage.js');
var TopicsAndSkillsDashboardPage = require('./TopicsAndSkillsDashboardPage.js');
var SkillEditorPage = require('./SkillEditorPage');

var imageUploadInput = element(
  by.css('.protractor-test-photo-upload-input'));
var imageSubmitButton = element(
  by.css('.protractor-test-photo-upload-submit'));
var thumbnailResetButton = element(by.css(
  '.protractor-test-thumbnail-reset-button'));
var stateNameText = element(
  by.css('.protractor-test-state-name-text'));
var activityCreationModal = element(by.css('.protractor-test-creation-modal'));
var createExplorationButton = element(
  by.css('.protractor-test-create-exploration'));

// Check if the save roles button is clickable.
var canAddRolesToUsers = async function() {
  return await element(by.css('.protractor-test-save-role')).isEnabled();
};

// Check if exploration is community owned.
var isExplorationCommunityOwned = async function() {
  return await element(
    by.css('.protractor-test-is-community-owned')
  ).isPresent();
};


// Check if the warning message is visible when the title is ''.
var checkForAddTitleWarning = async function() {
  return await element(
    by.className('protractor-test-title-warning')).isDisplayed();
};

// Trigger onblur event for title.
var triggerTitleOnBlurEvent = async function() {
  var explorationTitleInput = element(
    by.css('.protractor-test-exploration-title-input'));
  await action.click('Exploration Title Input', explorationTitleInput);
  var explorationObjectiveInput = element(
    by.css('.protractor-test-exploration-objective-input'));
  await action.click('Exploration Objective Input', explorationObjectiveInput);
};

// Open edit roles.
var openEditRolesForm = async function() {
  var testEditRoles = element(by.css('.protractor-test-edit-roles'));
  await action.click('Test edit roles', testEditRoles);
  await action.sendKeys('Test Role Username', element(
    by.css('.protractor-test-role-username')), 'Chuck Norris');
};

// Creates an exploration, opens its editor and skips the tutorial.
var createExploration = async function(welcomeModalIsShown) {
  await createExplorationAndStartTutorial(false);
  var explorationEditorPage = new ExplorationEditorPage.ExplorationEditorPage();
  var explorationEditorMainTab = explorationEditorPage.getMainTab();
  if (welcomeModalIsShown) {
    await explorationEditorMainTab.exitTutorial();
  }
};

// Creates a new exploration and wait for the exploration tutorial to start.
var createExplorationAndStartTutorial = async function(isCollectionEditor) {
  var creatorDashboardPage = new CreatorDashboardPage.CreatorDashboardPage;
  await creatorDashboardPage.get();

  await creatorDashboardPage.clickCreateActivityButton();
  if (isCollectionEditor) {
    await waitFor.visibilityOf(
      activityCreationModal,
      'ActivityCreationModal takes too long to be visible.');
    await action.click('Create Exploration Button', createExplorationButton);
  }

  await waitFor.pageToFullyLoad();
  await waitFor.visibilityOf(
    stateNameText, 'State name text takes too long to appear.');
};

/**
 * Only Admin users can create collections.
 */
var createCollectionAsAdmin = async function() {
  var creatorDashboardPage = new CreatorDashboardPage.CreatorDashboardPage;
  await creatorDashboardPage.get();
  await creatorDashboardPage.clickCreateActivityButton();
  await waitFor.visibilityOf(
    activityCreationModal, 'Activity Creation modal takes too long to appear');
  await creatorDashboardPage.clickCreateCollectionButton();
};

/**
 * Creating exploration for Admin users.
 */
var createExplorationAsAdmin = async function() {
  var creatorDashboardPage = new CreatorDashboardPage.CreatorDashboardPage;
  await creatorDashboardPage.get();
  await creatorDashboardPage.clickCreateActivityButton();
  await waitFor.visibilityOf(
    activityCreationModal, 'Activity Creation modal takes too long to appear');
  await creatorDashboardPage.clickCreateExplorationButton();
};

// This will only work if all changes have been saved and there are no
// outstanding warnings; run from the editor.
var publishExploration = async function() {
  await waitFor.elementToBeClickable(element(by.css(
    '.protractor-test-publish-exploration')));
  await element(by.css('.protractor-test-publish-exploration')).isDisplayed();
  var testPublishExploration = element(
    by.css('.protractor-test-publish-exploration'));
  await action.click('Test Publish Exploration', testPublishExploration);
  var prePublicationButtonElem = element(by.css(
    '.protractor-test-confirm-pre-publication'));
  await action.click(
    'Pre Publication Button Element', prePublicationButtonElem);

  await waitFor.invisibilityOf(
    prePublicationButtonElem,
    'prePublicationButtonElem taking too long to disappear while publishing');
  var testConfirmPublish = element(by.css('.protractor-test-confirm-publish'));
  await action.click('Test Confirm Publish', testConfirmPublish);

  var sharePublishModal = element(
    by.css('.protractor-test-share-publish-modal'));
  var closePublishModalButton = element(
    by.css('.protractor-test-share-publish-close'));
  await waitFor.visibilityOf(
    sharePublishModal, 'Share Publish Modal takes too long to appear');
  await action.click('Close Publish Modal Button', closePublishModalButton);
};

// Creates and publishes a minimal exploration.
var createAndPublishExploration = async function(
    title, category, objective, language, welcomeModalIsShown) {
  await createExploration(welcomeModalIsShown);
  var explorationEditorPage = new ExplorationEditorPage.ExplorationEditorPage();
  var explorationEditorMainTab = explorationEditorPage.getMainTab();
  await explorationEditorMainTab.setContent(
    await forms.toRichText('new exploration'));
  await explorationEditorMainTab.setInteraction('EndExploration');

  var explorationEditorSettingsTab = explorationEditorPage.getSettingsTab();
  await explorationEditorPage.navigateToSettingsTab();
  await explorationEditorSettingsTab.setTitle(title);
  await explorationEditorSettingsTab.setCategory(category);
  await explorationEditorSettingsTab.setObjective(objective);
  if (language) {
    await explorationEditorSettingsTab.setLanguage(language);
  }
  await explorationEditorPage.saveChanges();
  await publishExploration();
};

var createAddExpDetailsAndPublishExp = async function(
    title, category, objective, language, tags, welcomeModalIsShown) {
  await createExploration(welcomeModalIsShown);
  var explorationEditorPage = new ExplorationEditorPage.ExplorationEditorPage();
  var explorationEditorMainTab = explorationEditorPage.getMainTab();
  await explorationEditorMainTab.setContent(
    await forms.toRichText('new exploration'));
  await explorationEditorMainTab.setInteraction('EndExploration');
  await explorationEditorPage.saveChanges('Save the changes');
  await explorationEditorPage.publishCardExploration(
    title, objective, category, language, tags);
};

// Creates and publishes a exploration with two cards.
var createAndPublishTwoCardExploration = async function(
    title, category, objective, language, welcomeModalIsShown,
    correctnessFeedbackIsEnabled) {
  await createExploration(welcomeModalIsShown);
  var explorationEditorPage = new ExplorationEditorPage.ExplorationEditorPage();
  var explorationEditorMainTab = explorationEditorPage.getMainTab();
  await explorationEditorMainTab.setContent(await forms.toRichText('card 1'));
  await explorationEditorMainTab.setInteraction('Continue');
  var responseEditor = await explorationEditorMainTab.getResponseEditor(
    'default');
  await responseEditor.setDestination('second card', true, null);
  await explorationEditorMainTab.moveToState('second card');
  await explorationEditorMainTab.setContent(await forms.toRichText('card 2'));
  await explorationEditorMainTab.setInteraction('EndExploration');

  var explorationEditorSettingsTab = explorationEditorPage.getSettingsTab();
  await explorationEditorPage.navigateToSettingsTab();
  await explorationEditorSettingsTab.setTitle(title);
  await explorationEditorSettingsTab.setCategory(category);
  await explorationEditorSettingsTab.setObjective(objective);
  if (language) {
    await explorationEditorSettingsTab.setLanguage(language);
  }
  if (!correctnessFeedbackIsEnabled) {
    await explorationEditorSettingsTab.disableCorrectnessFeedback();
  }
  await explorationEditorPage.saveChanges();
  await publishExploration();
};

// ---- Role management (state editor settings tab) ----

// Here, 'roleName' is the user-visible form of the role name (e.g. 'Manager').
var _addExplorationRole = async function(roleName, username) {
  await action.click(
    'Edit roles', element(by.css('.protractor-test-edit-roles')));
  await action.sendKeys(
    'Username input',
    element(by.css('.protractor-test-role-username')),
    username);
  await action.select(
    'Role select', element(by.css('.protractor-test-role-select')), roleName);
  await action.click(
    'Save role', element(by.css('.protractor-test-save-role')));
};

var addExplorationManager = async function(username) {
  await _addExplorationRole('Manager', username);
};

var addExplorationCollaborator = async function(username) {
  await _addExplorationRole('Collaborator', username);
};

var addExplorationVoiceArtist = async function(username) {
  await action.click('Edit voice artist role button', element(
    by.css('.protractor-test-edit-voice-artist-roles')));
  await action.sendKeys(
    'New voice artist username input',
    element(by.css('.protractor-test-new-voice-artist-username')), username);
  await action.click('Add voice artist button', element(
    by.css('.protractor-test-add-voice-artist-role-button')));
  await waitFor.visibilityOf(element(by.css(
    '.protractor-test-voice-artist-' + username)));
};

var addExplorationPlaytester = async function(username) {
  await _addExplorationRole('Playtester', username);
};

// Here, roleName is the server-side form of the name (e.g. 'owner').
var _getExplorationRoles = async function(roleName) {
  var itemName = roleName + 'Name';
  var listName = roleName + 'Names';
  return await element.all(by.repeater(
    itemName + ' in $ctrl.ExplorationRightsService.' + listName +
    ' track by $index'
  )).map(async function(elem) {
    return await elem.getText();
  });
};

var getExplorationManagers = async function() {
  return await _getExplorationRoles('owner');
};

var getExplorationCollaborators = async function() {
  return await _getExplorationRoles('editor');
};

var getExplorationVoiceArtists = async function() {
  return await _getExplorationRoles('voiceArtist');
};

var getExplorationPlaytesters = async function() {
  return await _getExplorationRoles('viewer');
};

var createSkillAndAssignTopic = async function(
    skillDescription, material, topicName) {
  var topicsAndSkillsDashboardPage = (
    new TopicsAndSkillsDashboardPage.TopicsAndSkillsDashboardPage());
  await topicsAndSkillsDashboardPage.get();
  await topicsAndSkillsDashboardPage.createSkillWithDescriptionAndExplanation(
    skillDescription, material, true);
  await topicsAndSkillsDashboardPage.get();
  await topicsAndSkillsDashboardPage.navigateToSkillsTab();
  await topicsAndSkillsDashboardPage.filterSkillsByStatus('Unassigned');
  await topicsAndSkillsDashboardPage.searchSkillByName(skillDescription);
  await topicsAndSkillsDashboardPage.assignSkillToTopic(
    skillDescription, topicName);
};

var getImageSource = async function(customImageElement) {
  await waitFor.visibilityOf(
    customImageElement,
    'Image element is taking too long to appear.');
  return await customImageElement.getAttribute('src');
};

var uploadImage = async function(
    imageClickableElement, imgPath, resetExistingImage) {
  await action.click('Image clickable element', imageClickableElement);
  if (resetExistingImage) {
    expect(await thumbnailResetButton.isPresent()).toBe(true);
    await action.click('Topic thumbnail reset button', thumbnailResetButton);
  } else {
    expect(await thumbnailResetButton.isPresent()).toBe(false);
  }

  absPath = path.resolve(__dirname, imgPath);
  return await action.sendKeys(
    'Image Upload Input', imageUploadInput, absPath, clickInputElement = false);
};

var submitImage = async function(
    imageClickableElement, imageContainer, imgPath, resetExistingImage) {
  await waitFor.visibilityOf(
    imageClickableElement,
    'Image element is taking too long to appear.');
  await uploadImage(imageClickableElement, imgPath, resetExistingImage);
  await waitFor.visibilityOf(
    imageContainer, 'Image container is taking too long to appear');
  await action.click('Image submit button', imageSubmitButton);
  await waitFor.invisibilityOf(
    imageUploadInput,
    'Image uploader is taking too long to disappear');
  await waitFor.invisibilityOf(
    imageContainer,
    'Image container is taking too long to disappear');
  return await waitFor.pageToFullyLoad();
};

var createQuestion = async function() {
  var skillEditorPage = new SkillEditorPage.SkillEditorPage();
  var explorationEditorPage = new ExplorationEditorPage.ExplorationEditorPage();
  var explorationEditorMainTab = explorationEditorPage.getMainTab();
  await skillEditorPage.moveToQuestionsTab();
  await skillEditorPage.clickCreateQuestionButton();
  await explorationEditorMainTab.setContent(
    await forms.toRichText('Question 1'));
  await explorationEditorMainTab.setInteraction(
    'TextInput', 'Placeholder', 5);
  await explorationEditorMainTab.addResponse(
    'TextInput', await forms.toRichText('Correct Answer'), null, false,
    'FuzzyEquals', ['correct']);
  var responseEditor = await explorationEditorMainTab.getResponseEditor(0);
  await responseEditor.markAsCorrect();
  await (
    await explorationEditorMainTab.getResponseEditor('default')
  ).setFeedback(await forms.toRichText('Try again'));
  await explorationEditorMainTab.addHint('Hint 1');
  await explorationEditorMainTab.addSolution('TextInput', {
    correctAnswer: 'correct',
    explanation: 'It is correct'
  });
  await skillEditorPage.saveQuestion();
};

exports.getImageSource = getImageSource;
exports.submitImage = submitImage;
exports.uploadImage = uploadImage;

exports.createExploration = createExploration;
exports.createExplorationAndStartTutorial = createExplorationAndStartTutorial;
exports.publishExploration = publishExploration;
exports.createAndPublishExploration = createAndPublishExploration;
exports.createCollectionAsAdmin = createCollectionAsAdmin;
exports.createExplorationAsAdmin = createExplorationAsAdmin;
exports.createAndPublishTwoCardExploration = createAndPublishTwoCardExploration;

exports.canAddRolesToUsers = canAddRolesToUsers;
exports.isExplorationCommunityOwned = isExplorationCommunityOwned;
exports.checkForAddTitleWarning = checkForAddTitleWarning;
exports.triggerTitleOnBlurEvent = triggerTitleOnBlurEvent;
exports.openEditRolesForm = openEditRolesForm;
exports.addExplorationManager = addExplorationManager;
exports.addExplorationCollaborator = addExplorationCollaborator;
exports.addExplorationVoiceArtist = addExplorationVoiceArtist;
exports.addExplorationPlaytester = addExplorationPlaytester;
exports.getExplorationManagers = getExplorationManagers;
exports.getExplorationCollaborators = getExplorationCollaborators;
exports.getExplorationVoiceArtists = getExplorationVoiceArtists;
exports.getExplorationPlaytesters = getExplorationPlaytesters;
exports.createAddExpDetailsAndPublishExp = createAddExpDetailsAndPublishExp;
exports.createSkillAndAssignTopic = createSkillAndAssignTopic;
exports.createQuestion = createQuestion;
