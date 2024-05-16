// Fetch the JSON data
fetch("/assets/json/cards.json")
  .then((response) => response.json())
  .then((data) => {
    const cardsContainer = document.getElementById("cards");

    // Loop through the cards data and create the card elements
    data.cards.forEach((cardData) => {
      const card = document.createElement("a");
      card.href = cardData.href;
      card.classList.add("card");

      const cardContent = document.createElement("div");
      cardContent.classList.add("card-content");

      const cardImage = document.createElement("div");
      cardImage.classList.add("card-image");

      const icon = document.createElement("i");
      icon.classList.add(cardData.iconClass);
      cardImage.appendChild(icon);

      const cardInfoWrapper = document.createElement("div");
      cardInfoWrapper.classList.add("card-info-wrapper");

      const cardInfo = document.createElement("div");
      cardInfo.classList.add("card-info");

      const cardInfoTitle = document.createElement("div");
      cardInfoTitle.classList.add("card-info-title");

      const title = document.createElement("h3");
      title.textContent = cardData.title;
      cardInfoTitle.appendChild(title);

      const description = document.createElement("h4");
      description.textContent = cardData.description;
      cardInfoTitle.appendChild(description);

      cardInfo.appendChild(cardInfoTitle);
      cardInfoWrapper.appendChild(cardInfo);
      cardContent.appendChild(cardImage);
      cardContent.appendChild(cardInfoWrapper);
      card.appendChild(cardContent);
      cardsContainer.appendChild(card);
    });
  });
