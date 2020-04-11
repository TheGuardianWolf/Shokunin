import ReactGA from 'react-ga';
import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

let gaInit = false;
if (process.env.NODE_ENV === 'production') {
  if (process.env.GOOGLE_ANALYTICS_ID) {
    ReactGA.initialize(process.env.GOOGLE_ANALYTICS_ID ?? '');
    gaInit = true;
    console.info('Now tracking GA data.');
  } else {
    console.warn('GA tracking cannot be enabled.');
  }
} else {
  console.info('GA disabled as it is not a production environment');
}

export function GoogleAnalytics() {
  const history = useHistory();

  useEffect(() => {
    if (gaInit) {
      return history.listen((location) => {
        ReactGA.set({ page: location.pathname });
        ReactGA.pageview(location.pathname);
      });
    }
  }, [history]);

  return null;
}

export default GoogleAnalytics;
