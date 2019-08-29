import styled from 'styled-components';

export const FlexboxCenter = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
`;

export const MaxWidthWrapper = styled.div`
    max-width: 1200px;
    margin: 0 auto;
`;
export const MaxWidthContent = styled(MaxWidthWrapper)`
    max-width: 660px;
`;