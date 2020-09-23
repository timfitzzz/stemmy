export interface ITheme {
  palette: {
    darkPrimary: string
    primary: string
    midPrimary: string
    lightPrimary: string
    black: string
    white: string
  }
  spacing: {
    unit: number
  }
  global: {
    [key: string]: any
  }
}

const mainTheme = {
  palette: {
    darkPrimary: '#0f370e',
    lightPrimary: '#9bbc0e',
    midPrimary: '#8bad0d',
    primary: '#30622f',
    white: '#FFFFFF',
  },
  spacing: {
    unit: 8,
  },
  global: {
    spacing: 8,
    colors: {
      darkPrimary: '#0F370E',
      lightPrimary: '#9BBC0E',
      midPrimary: '#8BAD0D',
      primary: '#30622F',
      white: '#FFFFFF',
    },
  },
  rangeInput: {
    track: {
      color: 'brand',
      opacity: 1,
      lower: {
        color: 'brand',
      },
    },
  },
}

export default mainTheme
