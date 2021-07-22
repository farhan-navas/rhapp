import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom'

import styled from 'styled-components'
import LoadingSpin from '../../../components/LoadingSpin'
import PullToRefresh from 'pull-to-refresh-react'
import { OrderCard } from '../../../components/Supper/CustomCards/OrderCard'
import { InformationCard } from '../../../components/Supper/InformationCard'
import { DeleteOrderModal } from '../../../components/Supper/Modals/DeleteOrderModal'
import { LeaveGroupModal } from '../../../components/Supper/Modals/LeaveGroupModal'
import { SupperButton } from '../../../components/Supper/SupperButton'
import { SupperGroupCard } from '../../../components/Supper/SupperGroupCard'
import { updateOrderDetails } from '../../../store/supper/action'
import { Order, SupperGroup } from '../../../store/supper/types'
import { RootState } from '../../../store/types'
import { PATHS } from '../../Routes'
import { OrderContainer } from './OwnerView'
import { onRefresh } from '../../../common/reloadPage'

const ButtonContainer = styled.div`
  display: flex;
  margin: 40px 15px;
  justify-content: space-around;
`

const BottomContainer = styled.div`
  display: flex;
  flex-direction: column;
`

const InformationContainer = styled.div`
  margin: 0 0 25px 0;
`

type Props = {
  supperGroupIsOpen: boolean
  supperGroup: SupperGroup | null
  supperGroupIsCancelled: boolean
  order: Order | null
  deliveryFee: number
  totalFee: number
}

const UserView = (props: Props) => {
  const params = useParams<{ supperGroupId: string }>()
  const dispatch = useDispatch()
  const history = useHistory()
  const { isLoading } = useSelector((state: RootState) => state.supper)
  const [hasPaid, setHasPaid] = useState<boolean>(props.order?.hasPaid ?? false)
  const [deleteOrderModalIsOpen, setDeleteOrderModalIsOpen] = useState<boolean>(false)
  const [leaveGroupModalIsOpen, setLeaveGroupModalIsOpen] = useState<boolean>(false)

  const showBottomSection = () => {
    if (props.supperGroupIsOpen) {
      return (
        <>
          {props.order?.foodList && props.order.foodList.length > 0 && (
            <>
              <SupperButton
                ghost
                buttonWidth="160px"
                defaultButtonDescription="Delete Order"
                onButtonClick={() => setDeleteOrderModalIsOpen(true)}
              />
            </>
          )}
          <>
            <SupperButton
              buttonWidth="160px"
              defaultButtonDescription="Leave Group"
              onButtonClick={() => setLeaveGroupModalIsOpen(true)}
            />
          </>
        </>
      )
    } else if (props.supperGroupIsCancelled) {
      return (
        <>
          <BottomContainer>
            <InformationContainer>
              <InformationCard margin="0 15px 10px" cancelledSupperGroup />
            </InformationContainer>
            <SupperButton
              center
              defaultButtonDescription="Main Page"
              buttonWidth="200px"
              onButtonClick={() => history.push(`${PATHS.SUPPER_HOME}`)}
            />
          </BottomContainer>
        </>
      )
    } else {
      return (
        <SupperButton
          defaultButtonDescription="Mark Payment Complete"
          updatedButtonDescription="Payment Completed"
          buttonWidth="200px"
          onButtonClick={() => {
            setHasPaid(!hasPaid)
            props.order?.orderId && dispatch(updateOrderDetails(props.order?.orderId, { hasPaid: hasPaid }))
          }}
          isFlipButton
        />
      )
    }
  }

  return (
    <>
      {deleteOrderModalIsOpen && (
        <DeleteOrderModal
          isOwner={false}
          supperGroupId={params.supperGroupId}
          orderId={props.order?.orderId}
          onLeftButtonClick={() => history.push(`${PATHS.VIEW_ORDER}/${params.supperGroupId}`)}
          modalSetter={setDeleteOrderModalIsOpen}
        />
      )}
      {leaveGroupModalIsOpen && (
        <LeaveGroupModal
          suppergroupId={params.supperGroupId}
          onLeftButtonClick={() => history.push(`${PATHS.JOIN_ORDER}/${params.supperGroupId}`)}
          modalSetter={setLeaveGroupModalIsOpen}
        />
      )}
      {isLoading ? (
        <LoadingSpin />
      ) : (
        <PullToRefresh onRefresh={onRefresh}>
          <SupperGroupCard supperGroup={props.supperGroup} isHome={false} />
          <OrderContainer>
            <OrderCard
              supperGroup={props.supperGroup}
              ownerId={props.supperGroup?.ownerId}
              supperGroupStatus={props.supperGroup?.status}
              isEditable={props.supperGroupIsOpen}
              foodList={props.order?.foodList}
            />
          </OrderContainer>
          <ButtonContainer>{showBottomSection()}</ButtonContainer>
        </PullToRefresh>
      )}
    </>
  )
}

export default UserView
