import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from 'react';

let citiesArr = [
  {
    cityName: 'Berlin',
    country: 'Germany',
    emoji: '🇩🇪',
    date: '2027-02-12T09:24:11.863Z',
    notes: 'Amazing 😃',
    position: {
      lat: 52.53586782505711,
      lng: 13.376933665713324,
    },
    id: 98443197,
  },
  {
    cityName: 'San Roque',
    country: 'Spain',
    emoji: '🇪🇸',
    date: '2024-05-02T08:56:35.991Z',
    notes: '',
    position: {
      lat: '36.2377548012799',
      lng: '-5.427246093750001',
    },
    id: 98443198,
  },
  {
    cityName: 'Lisbon',
    country: 'Portugal',
    emoji: '🇵🇹',
    date: '2024-05-02T12:58:18.919Z',
    notes: '',
    position: {
      lat: '38.707698919925',
      lng: '-9.129638671875002',
    },
    id: 98443199,
  },
  {
    cityName: 'Madrid',
    country: 'Spain',
    emoji: '🇪🇸',
    date: '2024-05-02T14:08:09.177Z',
    notes: '',
    position: {
      lat: '40.36328834091583',
      lng: '-3.6474609375000004',
    },
    id: 98443200,
  },
  {
    cityName: 'Milan',
    country: 'Italy',
    emoji: '🇮🇹',
    date: '2024-05-03T11:20:38.152Z',
    notes: '',
    position: {
      lat: '45.46792982483541',
      lng: '9.195556640625002',
    },
    id: 98443201,
  },
];

const CitiesContext = createContext();

const initialState = {
  cities: [],
  isLoading: false,
  currentCity: {},
  error: '',
};

function reducer(state, action) {
  switch (action.type) {
    case 'loading':
      return { ...state, isLoading: true };
    case 'cities/loaded':
      return { ...state, isLoading: false, cities: action.payload };
    case 'city/loaded':
      return { ...state, isLoading: false, currentCity: action.payload };
    case 'city/created':
      return {
        ...state,
        isLoading: false,
        cities: [...state.cities, action.payload],
        currentCity: action.payload,
      };
    case 'city/deleted':
      return {
        ...state,
        isLoading: false,
        cities: state.cities.filter((city) => city.id !== action.payload),
        currentCity: {},
      };
    case 'rejected':
      return { ...state, isLoading: false, error: action.payload };
    default:
      throw new Error('Unknown dispatch action');
  }
}

function CitiesProvider({ children }) {
  const [{ cities, isLoading, currentCity, error }, dispatch] = useReducer(
    reducer,
    initialState
  );

  useEffect(function () {
    async function fetchCities() {
      dispatch({ type: 'loading' });

      try {
        dispatch({ type: 'cities/loaded', payload: citiesArr });
      } catch {
        dispatch({
          type: 'rejected',
          payload: 'There was an error loading cities...',
        });
      }
    }
    fetchCities();
  }, []);

  const getCity = useCallback(
    async function getCity(id) {
      if (+id === currentCity.id) return;

      dispatch({ type: 'loading' });
      try {
        const data = citiesArr.find((el) => el.id === +id);
        dispatch({ type: 'city/loaded', payload: data });
      } catch {
        dispatch({
          type: 'rejected',
          payload: 'There was an error loading city...',
        });
      }
    },
    [currentCity.id]
  );

  async function createCity(newCity) {
    dispatch({ type: 'loading' });
    try {
      const data = newCity;

      dispatch({ type: 'city/created', payload: data });
    } catch {
      dispatch({
        type: 'rejected',
        payload: 'There was an error creating city...',
      });
    }
  }

  async function deleteCity(id) {
    dispatch({ type: 'loading' });
    try {
      dispatch({ type: 'city/deleted', payload: id });
    } catch {
      dispatch({
        type: 'rejected',
        payload: 'There was an error deleting city...',
      });
    }
  }

  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        currentCity,
        getCity,
        createCity,
        deleteCity,
        error,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
}

function useCities() {
  const context = useContext(CitiesContext);
  if (!context)
    throw new Error('CitiesContext was used outside CitiesProvider');
  return context;
}

export { CitiesProvider, useCities };
