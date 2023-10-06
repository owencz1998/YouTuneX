import { Fragment, useEffect } from "react";
import {
  Redirect,
  Route,
  Switch
} from "react-router-dom";
import { ToastContainer } from "react-toastify";

// import SongContextProvider from "./context/SongContextProvider";
import PlayerContextProvider from "./context/ContextProvider";

import Content from "./components/Layout/Content/Content";
import Header from "./components/Layout/Header/Header";
import Layout from "./components/Layout/Layout";
import Navigation from "./components/Navigation/Navigation";

// import Loading from "./components/UI/Loading/Loading";
import Spinner from "./components/UI/Loading/Spinner";
// import SearchNavigation from "./components/UI/SearchNavigation/SearchNavigation";

import BrowsePage from "./pages/Browse/Browse";
import GenresPage from "./pages/Genres/Genres";
import HomePage from "./pages/Home/Home";
import SearchPage from "./pages/Search/Search";
// import SongPage from "./pages/Song/Song";
import FavouritesPage from "./pages/Home/Favourites";
import SongPageRenderer from "./pages/Song/SongPageRenderer";


import Popup from "./components/UI/Popup/Popup";
import SongWrapper from "./pages/Song/SongWrapper";

  useEffect(() => {
    history.listen(location => {
      if (!location.pathname.startsWith("/play")) {
        setPreviousPageUrl(location.pathname + location.search);
      }
    });
  }, [history]);

  useEffect(() => {
    setPreviousPageUrl(location.pathname + location.search);
  }, []);

  useEffect(() => {
    const checkIsAuth = async () => {
      try {
        setIsLoggingin(false);
        await login();
        setIsLoggingin(true);
      } catch (error) {
        setIsLoggingin(true);

        console.log("Not authenticated", error);
      }
    };

    const blockedPathname =
      location.pathname.includes("/login") ||
      location.pathname.includes("/signup");
    setInitialUrl(
      (blockedPathname ? "/home" : location.pathname) +
        (blockedPathname ? "" : location.search)
    );

    checkIsAuth();
  }, []);

  return (
    <Layout ref={rootElementRef}>
      <Switch>
        {isAuth && <Redirect to={initialUrl || "/home"} />}
        <Route path="/signup">
          <SignupPage
            authLoading={authLoading}
            editAuthConf={editAuthConf}
            setAuthLoading={setIsAuthLoading}
            topBoxMessage={topBoxMessage}
            setTopBoxMessage={setTopBoxMessage}
          />
        </Route>

        <Route path="/login">
          <LoginPage
            // setIsLoggedIn={setIsLoggedIn}
            authLoading={authLoading}
            editAuthConf={editAuthConf}
            setAuthLoading={setIsAuthLoading}
            setAutoLogout={setAutoLogout}
            topBoxMessage={topBoxMessage}
            setTopBoxMessage={setTopBoxMessage}
          />
        </Route>
      </Switch>
      {isAuth && (
        <Fragment>
          {/* // <Route path="*"> */}
          <Header>
            <Navigation logout={logout} previousPageUrl={previousPageUrl} />
          </Header>
          <Content>
            <PlayerContextProvider>
              <Switch>
                <Redirect exact to="/home" from="/" />
                <Route path="/home">
                  <HomePage
                    logout={logout}
                    token={token}
                    rootElementRef={rootElementRef}
                  />
                </Route>

                <Route path="/favourites">
                  <FavouritesPage
                    logout={logout}
                    removeFromFavouritesHandler={removeFromFavouritesHandler}
                    initLibrary={initLibrary}
                    token={token}
                    rootElementRef={rootElementRef}
                  />
                </Route>

                <Route path="/genres">
                  <GenresPage
                    logout={logout}
                    token={token}
                    rootElementRef={rootElementRef}
                  />
                </Route>

                {/* Redirect to the songs page (default) */}
                <Redirect
                  exact
                  path="/search/:searchQuery"
                  to="/search/:searchQuery/songs"
                />

                <Route path="/search/:searchQuery/:searchTerm">
                  <SearchPage
                    logout={logout}
                    token={token}
                    rootElementRef={rootElementRef}
                  />
                </Route>

                <Route path="/browse/:browseId">
                  <BrowsePage
                    logout={logout}
                    addToFavouritesHandler={addToFavouritesHandler}
                    removeFromFavouritesHandler={removeFromFavouritesHandler}
                    // library={library}
                    token={token}
                    rootElementRef={rootElementRef}
                  />
                </Route>

                {/* <Redirect from="*" to="/home" /> */}
              </Switch>

              <Route path="/play">
                {/* <PlayerContextProvider> */}
                <SongPageRenderer rootElementRef={rootElementRef} />
                {/* </PlayerContextProvider> */}
              </Route>
              <SongWrapper
                // library={library}
                logout={logout}
                addToFavouritesHandler={addToFavouritesHandler}
                removeFromFavouritesHandler={removeFromFavouritesHandler}
                setToastPosition={setToastPosition}
                token={token}
                previousPageUrl={previousPageUrl}
              />
            </PlayerContextProvider>
          </Content>
        </Fragment>
      )}

      {!isAuth && <Redirect from="*" to="/login" />}
      {/* </Switch> */}
      <Popup
        notCloseable
        autoClose={isLoggingin}
        content={
          <Fragment>
            <p className="link-large flex-center mg-t-3">
              Logging in
              <Spinner className="mg-l-2" />
            </p>
          </Fragment>
        }
      />

      <ToastContainer
        limit={4}
        position={toastPosition}
        autoClose={2000}
        hideProgressBar={true}
        newestOnTop={true}
        closeOnClick={true}
        pauseOnHover={false}
        rtl={false}
        draggable
      />
    </Layout>
  );
};

export default App;
