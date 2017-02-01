import AuthActions from '../actions/AuthActions';
import { generalConfig } from './config';

// TODO: split these up into separate files

export const getAuthorizationHeader = token => {
    return { 'Authorization': `Bearer ${token}` };
};

export const encodeJsonUrl = data => {
    return encodeURIComponent(JSON.stringify(data));
};

export const httpErrorHandler = e => {
    // skip the error codes that have been handled
    const handledStatuses = Object.keys(httpStatusCode);
    const indexOfStatus = handledStatuses.indexOf(e.status.toString());

    if (indexOfStatus !== -1) return;

    console.error(e);
    toastr.error('Pieprasījums neveiksmīgs - neparedzēta kļūda!');
};

export const httpSuccessHandler = data => console.log('Data received: ', data);

export const isEmailValid = email => {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
};

export const isPasswordValid = password => {
    return typeof password === 'string' && password.length >= 5;
};

export const getGenderValue = gender => {
    return gender == 'male' ? 'Vīrietis' : (gender == 'female' ? 'Sieviete' : '');
};

export const getRoleValue = role => {
    return role === 'admin' ? 'admins' : (role === 'user' ? 'lietotājs' : '');
};

export const getStatusValue = is_blocked => {
    return is_blocked === true ? 'bloķēts' : (is_blocked === false ? 'aktīvs' : '');
};

/**
 * Converts the passed date string to date and return it in the format DD/MM/YYY.
 *
 * @param {string} dateString Date string
 * @returns {string} Formated date string or an emprt string
 */
export const formatDateString = dateString => {
    if (!dateString) {
        return '';
    }

    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
};

/**
 * Initializes the datetime picker with the specified ID.
 *
 * Additionally adds the default date if it's passed.
 *
 * @param {string} datetimePickerSelector Control selector
 * @param {string} defaultDate date string
 * @param {Function} dateChangedHandler Date changed event handler
 */
export const initDateTimePicker = (datetimePickerSelector, defaultDate, dateChangedHandler) => {
    $(() => {
        const { dateFormat } = generalConfig;
        const dateTimePicker = $(datetimePickerSelector);
        const options = { format: dateFormat };

        if (defaultDate) {
            options.date = defaultDate;
        }

        dateTimePicker.datetimepicker(options);
        dateTimePicker.on("dp.change", e => dateChangedHandler(e.date.toString()));
    });

    $(datetimePickerSelector).show('slow', function() {
        $(this).trigger('isVisible');
    });
};

/**
 * Replaces admin fields property with prefixed admin fields on the parent object.
 *
 * Creates a new object and deletes the admin_fields object as it's not needed anymore.
 *
 * @param {Object} props User properties
 * @returns {Object} Updated properties
 */
export const prefixAdminFields = props => {
    const { admin_fields } = props;

    if (!admin_fields) {
        return props;
    }

    const newAdminFields = prefixProps(props.admin_fields, 'admin_fields');
    const newProps = Object.assign({}, props, newAdminFields);

    delete newProps.admin_fields;

    return newProps;
};

/**
 * Creates a new object with prefixed property names.
 *
 * @param {Object} obj Object to take properties from
 * @param {string} prefix Prefix to use
 * @returns {Object} Prefixed object
 */
export const prefixProps = (obj, prefix) => {
    const dotObj = {};

    Object.keys(obj).forEach(key => dotObj[`${prefix}.${key}`] = obj[key]);

    return dotObj;
};

/**
 * Calculates how many members there are in a group.
 *
 * @param {string} groupId Group id
 * @param {Object[]} groupMembers Group members object containing all group members
 * @returns {number} Group member count
 */
export const getGroupMemberCount = (groupId, groupMembers) => {
    const members = groupMembers[groupId];

    return members ? members.length : 0;
};

/**
 * Creates an object with the specified properties from the source object.
 * If the properties are not there, initializes them as empty strings.
 *
 * @param {string[]} propNames Property names to copy
 * @param {Object} sourceObject Object to copy the properties from
 * @returns {Object} The new object
 */
export const createObject = (propNames, sourceObject) => {
    const newObject = {};

    propNames.forEach(propName => {
        const sourceValue = sourceObject[propName];

        if (typeof sourceValue !== 'undefined') {
            newObject[propName] = sourceValue;
        } else {
            newObject[propName] = '';
        }
    });

    return newObject;
};

export const fetchData = request => {
    // TODO: replace jQuery with something else
    return $.ajax(request)
        .done(data => httpSuccessHandler(data))
        .fail(error => httpErrorHandler(error));
};

export const httpStatusCode = {
    400: res => {
        console.error(res);
        toastr.error('Pieprasījuma kļūda - mēģiniet vēlreiz!');
    },
    401: res => {
        console.error(res);
        toastr.error('Autorizācijas kļūda - mēģiniet vēlreiz!');
        AuthActions.silentLogoutUser();
    },
    403: res => {
        console.error(res);
        toastr.error('Lietotājs bloķēts - sazinieties ar administratoru!');
        AuthActions.silentLogoutUser();
    },
    404: res => {
        console.error(res);
        toastr.error('Pieprasītais saturs netika atrasts - sazinieties ar administratoru!');
    },
    409: res => {
        console.error(res);
        toastr.error('Noticis datu apstrādes konflikts - sazinieties ar administratoru!');
    },
    500: res => {
        console.error(res);
        toastr.error('Servera kļūda - mēģiniet vēlreiz!');
    }
};
