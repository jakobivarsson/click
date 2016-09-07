module Routes exposing (..)

import Navigation
import UrlParser exposing (Parser, (</>), format, int, oneOf, s, string)
import String


type Page
    = Index
    | Clicker String


toUrl page =
    case page of
        Index ->
            "/"

        Clicker name ->
            "#building/" ++ name


hashParser : Navigation.Location -> Result String Page
hashParser location =
    UrlParser.parse identity pageParser (String.dropLeft 1 location.hash)


pageParser =
    UrlParser.oneOf
        [ format Index (UrlParser.s "")
        , format Clicker (UrlParser.s "building" </> UrlParser.string)
        ]


urlUpdate result model =
    case result of
        Err _ ->
            ( model, Navigation.modifyUrl (toUrl model.page) )

        Ok Index ->
            ( { model | page = Index }, getCounters )

        Ok page ->
            ( { model | page = page }, Cmd.none )
