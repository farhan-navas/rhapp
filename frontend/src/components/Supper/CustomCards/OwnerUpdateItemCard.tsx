import React, { useEffect } from 'react'
import { FieldError, useForm } from 'react-hook-form'

import styled from 'styled-components'
import { ErrorText } from '../../../routes/Supper/CreateSupperGroup'
import { Food, SupperGroup } from '../../../store/supper/types'
import { FormHeader } from '../FormHeader'
import { MainCard } from '../MainCard'
import { SupperButton } from '../SupperButton'

const Input = styled.input<{ error?: FieldError | undefined }>`
  width: 100%;
  border-radius: 10px;
  border: 1px solid #d9d9d9;
  padding: 5px 10px;
  margin: 5px auto 0 auto;
  height: 35px;
  ${(props) => props.error && 'borderColor: red; background:#ffd1d1;'}
`

const TextArea = styled.textarea<{ error?: FieldError | undefined }>`
  width: 100%;
  border-radius: 10px;
  border: 1px solid #d9d9d9;
  padding: 5px 10px;
  margin: 5px auto 0 auto;
  height: fit-content;
  ${(props) => props.error && 'borderColor: red; background:#ffd1d1;'}

  ::placeholder {
    line-height: 18px;
  }
`

type Props = {
  foodItem?: boolean
  deliveryFee?: boolean
  food?: Food
  supperGroup?: SupperGroup
  hasTouchedSetter: React.Dispatch<React.SetStateAction<boolean>>
}

type FormData = {
  changes: string | undefined
  newPrice: number
  editReason: string
  newDeliveryFee: number
}

export const OwnerUpdateItemCard = (props: Props) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    errors,
    formState: { touched },
  } = useForm<FormData>({
    shouldUnregister: false,
  })

  useEffect(() => {
    if (props.foodItem) {
      reset({
        changes: props.food?.updates?.change,
        newPrice: props.food?.updates?.updatedPrice,
        editReason: props.food?.updates?.reason,
      })
    }
    if (props.deliveryFee) {
      reset({
        newDeliveryFee: props.supperGroup?.additionalCost,
      })
    }
  }, [reset, props.food, props.supperGroup])

  useEffect(() => {
    props.hasTouchedSetter(Object.values(touched).length ? true : false)
  }, [touched])

  const onUpdateItemClick = () => {
    if (!watch('newPrice')) {
      setValue('newPrice', props.food?.updates?.updatedPrice ?? props.food?.foodPrice ?? 0)
    }
    console.log(errors, watch())
    handleSubmit((data) => {
      console.log('onUpdateItemClick', data)
      return
    })()
  }

  const onDeleteItemClick = () => {
    setValue('newPrice', 0)
    handleSubmit((data) => {
      console.log('onDeleteItemClick', data)
      return
    })()
  }

  const onUpdateDeliveryClick = () => {
    handleSubmit((data) => {
      console.log('onUpdateDeliveryClick', data)
      return
    })()
  }

  return (
    <MainCard flexDirection="column" padding="1.5rem 2rem !important" minHeight="fit-content">
      <>
        {props.foodItem && (
          <>
            <FormHeader headerName="What changed?" />
            <Input
              type="text"
              defaultValue={''}
              placeholder="List changes here"
              name="changes"
              ref={register({
                required: false,
              })}
            />
            <FormHeader headerName="New Price" topMargin />
            <Input
              type="number"
              placeholder="Indicate new price"
              name="newPrice"
              defaultValue={''}
              ref={register({
                required: false,
                valueAsNumber: true,
                min: 0,
              })}
            />
            {errors.newPrice?.type === 'min' && <ErrorText>Invalid price!</ErrorText>}
            <FormHeader headerName="Reason for edit" isCompulsory topMargin />
            <TextArea
              defaultValue={''}
              placeholder="e.g. Price different on app, sides unavailable, etc.."
              name="editReason"
              ref={register({
                required: false,
                ...(props.foodItem && { validate: (input) => input.trim().length !== 0 }),
              })}
              error={errors.editReason}
            />
            {errors.editReason?.type === 'required' && <ErrorText>Reason required!</ErrorText>}
            {errors.editReason?.type === 'validate' && <ErrorText>Invalid reason!</ErrorText>}
            <SupperButton
              htmlType="submit"
              onButtonClick={onDeleteItemClick}
              defaultButtonDescription="Delete Item"
              ghost
              buttonWidth="100%"
              style={{ margin: '2rem 0 0.5rem 0' }}
            />
            <SupperButton
              htmlType="submit"
              onButtonClick={onUpdateItemClick}
              defaultButtonDescription="Update Item"
              buttonWidth="100%"
              style={{ margin: '1rem 0 0 0' }}
            />
          </>
        )}
        {props.deliveryFee && (
          <>
            <FormHeader headerName="Delivery Fee" isCompulsory />
            <Input
              type="number"
              placeholder="Indicate new delivery fee"
              name="newDeliveryFee"
              defaultValue={''}
              ref={register({
                required: true,
                ...(props.deliveryFee && { validate: (input) => input.trim().length !== 0 }),
                valueAsNumber: true,
                min: 0,
              })}
              error={errors.newDeliveryFee}
            />
            {errors.newDeliveryFee?.type === 'required' && <ErrorText>Delivery fee required!</ErrorText>}
            {(errors.newDeliveryFee?.type === 'min' || errors.newDeliveryFee?.type === 'validate') && (
              <ErrorText>Invalid delivery fee!</ErrorText>
            )}
            <SupperButton
              htmlType="submit"
              onButtonClick={onUpdateDeliveryClick}
              defaultButtonDescription="Update"
              buttonWidth="100%"
              style={{ margin: '2rem 0 0 0' }}
            />
          </>
        )}
      </>
    </MainCard>
  )
}
