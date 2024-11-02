import { cn } from "@/lib/utils";
import { InputMask } from "@react-input/mask";
import { Eye, EyeOff } from "lucide-react";
import {
  forwardRef,
  InputHTMLAttributes,
  Ref,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

type MaskTypes =
  | "(__) ____-____"
  | "(__) _____-____"
  | "___.___.___-__"
  | "__.___.___/____-__"
  | "_____-___"
  | "__/__/____";

export type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  labelClassName?: string;
  isInvalid?: boolean;
  errorMessage?: string;
  errorClassName?: string;
  mask?: MaskTypes;
  markAsRequired?: boolean;
  leftIcon?: React.ReactNode;
};

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      id,
      labelClassName,
      errorMessage,
      className,
      isInvalid,
      type,
      mask,
      markAsRequired,
      leftIcon,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const internalRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => internalRef.current as HTMLInputElement);

    const togglePasswordVisibility = () => {
      setShowPassword((prev) => !prev);
    };

    const inputType = type === "password" && showPassword ? "text" : type;

    const inputClassName = cn(
      "flex h-12 w-full rounded-md border border-input bg-background text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-900 focus-visible:ring-offset-2 focus-visible:border-0 disabled:cursor-not-allowed disabled:opacity-50 transition-all",
      leftIcon && "pl-10", // Adiciona padding-left quando há um leftIcon
      !leftIcon && "px-3", // Mantém padding padrão quando não há leftIcon
      (isInvalid || errorMessage) &&
      "border-red-600 focus-visible:ring-red-600 focus-visible:ring-offset-2 focus-visible:border-0",
      className
    );

    return (
      <div className="flex flex-col space-y-1">
        {label && (
          <label
            htmlFor={id}
            className={cn("text-sm font-medium", labelClassName)}
          >
            {label}{" "}
            {markAsRequired && (
              <span className="text-red-600" aria-hidden="true">
                *
              </span>
            )}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              {leftIcon}
            </div>
          )}

          {mask ? (
            <InputMask
              id={id}
              mask={mask}
              replacement={"_"}
              type={inputType}
              className={inputClassName}
              ref={internalRef as Ref<never>}
              {...props}
            />
          ) : (
            <input
              id={id}
              type={inputType}
              className={inputClassName}
              ref={internalRef}
              {...props}
            />
          )}
          {type === "password" && (
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute inset-y-0 right-0 flex items-center pr-3 focus:outline-none"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5 text-gray-500" />
              ) : (
                <Eye className="h-5 w-5 text-gray-500" />
              )}
            </button>
          )}
        </div>
        {errorMessage && (
          <p className={cn("text-sm text-red-600", errorMessage)}>
            {errorMessage}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
