// @flow
import '../../js/js.js'
import '../../css/vendor/jquery.fancybox.css'
import '../../css/pages/hwa.scss'
import '../vendor/jquery.fancybox'
import '../vendor/jquery.validate'

$( document ).ready(function() {

  jQuery.validator.addMethod('validPhone', function (value, element) {
    return this.optional(element) || /^\d{10,12}$/.test(value)
  }, 'Not valid phone')

  jQuery.validator.addMethod('validEmail', function (value, element) {
    return this.optional(element) || /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test(value)
  }, 'Not valid email')

  $('#hwa-contacts__form').validate({
    rules: {
      firstName: {
        required: true,
      },
      lastName: {
        required: true,
      },
      email: {
        required: true,
        validEmail: true
      },
      phone: {
        required: true,
        validPhone: true
      },
      message: {
        required: true,
      }
    },
    submitHandler: function(form, event) {
      validateSuccess(event);
    }
  })

  function validateSuccess(e) {
    e.preventDefault()

    const data = $('#hwa-contacts__form').serialize()

    const host = (location.host.indexOf('localhost') !== -1) ? 'localhost:8080' : location.host
    const url = location.protocol + '//' + host + '/message'

    $.ajax({
      url: url,
      data: data,
      method: 'post',
      contentType: 'application/x-www-form-urlencoded',
      success: function (resp) {
        $.fancybox.open('<div class="message"><h2>Hello!</h2><p>Your message was sent successfully!</p></div>');
      },
      error: function (resp) {
        $.fancybox.open('<div class="message"><h2>Hello!</h2><p>Your message was sent with erroe! Plese try again!</p></div>');
        // console.log('ERROR', resp.responseText)
        // console.log('ERROR', resp.responseJSON)
      }
    })
  }


});
