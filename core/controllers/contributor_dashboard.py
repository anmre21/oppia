# Copyright 2019 The Oppia Authors. All Rights Reserved.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#      http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS-IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

"""Controllers for the contributor dashboard page."""

from __future__ import annotations

import json

from core import feconf
from core.constants import constants
from core.controllers import acl_decorators
from core.controllers import base
from core.domain import config_domain
from core.domain import exp_fetchers
from core.domain import opportunity_services
from core.domain import suggestion_services
from core.domain import topic_fetchers
from core.domain import translation_services
from core.domain import user_services


class ContributorDashboardPage(base.BaseHandler):
    """Page showing the contributor dashboard."""

    URL_PATH_ARGS_SCHEMAS = {}
    HANDLER_ARGS_SCHEMAS = {
        'GET': {}
    }

    @acl_decorators.open_access
    def get(self):
        # TODO(#7402): Serve this page statically through app.yaml once
        # the CONTRIBUTOR_DASHBOARD_ENABLED flag is removed.
        if not config_domain.CONTRIBUTOR_DASHBOARD_IS_ENABLED.value:
            raise self.PageNotFoundException
        self.render_template('contributor-dashboard-page.mainpage.html')


class ContributionOpportunitiesHandler(base.BaseHandler):
    """Provides data for opportunities available in different categories."""

    GET_HANDLER_ERROR_RETURN_TYPE = feconf.HANDLER_TYPE_JSON
    URL_PATH_ARGS_SCHEMAS = {
        'opportunity_type': {
            'schema': {
                'type': 'basestring'
            }
        }
    }
    HANDLER_ARGS_SCHEMAS = {
        'GET': {
            'cursor': {
                'schema': {
                    'type': 'basestring'
                },
                'default_value': None
            },
            'language_code': {
                'schema': {
                    'type': 'basestring',
                    'validators': [{
                        'id': 'is_supported_audio_language_code'
                    }]
                },
                'default_value': None
            },
            'topic_name': {
                'schema': {
                    'type': 'basestring'
                },
                'default_value': None
            }
        }
    }

    @acl_decorators.open_access
    def get(self, opportunity_type):
        """Handles GET requests."""
        if not config_domain.CONTRIBUTOR_DASHBOARD_IS_ENABLED.value:
            raise self.PageNotFoundException
        search_cursor = self.normalized_request.get('cursor')
        language_code = self.normalized_request.get('language_code')

        if opportunity_type == constants.OPPORTUNITY_TYPE_SKILL:
            opportunities, next_cursor, more = (
                self._get_skill_opportunities_with_corresponding_topic_name(
                    search_cursor))

        elif opportunity_type == constants.OPPORTUNITY_TYPE_TRANSLATION:
            topic_name = self.normalized_payload.get('topic_name')
            if language_code is None:
                raise self.InvalidInputException
            opportunities, next_cursor, more = (
                self._get_translation_opportunity_dicts(
                    language_code, topic_name, search_cursor))

        elif opportunity_type == constants.OPPORTUNITY_TYPE_VOICEOVER:
            if language_code is None:
                raise self.InvalidInputException
            opportunities, next_cursor, more = (
                self._get_voiceover_opportunity_dicts(
                    language_code, search_cursor))

        else:
            raise self.PageNotFoundException

        self.values = {
            'opportunities': opportunities,
            'next_cursor': next_cursor,
            'more': more
        }
        self.render_json(self.values)

    def _get_skill_opportunities_with_corresponding_topic_name(self, cursor):
        """Returns a list of skill opportunities available for questions with
        a corresponding topic name.

        Args:
            cursor: str or None. If provided, the list of returned entities
                starts from this datastore cursor. Otherwise, the returned
                entities start from the beginning of the full list of entities.

        Returns:
            3-tuple(opportunities, cursor, more). where:
                opportunities: list(dict). A list of dicts of skill opportunity
                    details with additional corresponding topic_name.
                cursor: str or None. A query cursor pointing to the next
                    batch of results. If there are no more results, this might
                    be None.
                more: bool. If True, there are (probably) more results after
                    this batch. If False, there are no further results after
                    this batch.
        """
        # We want to focus attention on lessons that are part of a classroom.
        # See issue #12221.
        classroom_topic_ids = []
        for classroom_dict in config_domain.CLASSROOM_PAGES_DATA.value:
            classroom_topic_ids.extend(classroom_dict['topic_ids'])
        classroom_topics = topic_fetchers.get_topics_by_ids(classroom_topic_ids)
        # Associate each skill with one classroom topic name.
        # TODO(#8912): Associate each skill/skill opportunity with  all linked
        # topics.
        classroom_topic_skill_id_to_topic_name = {}
        for topic in classroom_topics:
            if topic is None:
                continue
            for skill_id in topic.get_all_skill_ids():
                classroom_topic_skill_id_to_topic_name[skill_id] = topic.name

        skill_opportunities, cursor, more = (
            opportunity_services.get_skill_opportunities(cursor))
        opportunities = []
        # Fetch opportunities until we have at least a page's worth that
        # correspond to a classroom or there are no more opportunities.
        while len(opportunities) < constants.OPPORTUNITIES_PAGE_SIZE:
            for skill_opportunity in skill_opportunities:
                if (
                        skill_opportunity.id
                        in classroom_topic_skill_id_to_topic_name):
                    skill_opportunity_dict = skill_opportunity.to_dict()
                    skill_opportunity_dict['topic_name'] = (
                        classroom_topic_skill_id_to_topic_name[
                            skill_opportunity.id])
                    opportunities.append(skill_opportunity_dict)
            if (
                    not more or
                    len(opportunities) >= constants.OPPORTUNITIES_PAGE_SIZE):
                break
            skill_opportunities, cursor, more = (
                opportunity_services.get_skill_opportunities(cursor))

        return opportunities, cursor, more

    def _get_translation_opportunity_dicts(
            self, language_code, topic_name, search_cursor):
        """Returns a list of translation opportunity dicts.

        Args:
            language_code: str. The language for which translation opportunities
                should be fetched.
            topic_name: str or None. The topic for which translation
                opportunities should be fetched. If topic_name is None or empty,
                fetch translation opportunities from all topics.
            search_cursor: str or None. If provided, the list of returned
                entities starts from this datastore cursor. Otherwise, the
                returned entities start from the beginning of the full list of
                entities.

        Returns:
            3-tuple(opportunities, cursor, more). where:
            opportunities: list(dict). A list of ExplorationOpportunitySummary
                dicts.
            cursor: str or None. A query cursor pointing to the next batch of
                results. If there are no more results, this might be None.
            more: bool. If True, there are (probably) more results after this
                batch. If False, there are no further results after this batch.
        """
        opportunities, next_cursor, more = (
            opportunity_services.get_translation_opportunities(
                language_code, topic_name, search_cursor))
        opportunity_dicts = [opp.to_dict() for opp in opportunities]
        return opportunity_dicts, next_cursor, more

    def _get_voiceover_opportunity_dicts(self, language_code, search_cursor):
        """Returns a list of voiceover opportunity dicts.

        Args:
            language_code: str. The language for which voiceover opportunities
                should be fetched.
            search_cursor: str or None. If provided, the list of returned
                entities starts from this datastore cursor. Otherwise, the
                returned entities start from the beginning of the full list of
                entities.

        Returns:
            3-tuple(opportunities, cursor, more). where:
            opportunities: list(dict). A list of ExplorationOpportunitySummary
                dicts.
            cursor: str or None. A query cursor pointing to the next batch of
                results. If there are no more results, this might be None.
            more: bool. If True, there are (probably) more results after this
                batch. If False, there are no further results after this batch.
        """
        opportunities, next_cursor, more = (
            opportunity_services.get_voiceover_opportunities(
                language_code, search_cursor))
        opportunity_dicts = [opp.to_dict() for opp in opportunities]
        return opportunity_dicts, next_cursor, more


