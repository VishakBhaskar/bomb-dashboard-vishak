import React, { useMemo, useContext } from 'react';

import styled from 'styled-components';
import { Button, Card, CardContent, Typography, TableCell, TableRow } from '@material-ui/core';
import FlashOnIcon from '@material-ui/icons/FlashOn';
import { ThemeContext } from 'styled-components';
import { getDisplayBalance } from '../../utils/formatBalance';

import useStatsForPool from '../../hooks/useStatsForPool';
import useBombStats from '../../hooks/useBombStats';
import useShareStats from '../../hooks/usebShareStats';
import useEarnings from '../../hooks/useEarnings';
import useStakedBalance from '../../hooks/useStakedBalance';
import useStakedTokenPriceInDollars from '../../hooks/useStakedTokenPriceInDollars';
import useApprove, { ApprovalState } from '../../hooks/useApprove';
import { AddIcon, RemoveIcon } from '../../components/icons';
import IconButton from '../../components/IconButton';
import useModal from '../../hooks/useModal';
import WithdrawModal from '../Bank/components/WithdrawModal';
import useWithdraw from '../../hooks/useWithdraw';
import useZap from '../../hooks/useZap';
import ZapModal from '../Bank/components/ZapModal';
import useStake from '../../hooks/useStake';
import DepositModal from '../Bank/components/DepositModal';
import useTokenBalance from '../../hooks/useTokenBalance';
import useHarvest from '../../hooks/useHarvest';

