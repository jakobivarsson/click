module Model exposing (..)


type Page
    = Index
    | Clicker String


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
