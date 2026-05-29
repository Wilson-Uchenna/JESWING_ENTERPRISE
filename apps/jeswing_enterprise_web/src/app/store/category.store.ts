import { computed, inject } from '@angular/core';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { Apollo, gql } from 'apollo-angular';
import { tap } from 'rxjs';

const GET_CATEGORIES = gql`
  query GetCategory {
    categories {
      id
      name
      slug
      description
      createdAt
      
    }
  }
`;

const CREATE_CATEGORY = gql`
  mutation createCategory($createCategoryInput: CreateCategoryInput!) {
    createCategory(createCategoryInput: $createCategoryInput) {
      id
      name
      description
      createdAt
    }
  }
`;

export interface Category {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CategoryState {
  categories: Category[];
  selectedCategory: Category | null;
  loading: boolean;
  saving: boolean;
  error: string | null;
  modalOpen: boolean;
}

const initialState: CategoryState = {
  categories: [],
  selectedCategory: null,
  loading: false,
  saving: false,
  error: null,
  modalOpen: false,
};

export const CategoryStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed((store) => ({
    totalCategories: computed(() => store.categories().length),
    hasCategories: computed(() => store.categories().length > 0),
    isBusy: computed(() => store.loading() || store.saving()),
    hasError: computed(() => store.error() !== null),
  })),
  withMethods((store, apollo = inject(Apollo)) => ({
    openModal(): void {
      patchState(store, { modalOpen: true, error: null });
    },

    closeModal(): void {
      patchState(store, { modalOpen: false, error: null });
    },

    selectCategory(category: Category | null): void {
      patchState(store, { selectedCategory: category });
    },

    loadCategories(): void {
      patchState(store, { loading: true, error: null });

      apollo
        .query<{ categories: Category[] }>({
          query: GET_CATEGORIES,
        })
        .pipe(
          tap({
            next: ({ data}) => {
              console.log('Categories fetched from API:', data?.categories);
              if (!data?.categories) return;
              patchState(store, {
                categories: data.categories as Category[],
                loading: false,
              });
            },
            error: (error) =>
              patchState(store, { error: error.message, loading: false }),
          }),
        )
        .subscribe();
    },

    createCategory(name: string, description: string): void {
      // Implementation for creating a category goes here
      patchState(store, { saving: true, error: null });
      // Example mutation call to create a category
      // apollo.mutate({
      //   mutation: CREATE_CATEGORY,
      //   variables: { name, description },
      // }).pipe(
      //   tap({
      //     next: ({ data }) => {
      //       if (!data) return;
      //       // Optionally, you can reload categories or update the state with the new category
      //       this.loadCategories();
      //       patchState(store, { saving: false });
      //     },
      //     error: (error) => patchState(store, { error: error.message, saving: false }),
      //   }),
      // ).subscribe();
      apollo
        .mutate<{
          createCategory: Category;
        }>({
          mutation: CREATE_CATEGORY,
          variables: { createCategoryInput: { name, description } },
        })
        .pipe(
          tap({
            next: ({ data }) => {
              if (!data) return;
              patchState(store, (state) => ({
                categories: [...state.categories, data.createCategory],
                saving: false,
                modalOpen: false,
              }));
            },
            error: (error) =>
              patchState(store, { error: error.message, saving: false }),
          }),
        )
        .subscribe();
    },

    clearError(): void {
      patchState(store, { error: null });
    },
  })),
);
