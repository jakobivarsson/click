module Routes exposing (..)

import Navigation
import UrlParser exposing (Parser, (</>), format, int, oneOf, s, string)
import Messages exposing (Msg)
import Model exposing (..)
import Update exposing (..)
import String


toUrl : Page -> String
toUrl page =
    case page of
        Index ->
            "/"

        Clicker name ->
            "#building/" ++ name


hashParser : Navigation.Location -> Result String Page
hashParser location =
    UrlParser.parse identity pageParser (String.dropLeft 1 location.hash)


pageParser : Parser (Page -> a) a
pageParser =
    UrlParser.oneOf
        [ format Index (UrlParser.s "")
        , format Clicker (UrlParser.s "building" </> UrlParser.string)
        ]


urlUpdate : Result a Page -> Model -> ( Model, Cmd Msg )
urlUpdate result model =
    case result of
        Err _ ->
            ( model, Navigation.modifyUrl (toUrl model.page) )

        Ok Index ->
            ( { model | page = Index }, getCounters )

        Ok (Clicker name) ->
            if List.member name model.counters then
                ( { model | page = Clicker name, counter = { name = name, value = 0 } }, Cmd.none )
            else
                ( model, Navigation.modifyUrl (toUrl Index) )
