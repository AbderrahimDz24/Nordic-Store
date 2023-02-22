fetch("https://dog.ceo/api/breeds/image/random/3")
  .then((response) => response.json())
  .then((data) => {
    if (data.status === "success") {
      postMessage(data.message)
    } else {
      console.log("Dogs Api error");
      console.log(data);
    }
  })
  .catch((err) => {
    console.log("Dogs Api error");
    console.log(err);
  });

