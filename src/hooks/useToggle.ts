import { useState } from "react";

export const useToggle = () => {
    const [isToggled, setToggled] = useState(false);
    
    type setIsToggledOverload = {
        (value?: undefined): void,
        (value?: boolean): void
    }
    
    const setIsToggled : setIsToggledOverload = (value: undefined | boolean) => {
        if (typeof value === "undefined") {
            setToggled(prevStatus => !prevStatus);
            // console.log('setIsToggled with undefined');
        }
        if (typeof value === 'boolean') {
            setToggled(value);
            // setToggled(prev_status => (prev_status = value));
                // This functional updator syntax yeilds error:"  'prev_status' is assigned a value but never used. " Even though I'm actually using the value.
                // ChatGPT: But if you’re just setting it to 'value', the functional updater is unnecessary, so the direct version is best.
                    // So Typescript complains about the setState functional updator syntax if you're using the assignment operator (=) on the setState variable
            // console.log('setIsToggled with boolean');
        }
    };

    return { isToggled, setIsToggled }
}