export function stringifyBPM(bpm: number): string {
  const splitDecimal = bpm.toString().split('.')

  switch (splitDecimal.length) {
    case 1:
      return bpm.toString() + '.00'
      break
    case 2:
      if (splitDecimal[1].length === 1) {
        return bpm.toString() + '0'
      } else {
        return bpm.toString()
      }
      break
    default:
      return bpm.toString()
      break
  }
}