const FarmDetails = ({ bank }) => {
  const { onWithdraw } = useWithdraw(bank);
  const { onZap } = useZap(bank);
  let statsOnPool = useStatsForPool(bank);
  const earnings = useEarnings(bank.contract, bank.earnTokenName, bank.poolId);
  const bombStats = useBombStats();
  const tShareStats = useShareStats();
  const stakedBalance = useStakedBalance(bank.contract, bank.poolId);
  const [approveStatus, approve] = useApprove(bank.depositToken, bank.address);
  const { onStake } = useStake(bank);
  const tokenBalance = useTokenBalance(bank.depositToken);
  const { color: themeColor } = useContext(ThemeContext);
  const { onReward } = useHarvest(bank);

  const stakedTokenPriceInDollars = useStakedTokenPriceInDollars(bank.depositTokenName, bank.depositToken);
  const tokenPriceInDollarsStaked = useMemo(
    () => (stakedTokenPriceInDollars ? stakedTokenPriceInDollars : null),
    [stakedTokenPriceInDollars],
  );
  const earnedInDollarsStaked = (
    Number(tokenPriceInDollarsStaked) * Number(getDisplayBalance(stakedBalance, bank.depositToken.decimal))
  ).toFixed(2);

  const tokenName = bank.earnTokenName === 'BSHARE' ? 'BSHARE' : 'BOMB';
  const tokenStats = bank.earnTokenName === 'BSHARE' ? tShareStats : bombStats;
  const tokenPriceInDollars = useMemo(
    () => (tokenStats ? Number(tokenStats.priceInDollars).toFixed(2) : null),
    [tokenStats],
  );

  const [onPresentWithdraw, onDismissWithdraw] = useModal(
    <WithdrawModal
      max={stakedBalance}
      decimals={bank.depositToken.decimal}
      onConfirm={(amount) => {
        if (Number(amount) <= 0 || isNaN(Number(amount))) return;
        onWithdraw(amount);
        onDismissWithdraw();
      }}
      tokenName={bank.depositTokenName}
    />,
  );

  const [onPresentZap, onDissmissZap] = useModal(
    <ZapModal
      decimals={bank.depositToken.decimal}
      onConfirm={(zappingToken, tokenName, amount) => {
        if (Number(amount) <= 0 || isNaN(Number(amount))) return;
        onZap(zappingToken, tokenName, amount);
        onDissmissZap();
      }}
      tokenName={bank.depositTokenName}
    />,
  );

  const [onPresentDeposit, onDismissDeposit] = useModal(
    <DepositModal
      max={tokenBalance}
      decimals={bank.depositToken.decimal}
      onConfirm={(amount) => {
        if (Number(amount) <= 0 || isNaN(Number(amount))) return;
        onStake(amount);
        onDismissDeposit();
      }}
      tokenName={bank.depositTokenName}
    />,
  );

  const earnedInDollars = (Number(tokenPriceInDollars) * Number(getDisplayBalance(earnings))).toFixed(2);
  let depositToken = bank.depositTokenName.toUpperCase();
  if (depositToken === '80BOMB-20BTCB-LP') {
    depositToken = 'BOMB-MAXI';
  }
  if (depositToken === '80BSHARE-20WBNB-LP') {
    depositToken = 'BSHARE-MAXI';
  }
  return (
    <TableRow key="STAKED">
      <TableCell align="center">
        <h3>TVL</h3>
        <Typography>{statsOnPool?.TVL}%</Typography>
      </TableCell>
      <TableCell align="center">
        <h3>Daily Returns</h3>
        <Typography>{bank.closedForStaking ? '0.00' : statsOnPool?.dailyAPR}%</Typography>
      </TableCell>

      <TableCell>
        <Card>
          <CardContent>
            <StyledCardContentInner>
              <StyledCardHeader>
                <h3>Your Stake</h3>

                {getDisplayBalance(earnings)}
                <Typography style={{ textTransform: 'uppercase', color: '#fffff' }}>
                  {`≈ $${earnedInDollars}`}
                </Typography>
              </StyledCardHeader>
            </StyledCardContentInner>
          </CardContent>
        </Card>
      </TableCell>

      <TableCell>
        <Card>
          <CardContent>
            <StyledCardContentInner>
              <StyledCardHeader>
                <h3>Earned</h3>
                {getDisplayBalance(stakedBalance, bank.depositToken.decimal)}
                <Typography style={{ textTransform: 'uppercase', color: '#fffff' }}>
                  {`≈ $${earnedInDollarsStaked}`}
                </Typography>
              </StyledCardHeader>
            </StyledCardContentInner>
          </CardContent>
        </Card>
      </TableCell>
      <TableCell>
        <StyledCardActions>
          {approveStatus !== ApprovalState.APPROVED ? (
            <Button
              disabled={
                bank.closedForStaking ||
                approveStatus === ApprovalState.PENDING ||
                approveStatus === ApprovalState.UNKNOWN
              }
              onClick={approve}
              className={
                bank.closedForStaking ||
                approveStatus === ApprovalState.PENDING ||
                approveStatus === ApprovalState.UNKNOWN
                  ? 'shinyButtonDisabled'
                  : 'shinyButton'
              }
              style={{ marginTop: '20px' }}
            >
              {`Deposit ${bank.depositTokenName}`}
            </Button>
          ) : (
            <>
              <IconButton onClick={onPresentWithdraw}>
                <RemoveIcon />
              </IconButton>
              <StyledActionSpacer />
              <IconButton
                disabled={
                  bank.closedForStaking ||
                  bank.depositTokenName === 'BOMB-BSHARE-LP' ||
                  bank.depositTokenName === 'BOMB' ||
                  bank.depositTokenName === 'BOMB-BTCB-LP' ||
                  bank.depositTokenName === '80BOMB-20BTCB-LP' ||
                  bank.depositTokenName === '80BSHARE-20WBNB-LP' ||
                  bank.depositTokenName === 'BUSM-BUSD-LP' ||
                  bank.depositTokenName === 'BBOND'
                }
                onClick={() => (bank.closedForStaking ? null : onPresentZap())}
              >
                <FlashOnIcon style={{ color: themeColor.grey[400] }} />
              </IconButton>
              <StyledActionSpacer />
              <IconButton
                disabled={bank.closedForStaking}
                onClick={() => (bank.closedForStaking ? null : onPresentDeposit())}
              >
                <AddIcon />
              </IconButton>
            </>
          )}
        </StyledCardActions>
      </TableCell>
      <TableCell>
        <StyledCardActions>
          <Button
            onClick={onReward}
            disabled={earnings.eq(0)}
            className={earnings.eq(0) ? 'shinyButtonDisabled' : 'shinyButton'}
          >
            Claim Rewards
          </Button>
        </StyledCardActions>
      </TableCell>

      <TableCell>
        <Button
          onClick={onPresentWithdraw}
          disabled={stakedBalance.eq(0)}
          className={stakedBalance.eq(0) ? 'shinyButtonDisabled' : 'shinyButton'}
        >
          Claim &amp; Withdraw
        </Button>
      </TableCell>
    </TableRow>
  );
};

const StyledCardContentInner = styled.div`
  align-items: center;
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
`;
const StyledCardHeader = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
`;
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

export default FarmDetails;
