module View exposing (..)

import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import Messages exposing (..)
import Model exposing (..)
import Routes exposing (toUrl)


view : Model -> Html Msg
view model =
    case model.page of
        Index ->
            indexTemplate model.counters

        Clicker name ->
            clickerTemplate model.counter.name model.counter.value


indexTemplate : List String -> Html Msg
indexTemplate counters = 
            div []
                [ ul []
                    (List.map clickerListElement counters)
                ]

clickerListElement : String -> Html Msg
clickerListElement c = li [] [ a [ href (toUrl (Clicker c)) ] [ text c ] ]


clickerTemplate : String -> Int -> Html Msg
clickerTemplate name value = 
        div []
            [ div [] [ text name ]
            , div [] [ text (toString value) ]
            , button [ onClick Decrement ] [ text "-" ]
            , button [ onClick Increment ] [ text "+" ]
            ]

