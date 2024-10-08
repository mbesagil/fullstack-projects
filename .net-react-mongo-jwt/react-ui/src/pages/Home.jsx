import { useSelector, useDispatch } from "react-redux";
import {
  increment,
  decrement,
  incrementByAmount,
  selectCount,
} from "../stores/counterSlice";
import Count1 from "../comoponents/Count1";
import ApiService from "../core/services/ApiService";

function Home() {
  const count = useSelector(selectCount);
  const dispatch = useDispatch();

  const getPosts = () => {
    ApiService.get("Posts")
      .then((res) => {
        console.log("res :>> ", res);
      })
      .catch((err) => {
        console.log("err :>> ", err);
      });
  };

  return (
    <>
      <div className="text-3xl font-bold underline text-red-600 w-100 text-center">
        Home
      </div>
      <div className="flex justify-center">
        <button className="bg-slate-500 p-2  rounded-e" onClick={getPosts}>
          Test Get Post
        </button>
      </div>
    </>
  );
}

export default Home;
