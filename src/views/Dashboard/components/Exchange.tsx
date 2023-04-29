import React from 'react';
import styled from 'styled-components';

import {Button} from '@material-ui/core';


import useBombFinance from '../../../hooks/useBombFinance';

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
     
    </>
  );
};

const StyledCardContentInner = styled.div`
  align-items: center;
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
`;

export default Exchange;
