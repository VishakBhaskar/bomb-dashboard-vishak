import React, {useCallback, useMemo} from 'react';

import styled from 'styled-components';

import useBondStats from '../../../hooks/useBondStats';

import useBombFinance from '../../../hooks/useBombFinance';
import useCashPriceInLastTWAP from '../../../hooks/useCashPriceInLastTWAP';
import {useTransactionAdder} from '../../../state/transactions/hooks';

import useTokenBalance from '../../../hooks/useTokenBalance';
import useBondsPurchasable from '../../../hooks/useBondsPurchasable';
import {getDisplayBalance} from '../../../utils/formatBalance';
import { BOND_REDEEM_PRICE, BOND_REDEEM_PRICE_BN } from '../../../bomb-finance/constants';

import {Box,  Card, CardContent, Typography,  Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    Paper,} from '@material-ui/core';

 import Exchange from './Exchange';

const Bond: React.FC = () => {

  const bombFinance = useBombFinance();
  const addTransaction = useTransactionAdder();
  const bondStat = useBondStats();

  const cashPrice = useCashPriceInLastTWAP();

  const bondsPurchasable = useBondsPurchasable();

  const bondBalance = useTokenBalance(bombFinance?.BBOND);


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
                </TableRow>
              </TableBody>    
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
      </Box>
  );
};

const StyledCardWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  @media (max-width: 768px) {
    width: 80%;
  }
`;

export default Bond;
