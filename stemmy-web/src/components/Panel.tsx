import styled from 'styled-components';

export const PanelWrapper = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
`

export const Panel = styled.div`
  display: flex;
  width: 100%;
  border: 3px solid ${p => p.theme.palette.lightPrimary};
  border-radius: 20px;
  position: relative;
  align-items: stretch;
  height: 100%;
`
export default Panel