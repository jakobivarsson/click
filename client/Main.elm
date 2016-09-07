module Main exposing (..)

import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import Keyboard
import List
import Navigation
import Platform.Sub
import Result
import Routes exposing (..)
import Update exposing (..)
import Model exposing (..)
import Messages exposing (..)
import WebSocket


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
    urlUpdate result (Model (Counter "Nymble" 0) [] True Index)



-- SUBSCRIPTIONS


subscriptions : Model -> Sub Msg
subscriptions model =
    Platform.Sub.batch
        [ WebSocket.listen server Update
        , Keyboard.downs keyListener
        ]


keyListener key =
    case key of
        39 ->
            Increment

        37 ->
            Decrement

        _ ->
            NoOp



-- VIEW


view : Model -> Html Msg
view model =
    case model.page of
        Clicker name ->
            div []
                [ div [] [ text model.counter.name ]
                , div [] [ text (toString model.counter.value) ]
                , button [ onClick Decrement ] [ text "-" ]
                , button [ onClick Increment ] [ text "+" ]
                ]

        Index ->
            div []
                [ ul []
                    (List.map
                        (\c ->
                            li []
                                [ a [ href (toUrl (Clicker c)) ] [ text c ]
                                ]
                        )
                        model.counters
                    )
                ]
