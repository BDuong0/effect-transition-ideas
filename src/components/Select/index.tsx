import { Dispatch, SetStateAction, useState } from "react";
import { VisibilityProvider } from "../../utils/VisibilityProvider";
import { SelectConsumer } from "./SelectConsumer";
import { SelectOptionType } from "../Select/data_types";

type SingleSelectContextDataType = {
  isMultiSelect: false;
  selectValue: SelectOptionType | undefined;
  setSelectFieldValue: (value: SelectOptionType) => void;
};

type MultiSelectContextDataType = {
  isMultiSelect: true;
  selectValue: SelectOptionType[];
  setSelectFieldValue: (value: SelectOptionType[]) => void;
};

type BaseContextDataType = {
  currentSelectedOptionIndex: number | undefined;
  setCurrentSelectedOptionIndex: Dispatch<SetStateAction<number | undefined>>;
};

// Use discriminated union so Typescript can know for sure the type that will be used during runtime
export type SelectContextDataType =
  | (SingleSelectContextDataType & BaseContextDataType)
  | (MultiSelectContextDataType & BaseContextDataType);

type SelectProviderProps = {
  isMultiSelect?: boolean;
  options: SelectOptionType[];
};

export const Select = ({
  options,
  isMultiSelect = false,
}: SelectProviderProps) => {
  const [selectfieldValue, setSelectFieldValue] = useState<SelectOptionType>();
  const [multiselectfieldValue, setMultiSelectFieldValue] = useState<
    SelectOptionType[]
  >([options[0]]);
  // If rendering out a single select, selectfieldValue should be a single variable with the typing as SelectOptionType
  // If rendering out a multi select, selectfieldValue should be an array of SelectOptionType
  const [currentSelectedOptionIndex, setCurrentSelectedOptionIndex] = useState<
    number | undefined
  >(undefined);

  const SelectContextData: SelectContextDataType = isMultiSelect
    ? {
        // Thank you https://stackoverflow.com/questions/11704267/in-javascript-how-to-conditionally-add-a-member-to-an-object
        isMultiSelect,
        selectValue: multiselectfieldValue,
        setSelectFieldValue: setMultiSelectFieldValue,
        currentSelectedOptionIndex,
        setCurrentSelectedOptionIndex,
      }
    : {
        isMultiSelect,
        selectValue: selectfieldValue,
        setSelectFieldValue: setSelectFieldValue,
        currentSelectedOptionIndex,
        setCurrentSelectedOptionIndex,
      };

  return (
    <VisibilityProvider eventType="onClick" contextData={SelectContextData}>
      <SelectConsumer options={options}></SelectConsumer>
    </VisibilityProvider>
  );
};
