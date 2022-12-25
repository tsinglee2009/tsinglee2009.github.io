;(function(){

    var fullHTML = ''

    window.onbeforeprint = () => {

        fullHTML = document.body.innerHTML;

        var resumeHTML = document.getElementById("resume-contents").innerHTML;
        document.body.innerHTML = resumeHTML;
    }

    window.onafterprint = () => {
        document.body.innerHTML = fullHTML;
    }

}())