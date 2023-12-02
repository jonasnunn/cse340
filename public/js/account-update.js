const form = document.querySelector("#editAccountForm")
    form.addEventListener("change", function () {
      const updateBtn = document.querySelector("#accountSubmit")
      updateBtn.removeAttribute("disabled")
    })