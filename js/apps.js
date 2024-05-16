document.querySelector(".apps").addEventListener("mousemove", (e) => {
  const appElements = document.querySelectorAll(".app");
  for (const appElement of appElements) {
    const rect = appElement.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    appElement.style.setProperty("--mouse-x", `${x}px`);
    appElement.style.setProperty("--mouse-y", `${y}px`);
  }
});

// JS to take content from a json file and display it on the cards and enable link redirection
fetch("/assets/json/apps.json")
  .then((response) => response.json())
  .then((data) => {
    const gamesContainer = document.querySelector(".apps");

    let allItems = data; // Store all items in a variable

    // Render the initial grid of images
    renderGrid(allItems);

    // Add the actual HTML structure for the tile(s)
    function renderGrid(items) {
      items.forEach((item) => {
        const game = document.createElement("div");
        game.classList.add("app");
        game.innerHTML = `<div><img src="/assets/img/apps/${item.img}" loading="lazy" alt="${item.title}" draggable="false"><h2>${item.title}</h2></div>`;
        gamesContainer.appendChild(game);

        // Add event listener to each game element to handle the click event and redirect to the link
        game.addEventListener("click", () => {
          localStorage.setItem("currentapp", `${item.src}`);
          localStorage.setItem("currenttitle", item.title);
          window.location.href = "/chatroom.html";
        });
      });
    }
  });
