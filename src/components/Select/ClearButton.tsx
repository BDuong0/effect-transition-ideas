// import { useVisibilityContext } from "../../utils/VisibilityProvider";
// import { SelectContextDataType } from "./index";

const ClearButton = () => {
    // const {contextData} = useVisibilityContext<SelectContextDataType>();
    // const {setSelectFieldValue} = contextData;
  
    function clearOptions () {
        //setSelectFieldValue();
    }

    return (
        <button
            onClick={(e) => {
                e.stopPropagation();
                clearOptions();
            }}>
            ClearButton
        </button>
    )
}

export default ClearButton