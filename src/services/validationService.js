import userService from './userService';
import postService from './postService';

const validationService = {
    async validateLoginForm(form, isLogin, setErrors) {
        if (!this.prepareForm(form, setErrors)) return;

        const {email, password} = form;

        const users = await userService.getUsersByFields({
            email: email.value,
            ...(isLogin && {password: password.value}),
        });

        if (isLogin) {
            if (!users[0]) {
                this.setFieldError(password, 'Wrong login or password', setErrors);
            }
        } else {
            if (users[0]) {
                this.setFieldError(email, 'User with such an email already exists', setErrors);
            }
        }

        return users[0];
    },

    async validatePostEditForm(form, setErrors) {
        if (!this.prepareForm(form, setErrors)) return;

        const postId = form.id.slice(10);
        const {title} = form;
        const posts = await postService.getPostsByFields({title: title.value});

        if (posts.length && posts[0].id !== postId) {
            this.setFieldError(title, 'Post with such title already exists', setErrors);
        }
    },

    async validateNewPostForm(form, setErrors) {
        if (!this.prepareForm(form, setErrors)) return;

        const titleInput = form['post-title'];
        const posts = await postService.getPostsByFields({title: titleInput.value});

        if (posts.length) {
            this.setFieldError(titleInput, 'Post with such title already exists', setErrors);
        }
    },

    prepareForm(form, setErrors) {
        this.resetFormErrors(form, setErrors);
        return this.validateFormElements(form, setErrors);
    },

    validateFormElements(form, setErrors) {
        const isFormValid = form.checkValidity();

        if (!isFormValid) {
            for (const input of form) {
                if (input.matches(':is(input,textarea)[name]')) {
                    const err = this.getValidationError(input);
                    if (err) {
                        setErrors(prev => ({...prev, [input.name]: err}));
                    }
                }
            }
        }

        return isFormValid;
    },

    getValidationError(input) {
        const {validity} = input;
        if (validity.valid) return '';

        if (validity.valueMissing) return 'Field cannot be empty';
        if (validity.tooShort || validity.tooLong)
            return `Value must be from ${input.minLength} to ${input.maxLength} characters.`;
        if (validity.typeMismatch && input.type === 'email')
            return 'Please enter an existing email.';

        return '';
    },

    resetFormErrors(form, setErrors) {
        for (const input of form) {
            if (input.name) input.setCustomValidity('');
        }
        setErrors({});
    },

    setFieldError(input, message, setErrors) {
        input.setCustomValidity(message);
        setErrors(prev => ({...prev, [input.name]: message}));
    }
};

export default validationService;
