// components/ToggleSwitch.tsx
import { useShareToggle } from "../../hooks/useShareToggle";

interface ToggleSwitchProps {
   // Server-synced mode (for cards)
   type?: "brain" | "piece";
   contentId?: string;
   // Controlled mode (for forms)
   isOn?: boolean;
   onToggle?: (value: boolean) => void;
   disabled?: boolean;
   // New props for variants and sizes
   variant?: "default" | "success" | "danger" | "warning" | "info";
   size?: "sm" | "md" | "lg";
}

const ToggleSwitch = ({
   type,
   contentId,
   isOn: controlledIsOn,
   onToggle,
   disabled = false,
   variant = "default",
   size = "md",
}: ToggleSwitchProps) => {
   // Check if we're in controlled mode (form) or server-synced mode (card)
   const isControlled = onToggle !== undefined;

   // Only use server-sync hook if NOT controlled
   const serverSync =
      !isControlled && type
         ? useShareToggle(type, contentId)
         : { isSharing: false, isMutating: false, handleToggle: () => {} };

   // Determine what values to use
   const isOn = isControlled ? controlledIsOn : serverSync.isSharing;
   const isMutating = isControlled ? false : serverSync.isMutating;
   const isDisabled = disabled || isMutating;

   // Handle click based on mode
   const handleClick = () => {
      if (isDisabled) return;

      if (isControlled) {
         // Form mode - just call the function
         onToggle(!controlledIsOn);
      } else {
         // Server-synced mode - call API
         serverSync.handleToggle();
      }
   };

   // Size configurations
   const sizeConfig = {
      sm: {
         container: "w-11 h-6",
         knob: "w-4 h-4",
         translate: "translate-x-5",
      },
      md: {
         container: "w-16 h-9",
         knob: "w-7 h-7",
         translate: "translate-x-7",
      },
      lg: {
         container: "w-20 h-11",
         knob: "w-9 h-9",
         translate: "translate-x-9",
      },
   };

   // Variant configurations (active state colors)
   const variantConfig = {
      default: {
         light: "bg-indigo-500 shadow-[0_4px_12px_rgba(99,102,241,0.45)]",
         dark: "dark:bg-indigo-600 dark:shadow-[0_4px_12px_rgba(99,102,241,0.35)]",
      },
      success: {
         light: "bg-green-500 shadow-[0_4px_12px_rgba(34,197,94,0.45)]",
         dark: "dark:bg-green-600 dark:shadow-[0_4px_12px_rgba(34,197,94,0.35)]",
      },
      danger: {
         light: "bg-red-500 shadow-[0_4px_12px_rgba(239,68,68,0.45)]",
         dark: "dark:bg-red-600 dark:shadow-[0_4px_12px_rgba(239,68,68,0.35)]",
      },
      warning: {
         light: "bg-amber-500 shadow-[0_4px_12px_rgba(245,158,11,0.45)]",
         dark: "dark:bg-amber-600 dark:shadow-[0_4px_12px_rgba(245,158,11,0.35)]",
      },
      info: {
         light: "bg-blue-500 shadow-[0_4px_12px_rgba(59,130,246,0.45)]",
         dark: "dark:bg-blue-600 dark:shadow-[0_4px_12px_rgba(59,130,246,0.35)]",
      },
   };

   const currentSize = sizeConfig[size];
   const currentVariant = variantConfig[variant];

   return (
      <div
         onClick={handleClick}
         className={`
           relative ${currentSize.container} rounded-full p-1
           flex items-center
           transition-colors duration-300 ease-in-out
           ${isDisabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}
           ${
              isOn
                 ? `${currentVariant.light} ${currentVariant.dark}`
                 : "bg-zinc-300 dark:bg-zinc-700 shadow-inner"
           }
         `}
      >
         <div
            className={`
              ${currentSize.knob} rounded-full
              bg-white dark:bg-zinc-100
              shadow-[0_2px_6px_rgba(0,0,0,0.25)]
              transition-transform duration-300 ease-in-out
              ${isOn ? currentSize.translate : "translate-x-0"}
            `}
         />
      </div>
   );
};

export default ToggleSwitch;
