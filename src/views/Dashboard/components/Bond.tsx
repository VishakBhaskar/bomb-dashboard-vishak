import React, {useCallback, useMemo} from 'react';
import Page from '../../../components/Page';
import {createGlobalStyle} from 'styled-components';
import {Route, Switch, useRouteMatch} from 'react-router-dom';
import PageHeader from '../../../components/PageHeader';
import ExchangeCard from '../../Bond/components/ExchangeCard';
import styled from 'styled-components';
import Spacer from '../../../components/Spacer';
import useBondStats from '../../../hooks/useBondStats';
//import useBombStats from '../../hooks/useBombStats';
import useBombFinance from '../../../hooks/useBombFinance';
import useCashPriceInLastTWAP from '../../../hooks/useCashPriceInLastTWAP';
import {useTransactionAdder} from '../../../state/transactions/hooks';
import ExchangeStat from '../../Bond/components/ExchangeStat';
import useTokenBalance from '../../../hooks/useTokenBalance';
import useBondsPurchasable from '../../../hooks/useBondsPurchasable';
import {getDisplayBalance} from '../../../utils/formatBalance';
import { BOND_REDEEM_PRICE, BOND_REDEEM_PRICE_BN } from '../../../bomb-finance/constants';
import { Alert } from '@material-ui/lab';
import {Box, Button, Card, CardContent, Typography,  Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    Paper,} from '@material-ui/core';
    import Label from '../../../components/Label';
 import Exchange from './Exchange';

// import HomeImage from '../../assets/img/background.jpg';
// import { Grid, Box } from '@material-ui/core';
// import { Helmet } from 'react-helmet';

// const BackgroundImage = createGlobalStyle`
//   body {
//     background: url(${HomeImage}) repeat !important;
//     background-size: cover !important;
//     background-color: #171923;
//   }
// `;
// const TITLE = 'bomb.money | Bonds'

