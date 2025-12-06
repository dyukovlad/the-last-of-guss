import { Container, Box } from '@mui/material';

interface PageWrapperProps {
  children: React.ReactNode;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
}

export const PageWrapper = ({
  children,
  maxWidth = 'md',
}: PageWrapperProps) => (
  <Container maxWidth={maxWidth}>
    <Box py={4}>{children}</Box>
  </Container>
);
