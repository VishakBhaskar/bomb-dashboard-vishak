import React, { useMemo, useState } from 'react';
import Page from '../../components/Page';
import { createGlobalStyle } from 'styled-components';
import CountUp from 'react-countup';
import moment from 'moment';
import CardIcon from '../../components/CardIcon';
import TokenSymbol from '../../components/TokenSymbol';
import useBombStats from '../../hooks/useBombStats';
import useLpStats from '../../hooks/useLpStats';
import useLpStatsBTC from '../../hooks/useLpStatsBTC';
import useModal from '../../hooks/useModal';
import useZap from '../../hooks/useZap';
import useBondStats from '../../hooks/useBondStats';
import usebShareStats from '../../hooks/usebShareStats';
import useTotalValueLocked from '../../hooks/useTotalValueLocked';
import useCurrentEpoch from '../../hooks/useCurrentEpoch';
import useLastEpochTwap from '../../hooks/useLastEpochTwap';
import useTreasuryAllocationTimes from '../../hooks/useTreasuryAllocationTimes';
import useTotalStakedOnBoardroom from '../../hooks/useTotalStakedOnBoardroom';
import { getDisplayBalance } from '../../utils/formatBalance';
import useFetchBoardroomAPR from '../../hooks/useFetchBoardroomAPR';
import useCashPriceInEstimatedTWAP from '../../hooks/useCashPriceInEstimatedTWAP';

import { roundAndFormatNumber } from '../../0x';

import {
  Box,
  Button,
  Card,
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
} from '@material-ui/core';
import ZapModal from '../Bank/components/ZapModal';
import { makeStyles } from '@material-ui/core/styles';
import useBombFinance from '../../hooks/useBombFinance';
import { Helmet } from 'react-helmet';
import ProgressCountdown from '../Boardroom/components/ProgressCountdown';
import Stake from '../Boardroom/components/Stake';
import Boardroom from './components/Boardroom';

import HomeImage from '../../assets/img/background.jpg';
import Harvest from '../Boardroom/components/Harvest';
// import Boardroom from '../Boardroom';
const BackgroundImage = createGlobalStyle`
  body {
    background: url(${HomeImage}) repeat !important;
    background-size: cover !important;
    background-color: #171923;
  }
`;
const TITLE = 'bomb.money | BTC pegged algocoin';

// const BackgroundImage = createGlobalStyle`
//   body {
//     background-color: grey;
//     background-size: cover !important;
//   }
// `;

const useStyles = makeStyles((theme) => ({
  button: {
    [theme.breakpoints.down('415')]: {
      // marginTop: '10px'
    },
  },
}));

const Home = () => {
  const classes = useStyles();
  const TVL = useTotalValueLocked();
  const bombFtmLpStats = useLpStatsBTC('BOMB-BTCB-LP');
  const bShareFtmLpStats = useLpStats('BSHARE-BNB-LP');
  const bombStats = useBombStats();
  const bShareStats = usebShareStats();
  const tBondStats = useBondStats();
  const bombFinance = useBombFinance();
  const { to } = useTreasuryAllocationTimes();
  const current_Epoch = useCurrentEpoch();
  const lastEpochTwap = useLastEpochTwap();
  const bSharestaked = useTotalStakedOnBoardroom();
  const boardroom_APR = useFetchBoardroomAPR();
  const liveEpochTwap = useCashPriceInEstimatedTWAP();

  // const bombmaxi = useBombMaxiStats('0xd6f52e8ab206e59a1e13b3d6c5b7f31e90ef46ef000200000000000000000028');

  const bombLPStats = useMemo(() => (bombFtmLpStats ? bombFtmLpStats : null), [bombFtmLpStats]);
  const boardroomAPR = useMemo(() => (boardroom_APR ? (boardroom_APR / 365).toFixed(2) : null), [boardroom_APR]);
  const bombPriceInDollars = useMemo(
    () => (bombStats ? Number(bombStats.priceInDollars).toFixed(2) : null),
    [bombStats],
  );

  const bshareLPStats = useMemo(() => (bShareFtmLpStats ? bShareFtmLpStats : null), [bShareFtmLpStats]);
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
  const boardRoomTVL = useMemo(
    () =>
      bSharestaked && bShareStats
        ? roundAndFormatNumber(Number(bSharestaked), 2) * roundAndFormatNumber(Number(bShareStats.priceInDollars), 2)
        : null,
    [bShareStats, bSharestaked],
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

  const bombLpZap = useZap({ depositTokenName: 'BOMB-BTCB-LP' });
  const bshareLpZap = useZap({ depositTokenName: 'BSHARE-BNB-LP' });

  const [onPresentBombZap, onDissmissBombZap] = useModal(
    <ZapModal
      decimals={18}
      onConfirm={(zappingToken, tokenName, amount) => {
        if (Number(amount) <= 0 || isNaN(Number(amount))) return;
        bombLpZap.onZap(zappingToken, tokenName, amount);
        onDissmissBombZap();
      }}
      tokenName={'BOMB-BTCB-LP'}
    />,
  );

  const [onPresentBshareZap, onDissmissBshareZap] = useModal(
    <ZapModal
      decimals={18}
      onConfirm={(zappingToken, tokenName, amount) => {
        if (Number(amount) <= 0 || isNaN(Number(amount))) return;
        bshareLpZap.onZap(zappingToken, tokenName, amount);
        onDissmissBshareZap();
      }}
      tokenName={'BSHARE-BNB-LP'}
    />,
  );

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
                    <Typography>{TVL}</Typography>
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
      {/* <Card>
        <CardContent align="center">
          <h2>Board Room</h2>
          <Box mt={2}>
            <Typography>TVL : $ {boardRoomTVL}</Typography>
            <Typography>Total Staked: {getDisplayBalance(bSharestaked)}</Typography>
            <Typography>Daily returns : {boardroomAPR}%</Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={3}>
                <Harvest />
              </Grid>
              <Grid item xs={12} sm={3}>
                <Boardroom />
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card> */}
      <Grid container spacing={3}></Grid>

      {/* </Grid> */}
    </Page>
  );
};

export default Home;
