const btn = document.createElement("button");
btn.textContent = "Button";
btn.addEventListener("click", () => {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", "https://api.github.com/users/KeisukeShimokawa");
  xhr.addEventListener("load", () => {
    if (xhr.status != 200) {
      console.log(`error ${xhr.status}: ${xhr.statusText}`);
    } else {
      console.log(`${xhr.status} (got ${xhr.response.length} bytes)`);
      console.log(xhr.response)
      console.log(xhr.getResponseHeader("Content-Type"));
      console.log(xhr.getAllResponseHeaders());
    }
  })
  xhr.addEventListener("error", () => {
    alert("request failed");
  })
  xhr.send();
})

document.body.appendChild(btn);