// import { options } from './components/Select/data_types';
// import { Select } from './components/Select';
import { Select } from "./components/Select";
import "./global_styles.scss";
import { options , optionsarray, SelectOptionType } from "./components/Select/data_types";
import { FormEvent, useReducer } from "react";

function reducer(state: SelectOptionType[][], action : {type: string}) {
  switch (action.type) {
    case "add":
      console.log('add new FormTile')
      return state
    case "remove":
      return state
    default:
      return state
  }
}

function App() {
  const [globalstate, dispatch] = useReducer(reducer, optionsarray)
  
  function addFormTile(){ dispatch({type: "add"}); }

  function removeFormTile(){ dispatch({type: "remove"}); }

  const handleOnSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formData = Object.fromEntries(new FormData(e.currentTarget))
    // No need to create array state. Each componenet manages its own input value and formData Object can access
    // all the input within the single <form> no matter if there's 1 custom select or 20 custom select

    for (let [key, value] of Object.entries(formData)) {
      console.log(key + " : " + value);
    }

    // console.log('handleobSubmit called');
  };

  return (
    <main className="default-theme">

      {/* <form onSubmit={handleOnSubmit}> */}
        {/* {globalstate.map((item, index) => (
          <Select options={item}/>
        ))}

        <input value="Submit" type="submit" className="cursor-pointer bg-slate-500 border"/><br/>
        <br />
        <button type="button" className="cursor-pointer bg-red-400 border" onClick={() => addFormTile()}>Add Input Tile</button><br/>
        <br />
        <button type="button" className="cursor-pointer bg-blue-500 border" onClick={() => removeFormTile()}>Remove Input Tile</button> */}

        {/* <input name="static-input" value="Hellow1"/> */}
        
        {/* <label
          >Custom file label:
          <input type="text" name="file-label" size={12}/>
        </label> */}
      {/* </form> */}

      {/* <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero debitis
        fuga veritatis! Saepe illo, soluta quo consectetur iste voluptas!
        Consectetur, modi? Odit ab, cupiditate rerum iure voluptas eveniet
        inventore doloribus.
      </p> */}
    </main>
  );
}

export default App;