class TranslatableTextHandler(base.BaseHandler):
    """Provides lessons content which can be translated in a given language."""

    GET_HANDLER_ERROR_RETURN_TYPE = feconf.HANDLER_TYPE_JSON
    URL_PATH_ARGS_SCHEMAS = {}
    HANDLER_ARGS_SCHEMAS = {
        'GET': {
            'language_code': {
                'schema': {
                    'type': 'basestring',
                    'validators': [{
                        'id': 'is_supported_audio_language_code'
                    }]
                }
            },
            'exp_id': {
                'schema': {
                    'type': 'basestring'
                }
            }
        }
    }

    @acl_decorators.open_access
    def get(self):
        """Handles GET requests."""
        language_code = self.normalized_request.get('language_code')
        exp_id = self.normalized_request.get('exp_id')

        if not opportunity_services.is_exploration_available_for_contribution(
                exp_id):
            raise self.InvalidInputException('Invalid exp_id: %s' % exp_id)

        exp = exp_fetchers.get_exploration_by_id(exp_id)
        state_names_to_content_id_mapping = exp.get_translatable_text(
            language_code)
        state_names_to_not_in_review_content_id_mapping = (
            self._get_state_names_to_not_in_review_content_id_mapping(
                state_names_to_content_id_mapping,
                suggestion_services
                .get_translation_suggestions_in_review_by_exploration(
                    exp_id, language_code)
            )
        )
        self.values = {
            'state_names_to_content_id_mapping': (
                state_names_to_not_in_review_content_id_mapping),
            'version': exp.version
        }

        self.render_json(self.values)

    def _get_state_names_to_not_in_review_content_id_mapping(
            self, state_names_to_content_id_mapping, suggestions):
        """Returns a copy of the supplied state_names_to_content_id_mapping
        minus any contents found in suggestions.

        Args:
            state_names_to_content_id_mapping:
                dict(str, dict(str, TranslatableItem)). A dict whose keys are
                state names, and whose corresponding values are each dicts
                mapping content IDs to the corresponding translatable items.
            suggestions: list(Suggestion). A list of translation suggestions.

        Returns:
            dict(str, dict(str, TranslatableItem)). A dict where state_name
            is the key and a dict with content_id as the key and
            TranslatableItem as value.
        """
        final_mapping = {}
        for state_name in state_names_to_content_id_mapping:
            content_id_to_translatable_item = dict(
                state_names_to_content_id_mapping[state_name])
            content_id_to_unsubmitted_translatable_item = {}
            for content_id, item in content_id_to_translatable_item.items():
                if not self._is_content_in_review(
                        state_name, content_id, suggestions):
                    content_id_to_unsubmitted_translatable_item[content_id] = (
                        item)
            if content_id_to_unsubmitted_translatable_item:
                final_mapping[state_name] = {
                    cid: translatable_item.to_dict()
                    for cid, translatable_item in (
                        content_id_to_unsubmitted_translatable_item.items())
                }
        return final_mapping

    def _is_content_in_review(self, state_name, content_id, suggestions):
        """Returns whether a suggestion exists in suggestions with a change dict
        matching the supplied state_name and content_id.

        Args:
            state_name: str. Exploration state name.
            content_id: str. Content ID.
            suggestions: list(Suggestion). A list of translation suggestions.

        Returns:
            bool. True if suggestion exists in suggestions with a change dict
            matching state_name and content_id, False otherwise.
        """
        return any(
            s.change.state_name == state_name and
            s.change.content_id == content_id for s in suggestions)


