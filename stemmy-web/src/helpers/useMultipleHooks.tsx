import { valueToObjectRepresentation } from '@apollo/client/utilities'
import React, { useEffect } from 'react'
import { idText } from 'typescript'
import { useTrack } from './'

type hookArgs = { arg: string; value: (value: any) => any; iterator: any[] }[]

interface IuseMultipleHooks {
  hook: any
  args: hookArgs
}

export function useMultipleHooks(
  { hook, args }: IuseMultipleHooks,
  hookCount: number | null | undefined,
  dependencies: any[] | null
): any {
  let hookOuts: any[] = []

  console.log(
    'use multiple hooks: active: ',
    dependencies &&
      !(
        dependencies ||
        !dependencies.filter(arg => !arg) ||
        hookCount == null ||
        typeof hookCount == 'undefined'
      )
  )
  console.log('dependencies ', dependencies)
  console.log('hookCount ', hookCount)
  console.log('typeof hookCount ', typeof hookCount)

  if (
    dependencies &&
    !(
      dependencies.filter(d => !d).length > 0 ||
      hookCount == null ||
      typeof hookCount == 'undefined'
    )
  ) {
    for (let i = 0; i === hookCount; i++) {
      hookOuts[i] = hook({
        ...args.map((arg, i) => {
          return { [arg.arg]: arg.value(arg.iterator[i]) }
        }),
      })
    }
  }

  console.log(hookOuts)

  return hookOuts
}

// let trackIds: string[] = ['2131233123', '12323424', '1231232314']

// let tracks = useMultipleHooks(
//   {
//     hook: useTrack,
//     args: [
//       {
//         arg: 'id',
//         value: input => input,
//         iterator: trackIds,
//       },
//       {
//         arg: 'player',
//         value: iterator => true,
//         iterator: trackIds,
//       },
//     ],
//   },
//   trackIds.length,
//   [trackIds]
// )
