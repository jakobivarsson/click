module Main exposing (..)

import Html exposing (..)
import Html.Events exposing (..)
import Http
import Json.Decode exposing (..)
import Keyboard
import List
import Maybe
import Navigation
import Platform.Sub
import Result
import String
import Task
import UrlParser exposing (Parser, (</>), format, int, oneOf, s, string)
import WebSocket


main =
    Navigation.program (Navigation.makeParser urlParser)
        { init = init
        , view = view
        , update = update
        , urlUpdate = urlUpdate
        , subscriptions = subscriptions
        }



-- URL PARSERS


type Page
    = Index
    | Clicker String


toUrl page =
    case page of
        Index ->
            ""

        Clicker name ->
            "/" ++ name


urlParser location =
    UrlParser.parse identity pageParser location.pathname


pageParser =
    UrlParser.oneOf
        [ format Index (UrlParser.s "")
        , format Clicker (UrlParser.s "" </> UrlParser.string)
        ]


urlUpdate result model =
    case result of
        Err _ ->
            ( model, Navigation.modifyUrl (toUrl model.page) )

        Ok Index ->
            ( { model | page = Index }, getCounters )

        Ok page ->
            ( { model | page = page }, Cmd.none )



-- MODEL


server : String
server =
    "ws://localhost:8008/counters/Nymble"


type alias Model =
    { counter : Counter
    , counters : List String
    , authenticated : Bool
    , page : Page
    }


type alias Counter =
    { name : String
    , value : Int
    }


init : Result String Page -> ( Model, Cmd Msg )
init result =
    urlUpdate result (Model (Counter "Nymble" 0) [] True Index)



-- UPDATE


type Msg
    = Increment
    | Decrement
    | Update String
    | GetCounters (List String)
    | HttpError Http.Error
    | NoOp


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        Increment ->
            ( model, WebSocket.send server "increment" )

        Decrement ->
            ( model, WebSocket.send server "decrement" )

        Update value ->
            ( { model | counter = Counter model.counter.name (safeToInt model.counter.value value) }, Cmd.none )

        GetCounters counters ->
            ( { model | counters = counters }, Cmd.none )

        HttpError error ->
            ( { model | counters = [ "error" ] }, Cmd.none )

        NoOp ->
            ( model, Cmd.none )


safeToInt default =
    String.toInt >> Result.toMaybe >> Maybe.withDefault default


getCounters =
    Task.perform HttpError GetCounters (Http.get countersDecoder "http://localhost:8008/counters")


countersDecoder =
    Json.Decode.list Json.Decode.string



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
    div []
        [ div [] [ text model.counter.name ]
        , div [] [ text (toString model.counter.value) ]
        , button [ onClick Decrement ] [ text "-" ]
        , button [ onClick Increment ] [ text "+" ]
        , ul [] (List.map (\c -> li [] [ text c ]) model.counters)
        ]