const Bond: React.FC = () => {
  const {path} = useRouteMatch();
  const bombFinance = useBombFinance();
  const addTransaction = useTransactionAdder();
  const bondStat = useBondStats();
  //const bombStat = useBombStats();
  const cashPrice = useCashPriceInLastTWAP();

  const bondsPurchasable = useBondsPurchasable();

  const bondBalance = useTokenBalance(bombFinance?.BBOND);
  //const scalingFactor = useMemo(() => (cashPrice ? Number(cashPrice) : null), [cashPrice]);

  const handleBuyBonds = useCallback(
    async (amount: string) => {
      const tx = await bombFinance.buyBonds(amount);
      addTransaction(tx, {
        summary: `Buy ${Number(amount).toFixed(2)} BBOND with ${amount} BOMB`,
      });
    },
    [bombFinance, addTransaction],
  );

  const handleRedeemBonds = useCallback(
    async (amount: string) => {
      const tx = await bombFinance.redeemBonds(amount);
      addTransaction(tx, {summary: `Redeem ${amount} BBOND`});
    },
    [bombFinance, addTransaction],
  );
  const isBondRedeemable = useMemo(() => cashPrice.gt(BOND_REDEEM_PRICE_BN), [cashPrice]);
  const isBondPurchasable = useMemo(() => Number(bondStat?.tokenInFtm) < 1.01, [bondStat]);
  const isBondPayingPremium = useMemo(() => Number(bondStat?.tokenInFtm) >= 1.1, [bondStat]);
// console.log("bondstat", Number(bondStat?.tokenInFtm))
  const bondScale = (Number(cashPrice) / 100000000000000).toFixed(4); 

  return (
    <Box>
    <Card>
        <CardContent >
          <h2>Bonds</h2>
          BBOND can be purchased only on contraction periods, when TWAP of BOMB is below 1
          <TableContainer component={Paper}>
            <Table aria-label="simple table">
              
              
              <TableBody>
                <TableRow key="BOND" >
                  

              <TableCell align="center">
             
              <Typography style={{ textTransform: 'uppercase', color: '#fffff' }}>  
              Current Price: (BOMB)^2
                </Typography>
             
              <h3> 10,000 BBOND =
                  {`${Number(bondStat?.tokenInFtm).toFixed(4) || '-'}`} BTCB
                  </h3></TableCell>

                  <TableCell align="center">
                  <Typography style={{ textTransform: 'uppercase', color: '#fffff' }}>  
              Available to redeem
                </Typography>
                <h3> {Number(getDisplayBalance(bondBalance)).toFixed(2)} BBOND
                  </h3>
                  </TableCell>

                  <TableCell> 
                  <StyledCardWrapper>
              <Exchange
                  action="Purchase"
                  fromToken={bombFinance.BOMB}
                  fromTokenName="BOMB"
                  toToken={bombFinance.BBOND}
                  toTokenName="BBOND"
                  priceDesc={
                    !isBondPurchasable
                      ? 'BOMB is over peg'
                      : getDisplayBalance(bondsPurchasable, 18, 4) + ' BBOND available'
                  }
                  onExchange={handleBuyBonds}
                  disabled={!bondStat || isBondRedeemable}
                  title = "Purchase BBOND"
                  btn='Purchase'
                />
              </StyledCardWrapper></TableCell>

              <TableCell>
                <Exchange
                  action="Redeem"
                  fromToken={bombFinance.BBOND}
                  fromTokenName="BBOND"
                  toToken={bombFinance.BOMB}
                  toTokenName="BOMB"
                  priceDesc={`${getDisplayBalance(bondBalance)} BBOND Available`}
                  onExchange={handleRedeemBonds}
                  disabled={!bondStat || bondBalance.eq(0) || !isBondRedeemable}
                  disabledDescription={!isBondRedeemable ? `Enabled when 10,000 BOMB > ${BOND_REDEEM_PRICE}BTC` : null}
                  title = "Redeem BOMB"
                  btn='Redeem'
                /></TableCell>

             

             

            {/* <TableCell><Button
                disabled={stakedBalance.eq(0) || (!canWithdrawFromBoardroom)}
                onClick={onPresentWithdraw}
                className={
                  stakedBalance.eq(0) || (!canWithdrawFromBoardroom)
                    ? 'shinyButtonDisabledSecondary'
                    : 'shinyButtonSecondary'
                }
              >
                Withdraw
              </Button></TableCell> */}
                  
                </TableRow>
              </TableBody>

              

              
              
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
      </Box>
    //   <StyledBond>
    //           <StyledCardWrapper>
    //             <ExchangeCard
    //               action="Purchase"
    //               fromToken={bombFinance.BOMB}
    //               fromTokenName="BOMB"
    //               toToken={bombFinance.BBOND}
    //               toTokenName="BBOND"
    //               priceDesc={
    //                 !isBondPurchasable
    //                   ? 'BOMB is over peg'
    //                   : getDisplayBalance(bondsPurchasable, 18, 4) + ' BBOND available for purchase'
    //               }
    //               onExchange={handleBuyBonds}
    //               disabled={!bondStat || isBondRedeemable}
    //             />
    //           </StyledCardWrapper>
    //           <StyledStatsWrapper>
    //             <ExchangeStat
    //               tokenName="10,000 BOMB"
    //               description="Last-Hour TWAP Price"
    //               //price={Number(bombStat?.tokenInFtm).toFixed(4) || '-'}
    //              price={bondScale || '-'}

    //             />
    //             <Spacer size="md" />
    //             <ExchangeStat
    //               tokenName="10,000 BBOND"
    //               description="Current Price: (BOMB)^2"
    //               price={Number(bondStat?.tokenInFtm).toFixed(4) || '-'}
    //             />
    //           </StyledStatsWrapper>
    //           <StyledCardWrapper>
    //             <ExchangeCard
    //               action="Redeem"
    //               fromToken={bombFinance.BBOND}
    //               fromTokenName="BBOND"
    //               toToken={bombFinance.BOMB}
    //               toTokenName="BOMB"
    //               priceDesc={`${getDisplayBalance(bondBalance)} BBOND Available in wallet`}
    //               onExchange={handleRedeemBonds}
    //               disabled={!bondStat || bondBalance.eq(0) || !isBondRedeemable}
    //               disabledDescription={!isBondRedeemable ? `Enabled when 10,000 BOMB > ${BOND_REDEEM_PRICE}BTC` : null}
    //             />
    //           </StyledCardWrapper>
    //         </StyledBond>
      
  );
};
const StyledCardActions = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 28px;
  width: 100%;
`;

const StyledActionSpacer = styled.div`
  height: ${(props) => props.theme.spacing[4]}px;
  width: ${(props) => props.theme.spacing[4]}px;
`;
const StyledBond = styled.div`
  display: flex;
  @media (max-width: 768px) {
    width: 100%;
    flex-flow: column nowrap;
    align-items: center;
  }
`;

const StyledCardWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  @media (max-width: 768px) {
    width: 80%;
  }
`;

const StyledStatsWrapper = styled.div`
  display: flex;
  flex: 0.8;
  margin: 0 20px;
  flex-direction: column;

  @media (max-width: 768px) {
    width: 80%;
    margin: 16px 0;
  }
`;

export default Bond;