class MachineTranslationStateTextsHandler(base.BaseHandler):
    """Provides a machine translation of exploration content."""

    GET_HANDLER_ERROR_RETURN_TYPE = feconf.HANDLER_TYPE_JSON
    URL_PATH_ARGS_SCHEMAS = {}
    HANDLER_ARGS_SCHEMAS = {
        'GET': {
            'exp_id': {
                'schema': {
                    'type': 'basestring'
                }
            },
            'state_name': {
                'schema': {
                    'type': 'basestring'
                }
            },
            'content_ids': {
                'schema': {
                    'type': 'basestring'
                }
            },
            'target_language_code': {
                'schema': {
                    'type': 'basestring',
                    'validators': [{
                        'id': 'is_supported_audio_language_code'
                    }, {
                        'id': 'is_valid_audio_language_code'
                    }]
                }
            }
        }
    }

    @acl_decorators.open_access
    def get(self):
        """Handles GET requests. Responds with a mapping from content id to
        translation of form:

            dict('translated_texts', dict(str, str|None))

        If no translation is found for a given content id, that id is mapped to
        None.

        Params:
            exp_id: str. The ID of the exploration being translated.
            state_name: str. The name of the exploration state being translated.
            content_ids: str[]. The content IDs of the texts to be translated.
            target_language_code: str. The language code of the target
                translation language.

        Data Response:

            dict('translated_texts': dict(str, str|None))

            A dictionary containing the translated texts stored as a mapping
                from content ID to the translated text. If an error occured
                during retrieval of some content translations, but not others,
                failed translations are mapped to None.

        Raises:
            400 (Bad Request): InvalidInputException. At least one input is
                missing or improperly formatted.
            404 (Not Found): PageNotFoundException. At least one identifier does
                not correspond to an entry in the datastore.
        """
        exp_id = self.normalized_request.get('exp_id')

        state_name = self.normalized_request.get('state_name')

        content_ids_string = self.normalized_request.get('content_ids')
        content_ids = []
        try:
            content_ids = json.loads(content_ids_string)
        except Exception as e:
            raise self.InvalidInputException(
                'Improperly formatted content_ids: %s' % content_ids_string
            ) from e

        target_language_code = self.normalized_request.get(
            'target_language_code')

        exp = exp_fetchers.get_exploration_by_id(exp_id, strict=False)
        if exp is None:
            raise self.PageNotFoundException()
        state_names_to_content_id_mapping = exp.get_translatable_text(
            target_language_code)
        if state_name not in state_names_to_content_id_mapping:
            raise self.PageNotFoundException()
        content_id_to_translatable_item_mapping = (
            state_names_to_content_id_mapping[state_name])
        translated_texts = {}
        for content_id in content_ids:
            if content_id not in content_id_to_translatable_item_mapping:
                translated_texts[content_id] = None
                continue

            source_text = content_id_to_translatable_item_mapping[
                content_id].content
            translated_texts[content_id] = (
                translation_services.get_and_cache_machine_translation(
                    exp.language_code, target_language_code, source_text)
            )

        self.values = {
            'translated_texts': translated_texts
        }
        self.render_json(self.values)


