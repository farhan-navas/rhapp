import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom'
import styled from 'styled-components'

import TopNavBar from '../../../components/Mobile/TopNavBar'
import PullToRefresh from 'pull-to-refresh-react'
import { RootState } from '../../../store/types'
import LoadingSpin from '../../../components/LoadingSpin'
import { PATHS } from '../../Routes'
import { V1_BACKGROUND } from '../../../common/colours'
import { InformationCard } from '../../../components/Supper/InformationCard'
import { SupperButton } from '../../../components/Supper/SupperButton'
import { OrderCard } from '../../../components/Supper/CustomCards/OrderCard'
import { SupperGroupStatus } from '../../../store/supper/types'
import { TwoStepCancelGroupModal } from '../../../components/Supper/Modals/TwoStepCancelGroupModal'
import { updateSupperGroup } from '../../../store/supper/action/level1/putRequests'
import { getOrderSummaryPageDetails } from '../../../store/supper/action/level2'
import { onRefresh } from '../../../common/reloadPage'

const MainContainer = styled.div`
  width: 100vw;
  height: 100%;
  min-height: 100vh;
  background-color: ${V1_BACKGROUND};
  display: flex;
  flex-direction: column;
`

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 90vw;
  margin: 2rem auto 0.5rem auto;
`

const OrderSummary = () => {
  const dispatch = useDispatch()
  const history = useHistory()
  const params = useParams<{ supperGroupId: string }>()
  const { collatedOrder, isLoading, supperGroup } = useSelector((state: RootState) => state.supper)
  const [twoStepModalIsOpen, setTwoStepModalIsOpen] = useState<boolean>(false)

  useEffect(() => {
    dispatch(getOrderSummaryPageDetails(params.supperGroupId))
  }, [dispatch])

  useEffect(() => {
    if (supperGroup?.status === SupperGroupStatus.CANCELLED) {
      history.replace(`${PATHS.VIEW_ORDER}/${params.supperGroupId}`)
    }
  }, [supperGroup?.status])

  const onClick = () => {
    dispatch(updateSupperGroup(params.supperGroupId, { status: SupperGroupStatus.ORDERED }))
    history.replace(`${PATHS.SUPPER_HOME}`)
    history.push(`${PATHS.VIEW_ORDER}/${params.supperGroupId}`)
  }

  return (
    <MainContainer>
      <PullToRefresh onRefresh={onRefresh}>
        <TopNavBar title="Order Summary" />
        {isLoading ? (
          <LoadingSpin />
        ) : (
          <>
            {twoStepModalIsOpen && (
              <TwoStepCancelGroupModal
                modalSetter={setTwoStepModalIsOpen}
                supperGroupId={params.supperGroupId}
                onLeftButtonClick={() => {
                  history.replace(PATHS.SUPPER_HOME)
                  history.push(`${PATHS.VIEW_ORDER}/${params.supperGroupId}`)
                }}
              />
            )}
            <OrderCard
              margin="0 23px"
              collatedOrder={collatedOrder}
              ownerId={supperGroup?.ownerId}
              supperGroupStatus={supperGroup?.status}
              splitCostMethod={supperGroup?.splitAdditionalCost}
              supperGroup={supperGroup}
              supperTotalCost={supperGroup?.totalPrice}
              isEditable
            />
            <ButtonContainer>
              <SupperButton
                ghost
                center
                defaultButtonDescription="Order Cancelled"
                onButtonClick={() => setTwoStepModalIsOpen(true)}
              />
              <SupperButton center defaultButtonDescription="Order Placed" onButtonClick={onClick} />
            </ButtonContainer>
            <InformationCard updateSummary />
          </>
        )}
      </PullToRefresh>
    </MainContainer>
  )
}

export default OrderSummary
