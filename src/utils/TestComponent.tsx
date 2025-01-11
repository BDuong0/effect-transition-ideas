import { ElementRef, ElementType, HTMLAttributes, ReactNode, RefObject, createElement } from "react";

interface testProps<T extends ElementType> extends HTMLAttributes<HTMLElement> {
    children: ReactNode;
    wrapperTag: T;
    childRef?: RefObject<ElementRef<T>>;
}

export function TestComponent<T extends ElementType>({children, wrapperTag, childRef, ...rest}: testProps<T>) {
  
  return createElement(
    wrapperTag,
    { ref: childRef, ...rest },
    children
  );
}
