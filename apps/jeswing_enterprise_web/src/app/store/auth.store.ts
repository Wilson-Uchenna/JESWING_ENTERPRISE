import { isPlatformBrowser } from '@angular/common';
import { computed, inject, PLATFORM_ID } from '@angular/core';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { Apollo, gql } from 'apollo-angular';
import { tap } from 'rxjs';

const LOGIN = gql`
  mutation Login($loginInput: LoginInput!) {
    login(loginInput: $loginInput) {
      accessToken
      refreshToken
      user {
        id
        name
        email
        role
      }
    }
  }
`;

const REGISTER = gql`
  mutation Register($createAuthInput: CreateAuthInput!) {
    createAuth(createAuthInput: $createAuthInput) {
      accessToken
      refreshToken
      user {
        id
        name
        email
        role
      }
    }
  }
`;

const GET_CURRENT_USER = gql`
  query CurrentUser {
    me {
      id
      firstName
      lastName
      email
      role
    }
  }
`;

const REFRESH_TOKEN = gql`
  mutation RefreshToken($token: String!) {
    refreshToken(token: $token) {
      accessToken
      refreshToken
    }
  }
`;

export interface AuthUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

export interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  loading: false,
  error: null,
};

export const AuthStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed((store) => ({
    isLoggedIn: computed(() => !!store.accessToken()),
    currentUser: computed(() => store.user()),
    isAdmin: computed(() => store.user()?.role === 'ADMIN')
  })),
  withMethods((store, apollo = inject(Apollo)) => {
    const platformId = inject(PLATFORM_ID);
    const isBrowser = isPlatformBrowser(platformId);

    const getToken = (key: string) =>
      isBrowser ? localStorage.getItem(key) : null;
    // const setToken = (key: string, value: string) => {
    //   if (isBrowser) localStorage.setItem(key, value);
    // };
    // const removeToken = (key: string) => {
    //   if (isBrowser) localStorage.removeItem(key);
    // };

    return {
      register(
        firstName: string,
        lastName: string,
        email: string,
        password: string,
      ) {
        patchState(store, { loading: true, error: null });
        apollo
          .mutate<{
            createAuth: {
              accessToken: string;
              refreshToken: string;
              user: AuthUser;
            };
          }>({
            mutation: REGISTER,
            variables: {
              createAuthInput: { firstName, lastName, email, password },
            },
          })
          .pipe(
            tap({
              next: ({ data }) => {
                if (!data) return;
                const { accessToken, refreshToken, user } = data.createAuth;
                localStorage.setItem('accessToken', accessToken);
                localStorage.setItem('refreshToken', refreshToken);
                patchState(store, {
                  accessToken,
                  refreshToken,
                  user,
                  loading: false,
                });
              },
              error: (error) =>
                patchState(store, { error: error.message, loading: false }),
            }),
          )
          .subscribe();
      },

      loadCurrentUser() {
        const accessToken = getToken('accessToken');
        const refreshToken = getToken('refreshToken');
        console.log('loadCurrentUser called, token:', accessToken); // add this
        if (!accessToken) return;

        // this is the critical line — without it isLoggedIn stays false
        patchState(store, { accessToken, refreshToken, loading: true });
          console.log('store after patch:', store.accessToken()); // add this
        apollo
          .query<{ me: AuthUser }>({ query: GET_CURRENT_USER })
          .pipe(
            tap({
              next: ({ data }) => {
                console.log('me query response:', data); // add this
                if (!data) return;
                patchState(store, {
                  user: data.me as AuthUser,
                  loading: false,
                });
              },
              error: (error) =>
                patchState(store, { error: error.message, loading: false }),
            }),
          )
          .subscribe();
      },

      login(email: string, password: string) {
        console.log('store login called', email, password); // add this
        patchState(store, { loading: true, error: null });
        return apollo
          .mutate<{
            login: {
              accessToken: string;
              refreshToken: string;
              user: AuthUser;
            };
          }>({
            mutation: LOGIN,
            variables: { loginInput: { email, password } },
          })
          .pipe(
            tap({
              next: ({ data }) => {
                if (!data) return;
                const { accessToken, refreshToken, user } = data.login;
                localStorage.setItem('accessToken', accessToken);
                localStorage.setItem('refreshToken', refreshToken);
                patchState(store, {
                  accessToken,
                  refreshToken,
                  user,
                  loading: false,
                });
              },
              error: (error) =>
                patchState(store, { error: error.message, loading: false }),
            }),
          );
      },

      logout() {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        patchState(store, {
          user: null,
          accessToken: null,
          refreshToken: null,
          error: null,
        });
        apollo.client.clearStore();
      },

      refreshAccessToken() {
        const token = store.refreshToken();
        if (!token) return;
        apollo
          .mutate<{
            refreshToken: { accessToken: string; refreshToken: string };
          }>({
            mutation: REFRESH_TOKEN,
            variables: { token },
          })
          .pipe(
            tap({
              next: ({ data }) => {
                if (!data) return;
                const { accessToken, refreshToken } = data.refreshToken;
                if (isBrowser) {
                  localStorage.setItem('accessToken', accessToken);
                  localStorage.setItem('refreshToken', refreshToken);
                }
                patchState(store, { accessToken, refreshToken });
              },
              error: () => {
                if (isBrowser) {
                  localStorage.removeItem('accessToken');
                  localStorage.removeItem('refreshToken');
                }
                patchState(store, {
                  user: null,
                  accessToken: null,
                  refreshToken: null,
                  error: 'Session expired. Please log in again.',
                });
              },
            }),
          )
          .subscribe();
      },
    };
  }),
);
