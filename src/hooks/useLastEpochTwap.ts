import {useEffect, useState} from 'react';
import useBombFinance from './useBombFinance';
import {BigNumber} from 'ethers';
import useRefresh from './useRefresh';

const useCurrentEpoch = () => {
  const [lastEpochTwap, setLastEpochTwap] = useState<BigNumber>(BigNumber.from(0));
  const bombFinance = useBombFinance();
  const {slowRefresh} = useRefresh();

  useEffect(() => {
    async function fetchCurrentEpoch() {
      try {
        setLastEpochTwap(await bombFinance.getBombPriceInLastTWAP());
      } catch (err) {
        console.error(err);
      }
    }
    fetchCurrentEpoch();
  }, [setLastEpochTwap, bombFinance, slowRefresh]);

  return lastEpochTwap;
};

export default useCurrentEpoch;
