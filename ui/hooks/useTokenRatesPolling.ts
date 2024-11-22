import { useSelector } from 'react-redux';
import {
  getCurrentChainId,
  getMarketData,
  getTokenExchangeRates,
  getTokensMarketData,
  getUseCurrencyRateCheck,
} from '../selectors';
import { getNetworkConfigurationsByChainId } from '../../shared/modules/selectors/networks';
import {
  tokenRatesStartPolling,
  tokenRatesStopPollingByPollingToken,
} from '../store/actions';
import {
  getCompletedOnboarding,
  getIsUnlocked,
} from '../ducks/metamask/metamask';
import useMultiPolling from './useMultiPolling';

const useTokenRatesPolling = () => {
  // Selectors to determine polling input
  const completedOnboarding = useSelector(getCompletedOnboarding);
  const isUnlocked = useSelector(getIsUnlocked);
  const currentChainId = useSelector(getCurrentChainId);
  const useCurrencyRateCheck = useSelector(getUseCurrencyRateCheck);
  const networkConfigurations = useSelector(getNetworkConfigurationsByChainId);

  // Selectors returning state updated by the polling
  const tokenExchangeRates = useSelector(getTokenExchangeRates);
  const tokensMarketData = useSelector(getTokensMarketData);
  const marketData = useSelector(getMarketData);

  const enabled = completedOnboarding && isUnlocked && useCurrencyRateCheck;

  const chainIds = process.env.PORTFOLIO_VIEW
    ? Object.keys(networkConfigurations)
    : [currentChainId];

  useMultiPolling({
    startPolling: tokenRatesStartPolling,
    stopPollingByPollingToken: tokenRatesStopPollingByPollingToken,
    input: enabled ? chainIds : [],
  });

  return {
    tokenExchangeRates,
    tokensMarketData,
    marketData,
  };
};

export default useTokenRatesPolling;
