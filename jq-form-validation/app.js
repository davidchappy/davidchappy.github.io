// elements
var $form = $('#mintSignupForm');

var fields = {
  email: {
    tag: $('#mintEmail'),
    tooltip: "You'll use this as your User ID"
  },
  emailConfirm: {
    tag: $('#mintEmailConfirm'),
  },
  password: {
    tag: $('#mintPassword'),
    tooltip: "Create a password you've never used before. This will help keep your account safe."
  },
  passwordConfirmation: {
    tag: $('#mintPasswordConfirm'),
  },
  country: {
    tag: $('#mintCountry'),
  },
  zip: {
    tag: $('#mintZip')  
  },
  remember: {
    tag: $('#mintRemember'),
  },
  submit: {
    tag: $('#submit'),
  }
}

// validations 

// http://stackoverflow.com/questions/46155/validate-email-address-in-javascript
function validEmail(email) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if(email) return re.test(email);
}

function hasCase(value) {
  var hasUpperCase = false;
  var hasLowerCase = false;
  for(var i=0; i<value.length; i++) {
    if(value[i] === value[i].toUpperCase()) {
      hasUpperCase = true;
    }
    if(value[i] === value[i].toLowerCase()) {
      hasLowerCase = true;
    }
  }
  if(hasLowerCase && hasUpperCase) {
    return true;
  } else {
    return false;
  }
}

function hasNumber(value) {
  for(var i=0; i<value.length; i++) {
    if(!isNaN(parseFloat(value[i])) && isFinite(value[i])) {
      return true;
    };
  }
  return false;
}

function hasSymbol(value) {
  var symbols = ["(", ")", "`", "~", "!", "@", "#", "$", "%", "^", "&", "*", "-", "+", "=", "|", "\\", "{", "}", "[", "]", ":", ";", "<", ">", ".", "?", "/"];
  for(var i=0; i<value.length; i++) {
    if(symbols.includes(value[i])) {
      return true;
    };
  }
  return false;
}

// http://stackoverflow.com/questions/160550/zip-code-us-postal-code-validation
function isValidZip(zip) {
  return /(^\d{5}$)|(^\d{5}-\d{4}$)/.test(zip);
}


// Main functions
function validate(element, finalKeypress) {
  element.tag.siblings('.errors').empty();
  element.errors = [];
  var errors = element.errors;

  // Remove Browser's default validation message;
  element.validationMessage = null;
  
  // Gets the DOM element
  var htmlTag = element.tag[0];

  // Validate presence
  if(htmlTag.required && htmlTag.value === '' && element.requiredMessage) {
    errors.push(element.requiredMessage);
  } 

  if(htmlTag.type === 'email') {
    if(htmlTag.id === 'mintEmailConfirm' 
      && htmlTag.value != fields.email.tag[0].value) {
      errors.push('Confirm email field does not match the email address field.')
    } 
    else if (htmlTag.id === 'mintEmail' && !validEmail(htmlTag.value)) {
      var message = 'Please enter a valid email address';
      errors.push(message);
    }
  } else if(htmlTag.type === 'password') {
    if(htmlTag.id === 'mintPassword') {
      if(htmlTag.value.length < 8) {
        errors.push('Use 8 or more characters');
      }
      if(!hasNumber(htmlTag.value)) {
        errors.push('Use upper and lower case letters (e.g. Aa)');
      }
      if(!hasCase(htmlTag.value)) {
        errors.push('Use a number (e.g. 1234)');
      }
      if(!hasSymbol(htmlTag.value)) {
        errors.push('Use a symbol (e.g. !@#$)');
      }
    } else if(htmlTag.id === 'mintPasswordConfirm' 
      && htmlTag.value != fields.password.tag[0].value) {
      console.log(htmlTag.value);
      console.log(fields.password.tag[0].value);
      errors.push('Confirm password field does not match the password field.')
    } 
  } 

  if(element === fields.zip) {
    if(htmlTag.value.length < 5 || !isValidZip(htmlTag.value)) {
      errors.push('Please enter a valid zip code.');
    }
  }

  if(errors.length) {
    element.tag.addClass('has-errors');
    var list = element.tag.siblings('ul');
    if(errors.length > 1) list.addClass('multiple');
    $.each(errors, function(index, val) {
      var li = $('<li>' + val + '</li>');
      list.append(li);
    });
    list.show();
  } else {
    element.tag.removeClass('has-errors');
    element.tag.addClass('valid-field');
  }
}

function setup() {
  $.each(fields, function(index, element) {
    element.tag.after("<ul class='errors'></ul>");    
  });
}

function listen() {
  console.log('listening');

  $.each(fields, function(index, val) {
    // tooltips
    if(val.tooltip) {
      val.tag.on('focus', function(event) {
        toggleToolTip(val.tag, val.tooltip);
      }).on('blur', function(event) {
        toggleToolTip(val.tag);
      })
    }
  });

  fields.password.tag.on('focus', function(event) {
    fields.password.tag.addClass('insecure');
    // fields.password.tag.siblings('.errors').addClass('errors-selected');
    validate(fields.password);
  });
  // fields.password.tag.on('blur' function(event) {
  //   fields.password.tag.removeClass('password-selected');
  //   fields.password.tag.siblings('.errors').removeClass('errors-selected');
  // });

  $.each(fields, function(index, val) {
    // keypresses
    val.tag.on('keypress', function(event) {
      console.log("typed");
      val.typed = true;  
    });
    val.tag.on('blur', function(event) {
      if(val.typed) {
        validate(val);
      }
    });
  });

  $.each(fields, function(index, val) {

  });
}

function toggleToolTip(field, message) {
  var parent = field.parent();
  if(field.siblings('.tooltip').length) {
    parent.find('.tooltip').remove();
  } else {
    field.after('<span class="tooltip">' + message + '</span>')
  }
}

// testing only
// function runValidations() {
//   validate(fields.email);
//   validate(fields.emailConfirm);
//   validate(fields.password);
//   validate(fields.passwordConfirmation);
//   validate(fields.zip);
//   validate(fields.country);
//   validate(fields.submit);
// }

$(document).ready(function() {
  setup();
  listen();

  // testing only
  // runValidations();
});





// jQuery Validation Plugin

// $('#mintSignupForm').validate({
//   rules: {
//     mintEmail: {
//       minlength: 5
//     },
//     mintEmailConfirm: {
//       minlength: 5,
//       equalTo: '#mintEmail'
//     },
//     mintPassword: {
//       minlength: 5
//     },
//     mintPasswordConfirm: {
//       minlength: 5,
//       equalTo: '#mintPassword'
//     } 
//   }
// });