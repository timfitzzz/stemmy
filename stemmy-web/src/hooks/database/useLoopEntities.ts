import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getLoop } from '../../store/loops/actions'
import {
  entitiesErrorSelector,
  entitiesLoadingSelector,
} from '../../helpers/selectors'
import { createDesiredEntitiesSelector } from '../../helpers/selectors'
import { LoopProps } from '../../types'
import { APIError } from '../../store/loops/types'

export interface IuseLoopEntities {
  loopIds: string[] | null
  count: number | null
}

export interface OuseLoopEntities {
  entities: LoopProps[]
  errors: APIError[]
}

export const useLoopEntities = ({ loopIds, count }: IuseLoopEntities) => {
  const dispatch = useDispatch()

  const loopSelector = useMemo(() => createDesiredEntitiesSelector(loopIds), [
    loopIds,
  ])

  const entities: LoopProps[] | null = useSelector(loopSelector)
  const entitiesLoading: string[] = useSelector(entitiesLoadingSelector)
  const entityErrors: APIError[] = useSelector(entitiesErrorSelector)

  const isEntityLoading = useMemo(
    () => (id: string) => {
      return !(entitiesLoading.indexOf(id) === -1)
    },
    [entitiesLoading]
  )

  const getEntityErrors = useMemo(
    () => (id: string) => entityErrors.filter(e => e.oid === id),
    [entityErrors]
  )

  useEffect(() => {
    if (
      loopIds &&
      count &&
      loopIds.length === count &&
      entities &&
      entities.length < count &&
      isEntityLoading
    ) {
      loopIds.forEach(id => {
        if (
          !isEntityLoading(id) &&
          getEntityErrors(id).length === 0 &&
          entities.filter(e => e.id === id).length === 0
        ) {
          dispatch(getLoop(id))
        }
      })
    }
  }, [loopIds, entityErrors])

  return {
    entities,
    errors: loopIds && entityErrors.filter(e => loopIds.indexOf(e.oid) > -1),
  }
}
