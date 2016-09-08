module Main exposing (..)

import Keyboard
import Navigation
import Platform.Sub
import Result
import Routes exposing (..)
import Update exposing (..)
import Messages exposing (..)
import Model exposing (..)
import View exposing (..)
import WebSocket


main : Program Never
main =
    Navigation.program (Navigation.makeParser hashParser)
        { init = init
        , view = view
        , update = update
        , urlUpdate = urlUpdate
        , subscriptions = subscriptions
        }


init : Result String Page -> ( Model, Cmd Msg )
init result =
    urlUpdate result (Model (Counter "" 0) [] True Index)



-- SUBSCRIPTIONS


subscriptions : Model -> Sub Msg
subscriptions model =
    Platform.Sub.batch
        [ subscribeCounter model.page model.counter
        , Keyboard.downs keyListener
        ]


subscribeCounter : Page -> Counter -> Sub Msg
subscribeCounter page counter =
    case page of
        Index ->
            Platform.Sub.none

        Clicker name ->
            WebSocket.listen server Update


keyListener : Keyboard.KeyCode -> Msg
keyListener key =
    case key of
        39 ->
            Increment

        37 ->
            Decrement

        _ ->
            NoOp
