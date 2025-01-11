import { HTMLAttributes, ReactNode } from "react";
import { useVisibilityContext } from "../../utils/VisibilityProvider";
import { SelectContextDataType } from "./index";
import { SelectOptionType } from "./data_types";

interface SelectOptionProps extends HTMLAttributes<HTMLElement> {
  option: SelectOptionType;
  selectoptionindex: number;
  children?: ReactNode;
}

export function SelectOption({
  option,
  selectoptionindex,
  children,
  ...rest
}: SelectOptionProps) {
  const { setIsToggled, contextData } =
    useVisibilityContext<SelectContextDataType>();
  const {
    isMultiSelect,
    selectValue,
    setSelectFieldValue,
    currentSelectedOptionIndex,
    setCurrentSelectedOptionIndex,
  } = contextData;

  function optionSetSelectFieldValue() {
    console.log("optionSetSelectFieldValue");

    if (isMultiSelect == false) {
      if (option !== selectValue) {
        // Minor performance issue
        setSelectFieldValue(option); // Change select value
        setCurrentSelectedOptionIndex(selectoptionindex);
      }
    }

    setIsToggled(); // close menu
  }

  const handleOptionOnClick = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    optionSetSelectFieldValue();
  };

  const handleOptionOnEnterKey = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.key !== "Enter") return;

    console.log("You hit enter key");
    optionSetSelectFieldValue();
    // focus select option
  };

  function isOptionSelected() {
    return currentSelectedOptionIndex === selectoptionindex;
  }

  return (
    <li
      role="option"
      tabIndex={0}
      className={`cursor-pointer rounded-md border pl-1 pr-4 transition hover:bg-primary-hover ${isOptionSelected() ? "bg-red-300" : "bg-primary"}`}
      onClick={handleOptionOnClick}
      onKeyDown={(e) => {
        handleOptionOnEnterKey(e);
      }}
      aria-selected={isOptionSelected() ? true : false}
      {...rest}
    >
      <span>
        {option.label} {children}
      </span>
    </li>
  );
}
