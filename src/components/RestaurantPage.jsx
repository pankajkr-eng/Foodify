import Shimmer from "./Shimmer";
import { useParams } from "react-router-dom";
import useRestaurantMenu from "../utils/useRestaurantMenu";
import RestaurantCategory from "./RestaurantCategory";
import { useState } from "react";
const RestaurantPage = () => {
  const { resId } = useParams();

  const resInfo = useRestaurantMenu(resId);
  // Lifting state up
  const [showIndex, setshowIndex] = useState(0);

  if (resInfo == null) return <Shimmer />;

  const {
    name,
    cuisines = [],
    costForTwoMessage = "",
  } = resInfo?.cards[2]?.card?.card?.info || {};

  const menuCard =
    resInfo?.cards[4]?.groupedCard?.cardGroupMap?.REGULAR?.cards[1]?.card?.card;

  const itemCards = menuCard?.itemCards || [];

  const categories =
    resInfo?.cards[4]?.groupedCard?.cardGroupMap?.REGULAR?.cards.filter(
      (c) =>
        c.card?.card?.["@type"] ==
        "type.googleapis.com/swiggy.presentation.food.v2.ItemCategory"
    );
  // console.log(categories);

  return (
    <div className="text-center">
      <h1 className="font-bold text-2xl my-2">
        {name || "Restaurant Name not available"}
      </h1>
      <p>
        {cuisines.length > 0
          ? cuisines.join(",")
          : "cuisine info not available"}
        - {costForTwoMessage}
      </p>
      {categories.map((category, index) => (
        <RestaurantCategory
          key={category?.card?.card.title}
          data={category?.card?.card}
          showItems={index == showIndex ? true : false}
          setshowIndex={() => setshowIndex(index)}
        />
      ))}
    </div>
  );
};

export default RestaurantPage;
