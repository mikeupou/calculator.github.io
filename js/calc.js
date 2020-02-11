var display;
var last_char;
var count_dots = 0; //count the number of dots in an operand
var negative_state = false;
var valid_chars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '+', '-', '*', '/', '.'];
var nums = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
var symbols = ['+', '-', '*', '/'];

function key_input(clicked){
  var button = document.getElementById(clicked);
  display = document.getElementById('display');
  last_char = display.value.charAt(display.value.length-1);


  //if last character on screen is not a number (+, -, *, /, .) or it is the first character entered
  if( !nums.includes(last_char) ){
      //if it is a number being pressed
      if (nums.includes(button.name)) {
          if(button.name == 0){
              if(last_char == '.') {
                  display.value += button.name;
              }else{
                  // do nothing, 0 cannot be a starting number
              }
          }else{
              display.value += button.name;
          }
      }
      // if . is pressed
      if(button.name == '.'){
          // if last character is ., do not do anything
          if(last_char == '.'){
              // do not do anything
            }else{
                // last character is +, -, *, /
                count_dots += 1;
                display.value = display.value + "0" + button.name;
            }
      }

      if(symbols.includes(button.name)){
          if(last_char=='.' || last_char=='(' || last_char==')'){
              display.value += button.name;
          }
      }

  // last character is a number
  }else{
      //if it is a number being pressed
      if (nums.includes(button.name)) {
          display.value += button.name;
      }
      // if . is pressed
      if(button.name == '.'){
          // if there is no . for an operand yet
          if(count_dots == 0){
              count_dots += 1;
              display.value += button.name;
          }else{
              // do nothing
          }
      }
      // if operators were pressed (+, -, *, /)
      if(symbols.includes(button.name)){
          count_dots = 0;
          display.value += button.name;
      }
  }


}// end of function key_input

function compute(){
  var display = document.getElementById('display');
  try{
      var answer = eval(display.value);
      if(answer=='Infinity'){
          display.value = 0;
      }else{
          if(answer % 1 == 0){
              display.value = answer;
          }else{
              // for accuracy
              answer = Math.round(answer*10000000000) / 10000000000;
              display.value = answer;
          }

      }
  }catch(e){
      display.value = 0;
  }


} // end of function compute

function clear_display(){
  var display = document.getElementById('display');
  count_dots = 0;
  display.value = "";
  negative_state = false;

} // end of function clear_display

function backspace(){
    display = document.getElementById('display');
    last_char = display.value.charAt(display.value.length-1);
    if(last_char=='.'){
        if(count_dots > 0){
          count_dots = 0;
        }
    }
    text = display.value.slice(0, -1);
    display.value = text;
} // end of function backspace

function get_negative_index(text){
  // get index of last occurence of (-
  var i;
  last_index = 0;
  curr_char = '';
  prev_char = '';
  for(i = text.length - 1; i > -1; i--){
      curr_char = text.charAt(i);
      if (curr_char == '('){
          if (prev_char == '-') {
              last_index = i;
              break;
          }
      }
      prev_char = curr_char;
  }
  return last_index;
}

function get_start_of_number_index(text){
  // get index of last occurence of (-
  var i;
  start_index = 0;
  curr_char = '';
  for(i = text.length - 1; i > -1; i--){
      curr_char = text.charAt(i);
      if (symbols.includes(text.charAt(i))){
          start_index = i + 1;
          break;
      }
  }
  return start_index;
}

function negate(){
    display = document.getElementById('display' );
    last_char = display.value.charAt(display.value.length-1);

    // as first input outputs (-
    if(display.value.length == 0){
      display.value = '(-';
      negative_state = true;
      return;
    }

    // after a number or . will scan backwards until it get last number or if
    // it meets operator 32 + 345 neg will be 32 + (-345
    if(nums.includes(last_char) || last_char=='.'){
      text = display.value;

      // if number is currently in negative negative_state e.g. 3 + (-345 neg, turn to 3 + 345
      if(negative_state){
          last_index = get_negative_index(text);
          str1 = text.slice(0, last_index);
          str2 = text.slice(last_index+2);
          display.value = str1 + str2;
          negative_state = false;
      }else{
          start_index = get_start_of_number_index(text);
          str1 = text.slice(0, start_index);
          str2 = text.slice(start_index);
          display.value = str1 + "(-" + str2;
          negative_state = true;
      }

    }

    // after a (- or last pressed character was neg
    if(display.value.charAt(display.value.length-1)=='-' && display.value.charAt(display.value.length-2)=='('){
      last_two_chars = display.value.slice(-2);
      if(last_two_chars=='(-'){
        text = display.value;
        display.value = text.slice(0,-2);
        negative_state = false;
      }
      return;
    }

    // after an operator will produce (- like 9 + neg will be 9 + (-
    if(symbols.includes(last_char)) {
      display.value += '(-';
      negative_state = true;
    }
}

function parentheses(clicked){
    var button = document.getElementById(clicked);
    display = document.getElementById('display');
    if(button.name=='open_par'){
        display.value += '(';
    }else{
        display.value += ')';
    }
}
