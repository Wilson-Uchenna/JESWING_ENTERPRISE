import {
  ApplicationConfig,
  inject,
  provideBrowserGlobalErrorListeners,
  Injector,
  provideAppInitializer,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import {
  provideClientHydration,
  withEventReplay,
} from '@angular/platform-browser';
import { provideApollo } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache } from '@apollo/client/cache';
import {
  provideHttpClient,
  withFetch,
  HttpHeaders,
} from '@angular/common/http';
import { SetContextLink } from '@apollo/client/link/context';
import { ApolloLink } from '@apollo/client';
import { ErrorLink } from '@apollo/client/link/error';
import { AuthStore } from './store/auth.store';
import { CombinedGraphQLErrors } from '@apollo/client/errors';

export const appConfig: ApplicationConfig = {
  providers: [
    provideApollo(() => {
      const httpLink = inject(HttpLink);
      const injector = inject(Injector);

      const authLink = new SetContextLink((prevContext) => {
        const token = localStorage.getItem('accessToken');
        const headers = (prevContext.headers ?? new HttpHeaders()).set(
          'Authorization',
          token ? `Bearer ${token}` : '',
        );
        return { ...prevContext, headers };
      });

      const errorLink = new ErrorLink(({ error, operation, forward }) => {
        if (CombinedGraphQLErrors.is(error)) {
          const isUnauthenticated = error.errors.some(
            (e) => e.extensions?.['code'] === 'UNAUTHENTICATED',
          );
          if (isUnauthenticated) {
            // lazily resolve AuthStore only when a request actually fails
            const authStore = injector.get(AuthStore);
            authStore.refreshAccessToken();
            return forward(operation);
          }
        }
        return forward(operation);
      });

      return {
        link: ApolloLink.from([
          errorLink,
          authLink,
          httpLink.create({ uri: 'http://localhost:3000/graphql' }),
        ]),
        cache: new InMemoryCache(),
      };
    }),
    provideAppInitializer(() => {
      const authStore = inject(AuthStore);
      authStore.loadCurrentUser();
    }),
    provideHttpClient(withFetch()),
    provideClientHydration(withEventReplay()),
    provideBrowserGlobalErrorListeners(),
    provideRouter(appRoutes),
  ],
};
