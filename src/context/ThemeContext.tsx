import { THEME_KEY } from "@/constants/theme";
import {
  createContext,
  Dispatch,
  FC,
  ReactNode,
  SetStateAction,
  useEffect,
  useState,
} from "react";

export interface ThemeContextData {
  theme: boolean;
  setTheme: Dispatch<SetStateAction<boolean>>;
}

export const ThemeContext = createContext<
  ThemeContextData | undefined
>(undefined);

interface ThemeProps {
  children: ReactNode;
}

export const ThemeProvider: FC<ThemeProps> = ({ children }) => {


  const [theme, setTheme] = useState(
    localStorage.getItem(THEME_KEY) === "light"
  );

  useEffect(() => {
    const theme = localStorage.getItem(THEME_KEY);
    document.body.className = theme ?? "dark";
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};


