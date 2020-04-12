import ReactGA from 'react-ga';
import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

let gaInit = false;
if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
  console.info('GA disabled as it is not a production environment');
} else {
  ReactGA.initialize('UA-163415862-1');
  gaInit = true;
  console.info('Now tracking GA data.');
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
