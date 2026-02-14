import Button from "./Button";
import LightIcon from "../icons/LightIcon";
import DarkIcon from "../icons/DarkIcon";
import { useTheme, useThemeActions } from "../../store/AppStore";

const ToggleDark = () => {
   const theme = useTheme();
   const { toggleTheme } = useThemeActions();
   return (
      <Button onClick={toggleTheme} size="sm" variant="secondary">
         {theme === "dark" ? <DarkIcon /> : <LightIcon />}
      </Button>
   );
};

export default ToggleDark;