class UserContributionRightsDataHandler(base.BaseHandler):
    """Provides contribution rights of the logged in user in translation,
    voiceover and question category on the contributor dashboard.
    """

    GET_HANDLER_ERROR_RETURN_TYPE = feconf.HANDLER_TYPE_JSON
    URL_PATH_ARGS_SCHEMAS = {}
    HANDLER_ARGS_SCHEMAS = {'GET': {}}

    @acl_decorators.open_access
    def get(self):
        """Handles GET requests."""
        contribution_rights = None
        if self.username:
            contribution_rights = user_services.get_user_contribution_rights(
                self.user_id)
        self.render_json({
            'can_review_translation_for_language_codes': (
                contribution_rights.can_review_translation_for_language_codes
                if contribution_rights else []),
            'can_review_voiceover_for_language_codes': (
                contribution_rights.can_review_voiceover_for_language_codes
                if contribution_rights else []),
            'can_review_questions': (
                contribution_rights.can_review_questions
                if contribution_rights else False),
            'can_suggest_questions': (
                (contribution_rights.can_submit_questions
                 if contribution_rights else False))
        })


class FeaturedTranslationLanguagesHandler(base.BaseHandler):
    """Provides featured translation languages set in admin config."""

    GET_HANDLER_ERROR_RETURN_TYPE = feconf.HANDLER_TYPE_JSON
    URL_PATH_ARGS_SCHEMAS = {}
    HANDLER_ARGS_SCHEMAS = {
        'GET': {}
    }

    @acl_decorators.open_access
    def get(self):
        """Handles GET requests."""
        self.render_json({
            'featured_translation_languages':
                config_domain.FEATURED_TRANSLATION_LANGUAGES.value
        })


class AllTopicNamesHandler(base.BaseHandler):
    """Provides names of all existing topics in the datastore."""

    GET_HANDLER_ERROR_RETURN_TYPE = feconf.HANDLER_TYPE_JSON
    URL_PATH_ARGS_SCHEMAS = {}
    HANDLER_ARGS_SCHEMAS = {
        'GET': {}
    }

    @acl_decorators.open_access
    def get(self):
        topic_summaries = topic_fetchers.get_all_topic_summaries()
        topic_names = [summary.name for summary in topic_summaries]
        self.values = {
            'topic_names': topic_names
        }
        self.render_json(self.values)
