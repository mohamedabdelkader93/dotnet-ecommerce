import { useEffect } from "react";
import { categorySelectors, fetchCategoriesAsync, fetchFilters } from "../../features/categories/categoriesSlice";
import { useAppSelector, useAppDispatch } from "../store/configureStore";

export default function useCategories() {
    const categories = useAppSelector(categorySelectors.selectAll);
    const { categoriesLoaded, filtersLoaded, metaData} = useAppSelector(state => state.categories);
    const dispatch = useAppDispatch();
  
    useEffect(() => {
      if (!categoriesLoaded) dispatch(fetchCategoriesAsync());
    }, [categoriesLoaded, dispatch])
  
    useEffect(() => {
      if (!filtersLoaded) dispatch(fetchFilters());
    }, [dispatch, filtersLoaded]);

    return {
        categories,
        categoriesLoaded,
        filtersLoaded,
        // brands,
        // types,
        metaData
    }
}