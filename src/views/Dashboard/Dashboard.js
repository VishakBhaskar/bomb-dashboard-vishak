import React, { useMemo } from 'react';
import Page from '../../components/Page';
import { createGlobalStyle } from 'styled-components';
import moment from 'moment';
import useBombStats from '../../hooks/useBombStats';

import useBondStats from '../../hooks/useBondStats';
import usebShareStats from '../../hooks/usebShareStats';
import useTotalValueLocked from '../../hooks/useTotalValueLocked';
import useCurrentEpoch from '../../hooks/useCurrentEpoch';
import useLastEpochTwap from '../../hooks/useLastEpochTwap';
import useTreasuryAllocationTimes from '../../hooks/useTreasuryAllocationTimes';
import useBanks from '../../hooks/useBanks';

import useCashPriceInEstimatedTWAP from '../../hooks/useCashPriceInEstimatedTWAP';

import { roundAndFormatNumber } from '../../0x';

import {
  CardContent,
  Grid,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TableHead,
  Paper,
  Box,
  Card,
} from '@material-ui/core';

import { Helmet } from 'react-helmet';
import ProgressCountdown from '../Boardroom/components/ProgressCountdown';

import Boardroom from './components/Boardroom';

import HomeImage from '../../assets/img/background.jpg';

import FarmDetails from './FarmDetails';

const BackgroundImage = createGlobalStyle`
  body {
    background: url(${HomeImage}) repeat !important;
    background-size: cover !important;
    background-color: #171923;
  }
`;
const TITLE = 'bomb.money | BTC pegged algocoin';

