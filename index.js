let items = [];
let shoppingCart = [];

window.onload = () => {
  fetch("https://api.myjson.com/bins/18fh4d")
    .then(response => {
      if (response.ok) {
        return response.json();
      }
    })
    .then(json => {
      items = json;
      displayItems(json);
    })
    .catch(error => console.log("there was an error on your fetch" + error));
};

/* 
    WHAT WE ARE DOING INSIDE DISPLAYITEMS?
      <div class="row">
      <div class ="col-md-4 mb-4">
      HERE IS THE INNER.HMTL
      THAT WILL BE A CARD WITH SOME VARIABLES
      </col>
      </div>
      
      //FINAL STRUCTURE
      <div class="row main">
      <div class ="col-md-4 mb-4">//card 1</div>
      <div class ="col-md-4 mb-4">//card 2</div>
      <div class ="col-md-4 mb-4">//card 3</div>
      <div class ="col-md-4 mb-4">//card 4</div>
      <div class ="col-md-4 mb-4">//card 5</div>
      ..n times = to the array i'm looping through
      </div>
*/

// what does it mean listOfItems = items as a parameter?
//DEFAULT PARAMETERS :
//IF I CALL THE FUNCTION WITHOUT SPECIFYING THE PARAMS USE THAT ONE
//ELSE USE THE PARAMS THAT I PASS YOU
/* 
const sum = (x=2,y=0){
    return x+y
}
sum() <= in this case instead of being undefined x and y will be 2 and 0 respectively
sum(3,5) <= in this case i'm overwriting the default parameters and so x and y will be 3 and 5 respectively
sum(3) <= in this case i'm over writing only one of the parameters so x will be 3 and y will be 0 (which is the default)

REMEMBER THAT I CAN PUT AS DEFAULT PARAMETER ANY VALUE SO CAN BE BOOL, OBJECT, UNDEFINED, NUMBER, STRING WHATEVER!!
*/

const displayItems = (listOfItems = items) => {
  const row = document.querySelector(".row.main");
  //[1,2,3]  => [{}, {}..]
  //clean the row before inserting IMPORTANT TO SEE THE CHANGES!!
  row.innerHTML = "";
  listOfItems.forEach(currentProducts => {
    let col = document.createElement("div");
    col.classList.add("col-md-4", "mb-4");
    col.innerHTML += `
    <div id="${currentProducts.asin}" class="card mb-4 shadow-sm">
          <div class="card-header" style="height:180px;">
          <p class="card-title h-100"><strong>${currentProducts.title}</strong><p>
          </div>
          <img class="img-fluid card-img-top" src="${currentProducts.img}" alt="item_img" height="210">
            <div class="card-body border-top pb-0">
            <div class="d-flex justify-content-between align-items-baseline">
              <p class="card-text">
                <strong>Price</strong> : $${currentProducts.price}
              </p>
              <div class="d-inline-block">
            <button type="button" id="skip" class="btn btn-sm btn-outline-dark">
              Skip
            </button>
              <button type="button" id="addToCart" class="btn btn-sm btn-outline-dark">
                    Add to cart
              </button> 
                </div>
             </div>
            </div><!-- end of card body -->
          </div><!-- end of card --> 
    `;
    row.appendChild(col); // adding to the dom

    //ADD TO CART EVENT
    col.querySelector("#addToCart").addEventListener("click", () => {
      shoppingCart.push(currentProducts);
      col.querySelector(`#${currentProducts.asin}`).classList.add("bg-success");
      displayShoppingCart();
    });

    //SKIP BUTTON EVENT
    col.querySelector("#skip").addEventListener("click", () => {
      /*
      IMAGINE OUR ITEMS ARE JUST THIS 2
    var items = [  
        {
        "asin": "B00KQG4806",
        "title": "Vanguard Sedona 41BL Zaino Fotografico e per Cannocchiale Leggero e Robusto, 25X19X43 cm, Blu",
        "img": "https://images-na.ssl-images-amazon.com/images/I/91GsyzK6%2BxL.jpg",
        "price": 90.23
         },
        {  
        "asin": "B07RP74NLP",
        "title": "HOLLYLAND Mars 300, 300 piedi HD Video Trasmettitore e Ricevitore Sistema, Compatibile con 1080P 60Hz e Segnale HDMI per Fotocamere Reflex Digitali e Mirrorless",
        "img": "https://images-na.ssl-images-amazon.com/images/I/61tUQmCQkmL.jpg",
        "price": 556.0
        }
       ]      
       
       HOW DOES findIndex() WORK?
       I want to find the index of the element that has an asin of B07RP74NLP
       If I find it returns his position (index)
       If I don't find him returns -1
    */
      /*
       //METHOD 1 WITH SPLICE(pos,x) => delete from a given position in the array x number of item
       //USING FINDINDEX() TO RETRIEVE THE INDEX
      //see explanation of findIndex above
      let index = items.findIndex(
        banana => banana.asin === currentProducts.asin
      );
      if (index != -1) {
        items.splice(index, 1);//modifying the original array
      } 
      */

      /* 
        METHOD 2 WITH FILTER
        1) ALWAYS RETURN AN ARRAY
        2) THE FILTERED ARRAY IS COMPOSED OF ITEM THAT PASSED THE FILTER(ITEMS THAT RETURNS TRUE)
      */

      //var filtered = [1,2,3,4,5].filter(current => current > 2)        filtered = [3,4,5]
      //var filtered = [1,2,3,4,5].filter(current => current != 2)        filtered = [1,3,4,5]  I WANT TO REMOVE THE 2
      items = items.filter(current => current.asin != currentProducts.asin); // currentProduct.asin is the item i want to delete

      //call the displayItems(items) <= will have 1 less object
      displayItems(); //whatever method we use to remove the item we will always call the display to see the changes
    });
  });
};

