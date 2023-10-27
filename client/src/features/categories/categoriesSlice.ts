import { createAsyncThunk, createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import agent from "../../app/api/agent";
import { MetaData } from "../../app/models/pagination";
import { Category, CategoryParams } from "../../app/models/category";
import { RootState } from "../../app/store/configureStore";

interface CategoriesState {
    categoriesLoaded: boolean;
    filtersLoaded: boolean;
    // status: string;
    // brands: string[];
    // types: string[];
    categoryParams: CategoryParams;
    metaData: MetaData | null;
}

const categoriesAdapter = createEntityAdapter<Category>();

function getAxiosParams(categoryParams: CategoryParams) {
    const params = new URLSearchParams();
    params.append('pageNumber', categoryParams.pageNumber.toString());
    params.append('pageSize', categoryParams.pageSize.toString());
    params.append('orderBy', categoryParams.orderBy);
    if (categoryParams.searchTerm) params.append('searchTerm', categoryParams.searchTerm);
    // if (categoryParams.types.length > 0) params.append('types', categoryParams.types.toString());
    // if (categoryParams.brands.length > 0) params.append('brands', categoryParams.brands.toString());
    return params;
}

export const fetchCategoriesAsync = createAsyncThunk<Category[], void, {state: RootState}>(
    'categories/fetchProductsAsync',
    async (_, thunkAPI) => {
        const params = getAxiosParams(thunkAPI.getState().categories.categoryParams)
        try {
            var response = await agent.Catalog.list(params);
            thunkAPI.dispatch(setMetaData(response.metaData));
            return response.items;
        } catch (error: any) {
            return thunkAPI.rejectWithValue({error: error.data})
        }
    }
)

export const fetchCategoryAsync = createAsyncThunk<Category, number>(
    'categories/fetchProductAsync',
    async (productId, thunkAPI) => {
        try {
            const product = await agent.Catalog.details(productId);
            return product;
        } catch (error: any) {
            return thunkAPI.rejectWithValue({error: error.data})
        }
    }
)

export const fetchFilters = createAsyncThunk(
    'categories/fetchFilters',
    async (_, thunkAPI) => {
        try {
            return agent.Catalog.fetchFilters();
        } catch (error: any) {
            return thunkAPI.rejectWithValue({error: error.message})
        }
    }
)

function initParams(): CategoryParams {
    return {
        pageNumber: 1,
        pageSize: 6,
        orderBy: 'name'
        // brands: [],
        // types: []
    }
}

export const categoriesSlice = createSlice({
    name: 'categories',
    initialState: categoriesAdapter.getInitialState<CategoriesState>({
        categoriesLoaded: false,
        filtersLoaded: false,
        // status: 'idle',
        // brands: [],
        // types: [],
        categoryParams: initParams(),
        metaData: null
    }),
    reducers: {
        setCategoryParams: (state, action) => {
            state.categoriesLoaded = false;
            state.categoryParams = {...state.categoryParams, ...action.payload, pageNumber: 1}
        },
        setPageNumber: (state, action) => {
            state.categoriesLoaded = false;
            state.categoryParams = {...state.categoryParams, ...action.payload}
        },
        setMetaData: (state, action) => {
            state.metaData = action.payload
        },
        resetCategoryParams: (state) => {
            state.categoryParams = initParams()
        },
        setCategory: (state, action) => {
            categoriesAdapter.upsertOne(state, action.payload);
            state.categoriesLoaded = false;
        },
        removeCategory: (state, action) => {
            categoriesAdapter.removeOne(state, action.payload);
            state.categoriesLoaded = false;
        }
    },
    // extraReducers: (builder => {
    //     builder.addCase(fetchProductsAsync.pending, (state, action) => {
    //         state.status = 'pendingFetchProducts'
    //     });
    //     builder.addCase(fetchProductsAsync.fulfilled, (state, action) => {
    //         categoriesAdapter.setAll(state, action.payload);
    //         state.status = 'idle';
    //         state.categoriesLoaded = true;
    //     });
    //     builder.addCase(fetchProductsAsync.rejected, (state, action) => {
    //         console.log(action.payload);
    //         state.status = 'idle';
    //     });
    //     builder.addCase(fetchProductAsync.pending, (state) => {
    //         state.status = 'pendingFetchProduct';
    //     });
    //     builder.addCase(fetchProductAsync.fulfilled, (state, action) => {
    //         categoriesAdapter.upsertOne(state, action.payload);
    //         state.status = 'idle';
    //     });
    //     builder.addCase(fetchProductAsync.rejected, (state, action) => {
    //         console.log(action);
    //         state.status = 'idle';
    //     });
    //     builder.addCase(fetchFilters.pending, (state) => {
    //         state.status = 'pendingFetchFilters';
    //     });
    //     builder.addCase(fetchFilters.fulfilled, (state, action) => {
    //         state.brands = action.payload.brands;
    //         state.types = action.payload.types;
    //         state.status = 'idle';
    //         state.filtersLoaded = true;
    //     });
    //     builder.addCase(fetchFilters.rejected, (state) => {
    //         state.status = 'idle';
    //     });
    // })
})

export const categorySelectors = categoriesAdapter.getSelectors((state: RootState) => state.categories);

export const {setCategoryParams, resetCategoryParams, setMetaData, setPageNumber, setCategory, removeCategory} = categoriesSlice.actions;