class InputUtils {
    static INVALID_INPUT_CLASS = 'input-invalid';
    static MAX_VALUE_LENGTH = 64;

    static getTarget(element) {
        return element.target ? element.target : element;
    }

    static isEmpty(element) {
        return InputUtils.getTarget(element).value.trim() > 0;
    }

    static addInvalidClass(element) {
        InputUtils.getTarget(element).classList.add(InputUtils.INVALID_INPUT_CLASS);
    }

    static removeInvalidClass(element) {
        InputUtils.getTarget(element).classList.remove(InputUtils.INVALID_INPUT_CLASS);
    }

    static isValidLength(value) {
        return value.length < InputUtils.MAX_VALUE_LENGTH;
    }
}

class EmailUtils {
    static regexp = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/

    static isValid(email) {
        return true;
        // return EmailUtils.regexp.test(String(email).toLowerCase());
    }
}

class Observer {
    _value;
    _subscribes = [];

    subscribe(handler) {
        this._subscribes.push(handler);
    }

    setValue(value) {
        this._value = value;
        this._updateSubscribes();
    }

    _updateSubscribes() {
        this._subscribes.forEach((handler) => handler(this._value));
    }
}

class BasicReactiveInput {
    observer;
    _input;

    constructor(element) {
        this.observer = new Observer();
        this.initialInput(element);
    }

    get value() {
        throw new Error('Getter \'reactiveValue\' must be implemented !');
    }

    initialInput(element) {
        if (!element) {
            return;
        }
        if (element instanceof HTMLElement) {
            this._input = element;
        } else {
            this._input = document.getElementById(element);
        }
        this.initialSubscriptions(this._input);
    }

    initialSubscriptions(...inputs) {
        inputs.forEach((input) => input.addEventListener('change', () => this.setElementValue()))
    }

    setElementValue() {
        this.observer.setValue(this.value);
    }

    subscribe(handler) {
        this.observer.subscribe(handler);
    }
}

class NumberInput extends BasicReactiveInput {
    static FIRST_DASH_INDEX = 4;
    static SECOND_DASH_INDEX = 7;
    static MAX_MAIN_NUMBER_LENGTH = 10;
    static DEFAULT_BY_PRE_PREFIX = '+375';
    static DASH_SIGN = '-';

    prefixInput;
    numberInput;

    constructor() {
        super();
        this.prefixInput = document.getElementById('phone-prefix-number-input-id');
        this.numberInput = document.getElementById('phone-number-input-id');
        this.initMainNumberPrettier();
        this.initialSubscriptions(this.prefixInput, this.numberInput);
    }


    get prefix() {
        return this.prefixInput.value;
    }

    get fullNumberPhone() {
        return `${NumberInput.DEFAULT_BY_PRE_PREFIX}(${this.prefix})${this.number}`
    }

    get value() {
        return this.fullNumberPhone;
    }

    get number() {
        return this.numberInput.value;
    }

    get numberLength() {
        return this.number.length;
    }

    get isMaxNumberLength() {
        return this.numberLength >= NumberInput.MAX_MAIN_NUMBER_LENGTH;
    }

    get isLastCharacterDash() {
        return this.number[this.numberLength - 1] === NumberInput.DASH_SIGN;
    }

    get numberWithoutLastSign() {
        return this.number.substr(0, this.numberLength - 1);
    }

    get isDashIndex() {
        return this.numberLength === NumberInput.FIRST_DASH_INDEX - 1
            || this.numberLength === NumberInput.SECOND_DASH_INDEX - 1
    }

    initMainNumberPrettier() {
        this.numberInput.addEventListener('input', (event) => {
            if (this.validateNewNumberValue(event)) {
                this.returnPreviousValue(event);
            }
            if (!this.isBackspace(event) && this.isDashIndex) {
                event.target.value = this.number + NumberInput.DASH_SIGN;
            }
        })
    }

    returnPreviousValue(event) {
        return event.target.value = this.numberWithoutLastSign;
    }

    validateNewNumberValue(event) {
        return !this.isBackspace(event)
            ? this.isMaxNumberLength
            : this.isLastCharacterDash;
    }

    isBackspace(event) {
        return !event.data;
    }
}

class NameInput extends BasicReactiveInput {
    constructor(element) {
        super(element);
        this.initNamePrettier();
    }

    get value() {
        return this._input.value;
    }

    get isEmptyValue() {
        return this.value.length < 1;
    }

    initNamePrettier() {
        this._input.addEventListener('input', (element) => {
            if (!this.isEmptyValue) {
                element.target.value = this.upperFirstSign(this.value);
            }
        })
    }

    upperFirstSign(value) {
        return `${value[0].toUpperCase()}${value.substr(1, this.value.length)}`;
    }
}

class NameInputs {
    firstnameInput;
    lastnameInput;
    patronymicInput;

    constructor() {
        this.firstnameInput = new NameInput('first-name-input-id');
        this.lastnameInput = new NameInput('second-name-input-id');
        this.patronymicInput = new NameInput('third-name-input-id');
    }

    get inputs() {
        return {
            firstname: this.firstnameInput,
            lastname: this.lastnameInput,
            patronymic: this.patronymicInput,
        }
    }
}

class EmailInput extends BasicReactiveInput {
    constructor(element) {
        super(element);
        this.initEmailPrettier();
    }

    get value() {
        return this._input.value
    }

    initEmailPrettier() {
        this._input.addEventListener('change', (element) => {
            if (this.isValidEmail(element)) {
                InputUtils.removeInvalidClass(element);
            } else {
                InputUtils.addInvalidClass(element);
            }
        });
    }

    isValidEmail(element) {
        return !InputUtils.isEmpty(element)
            && InputUtils.isValidLength(this.value)
            && EmailUtils.isValid(this.value)
    }
}

class TimeInput extends BasicReactiveInput {
    constructor(element) {
        super(element);
    }

    get value() {
        return this._input.value;
    }
}

class ContactForm {
    firstname;
    lastname;
    patronymic;
    phoneNumber;
    email;
    time;

    callButtonInput;

    get formValue() {
        return {
            firstname: this.firstname,
            lastname: this.lastname,
            patronymic: this.patronymic,
            phoneNumber: this.phoneNumber,
            email: this.email,
            time: this.time,
        }
    }

    get isFullForm() {
        return !Object.values(this.formValue).some((value) => !value);
    }

    constructor() {
        const nameInputs = new NameInputs().inputs;
        Object.entries(nameInputs).forEach(([variable, element]) => {
            element.subscribe((value) => {
                this[variable] = value
            });
        })
        new NumberInput().subscribe((phoneNumber) => this.phoneNumber = phoneNumber);
        new EmailInput('email-input-id').subscribe((email) => this.email = email);
        new TimeInput('time-input-id').subscribe((time) => this.time = time);

        this.callButtonInput = document.getElementById('main-call-button-id');
        this.callButtonInput.addEventListener('click', () => {
            if (this.isFullForm) {
                console.log(this.formValue);
            } else {
                console.log('Error')
            }
        })
    }
}