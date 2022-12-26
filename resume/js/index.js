;(function(){

   window.addEventListener('load', on_load)

   function on_load() {
        // init_adaptation()
        init_mask_field()
   }

   function init_adaptation() {
        if (isMobile()) {
            var resumme = document.querySelector('#resume-contents')
            var wrapper = document.querySelector('.content-wrapper')
            resumme.style.width = '100%'
            resumme.style.margin = '0'
            wrapper.style.borderRadius = '0'
            wrapper.style.padding = '22px 15px'
        }
   }

   function init_mask_field() {

        var btn_view = document.querySelector('#btn_view_resume')
        var input = document.querySelector('#ipt_resume_pwd')
        var ipt = document.querySelector('#ipt')
        
        input.addEventListener('click', () => {
            ipt.classList.remove('type_err')
        })

        btn_view.addEventListener('click', () => {
            // 用户输入的密码
            var input_pwd = input.value.trim()
            // 有效密码 yyyyMMdd
            var password = get_password()

            if (input_pwd === password) {
                document.querySelector('.mask').style.display = 'none'
                document.querySelector('.content-wrapper').style.display = 'block'
            } else {
                ipt.classList.add('type_err')
            }
        })
   }

   function get_password() {

       var date = new Date()

       var year = date.getFullYear().toString()
       var month = date.getMonth() + 1
       var day = date.getDate()
       
       var str_year = year.toString()
       var str_month = month < 10 ? ('0' + month) : month.toString()
       var str_day = day < 10 ? ('0' + day) : day.toString()

       return str_year + str_month + str_day
   }

    function isMobile() {
        return window.navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i);
    }
}())