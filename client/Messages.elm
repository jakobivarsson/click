module Messages exposing (..)

import Http


type Msg
    = Increment
    | Decrement
    | Update String
    | GetCounters (List String)
    | HttpError Http.Error
    | NoOp