const pError = document.querySelector("#searchError");
const filterSearch = () => {
  let query = document.querySelector("#query").value;
  pError.innerHTML = "";
  pError.classList.remove("error");
  //we have a string from imput
  //how do i display items that match the query?
  //in some way we have to FILTER in this array of items
  //looking for the title
  //does the current item. title match my query(what i wrote in the search) if yes put it in the filtered array
  //otherwhise don't
  let filteredArray = items.filter(current =>
    current.title.toLowerCase().includes(query.toLowerCase())
  );
  //wrost case scenario? we don't find anything
  //how can we check it? if the filteredArray is empry
  if (filteredArray.length > 0) {
    displayItems(filteredArray);
  } else {
    pError.innerHTML = "Item not found";
    pError.classList.add("error");
    displayItems(filteredArray);
  }
};

const displayShoppingCart = () => {
  //SELECTING THE CART
  const shoppingListUl = document.querySelector("#shopcart");
  //FOR THE NEXT TIME WE WILL CALL IT WE EMPTY IT
  shoppingListUl.innerHTML = "";
  //LOOP THROUGH THE GLOBAL ARRAY
  shoppingCart.forEach(currentElement => {
    //creating the element and populating it with the title
    let li = document.createElement("li");
    li.classList.add("list-group-item", "col-md-3");
    li.innerHTML += `
      ${currentElement.title.slice(0, 15).concat("...")}
      <span id="remove" class="badge badge-danger badge-pill">x</span>
    `;
    shoppingListUl.appendChild(li);

    //REMOVE EVENT
    li.querySelector("#remove").addEventListener("click", () => {
      //REMOVING ITEM FROM THE GLOBAL ARRAY
      shoppingCart = shoppingCart.filter(
        current => current.asin != currentElement.asin
      );
      //Calling again the method to see the item removed
      displayShoppingCart();
      //TRY TO FIX ON YOURSELF THE FACT THAT THE CARD
      //REMAINS WITH THAT BACKGROUND AFTER DELETING FROM CHART
    });
  });
};
