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
