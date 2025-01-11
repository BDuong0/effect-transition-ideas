/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */

const outputfileName = "global_tokens.css";

function generate_CSS_variables(deconstructed_key_value_pairs, variableName_prefix = ""){
    // Take in object that contains array of key-value pairs, that are stored in an array of two items, and output whatever SASS stuff I need by accessing the key and the value
    // Take in the key-values pairs that are the most primitive, i.e. "fs-400":  "1rem". Not the string keys like "neutral" or "font-size" that serve both a token grouping purpose and a token naming purpose
    let output_text = ``; 
    
    for ([key,value] of deconstructed_key_value_pairs) {
        output_text = output_text.concat(`  --${variableName_prefix}${key}: ${value};\n`);
        
    }

    return output_text;
}

function generate_1_CSS_variable(key, value) {
    let output_text = ``; 
    
    output_text = output_text.concat(`  --${key}: ${value};\n`);
        
    return output_text;
}

try {
    
    const design_tokens_object = require('./primitive-tokens.json');
    
    const fs = require('fs');

    try {
        var global_token_output = ``;

        // semantic_token_output = semantic_token_output.concat(`@use 'global_tokens' as ${globalToken_namespace_name};\n`);

        // Store all CSS variables inside global :root selector
        global_token_output = global_token_output.concat(`\n:root { \n`);

        for ([key,value] of Object.entries(design_tokens_object)) {
            if (key == "font-sizes") { // Iterate through object with zero nested objects. Object only has string key and string value 
                global_token_output = global_token_output.concat(`\n /* Font Sizes */\n`);
                
                // Write SASS variables into global_tokens.scss
                const font_sizes = Object.entries(design_tokens_object["font-sizes"]);
                global_token_output = global_token_output.concat(generate_CSS_variables(font_sizes));
                    // Empty string passed for variableName_prefix means that I set up the names for font-size variables and utlity classes directly in my json file
                global_token_output = global_token_output.concat(`\n`);

            }

            if (key == "font-family") {
                global_token_output = global_token_output.concat(`\n /* Font Family */\n`);
                for ([fontPurpose, fontPurpose__object] of Object.entries(design_tokens_object["font-family"])) {
                    
                    if (fontPurpose == "primary") {
                        for ([key, value] of Object.entries(design_tokens_object["font-family"]["primary"])) {
                            if (key == "font-primary") {
                                global_token_output = global_token_output.concat(generate_1_CSS_variable(key, value));
                                global_token_output = global_token_output.concat()
                            } 
                        }
                    }

                    if (fontPurpose == "accent") {
                        for ([key, value] of Object.entries(design_tokens_object["font-family"]["accent"])) {
                            if (key == "font-accent") {
                                global_token_output = global_token_output.concat(generate_1_CSS_variable(key, value));
                                global_token_output = global_token_output.concat()
                            } 
                        }
                    }
                }
            }

            if (key == "font-weights") {
                // 0 nested objects inside font-weights object
                global_token_output = global_token_output.concat(`\n /* Font Weight */\n`);

                const font_weights = Object.entries(design_tokens_object["font-weights"]);
                global_token_output = global_token_output.concat(generate_CSS_variables(font_weights));
                global_token_output = global_token_output.concat(`\n`);
                
            }

            if (key == "color"){ 
                // Iterate through object of objects(each one has string key and object value) that are nested one level deep
                global_token_output = global_token_output.concat(`\n /* Colors */\n`);
                

                for ([colorType, colorType__object] of Object.entries(design_tokens_object[key])) {
                        // Inside the "colors" object, there might be neutral colors object (an object in another object)
                        // colorType is a string denoting the type of color
                    const colors = Object.entries(design_tokens_object[key][colorType]);
                    global_token_output = global_token_output.concat(generate_CSS_variables(colors, key + "-" + colorType + "-"));
                }   
            }

            if (key == "spacing") {
                // Same code logic as iterating through "font-sizes"
                global_token_output = global_token_output.concat(`\n /* Spacing & Sizing */\n`);

                const spacing_object = Object.entries(design_tokens_object["spacing"]);
                global_token_output = global_token_output.concat(generate_CSS_variables(spacing_object));
                global_token_output = global_token_output.concat(`\n`);
                // No creating spacing utlity classes. Create utlitly classes as you need them, so you include only utility classes you will use.
                // data = data.concat(generate_SASS_utility_classes(spacing_object,"","","font-size"));
                // data = data.concat(`\n`);
            }
        }

        global_token_output = global_token_output.concat(`} \n`); // Add final curly brace to :root selector
        fs.writeFileSync('./src/utils/global_styles/' + outputfileName, global_token_output);
        console.log("=== " + outputfileName + " written successfully ===");
    } catch(err) {
        console.log(err);
    }


} catch(err) {
    console.log(err);
}





