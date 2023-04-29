import React from 'react';
import styled from 'styled-components';

import {Button, Card} from '@material-ui/core';

// import Button from '../../../components/Button';
// import Card from '../../../components/Card';
import CardContent from '../../../components/CardContent';
import useBombFinance from '../../../hooks/useBombFinance';
import Label from '../../../components/Label';
import TokenSymbol from '../../../components/TokenSymbol';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faArrowRight} from '@fortawesome/free-solid-svg-icons';
import useModal from '../../../hooks/useModal';
import ExchangeModal from '../../Bond/components/ExchangeModal';
import ERC20 from '../../../bomb-finance/ERC20';
import useTokenBalance from '../../../hooks/useTokenBalance';
import useApprove, {ApprovalState} from '../../../hooks/useApprove';
import useCatchError from '../../../hooks/useCatchError';
import { useWallet } from "use-wallet";
import UnlockWallet from '../../../components/UnlockWallet';

interface ExchangeProps {
  action: string;
  fromToken: ERC20;
  fromTokenName: string;
  toToken: ERC20;
  toTokenName: string;
  priceDesc: string;
  onExchange: (amount: string) => void;
  disabled?: boolean;
  disabledDescription?: string;
  title?: string;
  btn?: string;
}

const Exchange: React.FC<ExchangeProps> = ({
  action,
  fromToken,
  fromTokenName,
  toToken,
  toTokenName,
  priceDesc,
  onExchange,
  disabled = false,
  disabledDescription,
  title,
  btn
}) => {
  const catchError = useCatchError();
  const {
    contracts: {Treasury},
  } = useBombFinance();
  const [approveStatus, approve] = useApprove(fromToken, Treasury.address);

  const {account} = useWallet();
  const balance = useTokenBalance(fromToken);
  const [onPresent, onDismiss] = useModal(
    <ExchangeModal
      title={action}
      description={priceDesc}
      max={balance}
      onConfirm={(value) => {
        onExchange(value);
        onDismiss();
      }}
      action={action}
      tokenName={fromTokenName}
    />,
  );
  return (
    <>
    {/* <Card> */}
     
        <StyledCardContentInner>
         
        <h3>{title}</h3> 
          {priceDesc}
         
            {!!account ? (
              <>
              {approveStatus !== ApprovalState.APPROVED && !disabled ? (
                <Button
                  className="shinyButton"
                  disabled={approveStatus === ApprovalState.PENDING || approveStatus === ApprovalState.UNKNOWN}
                  onClick={() => catchError(approve(), `Unable to approve ${fromTokenName}`)}
                >
                  {btn}
                </Button>
              ) : (
                <Button
                  className={disabled ? 'shinyButtonDisabled' : 'shinyButton'}
                  onClick={onPresent}
                  disabled={disabled}
                >
                  {disabledDescription || action}
                </Button>
              )}
              </>
            ) : (
              <UnlockWallet />
            )}
         
        </StyledCardContentInner>
     
    {/* </Card> */}
    </>
  );
};

const StyledCardTitle = styled.div`
  align-items: center;
  display: flex;
  font-size: 20px;
  font-weight: 700;
  height: 64px;
  justify-content: center;
  color: #f9d749;
  margin-top: ${(props) => -props.theme.spacing[3]}px;
`;

const StyledCardIcon = styled.div`
  background-color: ${(props) => props.theme.color.grey[900]};
  width: 72px;
  height: 72px;
  border-radius: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: ${(props) => props.theme.spacing[2]}px;
`;

const StyledExchanger = styled.div`
  align-items: center;
  display: flex;
  margin-bottom: ${(props) => props.theme.spacing[5]}px;
`;

const StyledExchangeArrow = styled.div`
  font-size: 20px;
  padding-left: ${(props) => props.theme.spacing[3]}px;
  padding-right: ${(props) => props.theme.spacing[3]}px;
  padding-bottom: ${(props) => props.theme.spacing[4]}px;
`;

const StyledToken = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  font-weight: 600;
`;

const StyledCardActions = styled.div`
  display: flex;
  justify-content: center;
  margin-top: ${(props) => props.theme.spacing[3]}px;
  width: 100%;
`;

const StyledDesc = styled.span``;

const StyledCardContentInner = styled.div`
  align-items: center;
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
`;

export default Exchange;
