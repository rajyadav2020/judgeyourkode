const validator = require('validator')

const validate = (data)=>{
  const mandatoryFields = ['firstname','lastname','emailId','password'];

  const IsAllowed = mandatoryFields.every( (k)=> Object.keys(data).includes(k));

  if(!IsAllowed){
    return {status:false,message:"Mandatory fields are missing"}
  }
  if(validator.isEmail(data.emailId) === false){
    return {status:false,message:"Invalid email"}
  }
  if(validator.isStrongPassword(data.password) === false){
    return {status:false,message:"Weak password"}
  }


}
module.exports = validate;