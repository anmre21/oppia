// Copyright 2020 The Oppia Authors. All Rights Reserved.
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
 * @fileoverview Unit tests for PlatformFeatureService.
 */

import { TestBed, fakeAsync, flushMicrotasks, tick } from
  '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { WindowRef } from 'services/contextual/window-ref.service';
import { PlatformFeatureService, platformFeatureInitFactory } from
  'services/platform-feature.service';
import { PlatformFeatureBackendApiService } from
  'domain/platform_feature/platform-feature-backend-api.service';
import { FeatureNames, FeatureStatusSummary } from
  'domain/platform_feature/feature-status-summary.model';
import { UrlService } from 'services/contextual/url.service';


describe('PlatformFeatureService', () => {
  let windowRef: WindowRef;
  let apiService: PlatformFeatureBackendApiService;
  let platformFeatureService: PlatformFeatureService;
  let urlService: UrlService;

  let mockSessionStore: (obj: object) => void;
  let mockCookie: (cookieStr: string) => void;
  let mockPathName: (pathName: string) => void;

  let apiSpy: jasmine.Spy;

  // These properties are static, which are not automatically cleared after
  // each test, so we need to manually clear the state of
  // PlatformFeatureService.
  const clearStaticProperties = () => {
    // This throws "Type 'null' is not assignable to type 'FeatureStatusSummary'
    // ." We need to suppress this error because of the need to manually clear
    // the state of PlatformFeatureService after each test.
    // @ts-ignore
    PlatformFeatureService.featureStatusSummary = null;
    PlatformFeatureService._isInitializedWithError = false;
    // This throws "Type 'null' is not assignable to type 'Promise<void>'."
    // We need to suppress this error because of the need to manually clear the
    // state of PlatformFeatureService after each test.
    // @ts-ignore
    PlatformFeatureService.initializationPromise = null;
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });

    windowRef = TestBed.inject(WindowRef);
    apiService = TestBed.inject(PlatformFeatureBackendApiService);
    urlService = TestBed.inject(UrlService);

    clearStaticProperties();

    const store: Record<string, string> = {};
    let cookie = '';
    let userAgent = '';
    spyOnProperty(windowRef, 'nativeWindow').and.returnValue({
      sessionStorage: {
        getItem: (key: string) => store[key] || null,
        setItem: (key: string, value: string) => store[key] = value,
        removeItem: (key: string) => delete store[key]
      },
      document: {
        get cookie() {
          return cookie;
        }
      },
      navigator: {
        get userAgent() {
          return userAgent;
        }
      }
    });
    mockSessionStore = (obj: object) => {
      Object.assign(store, obj);
    };
    mockCookie = (cookieStr: string) => cookie = cookieStr;

    let pathName = '/';
    spyOn(urlService, 'getPathname').and.callFake(() => pathName);
    mockPathName = path => pathName = path;

    apiSpy = spyOn(apiService, 'fetchFeatureFlags').and.resolveTo(
      FeatureStatusSummary.createFromBackendDict({
        [FeatureNames.DummyFeature]: true,
      })
    );
  });

  describe('.initialize', () => {
    it('should load from server when storage is clean.', fakeAsync(() => {
      const successHandler = jasmine.createSpy('success');
      const failHandler = jasmine.createSpy('fail');
      platformFeatureService = TestBed.inject(PlatformFeatureService);
      platformFeatureService.initialize()
        .then(successHandler, failHandler);

      flushMicrotasks();

      expect(apiService.fetchFeatureFlags).toHaveBeenCalled();
      expect(successHandler).toHaveBeenCalled();
      expect(failHandler).not.toHaveBeenCalled();
      expect(platformFeatureService.isInitialzedWithError).toBeFalse();
    }));

    it('should save results in sessionStorage after loading.', fakeAsync(() => {
      const sessionId = 'session_id';
      mockCookie(`session=${sessionId}`);
      platformFeatureService = TestBed.inject(PlatformFeatureService);

      const timestamp = Date.now();

      flushMicrotasks();

      expect(apiService.fetchFeatureFlags).toHaveBeenCalled();
      const sessionItem = (
        windowRef.nativeWindow.sessionStorage.getItem('SAVED_FEATURE_FLAGS'));
      expect(sessionItem).not.toBeNull();
      if (sessionItem !== null) {
        expect(JSON.parse(sessionItem)).toEqual({
          timestamp: timestamp,
          sessionId: sessionId,
          featureStatusSummary: {
            [FeatureNames.DummyFeature]: true,
          }
        });
      }
      expect(platformFeatureService.isInitialzedWithError).toBeFalse();
    }));

    it('should load from sessionStorage if there are valid results.', fakeAsync(
      () => {
        const sessionId = 'session_id';
        mockCookie(`session=${sessionId}`);
        mockSessionStore({
          SAVED_FEATURE_FLAGS: JSON.stringify({
            sessionId: sessionId,
            timestamp: Date.now(),
            featureStatusSummary: {
              [FeatureNames.DummyFeature]: true,
            }
          })
        });

        // Ticks 60 secs, as stored results are valid for 12 hrs, the results
        // should still be valid.
        tick(60 * 1000);
        platformFeatureService = TestBed.inject(PlatformFeatureService);

        flushMicrotasks();

        expect(apiService.fetchFeatureFlags).not.toHaveBeenCalled();
        expect(platformFeatureService.isInitialzedWithError).toBeFalse();
      })
    );

    it('should load from server if saved results have expired.',
      fakeAsync(() => {
        const sessionId = 'session_id';
        mockCookie(`session=${sessionId}`);
        mockSessionStore({
          SAVED_FEATURE_FLAGS: JSON.stringify({
            sessionId: sessionId,
            timestamp: Date.now(),
            featureStatusSummary: {
              [FeatureNames.DummyFeature]: true,
            }
          })
        });

        // Ticks 13 hrs, as stored results are valid for 12 hrs, ths results
        // should have expired.
        tick(13 * 3600 * 1000);
        platformFeatureService = TestBed.inject(PlatformFeatureService);

        flushMicrotasks();

        expect(apiService.fetchFeatureFlags).toHaveBeenCalled();
        expect(platformFeatureService.isInitialzedWithError).toBeFalse();
      })
    );

    it(
      'should load from server if sessionId of saved result does not match.',
      fakeAsync(() => {
        const sessionId = 'session_id';
        mockCookie(`session=${sessionId}`);
        mockSessionStore({
          SAVED_FEATURE_FLAGS: JSON.stringify({
            sessionId: 'different session id',
            timestamp: Date.now(),
            featureStatusSummary: {
              [FeatureNames.DummyFeature]: true,
            }
          })
        });

        platformFeatureService = TestBed.inject(PlatformFeatureService);

        flushMicrotasks();

        expect(apiService.fetchFeatureFlags).toHaveBeenCalled();
        const sessionItem = (
          windowRef.nativeWindow.sessionStorage.getItem('SAVED_FEATURE_FLAGS'));
        expect(sessionItem).not.toBeNull();
        if (sessionItem !== null) {
          expect(JSON.parse(sessionItem).sessionId).toEqual(sessionId);
        }
        expect(platformFeatureService.isInitialzedWithError).toBeFalse();
      })
    );

    it('should load from server if the stored features don\'t match with' +
      ' feature list', fakeAsync(() => {
      const sessionId = 'session_id';
      mockCookie(`session=${sessionId}`);
      mockSessionStore({
        SAVED_FEATURE_FLAGS: JSON.stringify({
          sessionId: sessionId,
          timestamp: Date.now(),
          featureStatusSummary: {}
        })
      });

      platformFeatureService = TestBed.inject(PlatformFeatureService);

      flushMicrotasks();

      expect(apiService.fetchFeatureFlags).toHaveBeenCalled();
      expect(platformFeatureService.isInitialzedWithError).toBeFalse();
    }));

    it('should request only once if there are more than one call to ' +
      '.initialize.', fakeAsync(() => {
      platformFeatureService = TestBed.inject(PlatformFeatureService);

      platformFeatureService.initialize();
      platformFeatureService.initialize();

      flushMicrotasks();

      expect(apiService.fetchFeatureFlags).toHaveBeenCalledTimes(1);
      expect(platformFeatureService.isInitialzedWithError).toBeFalse();
    }));

    it('should disable all features when loading fails.', fakeAsync(() => {
      apiSpy.and.throwError('mock error');

      platformFeatureService = TestBed.inject(PlatformFeatureService);

      flushMicrotasks();

      expect(
        platformFeatureService.status.DummyFeature.isEnabled
      ).toBeFalse();
      expect(platformFeatureService.isInitialzedWithError).toBeTrue();
    }));

    it('should skip on the signup page', fakeAsync(() => {
      mockPathName('/signup');

      platformFeatureService = TestBed.inject(PlatformFeatureService);

      flushMicrotasks();

      expect(apiService.fetchFeatureFlags).not.toHaveBeenCalled();
      expect(platformFeatureService.isSkipped).toBeTrue();
    }));
  });

  describe('.featureSummary', () => {
    it('should return correct values of feature flags', fakeAsync(() => {
      platformFeatureService = TestBed.inject(PlatformFeatureService);

      flushMicrotasks();

      expect(
        platformFeatureService.status.DummyFeature.isEnabled
      ).toBeTrue();
      expect(platformFeatureService.isInitialzedWithError).toBeFalse();
    }));

    it('should throw error when accessed before initialization.', fakeAsync(
      () => {
        platformFeatureService = TestBed.inject(PlatformFeatureService);
        expect(
          () => platformFeatureService.status.DummyFeature.isEnabled
        ).toThrowError(
          'The platform feature service has not been initialized.');
      })
    );
  });

  describe('platformFeatureInitFactory', () => {
    let factoryFn = (service: PlatformFeatureService) => {
      return async(): Promise<void> => service.initialize();
    };

    beforeEach(() => {
      factoryFn = platformFeatureInitFactory;
      platformFeatureService = TestBed.inject(PlatformFeatureService);
    });

    it('should return a function that calls initialize', async() => {
      const mockPromise = Promise.resolve();
      const spy = spyOn(platformFeatureService, 'initialize')
        .and.returnValue(mockPromise);

      const returnedFn = factoryFn(platformFeatureService);
      const returnedPromise = returnedFn();

      expect(spy).toHaveBeenCalled();
      await expectAsync(returnedPromise).toBeResolvedTo();
    });
  });
});
