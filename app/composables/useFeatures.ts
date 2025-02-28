export const useFeatures = () => {
  const getFeatures = async () => {
    const { data, error } = await useFetch('/api/v1/features', {
      params: {
        limit: 100,
        offset: 0,
      },
    });

    if (error.value) {
      return {
        success: false,
        error: error.value,
        data: null,
      };
    }

    return data.value;
  };

  return {
    getFeatures,
  };
};
