import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// import { CookiesProvider } from "react-cookie";
// import { AuthProvider } from "./AuthProvider";
// import { GeneralUseProvider } from "./GeneralUse";
// import { GerenciadorProvider } from "./Gerenciador";

import { AuthProvider } from './AuthContext';
import { ThemeProvider } from './ThemeContext';

export default function Provider({ children }: { children: JSX.Element }) {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>{children}</AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
