import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/index";
import SignUp from "./pages/signUp";
import Question from "./pages/question";
// import context 
import UserContext from "./context";

// import question 
import { questions } from "../data/data";

const App = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <SignUp />
    },
    {
      path: "/home",
      element: <Home />
    },
    {
      path: "/question",
      element: <Question />
    }
  ]);
  return (
    <UserContext.Provider value={{ questions }}>
      <RouterProvider router={router} />
    </UserContext.Provider>
  )
}

export default App;