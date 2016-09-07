module Update exposing (..)

import Http
import Model exposing (..)
import WebSocket
import Messages exposing (..)
import Task
import Json.Decode
import String


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
