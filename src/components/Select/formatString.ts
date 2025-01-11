
export const convertStringToKebabCase = (input_string: string) => {
    let returned_string = input_string.replace(" ", "-");
    returned_string =  returned_string.toLowerCase();
  
    return returned_string
}