const Home = () => {
  const TVL = useTotalValueLocked();

  const bombStats = useBombStats();
  const bShareStats = usebShareStats();
  const tBondStats = useBondStats();
  const { to } = useTreasuryAllocationTimes();
  const current_Epoch = useCurrentEpoch();
  const lastEpochTwap = useLastEpochTwap();

  const liveEpochTwap = useCashPriceInEstimatedTWAP();
  const [banks] = useBanks();
  const activeBanks = banks.filter((bank) => !bank.finished);

  const tvl = useMemo(() => (TVL ? TVL.toFixed(2) : '-.--'), [TVL]);
  const bombPriceInDollars = useMemo(
    () => (bombStats ? Number(bombStats.priceInDollars).toFixed(2) : null),
    [bombStats],
  );

  const currentEpoch = useMemo(() => (current_Epoch ? Number(current_Epoch) : null), [current_Epoch]);
  const lastTwap = useMemo(
    () => (lastEpochTwap && current_Epoch ? Number(lastEpochTwap / (current_Epoch * 10000000000)).toFixed(3) : null),
    [lastEpochTwap, current_Epoch],
  );
  const liveTwap = useMemo(
    () => (liveEpochTwap ? Number(liveEpochTwap.priceInDollars).toFixed(3) : null),
    [liveEpochTwap],
  );

  const bombCirculatingSupply = useMemo(() => (bombStats ? String(bombStats.circulatingSupply) : null), [bombStats]);
  const bombTotalSupply = useMemo(() => (bombStats ? String(bombStats.totalSupply) : null), [bombStats]);

  const bSharePriceInDollars = useMemo(
    () => (bShareStats ? Number(bShareStats.priceInDollars).toFixed(2) : null),
    [bShareStats],
  );

  const bShareCirculatingSupply = useMemo(
    () => (bShareStats ? String(bShareStats.circulatingSupply) : null),
    [bShareStats],
  );
  const bShareTotalSupply = useMemo(() => (bShareStats ? String(bShareStats.totalSupply) : null), [bShareStats]);

  const tBondPriceInDollars = useMemo(
    () => (tBondStats ? Number(tBondStats.priceInDollars).toFixed(2) : null),
    [tBondStats],
  );

  const tBondCirculatingSupply = useMemo(
    () => (tBondStats ? String(tBondStats.circulatingSupply) : null),
    [tBondStats],
  );
  const tBondTotalSupply = useMemo(() => (tBondStats ? String(tBondStats.totalSupply) : null), [tBondStats]);

  return (
    <Page>
      <Helmet>
        <title>{TITLE}</title>
      </Helmet>
      <BackgroundImage />
      <Grid container spacing={3}>
        <Grid item xs={12} sm={7}>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell align="center">
                    {' '}
                    <h2>Bomb Finance Summmary</h2>{' '}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableHead>
                <TableRow>
                  <TableCell align="center">
                    {' '}
                    <h3>Token</h3>{' '}
                  </TableCell>
                  <TableCell align="center">
                    {' '}
                    <h3>Current Supply</h3>{' '}
                  </TableCell>
                  <TableCell align="center">
                    {' '}
                    <h3>Total Supply</h3>{' '}
                  </TableCell>
                  <TableCell align="center">
                    {' '}
                    <h3>Price</h3>{' '}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow key="BOMB" sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell align="center">$BOMB</TableCell>
                  <TableCell align="center">{roundAndFormatNumber(bombCirculatingSupply, 2)}</TableCell>
                  <TableCell align="center">{roundAndFormatNumber(bombTotalSupply, 2)}</TableCell>
                  <TableCell align="center">
                    ${bombPriceInDollars ? roundAndFormatNumber(bombPriceInDollars, 2) : '-.--'}
                  </TableCell>
                </TableRow>
              </TableBody>
              <TableBody>
                <TableRow key="BSHARE" sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell align="center">$BSHARE</TableCell>
                  <TableCell align="center">{roundAndFormatNumber(bShareCirculatingSupply, 2)}</TableCell>
                  <TableCell align="center">{roundAndFormatNumber(bShareTotalSupply, 2)}</TableCell>
                  <TableCell align="center">${bSharePriceInDollars ? bSharePriceInDollars : '-.--'}</TableCell>
                </TableRow>
              </TableBody>
              <TableBody>
                <TableRow key="BBOND" sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell align="center">$BBOND</TableCell>
                  <TableCell align="center">{roundAndFormatNumber(tBondCirculatingSupply, 2)}</TableCell>
                  <TableCell align="center">{roundAndFormatNumber(tBondTotalSupply, 2)}</TableCell>
                  <TableCell align="center">${tBondPriceInDollars ? tBondPriceInDollars : '-.--'}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
        {/* //  */}
        <Grid item xs={12} sm={5}>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableBody>
                <TableRow key="CURRENT EPOCH" sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell align="center">
                    {' '}
                    <h4>Current Epoch</h4>{' '}
                  </TableCell>
                  <TableCell align="center">{Number(currentEpoch)}</TableCell>
                </TableRow>
              </TableBody>
              <TableBody>
                <TableRow key="NEXT EPOCH" sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell align="center">
                    {' '}
                    <h4>Next Epoch</h4>{' '}
                  </TableCell>
                  <TableCell align="center">
                    <ProgressCountdown base={moment().toDate()} hideBar={true} deadline={to} description="Next Epoch" />
                  </TableCell>
                </TableRow>
              </TableBody>
              <TableBody>
                <TableRow key="LIVE TWAP" sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell align="center">
                    {' '}
                    <h4>Live Twap</h4>{' '}
                  </TableCell>
                  <TableCell align="center">
                    <Typography>{Number(liveTwap)}</Typography>
                  </TableCell>
                </TableRow>
              </TableBody>
              <TableBody>
                <TableRow key="TVL" sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell align="center">
                    {' '}
                    <h4>TVL</h4>{' '}
                  </TableCell>
                  <TableCell align="center">
                    <Typography>{tvl}</Typography>
                  </TableCell>
                </TableRow>
              </TableBody>
              <TableBody>
                <TableRow key="LAST TWAP" sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell align="center">
                    {' '}
                    <h4>Last Epoch TWAP</h4>{' '}
                  </TableCell>
                  <TableCell align="center">
                    <Typography>{lastTwap}</Typography>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
      {/* Board Room  */}
      <CardContent align="center">
        <Boardroom />
      </CardContent>
      <CardContent align="center">
        {/* <Grid container spacing={3} style={{ marginTop: '20px' }}> */}
        <Box>
          <Card>
            <CardContent>
              <h2>Bomb Farms</h2>
              Stake your LP tokens in our farms to start earning $BSHARE
              <TableContainer component={Paper}>
                <Table aria-label="simple table">
                  <TableBody>
                    {activeBanks
                      .filter((bank) => bank.sectionInUI === 3)
                      .map((bank) => (
                        <React.Fragment key={bank.name}>
                          <h3>{`${bank.depositTokenName}`}</h3>
                          <FarmDetails bank={bank} />
                        </React.Fragment>
                      ))}
                    {/* </Grid> */}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Box>
      </CardContent>

      <Grid container spacing={3}></Grid>
    </Page>
  );
};

export default Home;
