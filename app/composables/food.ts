import type { DetailMeal, Ingredient, Meal } from '~/types/food';

export function useFood() {
  const runtimeConfig = useRuntimeConfig();
  const baseUrl = runtimeConfig.public.API_BASE_URL;

  const extractFileName = (url: string): string => {
    const lastSegment = url.split('/').pop() || '';
    return lastSegment.split('.')[0] ?? '';
  };

  const fetchAllIngredients = async (): Promise<Ingredient[]> => {
    const response = await $fetch<{ meals: Record<string, any>[] }>(
      `${baseUrl}/api/json/v1/1/list.php?i=list`
    );

    const data = toArray(response.meals).map<Ingredient>((val) => {
      return {
        id: val.idIngredient,
        name: extractFileName(val.strThumb),
        description: val.strDescription,
        type: val.strType,
        title: val.strIngredient,
        thumbnail: val.strThumb
      };
    });

    return data;
  };

  const fetchMealsByIngredienName = async (search: string): Promise<Meal[]> => {
    const response = await $fetch<{ meals: Record<string, any>[] }>(
      `${baseUrl}/api/json/v1/1/filter.php?i=${encodeURIComponent(search)}`
    );

    const data = toArray(response.meals).map<Meal>((val) => {
      return {
        id: val.idMeal,
        title: val.strMeal,
        thumbnail: val.strMealThumb
      };
    });

    return data;
  };

  const fetchDetailMealById = async (id: string): Promise<DetailMeal> => {
    const response = await $fetch<{ meals: Record<string, any>[] }>(
      `${baseUrl}/api/json/v1/1/lookup.php?i=${encodeURIComponent(id)}`
    );

    const data = toArray(response.meals).at(0);

    const filteredIngredients = Object.keys(data).filter((k) => new RegExp('strIngredient').test(k));

    const detail: DetailMeal = {
      id: data.idMeal,
      title: data.strMeal,
      thumbnail: data.strMealThumb,
      instructions: data.strInstructions,
      area: data.strArea,
      category: data.strCategory,
      youtubeSrc: data.strYoutube,
      receipts: filteredIngredients
        .map((key, idx) => {
          let receipt = '';
          if (data[key] && data[`strMeasure${idx + 1}`]) {
            receipt = `${data[`strMeasure${idx + 1}`]} ${data[key]}`;
          }

          return receipt;
        })
        .filter((val) => val !== '')
    };

    return detail;
  };

  return {
    fetchAllIngredients,
    fetchMealsByIngredienName,
    fetchDetailMealById
  };
}
