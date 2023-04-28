import React, {useMemo} from 'react';
import styled from 'styled-components';

import {Box, Button, Card, CardContent, Typography,  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,} from '@material-ui/core';

import {AddIcon, RemoveIcon} from '../../../components/icons';
import IconButton from '../../../components/IconButton';
import Label from '../../../components/Label';
import Value from '../../../components/Value';


import useApprove, {ApprovalState} from '../../../hooks/useApprove';
import useModal from '../../../hooks/useModal';
import useTokenBalance from '../../../hooks/useTokenBalance';
import useWithdrawCheck from '../../../hooks/boardroom/useWithdrawCheck';

import {getDisplayBalance} from '../../../utils/formatBalance';

import DepositModal from '../../Boardroom/components/DepositModal';
import WithdrawModal from '../../Boardroom/components/WithdrawModal';
import useBombFinance from '../../../hooks/useBombFinance';

import useStakedBalanceOnBoardroom from '../../../hooks/useStakedBalanceOnBoardroom';
import useStakedTokenPriceInDollars from '../../../hooks/useStakedTokenPriceInDollars';


import useStakeToBoardroom from '../../../hooks/useStakeToBoardroom';
import useWithdrawFromBoardroom from '../../../hooks/useWithdrawFromBoardroom';
import usebShareStats from '../../../hooks/usebShareStats';
import useTotalStakedOnBoardroom from '../../../hooks/useTotalStakedOnBoardroom';
import useFetchBoardroomAPR from '../../../hooks/useFetchBoardroomAPR';
import useEarningsOnBoardroom from '../../../hooks/useEarningsOnBoardroom';
import useBombStats from '../../../hooks/useBombStats';
import useHarvestFromBoardroom from '../../../hooks/useHarvestFromBoardroom';
import useClaimRewardCheck from '../../../hooks/boardroom/useClaimRewardCheck';


const Boardroom: React.FC = () => {
  const bombFinance = useBombFinance();
  const [approveStatus, approve] = useApprove(bombFinance.BSHARE, bombFinance.contracts.Boardroom.address);

  const tokenBalance = useTokenBalance(bombFinance.BSHARE);
  const stakedBalance = useStakedBalanceOnBoardroom();

  const bSharestaked = useTotalStakedOnBoardroom();
  const bShareStats = usebShareStats();
  const boardroom_APR = useFetchBoardroomAPR();
  const earnings = useEarningsOnBoardroom();
  const bombStats = useBombStats();
  const {onReward} = useHarvestFromBoardroom();
  const canClaimReward = useClaimRewardCheck();

  const tokenPriceInDollarsEarned = useMemo(
    () => (bombStats ? Number(bombStats.priceInDollars).toFixed(2) : null),
    [bombStats],
  );
  const earnedInDollars = (Number(tokenPriceInDollarsEarned) * Number(getDisplayBalance(earnings))).toFixed(2);

  const stakedTokenPriceInDollars = useStakedTokenPriceInDollars('BSHARE', bombFinance.BSHARE);
  const tokenPriceInDollars = useMemo(
    () =>
      stakedTokenPriceInDollars
        ? (Number(stakedTokenPriceInDollars) * Number(getDisplayBalance(stakedBalance))).toFixed(2).toString()
        : null,
    [stakedTokenPriceInDollars, stakedBalance],
  );
  const boardRoomTVL = useMemo(
    () =>
      bSharestaked && bShareStats
        ? (Number(getDisplayBalance(bSharestaked))* Number(bShareStats.priceInDollars)).toFixed(2).toString()
        : null,
    [bShareStats, bSharestaked],
  );
  const boardroomAPR = useMemo(() => (boardroom_APR ? (boardroom_APR / 365).toFixed(2) : null), [boardroom_APR]);
  // const isOldBoardroomMember = boardroomVersion !== 'latest';

  const {onStake} = useStakeToBoardroom();
  const {onWithdraw} = useWithdrawFromBoardroom();
  const canWithdrawFromBoardroom = useWithdrawCheck();

  const [onPresentDeposit, onDismissDeposit] = useModal(
    <DepositModal
      max={tokenBalance}
      onConfirm={(value) => {
        onStake(value);
        onDismissDeposit();
      }}
      tokenName={'BShare'}
    />,
  );

  const [onPresentWithdraw, onDismissWithdraw] = useModal(
    <WithdrawModal
      max={stakedBalance}
      onConfirm={(value) => {
        onWithdraw(value);
        onDismissWithdraw();
      }}
      tokenName={'BShare'}
    />,
  );

  return (
    <Box>
    <Card>
        <CardContent >
          <h2>Board Room</h2>
          Stake BSHARE amd earn BOMB every epoch
          <Box mt={2}>
            <Typography>TVL : $ {boardRoomTVL}</Typography>
            <Typography>Total Staked: {getDisplayBalance(bSharestaked)}</Typography>
            <Typography>Daily returns : {boardroomAPR}%</Typography>
          </Box>
          <TableContainer component={Paper}>
            <Table aria-label="simple table">
              
              
              <TableBody>
                <TableRow key="STAKED" >
                  <TableCell align="center">
                    <h3>Your Stake</h3>
                     <Value value={getDisplayBalance(stakedBalance)} />
               <Label text={`≈ $${tokenPriceInDollars}`} variant="yellow" />
              <Label text={'BSHARE Staked'} variant="yellow" /></TableCell>

              <TableCell align="center">
              <h3>Earned</h3><Value value={getDisplayBalance(earnings)} />
              <Label text={`≈ $${earnedInDollars}`} variant="yellow" />
              <Label text="BOMB Earned" variant="yellow" /></TableCell>

              <TableCell><StyledCardActions>
               {approveStatus !== ApprovalState.APPROVED ? (
                 <Button
                   disabled={approveStatus !== ApprovalState.NOT_APPROVED}
                   className={approveStatus === ApprovalState.NOT_APPROVED ? 'shinyButton' : 'shinyButtonDisabled'}
                   style={{marginTop: '20px'}}
                   onClick={approve}
                 >
                   Deposit BSHARE
                 </Button>
               ) : (
                 <>
                   <IconButton disabled={!canWithdrawFromBoardroom} onClick={onPresentWithdraw}>
                     <RemoveIcon color={!canWithdrawFromBoardroom ? '' : 'yellow'} />
                   </IconButton>
                   <StyledActionSpacer />
                   <IconButton onClick={onPresentDeposit}>
                     <AddIcon color={!canWithdrawFromBoardroom ? '' : 'yellow'} />
                   </IconButton>
                 </>
               )}
             </StyledCardActions></TableCell>

             <TableCell><StyledCardActions>
              <Button
                onClick={onReward}
                className={earnings.eq(0) || !canClaimReward ? 'shinyButtonDisabled' : 'shinyButton'}
                disabled={earnings.eq(0) || !canClaimReward}
              >
                Claim Reward
              </Button>
            </StyledCardActions></TableCell>

            <TableCell><Button
                disabled={stakedBalance.eq(0) || (!canWithdrawFromBoardroom)}
                onClick={onPresentWithdraw}
                className={
                  stakedBalance.eq(0) || (!canWithdrawFromBoardroom)
                    ? 'shinyButtonDisabledSecondary'
                    : 'shinyButtonSecondary'
                }
              >
                Withdraw
              </Button></TableCell>
                  
                </TableRow>
              </TableBody>

              

              
              
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
      </Box>
    
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

export default Boardroom;
