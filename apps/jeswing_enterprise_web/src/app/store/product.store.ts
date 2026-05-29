import { computed, inject } from '@angular/core';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { Apollo, gql } from 'apollo-angular';
import { from, switchMap, tap } from 'rxjs';

const GET_PRODUCTS = gql`
  query GetProducts {
    products {
      id
      name
      description
      price
      image
      stripePriceId
    }
  }
`;

const CREATE_PRODUCT = gql`
mutation createProduct($createProductInput: CreateProductInput!) {
  createProduct(createProductInput: $createProductInput) {
    id
    name
    description
    price
    image
    category {
      id
      name
    }
    stripePriceId
  }
}
`;

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  stripePriceId: string;
  isFeatured: boolean | null;
  categoryId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductState {
  products: Product[];
  selectedProduct: Product | null;
  loading: boolean;
  saving: boolean;
  error: string | null;
  modalOpen: boolean;
}

const initialState: ProductState = {
  products: [],
  selectedProduct: null,
  loading: false,
  saving: false,
  error: null,
  modalOpen: false,
};

export const ProductStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed((store) => ({
    totalProducts: computed(() => store.products().length),
    hasProducts: computed(() => store.products().length > 0),
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

    compressImage(file: File, maxWidth: number = 800, quality: number = 0.7): Promise<string> {
      return new Promise((resolve, reject) => {
        const img = new Image();
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          reject(new Error('Canvas context not available'));
          return;
        }
        
        img.onload = () => {
          const scale = Math.min(maxWidth / img.width, 1);
          canvas.width = img.width * scale;
          canvas.height = img.height * scale;
          
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          
          // Compress to JPEG
          const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
          resolve(compressedBase64);
        };
        
        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = URL.createObjectURL(file);
      });
    },
    
    selectProduct(product: Product | null): void {
      patchState(store, { selectedProduct: product });
    },

    loadProducts() {
      patchState(store, { loading: true });
      apollo
        .watchQuery<{ products: Product[] }>({
          query: GET_PRODUCTS,
        })
        .valueChanges.pipe(
          tap({
            next: ({ data }) => {
              if (!data) return;
              patchState(store, {
                products: data.products as Product[],
                loading: false,
              });
            },
            error: (error) =>
              patchState(store, { error: error.message, loading: false }),
          }),
        )
        .subscribe();
    },

    createProduct(
  name: string, 
  description: string, 
  file: File | null,
  price: number,
  categoryId: string | number | null,
  stripePriceId: string
): void {
  patchState(store, { saving: true, error: null });

  const imagePromise = file 
    ? this.compressImage(file) 
    : Promise.resolve('');

  from(imagePromise)
    .pipe(
      switchMap((image) => 
        apollo.mutate<{
          createProduct: Product;
        }>({
          mutation: CREATE_PRODUCT,
          variables: {
            createProductInput: {
              name,
              description,
              price,
              image,
              categoryId,
              stripePriceId,
            }
          }
        })
      ),
      tap({
        next: ({ data }) => {
          if (!data) return;
          patchState(store, (state) => ({
            products: [...state.products, data.createProduct],
            saving: false,
            modalOpen: false,
          }));
        },
        error: (error) => {
          patchState(store, { error: error.message, saving: false });
        },
      })
    )
    .subscribe();
},
    clearError(): void {
      patchState(store, { error: null });
    },
  })),
);
