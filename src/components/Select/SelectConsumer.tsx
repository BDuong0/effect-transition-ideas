import {
  VisibilityProvider,
  useVisibilityContext,
} from "../../utils/VisibilityProvider";
import { SelectOption } from "./SelectOption";
import { SelectOptionType } from "./data_types";
import { KeyboardEvent, MouseEvent, useEffect, useRef } from "react";
import ClearButton from "./ClearButton";
import { SelectContextDataType } from ".";
import { DropdownIcon } from "../../assets/mingcute--down-fill";

type SelectProps = {
  options: SelectOptionType[];
};

const selectfield_label = "labelselectfield";
const element_selectfield_controls = "selectmainmenu";

export function SelectConsumer({ options }: SelectProps) {
  const { isToggled, setIsToggled, contextData } =
    useVisibilityContext<SelectContextDataType>();
  const {
    isMultiSelect,
    selectValue,
    currentSelectedOptionIndex,
    setCurrentSelectedOptionIndex,
  } = contextData;

  const selectwrapperRef = useRef<HTMLDivElement>(null);
  const selectfieldRef = useRef<HTMLButtonElement | null>(null);
  const parentmenuRef = useRef<HTMLUListElement | null>(null);

  const parentmenuOptions = useRef<HTMLCollection | null>(null);
  const currentSelectedMenuOption = useRef<HTMLElement | null>(null);

  // React 18 useEffect ran twice workaround thanks to Dave Gray's video https://www.youtube.com/watch?v=81faZzp18NM
  const is_useEffect_ran_once = useRef(false);
  useEffect(() => {
    if (is_useEffect_ran_once.current === false) {
      // Set the width of the selectfield the same width as the parentmenu
      initalizeSelectFieldWidth();
    }

    return () => {
      is_useEffect_ran_once.current = true;
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function initalizeSelectFieldWidth() {
    // On the first render, set the selectfield's width so it matches the width of the parent select menu
    // Behaves like a native HTML select, where the selectfield's width is the width of the longest item in the parent menu

    // Step 1: Record CSS property values for an element I want to be hidden
    setIsToggled(true); // Step 1.a: Make parentmenu visible in the DOM

    // Step 1.b Record the parentmenu's position property current value so we can revert back to it later
    let parentmenu_position_to_reset_to: string = "";

    // Step 1.c Set temporary position and opacity styles on the parentmenu
    if (parentmenuRef.current) {
      parentmenu_position_to_reset_to = parentmenuRef.current.style.position;

      parentmenuRef.current.style.opacity = "0"; // Step 1.d Element is visible in DOM, but not to user

      // Step 1.e Make sure element does not displace other elements on the screen
      parentmenuRef.current.style.position = "absolute";
      parentmenuRef.current.style.left = "-3000px";
    }

    // Step 2: Set the selectfield's width the same as the parentmenu's width
    let parentmenuWidth: number | undefined = 0;
    setTimeout(() => {
      parentmenuWidth = parentmenuRef.current?.getBoundingClientRect().width;

      if (selectfieldRef.current) {
        selectfieldRef.current.style.width = parentmenuWidth + "px";
      }

      // Step 3: Reset parentmenu's position and opacity styles to how it was before
      if (parentmenuRef.current) {
        parentmenuRef.current.style.opacity = "1";
        parentmenuRef.current.style.position = parentmenu_position_to_reset_to;
        parentmenuRef.current.style.left = "";
        setIsToggled(false);
      }
    }, 1);
  }

  function initalizeSelectRefs() {
    // Attach Refs to Select Menu Children when they are first visible in the DOM

    if (parentmenuRef.current !== null) {
      parentmenuOptions.current = parentmenuRef.current.children;

      if (currentSelectedOptionIndex != undefined) {
        setSelectMenuOpionRef(currentSelectedOptionIndex);
      }
    }
  }

  function setSelectMenuOpionRef(setOptionIndex: number) {
    if (parentmenuRef.current !== null && parentmenuOptions.current !== null) {
      currentSelectedMenuOption.current = parentmenuOptions.current[
        setOptionIndex
      ] as HTMLElement;
    }
  }

  function focusCurrentMenuOption() {
    setTimeout(() => {
      if (
        parentmenuOptions.current !== null &&
        currentSelectedMenuOption.current !== null
      ) {
        if (currentSelectedOptionIndex == undefined) {
          // Focus on first <li> child of parent menu
          // parentmenuOptions.current.children
        }

        currentSelectedMenuOption.current.focus();
      }
    }, 50);
  }

  // 🎹 Keydown Event Handlers for managing keyboard focus

  function resetCurrentMenuOption() {
    if (isMultiSelect == false) {
      if (selectValue != undefined) {
        if (currentSelectedOptionIndex === options.indexOf(selectValue)) return;

        setCurrentSelectedOptionIndex(options.indexOf(selectValue));
      }
    } else {
      console.log("Please add resetCurrentMenuOption for MultiSelect");
    }
  }

  // 🎹 Keydown Event Handlers for opening and closing the menu

  const handleSelectFieldOnClick = (e: MouseEvent) => {
    e.stopPropagation();

    if (
      parentmenuOptions.current === null &&
      currentSelectedMenuOption.current === null
    ) {
      initalizeSelectRefs();
    }

    setIsToggled();
    addDocumentOnClickHandler();
    focusCurrentMenuOption();
  };

  // use document onClick as alternative to on onBlur event when opening and closing the custom select
  function addDocumentOnClickHandler() {
    document.addEventListener(
      "click",
      (e) => {
        if (e.target instanceof Node) {
          if (parentmenuRef.current?.contains(e.target) === false) {
            setIsToggled(false);
            resetCurrentMenuOption();
          }
        }
      },
      { once: true },
    );
  }

  const handleEscapeKeydown = (e: KeyboardEvent) => {
    // Escape Key
    switch (e.key) {
      case "Escape":
        setIsToggled(false);

        // No matter what option user is 'hovered' on when exiting the menu, the currently selected option will always be focused the next time the menu is opened
        resetCurrentMenuOption();

        selectfieldRef.current?.focus();
        break;
    }
  };

  const handleSelectFieldKeydown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.target != selectfieldRef.current) return; // We want only the parent element (div) itself to active event listener, not the div's children.

    switch (e.key) {
      case "ArrowDown":
      case "ArrowUp": {
        if (
          parentmenuOptions.current === null &&
          currentSelectedMenuOption.current === null
        ) {
          initalizeSelectRefs();
        }

        if (isToggled === false) {
          setIsToggled(true);
          focusCurrentMenuOption();
          // addWindowOnClickEventListener();
          break;
        }
      }
    }
  };

  const handleParentMenuKeyDown = (e: KeyboardEvent) => {
    // At this point, select menu should be opened
    switch (e.key) {
      case "ArrowDown": {
        if (parentmenuOptions.current?.length) {
          // if option is already selected then select the next option down
          if (
            currentSelectedOptionIndex != undefined &&
            currentSelectedOptionIndex <= parentmenuOptions.current.length
          ) {
            setCurrentSelectedOptionIndex((prev) =>
              prev != undefined ? (prev += 1) : prev,
            );
          }

          // Reach end of menu cycle back up to the top
          // if an option is selected and we're on the last option then select the first option
          if (
            currentSelectedOptionIndex ===
            parentmenuOptions.current.length - 1
          ) {
            setCurrentSelectedOptionIndex(0);
          }
        }
        break;
      }

      case "ArrowUp": {
        // Same logic as case "ArrowDown" but in reverse
        if (
          currentSelectedOptionIndex != undefined &&
          parentmenuOptions.current?.length
        ) {
          // if option is already selected then select the next option down
          if (currentSelectedOptionIndex > 0) {
            setCurrentSelectedOptionIndex((prev) =>
              prev != undefined ? (prev -= 1) : prev,
            );
          }

          // Reach top of menu cycle cycle back from the bottom
          if (currentSelectedOptionIndex === 0) {
            setCurrentSelectedOptionIndex(parentmenuOptions.current.length - 1);
          }
        }
        break;
      }
    }
  };

  useEffect(() => {
    if (currentSelectedOptionIndex != undefined) {
      setSelectMenuOpionRef(currentSelectedOptionIndex);
    }
    focusCurrentMenuOption();

    // document onClick Listener as alternative to onBlur event for my custom select
    // I can still have accessible focus via up & down keys w/o triggering uncessary onBlur event
    // I want to have more control over when the 'onBlur' event happens
    // Similar accessbility logic to "Escape" inside handleSelectWrapperKeydown
    const WindowOnClickHandler = (e: Event) => {
      // Why can't I type 'e' as MouseEvent and not get error when I hover over WindowOnClickHandler inside the addEventListener
      // Even on this website, typing 'e' as MousEvent  should work without Typescript complaining: https://www.codefrontend.com/event-handler-in-react/
      // Needed to declare two different instances of the same window on click handler because the currentSelectedOptionIndex outside the useEffect stays at a single value which I don't want
      if (e.target instanceof Node) {
        if (parentmenuRef.current?.contains(e.target) === false) {
          setIsToggled(false);
          resetCurrentMenuOption(); // I didn't explicitly pass in currentSelectedOptionIndex into resetCurrentMenuOption(), but somehow resetCurrentMenuOption() works
          // If I declare the document onClick listener outside the useEffect, then my currentSelectedOptionIndex variable is always zero even though I change the state inside
          // The entire component doesn't re-render so that's maybe why currentSelectedOptionIndex is 0 even though visually the UI that currentSelectedOptionIndex controls changes
        }
      }
    };

    if (isToggled) {
      console.log("useEffect eventlistener added");
      document.addEventListener("click", WindowOnClickHandler);
    }

    return () => {
      if (isToggled) {
        document.removeEventListener("click", WindowOnClickHandler);
      }
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSelectedOptionIndex]);

  // ❌ Handling Event via useEffect, refs and addEventListener
  // The code does work as shown on https://bobbyhadz.com/blog/react-functional-component-add-event-listene, but Typescript complains
  // Tried adding event listeners via refs and the addEventListener method a
  // I get an "No overload matches this call" when I try to apply the event listener like this:
  // selectwrapperRef.current?.addEventListener("keydown", handleSelectWrapperKeydown)
  // I know that typecasting unkonwn may not be best practice, but I know that the normal syntax should work without Typescript complaining
  // This code shows adding event listeners via the onKeyDown, etc. https://www.kindacode.com/article/react-typescript-handling-keyboard-events/

  // ✅ Just add the event handling via on JSX attributes i.e onClick, onKeyDown, onMouseHover, etc.

  return (
    <div
      ref={selectwrapperRef}
      className="max-w-max"
      onClick={() => {
        setIsToggled(true);
      }} // Only add this event listener AFTER I've opened the menu NOT BEFORE
      onKeyDown={(e) => {
        handleEscapeKeydown(e);
      }}
    >
      <input type="hidden" name="combobox-field" value={isMultiSelect ? "multiselectOn" : selectValue?.label }/>
      <VisibilityProvider.Trigger
        wrapperTag="button"
        onClick={(e) => {
          handleSelectFieldOnClick(e);
        }}
        onKeyDown={handleSelectFieldKeydown}
        childRef={selectfieldRef}
        className="flex items-center rounded-md border-2 bg-primary"
        role="combobox"
        aria-controls={element_selectfield_controls}
        aria-haspopup="listbox"
        aria-expanded={isToggled ? "true" : "false"}
        aria-labelledby={selectfield_label}
        data-cy="SelectField"
      >
        <span className="inline-flex grow pl-1" id={selectfield_label}>
          {isMultiSelect
            ? selectValue[0].label
            : selectValue == undefined
              ? "Select..."
              : selectValue.label}
        </span>
        <DropdownIcon className="mr-1" />
      </VisibilityProvider.Trigger>

      <VisibilityProvider.Target
        wrapperTag="ul"
        childRef={parentmenuRef}
        onKeyDown={(e) => {
          handleParentMenuKeyDown(e);
        }}
        role="listbox"
        className=""
        id={element_selectfield_controls}
        data-cy="SelectMainMenu"
      >
        {options.map((option, index) => (
          <SelectOption
            key={option.label}
            option={option}
            selectoptionindex={index}
          >
            {index}
          </SelectOption>
        ))}
      </VisibilityProvider.Target>
    </div>
  );
}

SelectConsumer.Option = SelectOption;
SelectConsumer.ClearButton = ClearButton;
