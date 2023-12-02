const form = document.querySelector("#updatePasswordForm")
    form.addEventListener("change", function () {
      const updateBtn = document.querySelector("#passwordSubmit")
      updateBtn.removeAttribute("disabled")
    })