;(function () {
    'use strict'

    var carousels = function () {
        $('.owl-carousel1').owlCarousel({
            loop: true,
            center: true,
            margin: 0,
            responsiveClass: true,
            nav: false,
            responsive: {
                0: {
                    items: 1,
                    nav: false,
                },
                600: {
                    items: 1,
                    nav: false,
                },
                1000: {
                    items: 3,
                    nav: true,
                    loop: false,
                },
            },
        })

        $('.owl-carousel2').owlCarousel({
            loop: true,
            center: false,
            margin: 0,
            responsiveClass: true,
            nav: true,
            responsive: {
                0: {
                    items: 1,
                    nav: false,
                },
                600: {
                    items: 2,
                    nav: false,
                },
                1000: {
                    items: 3,
                    nav: true,
                    loop: true,
                },
            },
        })
    }

    // svg responsive in mobile mode
    var checkPosition = function () {
        if ($(window).width() < 767) {
            $('#bg-services').attr('viewBox', '0 0 1050 800')
        }
    }

    ;(function ($) {
        carousels()
        checkPosition()
    })(jQuery)
})()

// menu toggle button
function myFunction(x) {
    x.classList.toggle('change')
}

//Contact form validation//

/*!(function ($) {
    'use strict'

    $('form.arogya-email-form').submit(function (e) {
        e.preventDefault()

        var f = $(this).find('.form-group'),
            ferror = false,
            emailExp = /^[^\s()<>@,;:\/]+@\w[\w\.-]+\.[a-z]{2,}$/i

        f.children('input').each(function () {
            // run all inputs

            var i = $(this) // current input
            var rule = i.attr('data-rule')

            if (rule !== undefined) {
                var ierror = false // error flag for current input
                var pos = rule.indexOf(':', 0)
                if (pos >= 0) {
                    var exp = rule.substr(pos + 1, rule.length)
                    rule = rule.substr(0, pos)
                } else {
                    rule = rule.substr(pos + 1, rule.length)
                }

                switch (rule) {
                    case 'required':
                        if (i.val() === '') {
                            ferror = ierror = true
                        }
                        break

                    case 'minlen':
                        if (i.val().length < parseInt(exp)) {
                            ferror = ierror = true
                        }
                        break

                    case 'email':
                        if (!emailExp.test(i.val())) {
                            ferror = ierror = true
                        }
                        break

                    case 'checked':
                        if (!i.is(':checked')) {
                            ferror = ierror = true
                        }
                        break

                    case 'regexp':
                        exp = new RegExp(exp)
                        if (!exp.test(i.val())) {
                            ferror = ierror = true
                        }
                        break
                }
                i.next('.validate')
                    .html(
                        ierror
                            ? i.attr('data-msg') !== undefined
                                ? i.attr('data-msg')
                                : 'wrong Input'
                            : ''
                    )
                    .show('blind')
            }
        })
        f.children('textarea').each(function () {
            // run all inputs

            var i = $(this) // current input
            var rule = i.attr('data-rule')

            if (rule !== undefined) {
                var ierror = false // error flag for current input
                var pos = rule.indexOf(':', 0)
                if (pos >= 0) {
                    var exp = rule.substr(pos + 1, rule.length)
                    rule = rule.substr(0, pos)
                } else {
                    rule = rule.substr(pos + 1, rule.length)
                }

                switch (rule) {
                    case 'required':
                        if (i.val() === '') {
                            ferror = ierror = true
                        }
                        break

                    case 'minlen':
                        if (i.val().length < parseInt(exp)) {
                            ferror = ierror = true
                        }
                        break
                }
                i.next('.validate')
                    .html(
                        ierror
                            ? i.attr('data-msg') != undefined
                                ? i.attr('data-msg')
                                : 'wrong Input'
                            : ''
                    )
                    .show('blind')
            }
        })
        if (ferror) return false

        var this_form = $(this)
        var action = $(this).attr('action')

        if (!action) {
            this_form.find('.loading').slideUp()
            this_form
                .find('.error-message')
                .slideDown()
                .html('The form action property is not set!')
            return false
        }

        this_form.find('.sent-message').slideUp()
        this_form.find('.error-message').slideUp()
        this_form.find('.loading').slideDown()

        if ($(this).data('recaptcha-site-key')) {
            var recaptcha_site_key = $(this).data('recaptcha-site-key')
            grecaptcha.ready(function () {
                grecaptcha
                    .execute(recaptcha_site_key, {
                        action: 'arogya_email_form_submit',
                    })
                    .then(function (token) {
                        arogya_email_form_submit(
                            this_form,
                            action,
                            this_form.serialize() +
                                '&recaptcha-response=' +
                                token
                        )
                    })
            })
        } else {
            arogya_email_form_submit(this_form, action, this_form.serialize())
        }

        return true
    })

    function arogya_email_form_submit(this_form, action, data) {
        $.ajax({
            type: 'POST',
            url: action,
            data: data,
            timeout: 40000,
        })
            .done(function (msg) {
                if (msg == 'OK') {
                    this_form.find('.loading').slideUp()
                    this_form.find('.sent-message').slideDown()
                    this_form
                        .find('input:not(input[type=submit]), textarea')
                        .val('')
                } else {
                    this_form.find('.loading').slideUp()
                    if (!msg) {
                        msg =
                            'Form submission failed and no error message returned from: ' +
                            action +
                            '<br>'
                    }
                    this_form.find('.error-message').slideDown().html(msg)
                }
            })
            .fail(function (data) {
                console.log(data)
                var error_msg = 'Form submission failed!<br>'
                if (data.statusText || data.status) {
                    error_msg += 'Status:'
                    if (data.statusText) {
                        error_msg += ' ' + data.statusText
                    }
                    if (data.status) {
                        error_msg += ' ' + data.status
                    }
                    error_msg += '<br>'
                }
                if (data.responseText) {
                    error_msg += data.responseText
                }
                this_form.find('.loading').slideUp()
                this_form.find('.error-message').slideDown().html(error_msg)
            })
    }
})(jQuery)*/

;(function () {
    'use strict'
    window.addEventListener(
        'load',
        function () {
            // Fetch all the forms we want to apply custom Bootstrap validation styles to
            var forms = document.getElementsByClassName('needs-validation')
            // Loop over them and prevent submission
            var validation = Array.prototype.filter.call(
                forms,
                function (form) {
                    form.addEventListener(
                        'submit',
                        function (event) {
                            if (form.checkValidity() === false) {
                                event.preventDefault()
                                event.stopPropagation()
                            }
                            form.classList.add('was-validated')
                        },
                        false
                    )
                }
            )
        },
        false
    )
})()

/* for scroll to top */

//Get the button:
mybutton = document.getElementById('myBtn')

window.onscroll = function () {
    scrollFunction()
}

function scrollFunction() {
    if (
        document.body.scrollTop > 20 ||
        document.documentElement.scrollTop > 20
    ) {
        mybutton.style.display = 'block'
    } else {
        mybutton.style.display = 'none'
    }
}

// When the user clicks on the button, scroll to the top of the document
function topFunction() {
    document.body.scrollTop = 0 // For Safari
    document.documentElement.scrollTop = 0 // For Chrome, Firefox, IE and Opera
}
