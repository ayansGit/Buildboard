
const validations = {
    email: {
        presence: {
            message: 'Please enter email address'
        },
        format: {
            pattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            message: 'Please enter proper email address'
        }
    },

    fullname: {
        presence: {
            message: 'Please enter your full name'
        },
        format: {
            pattern: /^[a-zA-Z ]+$/,
            message: 'Full name can have only characters [A-Z] or [a-z]'
        }
    },
    firstname: {
        presence: {
            message: 'Please enter your first name'
        },
        format: {
            pattern: /^[a-zA-Z ]+$/,
            message: 'First name can have only characters [A-Z] or [a-z]'
        }
    },
    lastname: {
        presence: {
            message: 'Please enter your last name'
        },
        format: {
            pattern: /^[a-zA-Z ]+$/,
            message: 'Last name can have only characters [A-Z] or [a-z]'
        }
    },

    address: {
        presence: {
            message: 'Please enter your address'
        }
    },

    city: {
        presence: {
            message: 'Please enter your city'
        }
    },
    state: {
        presence: {
            message: 'Please enter your state'
        }
    },

    zipcode: {
        presence: {
            message: 'Please enter your zipcode'
        }
    },
    
    password: {
        presence: {
            message: 'Please enter password'
        }, length: {
            size: 8,
            message: 'Password should have minimum 8 characters'
        }
    },
    loginPassword: {
        presence: {
            message: 'Please enter password'
        }
    },
    phone_number: {
        presence: {
            message: 'Please enter phone number'
        }, length: {
            size: 10,
            message: 'Please enter valid phone number'
        }
    },


}
export const validate = (nameField, value) => {
    let result = { isError: false, messageError: '' }
    if (validations.hasOwnProperty(nameField)) {
        let v = validations[nameField]
        if (value == '' || value === null) {
            result = { isError: true, messageError: v.presence.message }
        } else if (v.hasOwnProperty('format') && !v.format.pattern.test(value)) {
            result = { isError: true, messageError: v.format.message }
        } else if (v.hasOwnProperty('length') && v.length.size > value.length) {
            result = { isError: true, messageError: v.length.message }
        }
        else {
            result.isError = false
        }
    } else {
        result.isError = false
    }
    return result
}

export const FieldType = {
    phone_number: "phone_number",
    email: "email",
    fullname: "fullname",
    address: "address"
}