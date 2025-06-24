import { useEffect, useState } from 'react';
import { api } from '../config/axiosInstance';

const useFetch = (endpoint) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get(endpoint);
        if (res.data.success) {
          setData(res.data.products || res.data); // Adjust this line based on expected structure
        } else {
          setError('Failed to fetch data');
        }
      } catch (err) {
        setError(err.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [endpoint]);

  return { data, loading, error };
};

export default useFetch;
