import { CSSProperties, ComponentRef, ElementType, HTMLAttributes, InputHTMLAttributes, ReactNode, RefObject, createContext, createElement, useContext } from "react";
import { useToggle } from "../hooks/useToggle";

interface VisibilityContextType<contextDataType> {
    isToggled: boolean;
    setIsToggled: (value?: boolean) => void;
    eventType: 'onClick' | 'onMouseEnter';
    contextData: contextDataType;
}

const VisibilityContext = createContext<VisibilityContextType<object> | null>(null);

// eslint-disable-next-line react-refresh/only-export-components
export function useVisibilityContext<contextDataType>() {
    const context = useContext(VisibilityContext) as VisibilityContextType<contextDataType>;

    if (!context) {
        throw new Error("Please nest component under VisibilityProvider")
    }

    return context;
}

type VisibilityProviderProps<contextDataType> = {
    children?: ReactNode;
    eventType: 'onClick' | 'onMouseEnter';
    contextData: contextDataType;
}

export const VisibilityProvider = ({children, eventType, contextData} : VisibilityProviderProps<object>) => {
  const { isToggled, setIsToggled } = useToggle();
  
  return (
    <VisibilityContext.Provider value={{isToggled, setIsToggled, eventType, contextData}}>
        {children}
    </VisibilityContext.Provider>
  )
}

VisibilityProvider.Trigger = VisibilityTrigger;
VisibilityProvider.Target = VisibilityTarget;

interface TriggerProps<T extends ElementType> extends InputHTMLAttributes<HTMLElement>{
    wrapperTag: T;
    children: ReactNode;
    passFunctionToParentHandler?: () => void;
    childRef?: RefObject<ComponentRef<T> | null>;
}


function VisibilityTrigger<T extends ElementType>({wrapperTag, children, passFunctionToParentHandler = () => {}, childRef, ...rest} : TriggerProps<T>) {
    const { setIsToggled, eventType} = useVisibilityContext();

    function handleEvent() {
        setIsToggled();
        passFunctionToParentHandler();
    }
    

    const assignPropsFromEventType = () => {
        // Assign onClick props for button you want to trigger via onClick and vice versa
        if (eventType == "onClick"){
            return ({
                [eventType]: handleEvent,
                handleClick: handleEvent 
            })
        }

        if (eventType == "onMouseEnter") {
            return ({
                [eventType]: handleEvent,
                onMouseLeave: handleEvent
            })
        }
        
    }
    

    return createElement(
        wrapperTag,
        {
            ref: childRef,
            assignPropsFromEventType,
            ...rest
        },
        children
    )
}

interface VisibilityTargetProps<T extends ElementType> extends HTMLAttributes<HTMLElement> {
    children: ReactNode;
    wrapperTag: T;
    childRef?: RefObject<ComponentRef<T> | null>;
}

function VisibilityTarget<T extends ElementType>({children, wrapperTag, childRef, ...rest} : VisibilityTargetProps<T>){
    const {isToggled, setIsToggled, eventType} = useVisibilityContext();

    const show = { display: 'block' };
    
    const hide = { display: 'none' }; 

    const wrapperStyle: CSSProperties = isToggled ? show : hide;

    if (eventType == "onClick") {
        //  return (
        //     <WrapperTag style={isToggled ? show : hide} {...rest}>
        //          {children}
        //      </WrapperTag>
        //  )

        return createElement(
            wrapperTag,
            {
                style: wrapperStyle,
                ref: childRef, 
                ...rest 
            },
            children
        );
    }

    if (eventType == "onMouseEnter") {
        // return (
        //     <WrapperTag 
        //         style={isToggled ? show : hide} 
                // onMouseEnter={() => {setIsToggled(true)}} 
        //         onMouseLeave={() => {setIsToggled(false)}}
        //         {...rest}
        //     >
        //         {children}
        //     </WrapperTag>
        // )

        return createElement(
            wrapperTag,
            { 
                style: wrapperStyle,
                onMouseEnter: setIsToggled(true),
                onMouseLeave: setIsToggled(false),
                ref: childRef, 
                ...rest
            },
            children
        );
    }
}