
export const policies = {
  onlyLetterAndSpace:(ev)=>{
    let val = ev.target.value;
    if(ev.keyCode == 32 && val.substring(val.length-1) == " " || ev.keyCode == 32 && val == ""){
      return false;
    }else if(!ev.key.match("[a-zA-Z ]")){
        return false;
    }
  },
  onlyLetter:(ev)=>{
    if(!ev.key.match("[a-zA-Z]")){
        return false;
    }
  },
  onlyNumber:(ev)=>{
    if(!ev.key.match("[0-9]")){
        return false;
    }
  },
  numberAndLetter:(ev)=>{
    let val = ev.target.value;
    if(ev.keyCode == 32 && val.substring(val.length-1) == " " || ev.keyCode == 32 && val == ""){
      return false;
    }else if(!ev.key.match("[a-zA-Z0-9 ]")){
        return false;
    }
  },
  password:(ev)=>{
    let val = ev.target.value;
    if(ev.keyCode == 32 && val.substring(val.length-1) == " " || ev.keyCode == 32 && val == ""){
      return false;
    }else if(!ev.key.match("[a-zA-Z0-9]")){
        return false;
    }
  }
}
