import RestaurantCard from "./RestaurantCard";
import { useState, useEffect } from "react";
import Shimmer from "./shimmer";
import { Link } from "react-router-dom";
import useOnlineStatus from "../utils/useOnlineStatus";

const Body = () => {
  const [listofRes, setListofRes] = useState([]);
  const [restaurantFiltered, setRestaurantFiltered] = useState([]);

  const [searchText, setSearchText] = useState("");

  console.log(listofRes);
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const data = await fetch(
      " https://www.swiggy.com/dapi/restaurants/list/v5?lat=28.4416833&lng=77.04997&is-seo-homepage-enabled=true&page_type=DESKTOP_WEB_LISTING"
    );

    const json = await data.json();

    // console.log(json);
    //optional chaining
    setListofRes(
      json?.data.cards[4]?.card?.card?.gridElements?.infoWithStyle?.restaurants
    );

    setRestaurantFiltered(
      json?.data.cards[4]?.card?.card?.gridElements?.infoWithStyle?.restaurants
    );
  };

  const onlineStatus = useOnlineStatus();
  if (onlineStatus == false)
    return (
      <h1>
        Looks like you are offline!! Please check your internet connection
      </h1>
    );

  // conditional rendering
  if (listofRes.length == 0) {
    console.log("zero hsi");

    return <Shimmer />;
  }

  return (
    <div className="body">
      <div className="filter flex">
        <div className="search m-4 p-4">
          <input
            type="text"
            className="search-box border border-solid border-black rounded-sm"
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target.value);
            }}
          />
          <button
            className="px-4 py-2 bg-green-100 m-4 rounded-lg"
            onClick={() => {
              console.log(searchText);

              const filteredRes = listofRes.filter((res) =>
                res.info.name
                  .toLowerCase()
                  .includes(searchText.toLocaleLowerCase())
              );

              setRestaurantFiltered(filteredRes);
            }}
          >
            Search
          </button>
        </div>
        <div className="search m-4 p-4 flex items-center">
          <button
            className="filter-btn px-4 py-2 bg-gray-100 rounded-lg "
            onClick={() => {
              const filteredList = listofRes.filter(
                (res) => res.info.avgRating > 4.2
              );
              setListofRes(filteredList);
            }}
          >
            Top Rated restaurants
          </button>
        </div>
      </div>
      <div className="res-container flex flex-wrap">
        {restaurantFiltered.map((restaurant) => (
          <Link
            key={restaurant.info.id}
            to={"/restaurants/" + restaurant.info.id}
          >
            <RestaurantCard resData={restaurant} />{" "}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Body;
