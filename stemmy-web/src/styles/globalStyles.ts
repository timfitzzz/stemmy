import { createGlobalStyle } from 'styled-components'
import mainTheme from './theme'

export default createGlobalStyle`
  body{
    -webkit-font-smoothing: antialiased;
    margin: 0;
    background: #FBFBFB; 
    color: ${mainTheme.palette.midPrimary};
  }

  h1 {
    color: ${mainTheme.palette.lightPrimary};
  }
`
